import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import Book from './interfaces/book.interface'


const app: Express = express()
app.use(cors())

const EXAMPLE_BOOK: Book = {
    owner: "John Doe",
    title: "Python Machine Learning: Machine Learning and Deep Learning with Python, scikit-learn, and TensorFlow 2, 3rd Edition",
    author: "Klabnik, Steve",
    topic: "Machine Learning",
    isbn: "9781492032649",
    location: "Helsinki"
}

app.get('/example', function (req: Request, res: Response) {
    console.log(`Got request from ${req.get("origin")}. Yay!`);
    res.json(EXAMPLE_BOOK)
})
  
app.listen(3001)
console.log("Server running on port 3001")
