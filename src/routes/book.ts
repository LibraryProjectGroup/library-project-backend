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
    const book: Book = {
        library_user: 1,
        title: req.query.title as string,
        author: req.query.author as string,
        topic: req.query.topic as string,
        isbn: req.query.isbn as string,
        location: req.query.location as string,
    };
    res.json({ ok: await queryInsertBook(book) });
});

router.put('/', async (req: Request, res: Response) => {
    const book: Book = {
        // Iffy parseInt here. TODO
        id: parseInt(req.query.id as any) as number,
        library_user: 1,
        title: req.query.title as string,
        author: req.query.author as string,
        topic: req.query.topic as string,
        isbn: req.query.isbn as string,
        location: req.query.location as string,
    };
    res.json({ ok: await queryUpdateBook(book) });
});

export default router;
