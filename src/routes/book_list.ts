import { Response, Request, Router, NextFunction } from "express";
import {
    queryDeleteList,
    queryInsertNewList,
    querySelectAllLists,
    querySelectListByUser,
    querySelectList,
    queryUpdateList,
    queryBooksByList,
    querySelectListInfo,
} from "../queries/book_list";
import Book_list from "../interfaces/book_list.interface";

const router = Router();

// note(markus): tested these in postman

router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await querySelectAllLists());
    } catch (err) {
        next(err);
    }
});

router.get("/user", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booklists = await querySelectListByUser(req.sessionUser.id);
        res.json(booklists);
    } catch (err) {
        next(err);
    }
});

router.get(
    "/books",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await queryBooksByList(Number(req.query.id)));
        } catch (err) {
            next(err);
        }
    }
);

router.get("/info", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await querySelectListInfo(Number(req.query.id)));
    } catch (err) {
        next(err);
    }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const listId = req.query.id;
    try {
        res.json(await querySelectList(Number(listId)));
    } catch (err) {
        next(err);
    }
});

router.put("/", async (req: Request, res: Response, next: NextFunction) => {
    const list: Book_list = req.body;
    try {
        res.json({ ok: await queryUpdateList(list) });
    } catch (err) {
        next(err);
    }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const list: Book_list = { ...req.body };
    try {
        res.json({
            ok: await queryInsertNewList(req.sessionUser.id, req.body.name),
        });
    } catch (err) {
        next(err);
    }
});

router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
    const listId = req.body.id;
    try {
        res.json({ ok: await queryDeleteList(listId) });
    } catch (err) {
        next(err);
    }
});

export default router;
