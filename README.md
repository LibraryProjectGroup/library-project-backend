# library-project-backend

### Note:
Use **ts-node** to run the server. <br> ts-node is not included in package.json. Instead, use *npm install -g ts-node* to install ts-node globally.

🚧 //Under construction// 🚧
<br>

## Endpoints



#### Endpoint: **GET book/{author}&{title}**
<br>
Example response:
<br>
Response schema: 
```JSON
{   
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

Endpoint: **/books**
<br>
Example response: 
<br>
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

#### Endpoint: **GET user/{userId}**
<br>
Example response:
<br>
Response schema: 
```JSON
{   
    "type":"array",
  "items": {
    "title": "User",
    "description": "User",
    "type": "object",
    "properties":{
      "libraryBook":{"type":"Book"},
      "userId":{"type":"string"},
      "userName":{"type":"string"},
    }
}
```

Endpoint: **/users**
<br>
Example response: 
<br>
Response schema: 
```JSON
{
  "type":"array",
  "items": {
    "title": "User",
    "description": "User",
    "type": "object",
    "properties":{
      "libraryBook":{"type":"Book"},
      "userId":{"type":"string"},
      "userName":{"type":"string"},
    }
}
```
