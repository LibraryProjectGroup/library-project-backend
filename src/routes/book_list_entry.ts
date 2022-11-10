import { Response, Request, Router } from "express";
import {
    queryInsertEntry,
    queryRemoveFromList,
    querySelectAllEntries,
    querySelectAllEntriesByList,
    querySelectEntry,
} from "../queries/book_list_entry";
import Book_list_entry from "../interfaces/book_list_entry.interface";

const router = Router();

router.get("/all", async (req: Request, res: Response) => {
    try {
        res.json(await querySelectAllEntries());
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

//export const querySelectAllEntriesByList = async (listId: number) => {
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

export default router;
