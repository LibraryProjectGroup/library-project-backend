import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import mysql from "mysql"
import Book from './interfaces/book.interface'

const DATABASE_NAME = 'efilibrarydb'
const DATABASE_USER = 'root'
const DATABASE_PASSWORD = 'superSecretPasswordInPlainText'
const EXAMPLE_BOOK: Book = {
    owner: "John Doe",
    title: "Python Machine Learning: Machine Learning and Deep Learning with Python, scikit-learn, and TensorFlow 2, 3rd Edition",
    author: "Klabnik, Steve",
    topic: "Machine Learning",
    isbn: "9781492032649",
    location: "Helsinki"
}

const app: Express = express()
app.use(cors())

const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME
})

//------------- Endpoints ------------
app.get('/example', function (req: Request, res: Response) {
    console.log(`Got request from ${req.get("origin")}. Yay!`);
    res.json(EXAMPLE_BOOK)
})

app.get('/allbooks', function (req: Request, res: Response) {

    let queryResult = null
    dbConnection.connect()
    dbConnection.query('SELECT * FROM book', (err, rows, fields) => {
        if (err) throw err
        queryResult = rows
        console.log(rows)
    })
    dbConnection.end()
    // Because of asynchronicity, this will log first and res.json will respond with queryValue that is null.
    // TODO: asynchronous response.
    console.log(queryResult)
    res.json(queryResult)
})
  

app.listen(3001)
console.log("Server running on port 3001")
