import { Response, Request, Router, NextFunction } from "express";
import {
    queryDeleteListBook,
    queryInsertEntry,
    queryRemoveFromList,
    querySelectAllEntries,
    querySelectAllEntriesByList,
    querySelectEntry,
} from "../queries/book_list_entry";
import Book_list_entry from "../interfaces/book_list_entry.interface";
import { querySelectList } from "../queries/book_list";

const router = Router();

router.get("/all", async (req: Request, res: Response) => {
    try {
        res.json(await querySelectAllEntries());
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.get("/list", async (req: Request, res: Response) => {
    try {
        res.json(await querySelectAllEntriesByList(Number(req.query.id)));
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        res.json(await querySelectEntry(Number(req.query.id)));
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.post("/", async (req: Request, res: Response) => {
    const entry: Book_list_entry = { ...req.body };
    try {
        res.json({ ok: await queryInsertEntry(entry) });
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.delete("/", async (req: Request, res: Response) => {
    const entryId = req.body.id;
    try {
        res.json({ ok: await queryRemoveFromList(entryId) });
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.delete(
    "/book",
    async (req: Request, res: Response, next: NextFunction) => {
        const listId = req.body.listId;
        const bookId = req.body.bookId;
        try {
            const list = await querySelectList(listId);
            if (
                !list ||
                (req.sessionUser.id != list.user &&
                    !req.sessionUser.administrator)
            ) {
                res.status(403).json({ ok: false });
            } else {
                res.json({ ok: await queryDeleteListBook(listId, bookId) });
            }
        } catch (err) {
            next(err);
        }
    }
);

export default router;
