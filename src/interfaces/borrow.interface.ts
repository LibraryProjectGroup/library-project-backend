interface Borrow {
  id: number;
  library_user: number;
  book: number;
  borrowDate: Date;
  dueDate: Date;
  returned: boolean;
  returnDate: Date | null;
}

export default Borrow;
