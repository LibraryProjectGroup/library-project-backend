import { Response, Request, Router, NextFunction } from "express";
import {
  deleteListBook,
  insertNewEntry,
  removeEntryById,
  getAllEntries,
  getEntriesByList,
  getEntryById,
} from "../queries/book_list_entry";
import Book_list_entry from "../interfaces/book_list_entry.interface";
import { getListById } from "../queries/book_list";

const router = Router();

router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getAllEntries());
  } catch (err) {
    next(err);
  }
});

router.get("/list", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getEntriesByList(Number(req.query.id)));
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getEntryById(Number(req.query.id)));
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const entry: Book_list_entry = { ...req.body };
  try {
    res.json({ ok: await insertNewEntry(entry) });
  } catch (err) {
    next(err);
  }
});

router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  const entryId = req.body.id;
  try {
    res.json({ ok: await removeEntryById(entryId) });
  } catch (err) {
    next(err);
  }
});

router.delete(
  "/book",
  async (req: Request, res: Response, next: NextFunction) => {
    const listId = req.body.listId;
    const bookId = req.body.bookId;
    try {
      const list = await getListById(listId);
      if (
        !list ||
        (req.sessionUser.id != list.user && !req.sessionUser.administrator)
      ) {
        res.status(403).json({ ok: false });
      } else {
        res.json({ ok: await deleteListBook(listId, bookId) });
      }
    } catch (err) {
      next(err);
    }
  }
);

export default router;
