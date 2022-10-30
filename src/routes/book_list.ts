import { Response, Request, Router } from "express";
import { 
    queryDeleteList,
    queryInsertNewList,
    querySelectAllLists,
    querySelectListByUser,
    querySelectList,
    queryUpdateList,
} from "../queries/book_list";
import Book_list from "../interfaces/book_list.interface";


const router = Router();

router.get('/all', async (req: Request, res: Response) => {
    res.json(await querySelectAllLists());
});

router.get('/booklist/user', async (req: Request, res: Response) => {
    const username: string = req.query.username as string;
    const booklists = await querySelectListByUser(username);
    res.json(booklists);
});

router.get('/', async (req: Request, res: Response) => {
    const listId = req.query.id as string;
    try {
        res.json(await querySelectList(listId));
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.put('/', async (req: Request, res: Response) => {
    const list: Book_list = req.body;
    res.json({ ok: await queryUpdateList(list) });
});

router.post('/', async (req: Request, res: Response) => {
    const list: Book_list = {...req.body};
    res.json({ ok: await queryInsertNewList(list) });
});

router.delete('/', async (req: Request, res: Response) => {
    const listId = req.query.id as string;
    try {
        res.json({ ok: await queryDeleteList(listId) });
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

export default router;