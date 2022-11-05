import Book from "./book.interface";
import Book_list from "./book_list.interface";

interface Book_list_entry {
    id?: number;
    list: Book_list | number;
    book: Book | number;
}

export default Book_list_entry;
