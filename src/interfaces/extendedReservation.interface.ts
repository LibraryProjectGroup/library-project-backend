interface ExtendedReservation {
  id: number;
  username: string;
  userId: number;
  title: string;
  bookId: number;
  reservationDatetime: Date;
  loaned: boolean;
  canceled: boolean;
  returnDate: Date | null;
}

export default ExtendedReservation;
