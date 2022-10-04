interface User {
    id?: number;
    email?: string;
    username: string;
    password: string;
    administrator: boolean;
}

export default User;