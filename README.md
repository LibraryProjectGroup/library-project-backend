# library-project-backend

### Note:
Use **ts-node** to run the server. <br> ts-node is not included in package.json. Instead, use *npm install -g ts-node* to install ts-node globally.

🚧 //Under construction// 🚧
Endpoint: **books**

Example response: 
Response schema: {
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
