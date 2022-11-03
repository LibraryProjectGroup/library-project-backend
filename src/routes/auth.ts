import { NextFunction, Request, Response, Router } from "express";
import { queryInsertUser, querySelectUserByUsername } from "../queries/user";
import { queryInsertSession, queryInvalidateSession } from "../queries/session";
import crypto from "crypto";

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

router.post(
    "/register",
    async (req: Request, res: Response, next: NextFunction) => {
        const username = req.body.username as string;
        const password = req.body.password as string;

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

        try {
            let user = await querySelectUserByUsername(username);
            if (user != null)
                return res.status(400).json({
                    ok: false,
                    message: "Username is already taken",
                });
            let newUser = await queryInsertUser(username, password, false);
            if (newUser == null) return res.status(500).json({ ok: false });

            let session = await createSession(newUser.id);
            if (session == null) return res.status(500).json({ ok: false });

            res.json({
                ok: true,
                secret: session.secret,
            });
        } catch (err) {
            next(err);
        }
    }
);

router.post(
    "/login",
    async (req: Request, res: Response, next: NextFunction) => {
        const username = req.body.username as string;
        const password = req.body.password as string;
        try {
            let user = await querySelectUserByUsername(username);

            if (user == null)
                return res.status(404).json({
                    ok: false,
                    message: "No account by that username",
                });

            if (user.passw != password)
                return res.status(403).json({
                    ok: false,
                    message: "Invalid password",
                });

            let session = await createSession(user.id);
            if (session == null) return res.status(500).json({ ok: false });

            res.json({
                ok: true,
                userId: user.id,
                secret: session.secret,
            });
        } catch (err) {
            next(err);
        }
    }
);

router.post(
    "/logout",
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.token)
            return res.status(400).json({ ok: false, message: "No session" });

        try {
            if (await queryInvalidateSession(req.token)) {
                res.json({ ok: true });
            } else {
                res.status(404).json({ ok: false, message: "Unknown session" });
            }
        } catch (err) {
            next(err);
        }
    }
);

export default router;
