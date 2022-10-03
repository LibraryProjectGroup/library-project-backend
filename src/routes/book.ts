import { Express, Response, Request } from "express";
import { Pool } from "mysql2";
import {
  querySelectBook,
  querySelectAllBooks,
  queryDeleteBook,
  queryInsertBook,
} from "../queries/bookQueries";
import Book from "../interfaces/book.interface";

const routeBook = (app: Express, pool: Pool) => {
  const route = "/book";

  app.get("/allbooks", async (req: Request, res: Response) => {
    const booksResult = await querySelectAllBooks(pool);
    res.json(booksResult);
  });

  app.get("/book", async (req: Request, res: Response) => {
    const bookId = req.query.id as string;
    const bookResult = await querySelectBook(pool, bookId);
    res.json(bookResult);
  });

  app.delete("/book", async (req: Request, res: Response) => {
    const bookId = req.query.id as string;
    const deleteResult = await queryDeleteBook(pool, bookId);
    res.json({ ok: deleteResult });
  });

  app.post("/book", async (req: Request, res: Response) => {
    const book: Book = {
      library_user: 1,
      title: req.query.title as string,
      author: req.query.author as string,
      topic: req.query.topic as string,
      isbn: req.query.isbn as string,
      location: req.query.location as string,
    };
    const insertResult = await queryInsertBook(pool, book);
    res.json({ ok: insertResult });
  });
};

export default routeBook;
