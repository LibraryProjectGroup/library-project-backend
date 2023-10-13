import { Response, Request, Router, NextFunction } from "express";
import {
    getAllReviews,
    getReviewByBookId,
    deleteReview,
    getReviewById,
    getAverageRatingForBook,
    updateReview,
    insertReview
} from "../queries/book_review";

const router = Router();

router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await getAllReviews());
    } catch (err) {
        next(err);
    }
});

router.get("/book", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await getReviewByBookId(Number(req.body.bookId)));
    } catch (err) {
        next(err);
    }
});

router.get("/average", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookId } = req.body;
        const averageRating = await getAverageRatingForBook(bookId);
        if (averageRating !== null) {
            res.json({ averageRating });
        } else {
            res.status(404).json({ error: "Book not found or no reviews available" });
        }
    } catch (err) {
        next(err);
    }
});

router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewIdToDelete = Number(req.body.reviewId);
        const bookReview = await getReviewById(reviewIdToDelete);
        if (!bookReview) {
            res.status(404).json({ ok: false, error: "Review not found." });
            return;
        }
        const isAuthorized =
            req.sessionUser.id == bookReview.userId ||
            req.sessionUser.administrator
        if (isAuthorized) {
            const deleteResult = await deleteReview(bookReview.id);
            if (deleteResult) {
                res.json({ ok: true });
            } else {
                res.status(500).json({ ok: false, error: "Failed to delete the review." });
            }
        } else {
            res.status(403).json({ ok: false, error: "Unauthorized to delete the review." });
        }
    } catch (err) {
        next(err);
    }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookId, comment, rating } = req.body;
        const added = await insertReview(req.session.userId, bookId, comment, rating);
        if (added) {
            res.json({ ok: true });
        } else {
            res.status(400).json({ ok: false, message: "Failed to add review book" });
        }
    } catch (err) {
        next(err);
    }
});

router.put("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reviewId, comment, rating } = req.body;
        const updated = await updateReview(reviewId, comment, rating);
        if (updated) {
            res.json({ ok: true });
        } else {
            res.status(400).json({ ok: false, message: "Failed to update book review" });
        }
    } catch (err) {
        next(err);
    }
});





export default router;
