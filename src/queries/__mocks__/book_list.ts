import Book_list from '../../interfaces/book_list.interface'

// note: this mock is very basic and its purpose is for jest to run through routes

let book_list1: Book_list = {
  id: 1,
  user: 1,
  name: 'Favourites',
}

let book_list2: Book_list = {
  id: 2,
  user: 1,
  name: 'ToShare',
}

let book_list3: Book_list = {
  id: 3,
  user: 2,
  name: 'Favourites',
}

let mockBook_listData = [book_list1, book_list2, book_list3]
let idCounter = 4

const getBook_list = (id: number) => {
  for (let index = 0; index < mockBook_listData.length; index++) {
    if (mockBook_listData[index].id === id) {
      return mockBook_listData[index]
    }
  }
  return null
}

export const getAllLists = async () => {
  return mockBook_listData as Array<Book_list>
}

export const getListsByUser = async (userId: number) => {
  let array: Array<Book_list> = []
  mockBook_listData.forEach((element) => {
    if (element.user == userId) {
      array.push(element)
    }
  })
  return array as Array<Book_list>
}

export const getListById = async (listId: number) => {
  return getBook_list(listId)
}

export const insertNewList = async (
  userId: number,
  listName: string
): Promise<Boolean> => {
  mockBook_listData.push({
    id: idCounter++,
    user: userId,
    name: listName,
  })
  return true
}

export const deleteList = async (listId: number) => {
  let deleted = false
  mockBook_listData = mockBook_listData.filter((book_list) => {
    if (book_list.id == listId) deleted = true
    return book_list.id != listId
  })
  return deleted
}

export const updateList = async (book_list: Book_list) => {
  const editedBook_list = getBook_list(book_list.id)
  if (editedBook_list) {
    editedBook_list.name = book_list.name
    return true
  }
  return false
}
