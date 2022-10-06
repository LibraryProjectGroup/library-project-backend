import { Response, Request, Router } from 'express';
import {
    querySelectAllUsers,
    querySelectUser,
    queryDeleteUser,
    queryInsertUser,
    queryUpdateUser,
} from '../queries/userQueries';
import User from '../interfaces/user.interface';

const router = Router();

router.get('/all', async (req: Request, res: Response) => {
    const usersResult = await querySelectAllUsers();
    res.json(usersResult);
});

router.get('/', async (req: Request, res: Response) => {
    const userId = req.query.id as string;
    const userResult = await querySelectUser(userId);
    res.json(userResult);
});

router.delete('/', async (req: Request, res: Response) => {
    const userId = req.query.id as string;
    const deleteResult = await queryDeleteUser(userId);
    res.json({ ok: deleteResult });
});

router.post('/', async (req: Request, res: Response) => {
    const user: User = {
        username: req.query.username as string,
        password: req.query.password as string,
        // Iffy parseInts here. TODO
        administrator: parseInt(req.query.administrator as any) as number,
    };
    const insertResult = await queryInsertUser(user);
    res.json({ ok: insertResult });
});

router.put('/', async (req: Request, res: Response) => {
    const user: User = {
        id: parseInt(req.query.id as any) as number,
        username: req.query.username as string,
        password: req.query.password as string,
        administrator: parseInt(req.query.administrator as any) as number,
    };
    const insertResult = await queryUpdateUser(user);
    res.json({ ok: insertResult });
});

export default router;
