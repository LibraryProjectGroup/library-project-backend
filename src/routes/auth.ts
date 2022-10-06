import { Request, Response, Router } from 'express';
import { queryInsertUser, querySelectUserByName } from '../queries/user';
import { queryInsertSession, queryInvalidateSession } from '../queries/session';
import crypto from 'crypto';

const timeout = 60 * 60 * 24 * 7; // 7 days before user has to login again
const minUsernameLength = 3;
const maxUsernameLength = 50;
const minPasswordLength = 3;
const maxPasswordLength = 150;

const router = Router();

async function createSession(userId: number) {
    // TODO: Secret should be unique but duplicates shouldn't really cause any issues
    let secret = crypto.randomBytes(16).toString('hex');
    return await queryInsertSession(userId, secret, timeout);
}

router.get('/register', async (req: Request, res: Response) => {
    const username = req.query.username as string;
    const password = req.query.password as string;

    if (
        username == undefined ||
        username.length < minUsernameLength ||
        username.length > maxUsernameLength
    )
        return res.status(400).json({
            ok: false,
            message: 'Username has to be between 3 and 50 characters',
        });

    if (
        password == undefined ||
        password.length < minPasswordLength ||
        password.length > maxPasswordLength
    )
        return res.status(400).json({
            ok: false,
            message: 'Password has to be between 3 and 50 characters',
        });

    let user = await querySelectUserByName(username);
    if (user != null)
        return res.status(400).json({
            ok: false,
            message: 'Username is already taken',
        });
    let newUser = await queryInsertUser(username, password, false);
    if (newUser == null) return res.status(500).json({ ok: false });

    let session = await createSession(newUser.id);
    if (session == null) return res.status(500).json({ ok: false });

    res.json({
        ok: true,
        secret: session.secret,
    });
});

router.get('/login', async (req: Request, res: Response) => {
    const username = req.query.username as string;
    const password = req.query.password as string;

    let user = await querySelectUserByName(username);
    if (user == null)
        return res.status(404).json({
            ok: false,
            message: 'No account by that username',
        });

    if (user.passw != password)
        return res.status(403).json({
            ok: false,
            message: 'Invalid password',
        });

    let session = await createSession(user.id);
    if (session == null) return res.status(500).json({ ok: false });

    res.json({
        ok: true,
        secret: session.secret,
    });
});

router.get('/logout', async (req: Request, res: Response) => {
    if (!req.cookies || !req.cookies.librarySession)
        return res.status(400).json({ ok: false, message: 'No session' });

    if (await queryInvalidateSession(req.cookies.librarySession)) {
        res.json({ ok: true });
    } else {
        res.status(404).json({ ok: false, message: 'Unknown session' });
    }
});

export default router;
