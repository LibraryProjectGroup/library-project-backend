import { Express, Response, Request, Router } from 'express';
import { Pool } from 'mysql2';
import {
    queryInsertBorrow,
    querySelectAllBorrows,
    querySelectBorrow,
    queryDeleteBorrow,
    queryUpdateBorrow,
} from '../queries/borrow';
import Borrow from '../interfaces/borrow.interface';

const router = Router();

router.get('/all', async (req: Request, res: Response) => {
    res.json(await querySelectAllBorrows());
});
router.get('/', async (req: Request, res: Response) => {
    const borrowId = req.query.id as string;
    res.json(await querySelectBorrow(borrowId));
});
router.delete('/', async (req: Request, res: Response) => {
    const borrowId = req.query.id as string;
    res.json({ ok: await queryDeleteBorrow(borrowId) });
});
router.post('/', async (req: Request, res: Response) => {
    const borrow: Borrow = {
        user: parseInt(req.query.user as string),
        book: parseInt(req.query.book as string),
        borrowDate: req.query.borrowdate as any as Date,
        dueDate: req.query.duedate as any as Date,
        returned: false,
    };
    res.json({ ok: await queryInsertBorrow(borrow) });
});
router.put('/', async (req: Request, res: Response) => {
    const borrow: Borrow = {
        id: parseInt(req.query.id as any) as number,
        user: parseInt(req.query.user as string),
        book: parseInt(req.query.book as string),
        borrowDate: req.query.borrowdate as any as Date,
        dueDate: req.query.duedate as any as Date,
        returned: req.query.returned as any as boolean,
    };
    res.json({ ok: await queryUpdateBorrow(borrow) });
});

export default router;
