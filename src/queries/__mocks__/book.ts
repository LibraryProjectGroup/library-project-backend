import Book from '../../interfaces/book.interface'

// note: this mock is very basic and its purpose is for jest to run through routes

let book1: Book = {
  id: 1,
  library_user: 1,
  title: 'bt1',
  image: 'https://images.isbndb.com/covers/91/26/9789513119126.jpg',
  author: 'ba1',
  year: 2011,
  isbn: '123-t456',
  topic: 'Java',
  description: '',
  language: 'en',
  homeOfficeId: 1,
  homeOfficeName: 'Helsinki',
  homeOfficeCountry: 'FIN',
  deleted: false,
}

let book2: Book = {
  id: 2,
  library_user: 1,
  title: 'bt2',
  image: 'https://images.isbndb.com/covers/91/26/9789513119126.jpg',
  author: 'ba2',
  year: 2012,
  isbn: '234-t567',
  topic: 'JavaScript',
  description: '',
  language: 'en',
  homeOfficeId: 1,
  homeOfficeName: 'Helsinki',
  homeOfficeCountry: 'FIN',
  deleted: true,
}

let book3: Book = {
  id: 3,
  library_user: 2,
  title: 'bt3',
  image: 'https://images.isbndb.com/covers/91/26/9789513119126.jpg',
  author: 'ba3',
  year: 2013,
  isbn: '345-t678',
  topic: 'TypeScript',
  description: '',
  language: 'en',
  homeOfficeId: 1,
  homeOfficeName: 'Helsinki',
  homeOfficeCountry: 'FIN',
  deleted: false,
}

let book4: Book = {
  id: 4,
  library_user: 2,
  title: 'bt4',
  image: 'https://images.isbndb.com/covers/91/26/9789513119126.jpg',
  author: 'ba4',
  year: 2014,
  isbn: '456-t567',
  topic: 'SQL',
  description: '',
  language: 'en',
  homeOfficeId: 1,
  homeOfficeName: 'Helsinki',
  homeOfficeCountry: 'FIN',
  deleted: false,
}

let mockBookData = [book1, book2, book3, book4]
let idCounter = 4

const getBook = (id: number) => {
  for (let index = 0; index < mockBookData.length; index++) {
    if (mockBookData[index].id === id) {
      return mockBookData[index]
    }
  }
  return null
}

export const querySelectBook = async (bookId: number): Promise<Book | null> => {
  return getBook(bookId)
}

export const querySelectAllBooks = async (): Promise<Book[]> => {
  let array: Array<Book> = []
  mockBookData.forEach((element) => {
    if (!element.deleted) {
      array.push(element)
    }
  })
  return array as Array<Book>
}
export const querySelectAllExistingBooks = async (): Promise<Book[]> => {
  return mockBookData as Array<Book>
}

export const queryHardDeleteBook = async (bookId: number): Promise<boolean> => {
  let deleted = false
  mockBookData = mockBookData.filter((book) => {
    if (book.id == bookId) deleted = true
    return book.id != bookId
  })
  return deleted
}

export const querySoftDeleteBook = async (bookId: number): Promise<boolean> => {
  const book = getBook(bookId)
  if (book) {
    book.deleted = true
    return true
  }
  return false
}

export const queryInsertBook = async (
  userId: number,
  title: string,
  image: string,
  author: string,
  year: number,
  isbn: string,
  topic: string,
  description: string,
  language: string,
  homeOfficeCountry: string,
  homeOfficeId: number,
  homeOfficeName: string
): Promise<boolean> => {
  mockBookData.push({
    id: idCounter++,
    library_user: userId,
    title,
    image,
    author,
    year,
    isbn,
    topic,
    description,
    language,
    homeOfficeCountry,
    homeOfficeId,
    homeOfficeName,
    deleted: false,
  })
  return true
}

export const queryUpdateBook = async (book: Book): Promise<boolean> => {
  const editedBook = getBook(book.id)
  if (editedBook) {
    editedBook.title = book.title
    editedBook.image = book.image
    editedBook.author = book.author
    editedBook.year = book.year
    editedBook.isbn = book.isbn
    editedBook.topic = book.topic
    editedBook.description = book.description
    editedBook.language = book.language
    editedBook.homeOfficeId = book.homeOfficeId
    editedBook.homeOfficeName = book.homeOfficeName
    editedBook.homeOfficeCountry = book.homeOfficeCountry
    return true
  }
  return false
}
