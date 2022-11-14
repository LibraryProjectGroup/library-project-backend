import { Response, Request, Router } from 'express';
import {
    queryDeleteList,
    queryInsertNewList,
    querySelectAllLists,
    querySelectListByUser,
    querySelectList,
    queryUpdateList,
} from '../queries/book_list';
import Book_list from '../interfaces/book_list.interface';

const router = Router();

// note(markus): tested these in postman

router.get('/all', async (req: Request, res: Response) => {
    try {
        res.json(await querySelectAllLists());
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.get('/user', async (req: Request, res: Response) => {
    try {
        const booklists = await querySelectListByUser(req.sessionUser.id);
        res.json(booklists);
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.get('/', async (req: Request, res: Response) => {
    const listId = req.body.id ;
    try {
        res.json(await querySelectList(listId));
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.put('/', async (req: Request, res: Response) => {
    const list: Book_list = req.body;
    try {
        res.json({ ok: await queryUpdateList(list) });
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const list: Book_list = { ...req.body };
    try {
        res.json({ ok: await queryInsertNewList(req.sessionUser.id, req.body.name), });
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

router.delete('/', async (req: Request, res: Response) => {
    const listId = req.body.id;
    try {
        res.json({ ok: await queryDeleteList(listId) });
    } catch (error) {
        console.error(error);
        res.json({ ok: false, status: 500 });
    }
});

export default router;
