import Borrow from "../../interfaces/borrow.interface";
import {
    querySelectAllUsers,
    querySelectUser,
    querySoftDeleteUser,
    queryInsertUser,
    queryUpdateUser,
    queryAdminUpdateUser,
} from "../../queries/user";

// note: this mock is very basic and its purpose is for jest to run through routes
let tenDaysAhead = new Date();
tenDaysAhead.setDate(tenDaysAhead.getDate() + 10);

const borrow1: Borrow = {
    id: 1,
    library_user: 1,
    book: 1,
    borrowDate: new Date(),
    dueDate: new Date(tenDaysAhead),
    returned: false,
};

const borrow2: Borrow = {
    id: 2,
    library_user: 1,
    book: 3,
    borrowDate: new Date(),
    dueDate: new Date(tenDaysAhead),
    returned: false,
};
const borrow3: Borrow = {
    id: 3,
    library_user: 2,
    book: 2,
    borrowDate: new Date("2020-01-01"),
    dueDate: new Date("2020-01-11"),
    returned: true,
};

let mockBorrowData = [borrow1, borrow2, borrow3];
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

/*
export const querySelectAllCurrentBorrows2 = async (): Promise<Borrow[]> => {
    let array: Array<Borrow> = [];
    mockBorrowData.forEach((element) => {
        if (!element.returned && new Date() > element.dueDate) {
            array.push(element);
        }
    });
    return array as Array<Borrow>;
};
*/

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
    });
    return true;
};

export const queryUpdateBorrow = async (borrow: Borrow): Promise<boolean> => {
    const editedBorrow = getBorrow(borrow.id);
    if (editedBorrow) {
        editedBorrow.library_user = borrow.library_user;
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
            if (!element.returned && element.id == borrow.id)
                array.push(element);
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

// export const queryDetailedExpiredBorrows = async (): Promise<DetailedExpiredBorrow[]> => {}
