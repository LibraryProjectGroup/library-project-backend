import { Express, Response, Request } from 'express';
import { Pool } from 'mysql2';
import {
    querySelectAllUsers,
    querySelectUser,
    queryDeleteUser,
    queryInsertUser,
    queryUpdateUser,
} from '../queries/userQueries';
import User from '../interfaces/user.interface';

const routeUser = (app: Express, pool: Pool) => {
    app.get('/allusers', async (req: Request, res: Response) => {
        const usersResult = await querySelectAllUsers(pool);
        res.json(usersResult);
    });

    app.get('/user', async (req: Request, res: Response) => {
        const userId = req.query.id as string;
        const userResult = await querySelectUser(pool, userId);
        res.json(userResult);
    });

    app.delete('/user', async (req: Request, res: Response) => {
        const userId = req.query.id as string;
        const deleteResult = await queryDeleteUser(pool, userId);
        res.json({ ok: deleteResult });
    });

    app.post('/user', async (req: Request, res: Response) => {
        const user: User = {
            username: req.query.username as string,
            password: req.query.password as string,
            // Iffy parseInts here. TODO
            administrator: parseInt(req.query.administrator as any) as number,
        };
        const insertResult = await queryInsertUser(pool, user);
        res.json({ ok: insertResult });
    });

    app.put('/user', async (req: Request, res: Response) => {
        const user: User = {
            id: parseInt(req.query.id as any) as number,
            username: req.query.username as string,
            password: req.query.password as string,
            administrator: parseInt(req.query.administrator as any) as number,
        };
        const insertResult = await queryUpdateUser(pool, user);
        res.json({ ok: insertResult });
    });
};

export default routeUser;
