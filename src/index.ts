import express, { Express, Request, response, Response } from 'express'
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

const pool = mysql.createPool({
    host: 'localhost',
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME
})

//------------ Responses -----------
// Queries in mysql library don't return a promise, so responses have to be handled in a callback function.

const responseAllBooks = async(res:Response) => {
    pool.query("SELECT * FROM book", (error, result, fields)=>{
        if (error) throw error;
        sendResponse(res, result)
    })
}

const responseBook = async(res:Response, id:string, requestMethod:string) => {
    pool.query("SELECT * FROM book WHERE book.id = ?", [id], (error, result, fields)=>{
        if (error) throw error;
        if(result.length === 1){
            sendResponse(res, result[0])
        } else{
            sendResponse(res, {"result":"null"})
        }
    })
}

const sendResponse = async(res: Response, queryResult: any) => {
    res.json(queryResult)
}

//------------- Endpoints -----------

app.get('/allbooks', function (req: Request, res: Response) {
    responseAllBooks(res)
})

app.get('/book', function (req: Request, res: Response) {
    responseBook(res, req.query.id as string, "get")
})

/* TODO: 
app.post('/book', function (req: Request, res: Response) {
    responseBook(res, req, "post")
})
*/

app.get('/example', function (req: Request, res: Response) {
    console.log(`Got a request from ${req.get("origin")}. Yay!`);
    res.json(EXAMPLE_BOOK)
})


app.listen(3001)
console.log("Server running on port 3001")


