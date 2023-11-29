import Book_request from '../../interfaces/book_request.interface'
import { Book_request_status } from '../../interfaces/book_request.interface'

const mockBookRequests: Book_request[] = [
  {
    id: 1,
    userId: 1,
    isbn: '978-1234567890',
    title: 'Sample Book 1',
    reason: 'I want to read this book.',
    status: 0,
  },
  {
    id: 2,
    userId: 2,
    isbn: '978-9876543210',
    title: 'Another Book',
    reason: 'I need this for my research.',
    status: 0,
  },
  {
    id: 3,
    userId: 3,
    isbn: '978-5678901234',
    title: 'The Third Book',
    reason: 'This book is a must-read!',
    status: 2,
  },
  {
    id: 4,
    userId: 1,
    isbn: '978-3456789012',
    title: 'Request Book 4',
    reason: 'I heard its a great book.',
    status: 0,
  },
  {
    id: 5,
    userId: 2,
    isbn: '978-2109876543',
    title: 'Book Five',
    reason: 'Please approve my request.',
    status: 1,
  },
]

export const getAllRequests = async (): Promise<Book_request[]> => {
  return mockBookRequests
}

export const insertRequest = async (
  userId: number,
  isbn: string,
  title: string,
  reason: string
): Promise<boolean> => {
  let lengthBefore = mockBookRequests.length
  mockBookRequests.push({
    id: mockBookRequests.length + 1,
    userId: userId,
    isbn: isbn,
    title: title,
    reason: reason,
    status: 0,
  })
  if (mockBookRequests.length > lengthBefore) {
    return true
  }
  return false
}

export const updateRequestStatus = async (
  id: number,
  status: Book_request_status
): Promise<boolean> => {
  let index = mockBookRequests.findIndex((element) => element.id === id)
  if (index < 0 && index > mockBookRequests.length) {
    return false
  } else {
    mockBookRequests[index].status = status
    return true
  }
}
