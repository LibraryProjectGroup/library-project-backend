# library-project-backend

### Note:

The backend server is run during development with [ts-node](https://www.npmjs.com/package/ts-node). Ts-node is now included in development dependencies, and the server can be started with `npm start`. By default the backend server will start on port 3000, which can be changed by setting `PORT` environment variable.

```sh
$ npm install
$ npm start
# open http://localhost:3000
```

### Note #2:

Database connection doesn't work without **.env** in **root** folder. .env is set to be ignored by git with .gitignore, so create .env locally. <br> .env is in the form of: <br>

```
    DATABASE_SERVER = ???
    DATABASE_NAME = ???
    DATABASE_USER = ???
    DATABASE_PASSWORD = ???

```

Database name, user, and password can be found on Discord at **#secrets**.

### Note #3:

To make SQL queries from backend, a local database isn't necessary: the backend can access remote database via PuTTY and tunneling. <br> To set up tunneling in PuTTY, have _Host Name_ set as **javaohjelmointi.net** and _Port_ as **22**. Under _Connection-> SSH -> Tunnels_, set _Source port_ as **3306** and _Destination_ as **localhost:3306**. After that, select _Session_ again, name the session under _Saved Session_, save it, select it from the list, and press **Open**. <br>
After connecting, input proper credentials from **#secrets**. The database is then available on localhost:3306.

### Developing in a container

The [.devcontainer](.devcontainer/) folder contains files for developing the backend in a [VS Code Container](https://code.visualstudio.com/docs/remote/containers). See installation and usage instructions at [code.visualstudio.com](https://code.visualstudio.com/docs/remote/containers).

[docker-compose.yml](.devcontainer/docker-compose.yml) file contains a container for both the Express application as well as the dabatase. Database initialization is handled automatically on creation using the _\*.sql_ files in [sql/](./sql/) folder. [docker-compose.yml](.devcontainer/docker-compose.yml) contains also the database credentials for local development as environment variables. These must only be used for local development.

<br>

# Endpoints
### Note #4:
Endpoints that use body will be in JSON format.

## Auth

### /auth/register (POST)

Body
```JSON
{
  "username": string,
  "email": string,
  "password": string
}
```

On Success Response schema:
```JSON
{
  "ok": true,
  "secret": string
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "message": string
}
```

### /auth/login (POST)

Body
```JSON
{
  "email": string,
  "password": string
}
```

On Success Response schema:
```JSON
{
  "ok": true,
  "userId": number,
  "secret": string
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "message": string
}
```

### /auth/logout (POST)

On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "message": string
}
```

## Book List Entry

### /booklistentry/all (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "list": number,
    "book": number
  }
]
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "status": 500
}
```

### /booklistentry/list?id={id} (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "list": number,
    "book": number
  }
]
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "status": 500
}
```

### /booklistentry?id={id} (GET)
On Success Response schema:
```JSON
{
  "id": number,
  "list": number,
  "book": number
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "status": 500
}
```

### /booklistentry (POST)
Body:
```JSON
{
  "list": number,
  "book": number
}
```

On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "status": 500
}
```

### /booklistentry (DELETE)
Body:
```JSON
{
  "id": number
}
```

On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "status": 500
}
```

### /booklistentry/book (DELETE)
Body:
```JSON
{
  "listId": number,
  "bookId": number
}
```

On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```
## Book List

### /booklist/all (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "library_user": number,
    "name": string
  }
]
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "status": 500
}
```

### /booklist/user (GET)
On Success Response schema:
```JSON
{
  "id": number,
  "library_user": number,
  "name": string
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "status": 500
}
```

### /booklist/books?id={id} (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "library_user": number,
    "title": string,
    "author": string,
    "isbn": string,
    "topic": string,
    "location": string,
    "deleted": boolean
  }
]
```

### /booklist/info?id={id} (GET)
On Success Response schema:
```JSON
{
  "userId": number,
  "username": string,
  "name": string
}
```

### /booklist?id={id} (GET)
On Success Response schema:
```JSON
{
  "id": number,
  "library_user": number,
  "name": string
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "status": 500
}
```

### /booklist (PUT)
Body:
```JSON
{
  "id": number,
  "name": string
}
```

On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "status": 500
}
```

### /booklist (POST)
Body:
```JSON
{
  "name": string
}
```

On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "status": 500
}
```

### /booklist (DELETE)
Body:
```JSON
{
  "id": number
}
```

On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "status": 500
}
```

## Book Request

### /bookrequest/all (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "userId": number,
    "isbn": string,
    "title": string,
    "reason": string,
    "status": Book_request_status
  }
]
```

### /bookrequest (POST)
Body:
```JSON
{
  "isbn": string,
  "title": string,
  "reason": string
}
```

On Success Response schema:
```JSON
{
  "ok": true
}
```

### /bookrequest/updatestatus (PUT)
Body:
```JSON
{
  "id": number,
  "status": Book_request_status
}
```

On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```
## Book Reservation

### /bookreservation/all (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "userId": number,
    "bookId": number,
    "borrowId": number,
    "reservationDatetime": Date,
    "loaned": boolean,
    "canceled": boolean
  }
]
```

### /bookreservation/all/current (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "userId": number,
    "bookId": number,
    "borrowId": number,
    "reservationDatetime": Date,
    "loaned": boolean,
    "canceled": boolean,
    "returnDate": Date | null
  }
]
```

### /bookreservation/all/extended (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "username": string,
    "title": string,
    "bookId": number,
    "reservationDatetime": Date,
    "loaned": boolean,
    "canceled": boolean,
    "returnDate": Date | null
  }
]
```
### /bookreservation/book (GET)
Body:
```JSON
{
  "bookId": number
}
```

