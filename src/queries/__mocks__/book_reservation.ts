import Book_reservation from '../../interfaces/book_reservation.interface'
import ExtendedReservation from '../../interfaces/extendedReservation.interface'

import { mockUserData } from './user'
import { mockBookData } from './book'
import { mockBorrowData, isBookAvailable } from './borrow'
import { RESERVATION_DAYS, MS_IN_DAY } from '../../constants'

// note: this mock is very basic and its purpose is for jest to run through routes

let date = new Date()

let reservation1: Book_reservation = {
  id: 1,
  bookId: 1,
  userId: 1,
  borrowId: 1,
  reservationDatetime: date,
  loaned: false,
  canceled: false,
}

let reservation2: Book_reservation = {
  id: 2,
  bookId: 2,
  userId: 2,
  borrowId: 2,
  reservationDatetime: date,
  loaned: true,
  canceled: false,
}

let reservation3: Book_reservation = {
  id: 3,
  bookId: 3,
  userId: 3,
  borrowId: 3,
  reservationDatetime: date,
  loaned: false,
  canceled: false,
}

let reservation4: Book_reservation = {
  id: 4,
  bookId: 1,
  userId: 2,
  borrowId: 4,
  reservationDatetime: date,
  loaned: false,
  canceled: false,
}

let reservation5: Book_reservation = {
  id: 5,
  bookId: 2,
  userId: 3,
  borrowId: 5,
  reservationDatetime: date,
  loaned: false,
  canceled: false,
}

let mockReservationsData = [
  reservation1,
  reservation2,
  reservation3,
  reservation4,
  reservation5,
]
let idCount = 5

const getUsername = async (userId: number): Promise<string | null> => {
  for (let index = 0; index < mockUserData.length; index++) {
    if (mockUserData[index].id === userId) {
      return mockUserData[index].username
    }
  }
  return null
}

const getBookTitle = async (bookId: number): Promise<string | null> => {
  for (let index = 0; index < mockBookData.length; index++) {
    if (mockBookData[index].id === bookId) {
      return mockBookData[index].title
    }
  }
  return null
}

const getReturnDate = async (borrowId: number): Promise<Date | null> => {
  for (let index = 0; index < mockBorrowData.length; index++) {
    if (mockBorrowData[index].id === borrowId) {
      return mockBorrowData[index].returnDate
    }
  }
  return null
}

const filterValidReservations = (reservations: any) => {
  return JSON.parse(JSON.stringify(reservations)).filter(
    (reservation: ExtendedReservation) =>
      reservation.returnDate === null ||
      new Date(
        new Date(reservation.returnDate).getTime() +
          RESERVATION_DAYS * MS_IN_DAY
      ).getTime() > new Date().getTime()
  )
}

///bookreservation/all (GET)
export const getAllReservations = async (): Promise<Book_reservation[]> => {
  let array: Array<Book_reservation> = []
  mockReservationsData.forEach((element) => {
    array.push(element)
  })
  return array
}

///bookreservation/all/current
export const getCurrentReservations = async (): Promise<
  ExtendedReservation[]
> => {
  const array: Array<ExtendedReservation> = []
  for (let index = 0; index < mockReservationsData.length; index++) {
    if (
      mockReservationsData[index].canceled !== true &&
      mockReservationsData[index].loaned !== true
    ) {
      let username = await getUsername(mockReservationsData[index].userId)
      let title = await getBookTitle(mockReservationsData[index].bookId)
      let returnDate = await getReturnDate(mockReservationsData[index].borrowId)
      if (username !== null && title !== null) {
        array.push({
          id: mockReservationsData[index].id,
          username: username,
          userId: mockReservationsData[index].userId,
          title: title,
          bookId: mockReservationsData[index].bookId,
          reservationDatetime: mockReservationsData[index].reservationDatetime,
          loaned: mockReservationsData[index].loaned,
          canceled: mockReservationsData[index].canceled,
          returnDate: returnDate,
        })
      }
    }
  }
  return filterValidReservations(array) as ExtendedReservation[]
}

///bookreservation/all/extended
export const getAllExtendedReservations = async (): Promise<
  ExtendedReservation[]
