interface Session {
  id: number;
  userId: number;
  secret: string;
  expires: number;
  invalidated: boolean;
}

export default Session;
