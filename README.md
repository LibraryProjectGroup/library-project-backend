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

Endpoints that use body will be in JSON format. Endpoint requires either query or body, if query is present, the body section will not be shown and vice versa.
<br>
If not separately mentioned, On Success Response schema is:

```JSON
{
  "ok": true
}
```

If not separately mentioned, On Fail Response schema is:

```JSON
{
  "ok": fail
}
```

## Auth

<Details>
    <Summary>
        Show Endpoints
    </Summary>

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

On Fail Response schema:

```JSON
{
  "ok": false,
  "message": string
}
```

</Details>

## Book List Entry

<Details>
    <Summary>
        Show Endpoints
    </Summary>
    
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

</Details>

## Book List

<Details>
    <Summary>
        Show Endpoints
    </Summary>
    
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

On Fail Response schema:

```JSON
{
  "ok": false,
  "status": 500
}
```

</Details>

## Book Request

<Details>
    <Summary>
        Show Endpoints
    </Summary>

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

### /bookrequest/updatestatus (PUT)

Body:

```JSON
{
  "id": number,
  "status": Book_request_status
}
```

</Details>

## Book Reservation

<Details>
    <Summary>
        Show Endpoints
    </Summary>

\
Book_reservations are considered active, if they are not canceled, loaned, and the connected Borrow hasn't been returned more than RESERVATION_DAYS prior to now. Book_reservations are considered loanable, if they are active and the connecting Borrow has been returned. Book_reservation status isn't automatically updated in the backend, but is instead filtered through SQL queries and _filterActiveReservations_ function in **queries/book_reservation**.

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

### /bookreservation/active/loanable

```JSON
[
  {
    "id": number,
    "bookId": number,
    "reservationDatetime": Date,
    "loaned": boolean,
    "canceled": boolean,
    "returnDate": Date
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

### /bookreservation/cancel (POST)

Body:

```JSON
{
  "bookId": number
}
```

### /bookreservation/loan (POST)

Body:

```JSON
{
  "reservationId": number
}
```

### /bookreservation/user/current (POST)

Body:

```JSON
{
  "userId": number
}
```

</Details>

## Book

<Details>
    <Summary>
        Show Endpoints
    </Summary>

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

### /book/count (GET)

On Success Response schema:

```JSON
number
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

### /book?id={id} (DELETE)

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

</Details>

## Borrow

<Details>
    <Summary>
        Show Endpoints
    </Summary>

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

### /borrow (DELETE)

Body:

```JSON
{
    "bookId": number
}
```

### /borrow (POST)

Body:

```JSON
{
  "bookId": number
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

### /borrow/return (PUT)

Body:

```JSON
{
  "borrowId": number
}
```

</Details>

## Health

<Details>
    <Summary>
        Show Endpoints
    </Summary>

### /health (GET)

On Fail Response schema:

```JSON
{
  "ok": false,
  "error:": string
}
```

</Details>

## Password Reset

<Details>
    <Summary>
        Show Endpoints
    </Summary>

### /passwordreset/secret?id={id} (GET)

On Success Response schema:

```JSON
{
  "ok": true,
  "secret": string
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

On Fail Response schema:

```JSON
{
  "ok": false,
  "message": string
}
```

</Details>

## User

<Details>
    <Summary>
        Show Endpoints
    </Summary>

### /user/all (GET)

On Success Response schema:

```JSON
[
  {
    "id": number,
    "username": string,
    "email": string,
    "administrator": boolean
  }
]
```

### /user?id={id} (GET)

On Success Response schema:

```JSON
{
  "id": number,
  "username": string,
  "email": string,
  "administrator": boolean
}
```

### /user/session (GET)

On Success Response schema:

```JSON
{
  "id": number,
  "username": string,
  "email": string,
  "administrator": boolean,
  "deleted": boolean
}
```

### /user (DELETE)

Body:

```JSON
{
  "id": number
}
```

### /user (POST)

Body:

```JSON
{
  "username": string,
  "email": string,
  "password": string,
  "administrator": boolean
}
```

### /user?id={id}&username={username}&email={email}&password={password}&administrator={administrator} (PUT)

### /user/admin?id={id}&username={username}&email={email}&administrator={administrator} (PUT)

</Details>

# Database Diagram

<Details>
    <Summary>
        Show Diagram
    </Summary>
    <img src="dbdiagram.png"></img>
</Details>

# Docker Help

Building the docker image: `docker image build .`  
Running the docker image: `docker run -p 3000:3000 <docker image>`
