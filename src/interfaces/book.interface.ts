interface Book {
  id: number
  library_user: number
  title: string
  image: string
  author: string
  year: number
  topic: string
  isbn: string
  description: string
  language: string
  deleted: boolean
  homeOfficeId: number
  homeOfficeName: string
  homeOfficeCountry: string
}

export default Book
