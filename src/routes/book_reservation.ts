import { Response, Request, Router, NextFunction } from "express";
import {
    querySelectReservations,
    querySelectReservation,
    queryInsertReservation,
    queryUpdateReservation,
    queryCancelReservation,
    queryLoanReservation,
    querySelectCurrentReservations,
    querySelectJoinedReservations,
    queryUserCurrentJoinedReservations,
    querySelectCurrentReservationForBook,
} from "../queries/book_reservation";

const router = Router();

router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await querySelectReservations());
    } catch (err) {
        next(err);
    }
});


router.get(
    "/all/current",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await querySelectCurrentReservations());
        } catch (err) {
            next(err);
        }
    }
);

router.get(
    "/all/joined",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await querySelectJoinedReservations());
        } catch (err) {
            next(err);
        }
    }
);

router.get("/book", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await querySelectCurrentReservationForBook(req.body.bookId));
    } catch (err) {
        next(err);
    }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({
            ok: await queryInsertReservation(
                req.sessionUser.id,
                req.body.bookId
            ),
        });
    } catch (err) {
        next(err);
    }
});

router.post(
    "/cancel",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json({
                ok: await queryCancelReservation(req.body.bookId),
            });
        } catch (err) {
            next(err);
        }
    }
);

router.post(
    "/loan",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json({
                ok: await queryLoanReservation(req.body.bookId),
            });
        } catch (err) {
            next(err);
        }
    }
);

router.post(
    "/user/current",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await queryUserCurrentJoinedReservations(req.body.userId));
        } catch (err) {
            next(err);
        }
    }
);

export default router;
