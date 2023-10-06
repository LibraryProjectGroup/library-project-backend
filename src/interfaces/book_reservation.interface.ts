interface Book_reservation {
  id: number
  bookId: number
  userId: number
  borrowId: number
  reservationDatetime: Date
  loaned: boolean
  canceled: boolean
}

export default Book_reservation
