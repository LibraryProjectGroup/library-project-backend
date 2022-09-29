# library-project-backend

### Note:
Use **ts-node** to run the server. <br> ts-node is not included in package.json. Instead, use *npm install -g ts-node* to install ts-node globally.

### Note #2:
Database connection doesn't work without **secrets.ts** in **/src** folder. secrets.ts is set to be ignored by git with .gitignore, so create secrets.ts locally. <br> secrets.ts is in the form of: <br>
``` 
    const DATABASE_NAME = ???
    const DATABASE_USER = ???
    const DATABASE_PASSWORD = ???
    
    export { DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD }
```
Database name, user, and password can be found on Discord.

### Note #3: 
To make SQL queries from backend, a local database isn't necessary: the backend can access remote database via PuTTY and tunneling. <br> To set up tunneling in PuTTY, have *Host Name* set as **javaohjelmointi.net** and *Port* as **22**. Under *Connection-> SSH -> Tunnels* set *Source port* as **3306** and *Destination* as **localhost:3306**. After that, select *Session* again, name the session under *Saved Session*, save it, select it from the list, and press **Open**. <br>
After connecting, input proper credentials. The database is then available on localhost:3306. 

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

#### /allbooks (GET)

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
### User **(⚠ not working yet)**
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

#### /users (GET)

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
