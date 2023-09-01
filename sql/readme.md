# Database Documentation

## Import Instructions

HeidiSQL installs with MariaDB automacially.
In HeidiSQL choose a session (new or existing) -> Advanced tab -> Startup script -> EfiLibrary1.sql file.

The sql file can be found in teams under database folder.

(Full table creation, inserting queries and table dropping queries are in the bottom of the document.)

## Relation Schema
.
.
.
.
.


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
````

### INSERT INTO Queries
```sql
INSERT INTO library_user VALUES (
  1, "mikkomallikas", "1234", TRUE
);

INSERT INTO book VALUES (
  1, 1, "JS", "JS For Dummies", "JS Teacher", "12345-67-89", "MERICA"
);
```

##### DROP TABLE Queries

```sql
DROP TABLE book;
DROP TABLE library_user;

