import { Express, Response, Request, Router } from 'express';
import { Pool } from 'mysql2';
import {
    queryInsertBorrow,
    querySelectAllBorrows,
    querySelectBorrow,
    queryDeleteBorrow,
    queryUpdateBorrow,
    querySelectAllCurrentBorrows,
    queryBookIsAvailable,
    queryReturnBorrow,
    queryBorrowsByUsername,
} from '../queries/borrow';

import Borrow from '../interfaces/borrow.interface';
import { querySelectUserBySessionId } from '../queries/user';

const router = Router();

router.get('/all', async (req: Request, res: Response) => {
    try {
        res.json(await querySelectAllBorrows());
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});
router.get('/', async (req: Request, res: Response) => {
    const borrowId = req.query.id as string;
    try {
        res.json(await querySelectBorrow(borrowId));
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});


router.delete('/', async (req: Request, res: Response) => {
    const borrowId = req.query.id as string;
    if (querySelectUserBySessionId(req.query.userId) === req.query.library_user.id) {

        try {
            res.json({ ok: await queryDeleteBorrow(borrowId) });
        } catch (error) {
            console.error(error);
            res.json({ ok: false, status: 500 });
        }
    } else {
        res.json({ ok: false, status: 500 });
    };
});

router.post('/', async (req: Request, res: Response) => {
    console.log('BORROW POST');
    let bookAvailable = await queryBookIsAvailable(req.body.book);
    if (bookAvailable) {
        try {
            const borrow: Borrow = { ...req.body, returned: 0 };
            console.log(borrow);
            res.json({ ok: await queryInsertBorrow(borrow) });
        } catch {
            res.status(500).json({ ok: false });
        }
    } else {
        return res.status(403).json({
            ok: false,
            message: 'Book not available for borrowing',
        });
    }
});
router.put('/', async (req: Request, res: Response) => {
    const borrow: Borrow = req.body;
    res.json({ ok: await queryUpdateBorrow(borrow) });
});

router.get('/current', async (req: Request, res: Response) => {
    const currentBorrows = await querySelectAllCurrentBorrows();
    res.json(currentBorrows);
});
router.get('/current/user', async (req: Request, res: Response) => {
    const username: string = req.query.username as string;
    const currentBorrows = await queryBorrowsByUsername(username);
    res.json(currentBorrows);
});
router.put('/return', async (req: Request, res: Response) => {
    try {
        res.json({ ok: await queryReturnBorrow(req.body.borrowId) });
    } catch {
        res.status(500).json({ ok: false });
    }
});

export default router;
