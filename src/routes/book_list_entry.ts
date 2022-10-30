import { Response, Request, Router } from "express";
import { 
    queryInsertEntry,
    queryRemoveFromList,
    //querySelectAllEntries,
    querySelectEntry, 
} from "../queries/book_list_entry";
import Book_list_entry from "../interfaces/book_list_entry.interface";


const router = Router();

//  can these be moved to book_list router file?

router.get('/', async (req: Request, res: Response) => {
    const entryId = req.query.id as string;
    try {
        res.json(await querySelectEntry(entryId));
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const entry: Book_list_entry = {...req.body};
    res.json({ ok: await queryInsertEntry(entry) });
});

router.delete('/', async (req: Request, res: Response) => {
    const entryId = req.query.id as string;
    try {
        res.json({ ok: await queryRemoveFromList(entryId) });
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

export default router;