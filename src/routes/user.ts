import { Response, Request, Router } from 'express';
import {
    querySelectAllUsers,
    querySelectUser,
    queryDeleteUser,
    queryInsertUser,
    queryUpdateUser,
    querySelectUserByName,
} from '../queries/user';
import User from '../interfaces/user.interface';

const router = Router();

router.get('/all', async (req: Request, res: Response) => {
    try {
        res.json(await querySelectAllUsers());
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.get('/', async (req: Request, res: Response) => {
    const userId = req.query.id as string;
    try {
        res.json(await querySelectUser(userId));
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.get('/username', async (req: Request, res: Response) => {
    try {
        res.json(await querySelectUserByName(req.query.username as string));
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.delete('/', async (req: Request, res: Response) => {
    const userId = req.query.id as string;
    try {
        res.json({ ok: await queryDeleteUser(userId) });
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const username = req.query.username as string;
    const password = req.query.password as string;
    const administrator = parseInt(req.query.administrator as any) as number;
    try {
        res.json({
            ok: await queryInsertUser(username, password, administrator),
        });
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.put('/', async (req: Request, res: Response) => {
    const user: User = {
        id: parseInt(req.query.id as any) as number,
        username: req.query.username as string,
        passw: req.query.password as string,
        administrator: parseInt(req.query.administrator as any) as number,
    };
    try {
        res.json({ ok: await queryUpdateUser(user) });
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

export default router;