> => {
  const array: Array<ExtendedReservation> = []
  for (let index = 0; index < mockReservationsData.length; index++) {
    let username = await getUsername(mockReservationsData[index].userId)
    let title = await getBookTitle(mockReservationsData[index].bookId)
    let returnDate = await getReturnDate(mockReservationsData[index].borrowId)
    if (username !== null && title !== null) {
      array.push({
        id: mockReservationsData[index].id,
        username: username,
        userId: mockReservationsData[index].userId,
        title: title,
        bookId: mockReservationsData[index].bookId,
        reservationDatetime: mockReservationsData[index].reservationDatetime,
        loaned: mockReservationsData[index].loaned,
        canceled: mockReservationsData[index].canceled,
        returnDate: returnDate,
      })
    }
  }
  return filterValidReservations(array) as ExtendedReservation[]
}

///bookreservation/book (GET)
export const getCurrentReservationForBook = async (bookId: number) => {
  const array: Array<ExtendedReservation> = []
  for (let index = 0; index < mockReservationsData.length; index++) {
    if (mockReservationsData[index].bookId === bookId) {
      let username = await getUsername(mockReservationsData[index].userId)
      let title = await getBookTitle(mockReservationsData[index].bookId)
      let returnDate = await getReturnDate(mockReservationsData[index].borrowId)
      if (username !== null && title !== null) {
        array.push({
          id: mockReservationsData[index].id,
          username: username,
          userId: mockReservationsData[index].userId,
          title: title,
          bookId: mockReservationsData[index].bookId,
          reservationDatetime: mockReservationsData[index].reservationDatetime,
          loaned: mockReservationsData[index].loaned,
          canceled: mockReservationsData[index].canceled,
          returnDate: returnDate,
        })
      }
    }
  }
  const validReservations = filterValidReservations(array)
  return validReservations.length > 0
    ? (validReservations[0] as ExtendedReservation)
    : null
}

export const getUserCurrentExtendedReservations = async (
  userId: number
): Promise<ExtendedReservation[] | null> => {
  const array: Array<ExtendedReservation> = []
  for (let index = 0; index < mockReservationsData.length; index++) {
    if (
      mockReservationsData[index].bookId === userId &&
      mockReservationsData[index].loaned === false &&
      mockReservationsData[index].canceled === false
    ) {
      let username = await getUsername(mockReservationsData[index].userId)
      let title = await getBookTitle(mockReservationsData[index].bookId)
      let returnDate = await getReturnDate(mockReservationsData[index].borrowId)
      if (username !== null && title !== null) {
        array.push({
          id: mockReservationsData[index].id,
          username: username,
          userId: mockReservationsData[index].userId,
          title: title,
          bookId: mockReservationsData[index].bookId,
          reservationDatetime: mockReservationsData[index].reservationDatetime,
          loaned: mockReservationsData[index].loaned,
          canceled: mockReservationsData[index].canceled,
          returnDate: returnDate,
        })
      }
    }
  }
  const validReservations = filterValidReservations(array)
  return validReservations.length > 0
    ? (validReservations as ExtendedReservation[])
    : null
}

//Insert reservation
export const insertReservation = async (
  userId: number,
  bookId: number
): Promise<Boolean> => {
  const length = mockReservationsData.length
  if (await getCurrentReservationForBook(bookId)) {
    return false
  }
  const borrow = await isBookAvailable(bookId)
  if (borrow === true) {
    mockReservationsData.push({
      id: idCount + 1,
      bookId: bookId,
      userId: userId,
      borrowId: mockBorrowData.length + 1,
      reservationDatetime: date,
      loaned: false,
      canceled: false,
    })
  }
  return true
}

//Cancel reservation
export const cancelReservation = async (bookId: number): Promise<Boolean> => {
  mockReservationsData.forEach((element) => {
    if (element.bookId === bookId) {
      element.canceled = !element.canceled
    }
  })
  return true
}

// /bookreservation/loan
export const loanReservation = async (bookId: number): Promise<any> => {
  mockReservationsData.forEach((element) => {
    if (element.bookId === bookId) {
      element.loaned = !element.loaned
    }
  })
  return true
}
