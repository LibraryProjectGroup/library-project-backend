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
    res.json(await querySelectAllBooks());
});

router.get('/', async (req: Request, res: Response) => {
    const bookId = req.query.id as string;
    res.json(await querySelectBook(bookId));
});

router.delete('/', async (req: Request, res: Response) => {
    const bookId = req.query.id as string;
    res.json({ ok: await queryDeleteBook(bookId) });
});

router.post('/', async (req: Request, res: Response) => {
    const book: Book = req.body;
    res.json({ ok: await queryInsertBook(book) });
});

router.put('/', async (req: Request, res: Response) => {
    const book: Book = req.body;
    res.json({ ok: await queryUpdateBook(book) });
});

export default router;
