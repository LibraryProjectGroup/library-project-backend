import { Response, Request, Router } from 'express';
import Book from '../interfaces/book.interface';

const router = Router();

const EXAMPLE_BOOK: Book = {
    id: 1,
    library_user: 'John Doe',
    title: 'Python Machine Learning: Machine Learning and Deep Learning with Python, scikit-learn, and TensorFlow 2, 3rd Edition',
    author: 'Klabnik, Steve',
    topic: 'Machine Learning',
    isbn: '9781492032649',
    location: 'Helsinki',
};
const EXAMPLE_BOOK_2: Book = { ...EXAMPLE_BOOK, id: 2, title: 'Book 2' };
const EXAMPLE_BOOK_3: Book = { ...EXAMPLE_BOOK, id: 3, title: 'Book 3' };
const EXAMPLE_BOOKS: Array<Book> = [
    EXAMPLE_BOOK,
    EXAMPLE_BOOK_2,
    EXAMPLE_BOOK_3,
];

router.get('/', async (req: Request, res: Response) => {
    res.json(EXAMPLE_BOOKS);
});

export default router;
