import { Request, Response, Router, NextFunction } from "express";
import { querySelectAllBooks } from "../queries/book";

const router = Router();

router.get("", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await querySelectAllBooks();
        res.json({ ok: true });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: err.toString() });
    }
});

export default router;
