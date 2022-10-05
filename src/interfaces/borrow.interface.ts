import User from './user.interface';
import Book from './book.interface';

interface Borrow {
    id?: number;
    user: User | number;
    book: Book | number;
    borrowDate: Date;
    dueDate: Date;
    returned: boolean;
}

export default Borrow;
