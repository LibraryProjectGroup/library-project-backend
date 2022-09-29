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

<br>

## Endpoints



### Book
#### /book?{id} (GET)

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

#### /book?{title}&{author}&{isbn}&{topic}&{location} (POST)

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

#### /book?{bookid}&{userid}&{title}&{author}&{isbn}&{topic}&{location} (PUT)

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

#### /book?{id} (DELETE)

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

#### /books (GET)

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
#### /user?{id} (GET)

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
