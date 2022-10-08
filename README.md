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

## Endpoints

### Book

#### /book?id={id} (GET)

Response schema:

```JSON
{
    "title": "Book",
    "description": "Book",
    "type": "object",
    "properties":{
      "id":{"type":"string"},
      "libraryUser":{"type":"User"},
      "topic":{"type":"Topic"},
      "title":{"type":"string"},
      "author":{"type":"string"},
      "isbn":{"type":"string"},
      "location":{"type":"string"}
    }
}
```

#### /book?title={title}&author={author}&isbn={isbn}&topic={topic}&location={location} (POST)

Response schema:

```JSON
{
    "title": "Ok",
    "description": "Ok",
    "type": "object",
    "properties":{
      "ok":{"type":"boolean"}
    }
}
```

#### /book?id={id}&title={title}&author={author}&isbn={isbn}&topic={topic}&location={location} (PUT)

Response schema:

```JSON
{
    "title": "Ok",
    "description": "Ok",
    "type": "object",
    "properties":{
      "ok":{"type":"boolean"}
    }
}
```

#### /book?id={id} (DELETE)

Response schema:

```JSON
{
    "title": "Ok",
    "description": "Ok",
    "type": "object",
    "properties":{
      "ok":{"type":"boolean"}
    }
}
```

#### /book/all (GET)

Response schema:

```JSON
{
  "type":"array",
  "items": {
    "title": "Book",
    "description": "Book",
    "type": "object",
    "properties":{
      "libraryUser":{"type":"User"},
      "topic":{"type":"Topic"},
      "title":{"type":"string"},
      "author":{"type":"string"},
      "isbn":{"type":"string"},
      "location":{"type":"string"}
    }
}
```

### User

#### /user?id={id} (GET)

Response schema:

```JSON
{
    "title": "User",
    "description": "User",
    "type": "object",
    "properties":{
      "books":{"type":"array"},
      "userId":{"type":"string"},
      "userName":{"type":"string"},
}
```

#### /user/all (GET)

Response schema:

```JSON
{
  "type":"array",
  "items": {
    "title": "User",
    "description": "User",
    "type": "object",
    "properties":{
      "books":{"type":"array"},
      "userId":{"type":"string"},
      "userName":{"type":"string"},
    }
}
```
