import Book from "../../interfaces/book.interface";

// note: this mock is very basic and its purpose is for jest to run through routes

let book1: Book = {
    id: 1,
    library_user: 1,
    title: "bt1",
    author: "ba1",
    year: 2011,
    isbn: "123-t456",
    topic: "Java",
    location: "Helsinki",
    deleted: false,
};

let book2: Book = {
    id: 2,
    library_user: 1,
    title: "bt2",
    author: "ba2",
    year: 2012,
    isbn: "234-t567",
    topic: "JavaScript",
    location: "Helsinki",
    deleted: true,
};

let book3: Book = {
    id: 3,
    library_user: 2,
    title: "bt3",
    author: "ba3",
    year: 2013,
    isbn: "345-t678",
    topic: "TypeScript",
    location: "Helsinki",
    deleted: false,
};

let book4: Book = {
    id: 4,
    library_user: 2,
    title: "bt4",
    author: "ba4",
    year: 2014,
    isbn: "456-t567",
    topic: "SQL",
    location: "Helsinki",
    deleted: false,
};

let mockBookData = [book1, book2, book3, book4];
let idCounter = 4;

const getBook = (id: number) => {
    for (let index = 0; index < mockBookData.length; index++) {
        if (mockBookData[index].id === id) {
            return mockBookData[index];
        }
    }
    return null;
};

export const querySelectBook = async (bookId: number): Promise<Book | null> => {
    return getBook(bookId);
};

export const querySelectAllBooks = async (): Promise<Book[]> => {
    let array: Array<Book> = [];
    mockBookData.forEach((element) => {
        if (!element.deleted) {
            array.push(element);
        }
    });
    return array as Array<Book>;
};
export const querySelectAllExistingBooks = async (): Promise<Book[]> => {
    return mockBookData as Array<Book>;
};

export const queryHardDeleteBook = async (bookId: number): Promise<boolean> => {
    let deleted = false;
    mockBookData = mockBookData.filter((book) => {
        if (book.id == bookId) deleted = true;
        return book.id != bookId;
    });
    return deleted;
};

export const querySoftDeleteBook = async (bookId: number): Promise<boolean> => {
    const book = getBook(bookId);
    if (book) {
        book.deleted = true;
        return true;
    }
    return false;
};

export const queryInsertBook = async (
    userId: number,
    title: string,
    author: string,
    year: number,
    isbn: string,
    topic: string,
    location: string
): Promise<boolean> => {
    mockBookData.push({
        id: idCounter++,
        library_user: userId,
        title,
        author,
        year,
        isbn,
        topic,
        location,
        deleted: false,
    });
    return true;
};

export const queryUpdateBook = async (book: Book): Promise<boolean> => {
    const editedBook = getBook(book.id);
    if (editedBook) {
        editedBook.title = book.title;
        editedBook.author = book.author;
        editedBook.year = book.year;
        editedBook.isbn = book.isbn;
        editedBook.topic = book.topic;
        editedBook.location = book.location;
        return true;
    }
    return false;
};
