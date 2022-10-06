import { Response, Request, Router } from 'express';
import {
    querySelectBook,
    querySelectAllBooks,
    queryDeleteBook,
    queryInsertBook,
    queryUpdateBook,
} from '../queries/bookQueries';
import Book from '../interfaces/book.interface';

const router = Router();

router.get('/all', async (req: Request, res: Response) => {
    const booksResult = await querySelectAllBooks();
    res.json(booksResult);
});

router.get('/', async (req: Request, res: Response) => {
    const bookId = req.query.id as string;
    const bookResult = await querySelectBook(bookId);
    res.json(bookResult);
});

router.delete('/', async (req: Request, res: Response) => {
    const bookId = req.query.id as string;
    const deleteResult = await queryDeleteBook(bookId);
    res.json({ ok: deleteResult });
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
    const insertResult = await queryInsertBook(book);
    res.json({ ok: insertResult });
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
    const insertResult = await queryUpdateBook(book);
    res.json({ ok: insertResult });
});

export default router;
