import Borrow from "../../interfaces/borrow.interface";
import DetailedExpiredBorrow from "../../interfaces/detailedExpiredBorrows.interface";

// note: this mock is very basic and its purpose is for jest to run through routes

let date = new Date();
const tenDaysAhead = date.setDate(date.getDate() + 10);
const dayBehind = date.setDate(date.getDate() - 1);

const borrow1: Borrow = {
  id: 1,
  library_user: 1,
  book: 1,
  borrowDate: new Date(),
  dueDate: new Date(tenDaysAhead),
  returnDate: null,
  returned: false,
};

const borrow2: Borrow = {
  id: 2,
  library_user: 1,
  book: 3,
  borrowDate: new Date(),
  dueDate: new Date(tenDaysAhead),
  returnDate: null,
  returned: false,
};

const borrow3: Borrow = {
  id: 3,
  library_user: 2,
  book: 2,
  borrowDate: new Date("2020-01-01"),
  dueDate: new Date("2020-01-11"),
  returnDate: null,
  returned: true,
};

const borrow4: Borrow = {
  id: 4,
  library_user: 2,
  book: 4,
  borrowDate: new Date(),
  dueDate: new Date(dayBehind),
  returnDate: null,
  returned: false,
};

const detailedExpiredBorrow1: DetailedExpiredBorrow = {
  borrowId: 4,
  title: "bt4",
  dueDate: borrow4.dueDate,
  bookId: 4,
  library_user: "t2",
  userId: borrow4.library_user,
};

let mockBorrowData = [borrow1, borrow2, borrow3, borrow4];
let mockDetailedExpiredBorrowData = [detailedExpiredBorrow1];
let idCounter = 4;

const getBorrow = (id: number) => {
  for (let index = 0; index < mockBorrowData.length; index++) {
    if (mockBorrowData[index].id === id) {
      return mockBorrowData[index];
    }
  }
  return null;
};

export const querySelectAllBorrows = async (): Promise<Borrow[]> => {
  return mockBorrowData as Array<Borrow>;
};

export const querySelectAllCurrentBorrows = async (): Promise<Borrow[]> => {
  let array: Array<Borrow> = [];
  mockBorrowData.forEach((element) => {
    if (!element.returned) {
      array.push(element);
    }
  });
  return array as Array<Borrow>;
};

export const querySelectAllCurrentBorrows2 = async () => {
  let array: {
    username: string;
    title: string;
    borrowDate: Date;
    dueDate: Date;
    id: number;
  }[] = [];
  mockBorrowData.forEach((element) => {
    if (!element.returned) {
      array.push({
        username: "asd",
        title: "asd",
        borrowDate: element.borrowDate,
        dueDate: element.dueDate,
        id: element.book,
      });
    }
  });
  return array;
};

export const querySelectBorrow = async (
  borrowingId: number
): Promise<Borrow | null> => {
  return getBorrow(borrowingId);
};

export const queryDeleteBorrow = async (
  borrowingId: number
): Promise<boolean> => {
  let deleted = false;
  mockBorrowData = mockBorrowData.filter((borrow) => {
    if (borrow.id == borrowingId) deleted = true;
    return borrow.id != borrowingId;
  });
  return deleted;
};

export const queryInsertBorrow = async (
  userId: number,
  bookId: number,
  dueDate: Date,
  borrowDate: Date
): Promise<boolean> => {
  mockBorrowData.push({
    id: idCounter++,
    library_user: userId,
    book: bookId,
    borrowDate,
    dueDate,
    returned: false,
    returnDate: null,
  });
  return true;
};

export const queryUpdateBorrow = async (borrow: Borrow): Promise<boolean> => {
  const editedBorrow = getBorrow(borrow.id);
  if (editedBorrow) {
    editedBorrow.book = borrow.book;
    editedBorrow.borrowDate = borrow.borrowDate;
    editedBorrow.dueDate = borrow.dueDate;
    editedBorrow.returned = borrow.returned;
    return true;
  }
  return false;
};

export const queryBookIsAvailable = async (
  bookId: number
): Promise<boolean> => {
  const borrow = getBorrow(bookId);
  let availCheck = 0;
  if (borrow) {
    mockBorrowData.forEach((element) => {
      if (!element.returned && element.id == borrow.id) availCheck++;
    });
  }
  return availCheck == 0;
};

export const queryBorrowsByUserId = async (
  userId: number
): Promise<Borrow[]> => {
  let array: Array<Borrow> = [];
  const borrow = getBorrow(userId);
  if (borrow) {
    mockBorrowData.forEach((element) => {
      if (!element.returned && element.id == borrow.id) array.push(element);
    });
  }
  return array as Array<Borrow>;
};

export const queryExpiredBorrows = async (): Promise<Borrow[]> => {
  let array: Array<Borrow> = [];
  mockBorrowData.forEach((element) => {
    if (!element.returned && new Date() > element.dueDate) {
      array.push(element);
    }
  });
  return array as Array<Borrow>;
};

export const queryDetailedExpiredBorrows = async (): Promise<
  DetailedExpiredBorrow[]
> => {
  return mockDetailedExpiredBorrowData as Array<DetailedExpiredBorrow>;
};
