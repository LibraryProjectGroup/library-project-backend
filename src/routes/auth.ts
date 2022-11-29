import { Request, Response, Router } from "express";
import {
    queryInsertUser,
    querySelectUserByEmail,
    querySelectUserByUsername,
} from "../queries/user";
import { queryInsertSession, queryInvalidateSession } from "../queries/session";
import crypto from "crypto";
import bcrypt from "bcrypt";

const timeout = 60 * 60 * 24 * 7; // 7 days before user has to login again
const minUsernameLength = 3;
const maxUsernameLength = 50;
const minPasswordLength = 3;
const maxPasswordLength = 150;

const router = Router();

async function createSession(userId: number) {
    // TODO: Secret should be unique but duplicates shouldn't really cause any issues
    let secret = crypto.randomBytes(16).toString("hex");
    return await queryInsertSession(userId, secret, timeout);
}

const isAlphaNumeric = (charCode: number) => {
    if (
        (charCode > 47 && charCode < 58) || // (0-9)
        (charCode > 64 && charCode < 91) || // (A-Z)
        (charCode > 96 && charCode < 123) // (a-z)
    )
        return true;
    else return false;
};

const isValidEmail = (email: string) => {
    // "Email has to be in the form of [ prefix@domain ]"
    // note: add check to only allow .-_ inside prefix symbols when followed by alphanumeric(s);
    //      don't allow any other symbol (unless we care about +)
    if (email && email.includes("@")) {
        let parts = email.split("@");
        let prefix = parts[0];
        let domain = parts[1];
        if (prefix.length > 0) {
            let first = prefix.slice(0, 1).charCodeAt(0);
            let last = prefix.slice(-1).charCodeAt(0);
            if (isAlphaNumeric(first) && isAlphaNumeric(last)) {
                if (domain.includes(".")) {
                    let domainparts = domain.split(".");
                    return domainparts[domainparts.length - 1].length >= 2;
                } else {
                    return domain.length >= 2;
                }
            }
        }
    }
    return false;
};

router.post("/register", async (req: Request, res: Response) => {
    const username = req.body.username as string;
    const password = req.body.password as string;
    const email = req.body.email as string;

    if (!isValidEmail(email))
        return res.status(400).json({
            ok: false,
            message: "Email has to be in the form of [ prefix@domain ]",
        });

    if (
        username == undefined ||
        username.length < minUsernameLength ||
        username.length > maxUsernameLength
    )
        return res.status(400).json({
            ok: false,
            message: "Username has to be between 3 and 50 characters",
        });

    if (
        password == undefined ||
        password.length < minPasswordLength ||
        password.length > maxPasswordLength
    )
        return res.status(400).json({
            ok: false,
            message: "Password has to be between 3 and 50 characters",
        });

    let user = await querySelectUserByUsername(username);
    if (user != null)
        return res.status(400).json({
            ok: false,
            message: "Username is already taken",
        });

    let hashedPassword = await bcrypt.hash(password, 8);

    let newUser = await queryInsertUser(
        username,
        email,
        hashedPassword,
        false,
        false
    );
    if (newUser == null) return res.status(500).json({ ok: false });

    let session = await createSession(newUser.id);
    if (session == null) return res.status(500).json({ ok: false });

    res.json({
        ok: true,
        secret: session.secret,
    });
});

router.post("/login", async (req: Request, res: Response) => {
    const password = req.body.password as string;
    const email = req.body.email as string;

    if (email == null)
        return res.status(404).json({
            ok: false,
            message: "Email and password required",
        });

    let user = await querySelectUserByEmail(email);
    if (user == null)
        return res.status(404).json({
            ok: false,
            message: "Invalid Email or Password",
        });

    if (password == null || !(await bcrypt.compare(password, user.passw)))
        return res.status(403).json({
            ok: false,
            message: "Invalid Email or Password",
        });

    let session = await createSession(user.id);
    if (session == null) return res.status(500).json({ ok: false });

    res.json({
        ok: true,
        userId: user.id,
        secret: session.secret,
    });
});

router.post("/logout", async (req: Request, res: Response) => {
    if (!req.token)
        return res.status(400).json({ ok: false, message: "No session" });

    if (await queryInvalidateSession(req.token)) {
        res.json({ ok: true });
    } else {
        res.status(404).json({ ok: false, message: "Unknown session" });
    }
});

export default router;
