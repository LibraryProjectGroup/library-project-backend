interface Book {
  id: number;
  library_user: number;
  title: string;
  image: string;
  author: string;
  year: number;
  topic: string;
  isbn: string;
  location: string;
  deleted: boolean;
}

export default Book;
