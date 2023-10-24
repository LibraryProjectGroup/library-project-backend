import { Response, Request, Router, NextFunction } from 'express'
import {
  getAllLists,
  getListsByUser,
  getListById,
  insertNewList,
  deleteList,
  updateList,
  getBooksByListId,
  getListInfoById,
} from '../queries/book_list'
import Book_list from '../interfaces/book_list.interface'

const router = Router()

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getAllLists())
  } catch (err) {
    next(err)
  }
})

router.get('/user', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booklists = await getListsByUser(req.sessionUser.id)
    res.json(booklists)
  } catch (err) {
    next(err)
  }
})

router.get(
  '/books',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await getBooksByListId(Number(req.query.id)))
    } catch (err) {
      next(err)
    }
  }
)

router.get('/info', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getListInfoById(Number(req.query.id)))
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const listId = req.query.id
  try {
    res.json(await getListById(Number(listId)))
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  const list: Book_list = req.body
  try {
    res.json({ ok: await updateList(list) })
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const list: Book_list = { ...req.body }
  try {
    res.json({
      ok: await insertNewList(req.sessionUser.id, req.body.name),
    })
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  const listId = req.body.id
  try {
    res.json({ ok: await deleteList(listId) })
  } catch (err) {
    next(err)
  }
})

export default router
