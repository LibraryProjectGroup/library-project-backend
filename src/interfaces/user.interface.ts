interface User {
  id: number;
  username: string;
  email: string;
  passw: string;
  administrator: boolean;
  deleted: boolean;
  /**
   * An optional home office.
   */
  homeOfficeId?: number;
}

export default User;
