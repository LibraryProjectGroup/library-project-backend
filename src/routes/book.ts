import { Response, Request, Router } from 'express';
import {
    querySelectBook,
    querySelectAllBooks,
    queryDeleteBook,
    queryInsertBook,
    queryUpdateBook,
} from '../queries/book';
import Book from '../interfaces/book.interface';

const router = Router();

router.get('/all', async (req: Request, res: Response) => {
    try {
        res.json(await querySelectAllBooks());
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.get('/', async (req: Request, res: Response) => {
    const bookId = req.query.id as string;
    try {
        res.json(await querySelectBook(bookId));
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.delete('/', async (req: Request, res: Response) => {
    const bookId = req.query.id as string;

    try {
        const book = await querySelectBook(bookId);
        if (
            req.sessionUser.id == book.library_user ||
            req.sessionUser.administrator
        ) {
            res.json({ ok: await queryDeleteBook(bookId) });
        } else {
            res.json({ ok: false });
        }
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.post('/', async (req: Request, res: Response) => {
    req.body.library_user = req.sessionUser.id;
    const book: Book = req.body;
    try {
        res.json({ ok: await queryInsertBook(book) });
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.put('/', async (req: Request, res: Response) => {
    req.body.library_user = req.sessionUser.id;
    const updatedBook: Book = req.body;
    if (!updatedBook.id) {
        res.json({ ok: false });
        return;
    }
    try {
        const book = await querySelectBook(updatedBook.id.toString());
        if (
            req.sessionUser.id == book.library_user ||
            req.sessionUser.administrator
        ) {
            res.json({ ok: await queryUpdateBook(updatedBook) });
        } else {
            res.json({ ok: false });
        }
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

export default router;
