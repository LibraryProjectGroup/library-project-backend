interface User {
  id: number
  username: string
  email: string
  passw: string | null
  administrator: boolean
  deleted: boolean
  /**
   * An optional home office.
   */
  homeOfficeId?: number
}

export default User
