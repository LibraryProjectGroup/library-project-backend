interface User {
    id?: number;
    email?: string;
    username: string;
    password: string;
    administrator: boolean | number;
}

export default User;
