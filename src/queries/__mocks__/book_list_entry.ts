import Book_list_entry from "../../interfaces/book_list_entry.interface";

// note: this mock is very basic and its purpose is for jest to run through routes

let book_list_entry1: Book_list_entry = {
  id: 1,
  list: 1,
  book: 1,
};

let book_list_entry2: Book_list_entry = {
  id: 2,
  list: 2,
  book: 1,
};

let book_list_entry3: Book_list_entry = {
  id: 3,
  list: 3,
  book: 3,
};

let mockBook_list_entryData = [
  book_list_entry1,
  book_list_entry2,
  book_list_entry3,
];
let idCounter = 4;

const getBook_list_entry = (id: number) => {
  for (let index = 0; index < mockBook_list_entryData.length; index++) {
    if (mockBook_list_entryData[index].id === id) {
      return mockBook_list_entryData[index];
    }
  }
  return null;
};

export const querySelectAllEntries = async () => {
  return mockBook_list_entryData as Array<Book_list_entry>;
};

export const querySelectAllEntriesByList = async (listId: number) => {
  let array: Array<Book_list_entry> = [];
  mockBook_list_entryData.forEach((element) => {
    if (element.list == listId) array.push(element);
  });
  return array as Array<Book_list_entry>;
};

export const querySelectEntry = async (entryId: number) => {
  return getBook_list_entry(entryId);
};

export const queryInsertEntry = async (book_list_entry: Book_list_entry) => {
  mockBook_list_entryData.push({
    id: idCounter++,
    list: book_list_entry.list,
    book: book_list_entry.book,
  });
  return true;
};

export const queryRemoveFromList = async (entryId: number) => {
  let deleted = false;
  mockBook_list_entryData = mockBook_list_entryData.filter(
    (book_list_entry) => {
      if (book_list_entry.id == entryId) deleted = true;
      return book_list_entry.id != entryId;
    }
  );
  return deleted;
};
