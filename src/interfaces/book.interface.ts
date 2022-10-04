import User from './user.interface';

interface Book {
    id?: number;
    addedBy?: User;
    library_user?: string | number;
    title: string;
    author: string;
    topic: string;
    isbn: string;
    location: string;
}

export default Book;
