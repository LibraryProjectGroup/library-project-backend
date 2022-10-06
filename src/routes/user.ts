import { Response, Request, Router } from 'express';
import {
    querySelectAllUsers,
    querySelectUser,
    queryDeleteUser,
    queryInsertUser,
    queryUpdateUser,
} from '../queries/user';
import User from '../interfaces/user.interface';

const router = Router();

router.get('/all', async (req: Request, res: Response) => {
    res.json(await querySelectAllUsers());
});

router.get('/', async (req: Request, res: Response) => {
    const userId = req.query.id as string;
    res.json(await querySelectUser(userId));
});

router.delete('/', async (req: Request, res: Response) => {
    const userId = req.query.id as string;
    res.json({ ok: await queryDeleteUser(userId) });
});

router.post('/', async (req: Request, res: Response) => {
    const username = req.query.username as string;
    const password = req.query.password as string;
    const administrator = parseInt(req.query.administrator as any) as number;
    res.json({ ok: await queryInsertUser(username, password, administrator) });
});

router.put('/', async (req: Request, res: Response) => {
    const user: User = {
        id: parseInt(req.query.id as any) as number,
        username: req.query.username as string,
        passw: req.query.password as string,
        administrator: parseInt(req.query.administrator as any) as number,
    };
    res.json({ ok: await queryUpdateUser(user) });
});

export default router;
