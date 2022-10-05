import { Express, Response, Request } from 'express';
import { Pool } from 'mysql2';
import {
    queryInsertBorrow,
    querySelectAllBorrows,
    querySelectBorrow,
    queryDeleteBorrow,
} from '../queries/borrowQueries';
import Borrow from '../interfaces/borrow.interface';

const routeBorrow = (app: Express, pool: Pool) => {
    app.get('/allborrows', async (req: Request, res: Response) => {
        const booksResult = await querySelectAllBorrows(pool);
        res.json({ ok: booksResult });
    });
    app.get('/borrow', async (req: Request, res: Response) => {
        const borrowId = req.query.id as string;
        const booksResult = await querySelectBorrow(pool, borrowId);
        res.json({ ok: booksResult });
    });
    app.delete('/borrow', async (req: Request, res: Response) => {
        const borrowId = req.query.id as string;
        const booksResult = await queryDeleteBorrow(pool, borrowId);
        res.json({ ok: booksResult });
    });
    app.post('/borrow', async (req: Request, res: Response) => {
        const borrow: Borrow = {
            user: parseInt(req.query.user as string),
            book: parseInt(req.query.book as string),
            borrowDate: req.query.borrowdate as any as Date,
            dueDate: req.query.duedate as any as Date,
            returned: false,
        };
        const insertResult = await queryInsertBorrow(pool, borrow);
        res.json({ ok: insertResult });
    });
};

export { routeBorrow };
