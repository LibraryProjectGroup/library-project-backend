import { Response, Request, Router, NextFunction } from 'express'
import {
  getBookById,
  getAllExistingBooks,
  markBookAsDeleted,
  insertNewBook,
  updateBook,
  getAllReservedBooks,
  getAllBooksPaged,
  getCountOfAllBooks,
  updateBooksOffice,
} from '../queries/book'
import Book from '../interfaces/book.interface'

const router = Router()

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getAllExistingBooks())
  } catch (err) {
    next(err)
  }
})

router.get('/page', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(
      await getAllBooksPaged(Number(req.query.page), Number(req.query.pageSize))
    )
  } catch (err) {
    next(err)
  }
})

router.get(
  '/count',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await getCountOfAllBooks())
    } catch (err) {
      next(err)
    }
  }
)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getBookById(Number(req.query.id)))
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await getBookById(Number(req.query.id))
    if (
      book &&
      (req.sessionUser.id == book.library_user || req.sessionUser.administrator)
    ) {
      res.json({ ok: await markBookAsDeleted(book.id) })
    } else {
      res.status(403).json({ ok: false })
    }
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.sessionUser.administrator) {
      const result = await insertNewBook(
        req.sessionUser.id,
        req.body.title,
        req.body.image,
        req.body.author,
        req.body.year,
        req.body.isbn,
        req.body.topic,
        req.body.description,
        req.body.language,
        req.body.homeOfficeId
      )
      if (await result) {
        const books = await getAllExistingBooks()

        res.json({
          ok: result,
          books: await books,
        })
      }
    } else {
      res.status(403).json({ ok: false })
    }
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedBook: Book = req.body
    updatedBook.library_user = req.sessionUser.id
    const book = await getBookById(updatedBook.id)
    if (
      book &&
      (req.sessionUser.id == book.library_user || req.sessionUser.administrator)
    ) {
      const ok = await updateBook(updatedBook)
      const updated = (await ok) ? await getBookById(book.id) : null
      res.json({ ok: await ok, book: await updated })
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
      res.json(await getAllReservedBooks())
    } catch (err) {
      next(err)
    }
  }
)

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newOfficeId, oldOfficeId } = req.body

    if (req.sessionUser.administrator) {
      const ok = await updateBooksOffice(newOfficeId, oldOfficeId)
      res.json({ ok })
    } else {
      res.status(403).json({ ok: false })
    }
  } catch (err) {
    next(err)
  }
})

export default router
