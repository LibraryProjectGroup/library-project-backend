# Database Documentation

## Import Instructions

HeidiSQL installs with MariaDB automacially.
In HeidiSQL choose a session (new or existing) -> Advanced tab -> Startup script -> EfiLibrary1.sql file.

The sql file can be found in teams under database folder.

(Full table creation, inserting queries and table dropping queries are in the bottom of the document.)

## Relation Schema

```mermaid
classDiagram
    book "1" -- "0..*" book_keyword
    book_keyword "0..*" -- "1" keyword

    book "1" -- "0..*" recommendation
    book "1" -- "0..*" borrowing
    book "0..*" -- "1" library_user
    book "0..*" -- "1" topic

    book "1" -- "0..*" book_list_entry
    book "1" -- "0..*" reservation

    book_list "1" -- "0..*" book_list_entry
    book_list "0..*" -- "1" library_user
    reservation "0..*" -- "1" library_user
    library_user "1" -- "0..*" borrowing



    class book{
        id [PK]
        library [FK]
        topic [FK]
        title
        author
        isbn
        location
    }

    class borrowing{
       	id [PK]
     	library_user [FK]
        book [FK]
	    dueDate
	    borrowDate
	    returned

    }
    class library_user{
      	id	[PK]
	    username
        passw
	    administrator

    }
    class topic{
      topic [PK]
    }

    class recommendation{
        id [PK]
	    book [FK]
	    library_user [FK]
	    recommendation
    }

    class reservation {
        id [PK]
	    library_user [FK]
	    book [FK]
	    date
	    duration
    }

    class book_list {
        id [PK]
        library_user [FK]
        name
    }

    class book_list_entry {
        id [PK]
        book [FK]
        list [FK]
    }

    class keyword {
        keyword [PK]
    }

    class book_keyword {
        id [PK]
        book [FK]
        keyword [FK]
    }
```

# Tables

### Name: library_user

### Definition: A user of the software

| Properties                        | Name          | Description             | Type         | PK/FK/NOT NULL |
| --------------------------------- | ------------- | ----------------------- | ------------ | -------------- |
|                                   | id            |                         | Integer      | PK             |
|                                   | username      | Username to log in      | Varchar(50)  | NOT NULL       |
| Type length depends on encryption | passw         | Password to log in      | Varchar(150) | NOT NULL       |
|                                   | administrator | Determines admin status | Bit(1)       |                |

##

### Name: book

### Definition: A book that’s been registered to the library

| Properties | Name         | Description                      | Type         | PK/FK/NOT NULL |
| ---------- | ------------ | -------------------------------- | ------------ | -------------- |
|            | id           |                                  | Integer      | PK             |
|            | library_user | id of the user who owns the book | Integer      | FK             |
|            | topic        | Books topic taken from Topic     | Varchar(50)  | FK             |
|            | title        | Name of book                     | Varchar(250) | NOT NULL       |
|            | author       | Name of author                   | Varchar(250) | NOT NULL       |
|            | isbn         | The book's ISBN                  | Varchar(20)  | NOT NULL       |
|            | location     | Location of book                 | Varchar(20)  | NOT NULL       |

##

### Name: borrowing

### Definition: A borrow card that shows if a book is borrowed, by who, and until when.

| Properties | Name         | Description                              | Type    | PK/FK/NOT NULL |
| ---------- | ------------ | ---------------------------------------- | ------- | -------------- |
|            | id           |                                          | Integer | PK             |
|            | library_user | id of the user who is borrowing the book | Integer | FK             |
|            | book         | id of the book that’s being borrowed     | Integer | FK             |
|            | dueDate      | Date of return                           | Date    | NOT NULL       |
|            | borrowDate   | Date of borrow                           | Date    | NOT NULL       |
|            | returned     | Is the borrow completed or not           | Bit(1)  | NOT NULL       |

##

### Name: recommendation

### Definition: A recommendation that is given to a book by a user.

