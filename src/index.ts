import express, { Express, Request, response, Response } from 'express'
import cors from 'cors'
import mysql from "mysql"
import Book from './interfaces/book.interface'


const DATABASE_NAME = 'efilibrarydb'
const DATABASE_USER = 'root'
const DATABASE_PASSWORD = 'superSecretPasswordInPlainText'
const EXAMPLE_BOOK: Book = {
    id: 1,
    library_user: "John Doe",
    title: "Python Machine Learning: Machine Learning and Deep Learning with Python, scikit-learn, and TensorFlow 2, 3rd Edition",
    author: "Klabnik, Steve",
    topic: "Machine Learning",
    isbn: "9781492032649",
    location: "Helsinki"
}
const EXAMPLE_BOOK_2: Book = {...EXAMPLE_BOOK, id:2, title: "Book 2"}
const EXAMPLE_BOOK_3: Book = {...EXAMPLE_BOOK, id:3, title: "Book 3"}
const EXAMPLE_BOOKS: Array<Book> = [EXAMPLE_BOOK, EXAMPLE_BOOK_2, EXAMPLE_BOOK_3]

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
    /*pool.query('SELECT * FROM book', (error, result, fields)=>{
        if (error) throw error;
        sendResponse(res, result)
    })*/
    sendResponse(res, EXAMPLE_BOOKS)
}

const responseBook = async(res:Response, bookId:string, requestMethod:string, editedBook?:Book) => {
    switch(requestMethod){

        case 'get':
            pool.query('SELECT * FROM book WHERE book.id = ?', [bookId], (error, result, fields)=>{
                if (error) throw error;
                if(result.length === 1){
                    sendResponse(res, result[0])
                } else{
                    sendResponse(res, {'result':'null'})
                }
            })
            break;

        case 'delete':
            pool.query('DELETE FROM book WHERE id=?', [bookId], (error, result, fields)=>{
                if (error) throw error;
                sendResponse(res, {'status':'ok'})
            })
            break;

        case 'post':
            // Temporary fix for DB not having auto incrementing id's. 
            const randomId = Math.floor(Math.random() * 99999);
            pool.query('INSERT INTO book (id, library_user, title, author, topic, isbn, location) VALUES (?)', [[randomId,1, editedBook?.title,editedBook?.author, editedBook?.topic, editedBook?.isbn, editedBook?.location]], (error, result, fields)=>{
                if (error) throw error;
                sendResponse(res, {'status':'ok'})
            })
            break;
        
        case 'put':
            const sqlQuery = `UPDATE book set title='${editedBook?.title}', author='${editedBook?.author}', topic='${editedBook?.topic}', isbn='${editedBook?.isbn}', location='${editedBook?.location}' WHERE book.id=${bookId}`
            pool.query(sqlQuery, (error, result, fields)=>{
                if (error) throw error;
                sendResponse(res, {'status':'ok'})
            })
    }
}

const sendResponse = async(res: Response, queryResult: any) => {
    res.json(queryResult)
}

//------------- Endpoints -----------

app.get('/allbooks', function (req: Request, res: Response) {
    responseAllBooks(res)
})

app.get('/book', function (req: Request, res: Response) {
    responseBook(res, req.query.id as string, 'get')
})

app.delete('/book', function (req: Request, res: Response) {
    responseBook(res, req.query.id as string, 'delete')
})

app.post('/book', function (req: Request, res: Response) {
    const editedBook:Book = {
        library_user: req.query.library_user as string,
        title: req.query.title as string,
        author: req.query.author as string,
        topic: req.query.topic as string,
        isbn: req.query.isbn as string,
        location: req.query.location as string
    }
    console.log("REQUEST")
    console.log(req)
    responseBook(res, req.query.id as string , 'post', editedBook)
})

app.put('/book', function (req: Request, res: Response) {
    const editedBook:Book = {
        library_user: req.query.library_user as string,
        title: req.query.title as string,
        author: req.query.author as string,
        topic: req.query.topic as string,
        isbn: req.query.isbn as string,
        location: req.query.location as string
    }
    console.log("REQUEST")
    console.log(req)
    responseBook(res, req.query.id as string , 'put', editedBook)
})


app.get('/example', function (req: Request, res: Response) {
    console.log(`Got a request from ${req.get('origin')}. Yay!`);
    res.json(EXAMPLE_BOOK)
})


app.listen(3001)
console.log("Server running on port 3001")

export default app
