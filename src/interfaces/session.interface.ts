interface Session {
    id: number;
    user_id: number;
    secret: string;
    expires: number;
    invalidated: boolean;
}

export default Session;