| Properties | Name           | Description                                | Type    | PK/FK/NOT NULL |
| ---------- | -------------- | ------------------------------------------ | ------- | -------------- |
|            | id             |                                            | Integer | PK             |
|            | book           | id of the book that’s being rated          | Integer | FK             |
|            | library_user   | id of user who is doing the recommendation | Integer | FK             |
|            | recommendation | Is the book recommended or not             | Bit(1)  | NOT NULL       |

##

### Name: reservation

### Definition: A reservation of a book made by a user.

| Properties | Name         | Description                                | Type    | PK/FK/NOT NULL |
| ---------- | ------------ | ------------------------------------------ | ------- | -------------- |
|            | id           |                                            | Integer | PK             |
|            | library_user | id of the user who is doing the reserving  | Integer | FK             |
|            | book         | id of book that is being reserved          | Integer | FK             |
|            | date         | The beginning date of the reservation      | Date    | NOT NULL       |
|            | duration     | The duration of the reservation in days(?) | Integer |                |

### Name: book_list

### Definition: A list of books made by a user.

| Properties | Name         | Description                       | Type        | PK/FK/NOT NULL |
| ---------- | ------------ | --------------------------------- | ----------- | -------------- |
|            | id           |                                   | Integer     | PK             |
|            | library_user | id of the user that owns the list | Integer     | FK             |
|            | name         | Name of the list                  | Varchar(20) |                |

##

### Name: topic

### Definition: Contains topics for books.

| Properties | Name  | Description           | Type        | PK/FK/NOT NULL |
| ---------- | ----- | --------------------- | ----------- | -------------- |
|            | topic | Topic names for books | Varchar(50) | PK             |

##

### Name: book_list_entry

### Definition: Helper table that binds books to different lists.

| Properties | Name | Description                       | Type    | PK/FK/NOT NULL |
| ---------- | ---- | --------------------------------- | ------- | -------------- |
|            | id   |                                   | Integer | PK             |
|            | book | id of a book that is being binded | Integer | FK             |
|            | list | id of a list the book is in       | Integer | FK             |

##

### Name: keyword

### Definition: Table contains a list of keywords that books can be labeled with. Useful for keyword searches.

| Properties | Name    | Description                     | Type        | PK/FK/NOT NULL |
| ---------- | ------- | ------------------------------- | ----------- | -------------- |
|            | keyword | The keyword to label books with | Varchar(30) | PK             |

##

### Name: book_keyword

### Definition: Helper table that binds keywords to books.

| Properties | Name    | Description                        | Type        | PK/FK/NOT NULL |
| ---------- | ------- | ---------------------------------- | ----------- | -------------- |
|            | id      |                                    | Integer     | PK             |
|            | book    | id of a book taken from Book table | Integer     | FK             |
|            | keyword | keyword taken from Keyword table   | Varchar(30) | FK             |

##

### CREATE TABLE Queries

```sql
CREATE TABLE book (
  id INTEGER PRIMARY KEY,
  library_user INTEGER NOT NULL,
  topic VARCHAR(50) NOT NULL,
  title VARCHAR(250) NOT NULL,
  author VARCHAR(250) NOT NULL,
  isbn VARCHAR(20) NOT NULL,
  location VARCHAR(20) NOT NULL
);

CREATE TABLE library_user (
  id INTEGER PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  passw VARCHAR(150) NOT NULL,
  administrator BOOLEAN
);

ALTER TABLE library_user ADD CONSTRAINT UQ_libary_user_username UNIQUE(username);
ALTER TABLE book ADD CONSTRAINT FK_book_library_user FOREIGN KEY(library_user) REFERENCES library_user(id)
```

### INSERT INTO Queries

```sql
INSERT INTO library_user VALUES (
  1, "mikkomallikas", "1234", TRUE
);

INSERT INTO book VALUES (
  1, 1, "JS", "JS For Dummies", "JS Teacher", "12345-67-89", "MERICA"
);
```

### DROP TABLE Queries

```sql
DROP TABLE book;
DROP TABLE library_user;

```
