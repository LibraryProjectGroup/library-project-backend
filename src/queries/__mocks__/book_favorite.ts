import Book_favorite from '../../interfaces/book_favorite.interface'

// note: this mock is very basic and its purpose is for jest to run through routes

let date = new Date()

let favoritebook1: Book_favorite = {
  id: 1,
  userId: 1,
  bookId: 1,
  favoritedDatetime: date,
}

let favoritebook2: Book_favorite = {
  id: 2,
  userId: 1,
  bookId: 2,
  favoritedDatetime: date,
}

let favoritebook3: Book_favorite = {
  id: 3,
  userId: 2,
  bookId: 1,
  favoritedDatetime: date,
}

let mockFavoriteBookData = [favoritebook1, favoritebook2, favoritebook3]
let sessionId = 1

const getBook = (userId: number, bookId: number) => {
  for (let index = 0; index < mockFavoriteBookData.length; index++) {
    if (
      mockFavoriteBookData[index].userId === userId &&
      mockFavoriteBookData[index].bookId === bookId
    ) {
      return mockFavoriteBookData[index]
    }
  }
  return null
}

export const isBookFavoritedByUser = async (
  userId: number,
  bookId: number
): Promise<any> => {
  let book = getBook(userId, bookId)
  if (book !== null) {
    return true
  }
  return false
}

export const getFavoriteCountForBook = async (
  bookId: number
): Promise<number> => {
  let favoriteCount: number = 0
  for (let index = 0; index < mockFavoriteBookData.length; index++) {
    if (mockFavoriteBookData[index].bookId === bookId) {
      favoriteCount = favoriteCount + 1
    }
  }
  return favoriteCount
}

export const addFavoriteBook = async (
  userId: number,
  bookId: number
): Promise<boolean> => {
  let lengthBefore = mockFavoriteBookData.length
  mockFavoriteBookData.push({
    id: mockFavoriteBookData.length + 1,
    userId: userId,
    bookId: bookId,
    favoritedDatetime: new Date(),
  })
  if (mockFavoriteBookData.length > lengthBefore) {
    return true
  }
  return false
}

export const deleteFavoriteBook = async (
  userId: number,
  bookId: number
): Promise<boolean> => {
  let lengthBefore = mockFavoriteBookData.length
  let array: Array<Book_favorite> = []
  mockFavoriteBookData.forEach((element) => {
    if (element.userId !== userId && element.bookId !== bookId) {
      array.push(element)
    }
  })
  mockFavoriteBookData = array
  if (lengthBefore > array.length) {
    return true
  }
  return false
}
