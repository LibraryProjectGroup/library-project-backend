import Book_review from '../../interfaces/book_review.interface'

const date = new Date()

const mockBookReviews: Book_review[] = [
  {
    id: 1,
    userId: 1,
    bookId: 1,
    comment: 'A great book!',
    rating: 5,
    reviewDate: date,
  },
  {
    id: 2,
    userId: 2,
    bookId: 2,
    comment: 'Enjoyable read',
    rating: 4,
    reviewDate: date,
  },
  {
    id: 3,
    userId: 3,
    bookId: 1,
    comment: 'Not my favorite',
    rating: 3,
    reviewDate: date,
  },
  {
    id: 4,
    userId: 1,
    bookId: 3,
    comment: 'Loved it!',
    rating: 5,
    reviewDate: date,
  },
  {
    id: 5,
    userId: 2,
    bookId: 3,
    comment: 'Highly recommended',
    rating: 5,
    reviewDate: date,
  },
]

export const getAllReviews = async (): Promise<Book_review[]> => {
  return mockBookReviews as Book_review[]
}

export const getReviewByBookId = async (
  bookId: number
): Promise<Book_review[] | null> => {
  let array: Array<Book_review> = []
  for (let index = 0; index < mockBookReviews.length; index++) {
    if (mockBookReviews[index].bookId === bookId) {
      array.push(mockBookReviews[index])
    }
  }
  return array.length > 0 ? (array as Book_review[]) : null
}

export const deleteReview = async (id: number): Promise<boolean> => {
  let array: Array<Book_review> = []
  for (let index = 0; index < mockBookReviews.length; index++) {
    if (mockBookReviews[index].id !== id) {
      array.push(mockBookReviews[index])
    }
  }
  if (mockBookReviews.length > array.length) {
    return true
  }
  return false
}

export const updateReview = async (
  reviewId: number,
  comment: string,
  rating: number
): Promise<boolean> => {
  mockBookReviews.forEach((element) => {
    if (element.id === reviewId) {
      element.comment = comment
      element.rating = rating
    }
  })
  return true
}

export const insertReview = async (
  userId: number,
  bookId: number,
  comment: string,
  rating: number
): Promise<boolean> => {
  mockBookReviews.push({
    id: mockBookReviews.length + 1,
    userId: userId,
    bookId: bookId,
    comment: comment,
    rating: rating,
    reviewDate: new Date(),
  })
  return true
}

export const getAverageRatingForBook = async (
  bookId: number
): Promise<number | null> => {
  let totalRating: number = 0
  let numberOfReviews: number = 0
  let averageRating: number = 0
  mockBookReviews.forEach((element) => {
    if (element.bookId === bookId) {
      totalRating = totalRating + element.rating
      numberOfReviews++
    }
  })
  averageRating = totalRating / numberOfReviews
  return averageRating
}

export const getReviewById = async (
  reviewId: number
): Promise<Book_review | null> => {
  let array: Array<Book_review> = []
  for (let index = 0; index < mockBookReviews.length; index++) {
    if (mockBookReviews[index].id === reviewId) {
      array.push(mockBookReviews[index])
    }
  }
  return array.length > 0 ? (array[0] as Book_review) : null
}