On Success Response schema:
```JSON
[
  {
    "id": number,
    "userId": number,
    "bookId": number,
    "borrowId": number,
    "reservationDatetime": Date,
    "loaned": boolean,
    "canceled": boolean,
    "returnDate": Date | null
  }
]
```

### /bookreservation (POST)
Body:
```JSON
{
  "bookId": number
}
```

On Success Response schema:
```JSON
{
  "ok": true,
}
```

### /bookreservation/cancel (POST)
Body:
```JSON
{
  "bookId": number
}
```

On Success Response schema:
```JSON
{
  "ok": true,
}
```

### /bookreservation/loan (POST)
Body:
```JSON
{
  "bookId": number
}
```

On Success Response schema:
```JSON
{
  "ok": true,
}
```

### /bookreservation/user/current (POST)
Body:
```JSON
{
  "userId": number
}
```

On Success Response schema:
```JSON
{
  "ok": true,
}
```

## Book

### /book/all (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "library_user": number,
    "title": string,
    "author": string,
    "isbn": string,
    "topic": string,
    "location": string,
    "deleted": boolean
  }
]
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /book/page?page={page}&pageSize={pageSize} (GET)
pageSize is optional

On Success Response schema:
```JSON
[
  {
    "id": number,
    "library_user": number,
    "title": string,
    "author": string,
    "isbn": string,
    "topic": string,
    "location": string,
    "deleted": boolean
  }
]
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /book/count (GET)
On Success Response schema:
```JSON
number
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /book?id={id} (GET)
On Success Response schema:
```JSON
{
  "id": number,
  "library_user": number,
  "title": string,
  "author": string,
  "isbn": string,
  "topic": string,
  "location": string,
  "deleted": boolean
}
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /book?id={id} (DELETE)
On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /book (POST)
Body:
```JSON
{
  "title": string,
  "author": string,
  "isbn": string,
  "topic": string,
  "location": string
}
```

On Success Response schema:
```JSON
[
{
  "ok": true,
}

```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /book (PUT)
Body:
```JSON
{
  "id": number,
  "title": string,
  "author": string,
  "isbn": string,
  "topic": string,
  "location": string
}
```

On Success Response schema:
```JSON
{
  "ok": true,
}
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /book/all/reserved (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "library_user": number,
    "title": string,
    "author": string,
    "isbn": string,
    "topic": string,
    "location": string,
    "deleted": boolean
  }
]
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

## Borrow

### /borrow/all (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "library_user": number,
    "book": number,
    "dueDate": Date,
    "borrowDate": Date,
    "returned": boolean,
    "returnDate": Date | null
  }
]
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /borrow?id={id} (GET)
On Success Response schema:
```JSON
{
  "id": number,
  "library_user": number,
  "book": number,
  "dueDate": Date,
  "borrowDate": Date,
  "returned": boolean,
  "returnDate": Date | null
}
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /borrow (DELETE)
Body:
```JSON
{
    "bookId": number
}
```

On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /borrow (POST)
Body:
```JSON
{
  "bookId": number
}
```

On Success Response schema:
```JSON
{
  "ok": true,
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "message": string
}
```

### /borrow (PUT)
Body:
```JSON
{
  "id": number,
  "book": number,
  "dueDate": Date,
  "borrowDate": Date,
  "returned": boolean,
  "returnDate": Date | null
}
```

On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /borrow/current (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "library_user": number,
    "book": number,
    "dueDate": Date,
    "borrowDate": Date,
    "returned": boolean,
    "returnDate": Date | null
  }
]
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /borrow/expired/admin (GET)
On Success Response schema:
```JSON
[
  {
    "borrowId": number,
    "dueDate": Date,
    "title": string,
    "bookId": number,
    "username": string,
    "userId": number
  }
]
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /borrow/current/admin (GET)
On Success Response schema:
```JSON
[
  {
    "username": string,
    "title": string,
    "borrowDate": Date,
    "dueDate": Date,
    "id": number
  }
]
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /borrow/expired (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "library_user": number,
    "book": number,
    "dueDate": Date,
    "borrowDate": Date,
    "returned": boolean,
    "returnDate": Date | null
  }
]
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /borrow/session (GET)
On Success Response schema:
```JSON
[
  {
    "id": number,
    "library_user": number,
    "book": number,
    "dueDate": Date,
    "borrowDate": Date,
    "returned": boolean,
    "returnDate": Date | null
  }
]
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /borrow/return (PUT)
Body:
```JSON
{
  "borrowId": number
}
```

On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

## Health

### /health (GET)
On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "error:": string
}
```

## Password Reset

### /passwordreset/secret?id={id} (GET)
On Success Response schema:
```JSON
{
  "ok": true,
  "secret": string
}
```

On Fail Response schema:
```JSON
{
  "ok": false
}
```

### /passwordreset (POST)
Body:
```JSON
{
  "secret": string,
  "password": string
}
```

On Success Response schema:
```JSON
{
  "ok": true
}
```

On Fail Response schema:
```JSON
{
  "ok": false,
  "message": string
}
```

## User








































# Docker Help
Building the docker image: `docker image build .`  
Running the docker image: `docker run -p 3000:3000 <docker image>`

