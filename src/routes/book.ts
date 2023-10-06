import { Response, Request, Router, NextFunction } from 'express'
import {
  querySelectBook,
  querySelectAllBooks,
  querySoftDeleteBook,
  queryInsertBook,
  queryUpdateBook,
  querySelectAllReservedBooks,
  querySelectAllBooksPaged,
  queryCountAllBooks,
} from '../queries/book'
import Book from '../interfaces/book.interface'

const router = Router()

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await querySelectAllBooks())
  } catch (err) {
    next(err)
  }
})

router.get('/page', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(
      await querySelectAllBooksPaged(
        Number(req.query.page),
        Number(req.query.pageSize)
      )
    )
  } catch (err) {
    next(err)
  }
})

router.get(
  '/count',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await queryCountAllBooks())
    } catch (err) {
      next(err)
    }
  }
)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await querySelectBook(Number(req.query.id)))
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await querySelectBook(Number(req.query.id))
    if (
      book &&
      (req.sessionUser.id == book.library_user || req.sessionUser.administrator)
    ) {
      res.json({ ok: await querySoftDeleteBook(book.id) })
    } else {
      res.status(403).json({ ok: false })
    }
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      ok: await queryInsertBook(
        req.sessionUser.id,
        req.body.title,
        req.body.image,
        req.body.author,
        req.body.year,
        req.body.isbn,
        req.body.topic,
        req.body.homeOfficeId
      ),
    })
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedBook: Book = req.body
    updatedBook.library_user = req.sessionUser.id
    const book = await querySelectBook(updatedBook.id)
    if (
      book &&
      (req.sessionUser.id == book.library_user || req.sessionUser.administrator)
    ) {
      res.json({ ok: await queryUpdateBook(updatedBook) })
    } else {
      res.status(403).json({ ok: false })
    }
  } catch (err) {
    next(err)
  }
})

router.get(
  '/all/reserved',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await querySelectAllReservedBooks())
    } catch (err) {
      next(err)
    }
  }
)

export default router
