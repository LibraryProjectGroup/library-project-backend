interface Book {
  id?: number;
  // TODO: User interface
  library_user?: string | number;
  title: string;
  author: string;
  topic: string;
  isbn: string;
  location: string;
}

export default Book;
