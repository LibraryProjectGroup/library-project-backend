interface User {
  id: number;
  username: string;
  email: string;
  passw: string | null;
  administrator: boolean;
  deleted: boolean;
}

export default User;
