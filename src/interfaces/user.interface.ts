interface User {
    id: number;
    username: string;
    email: string;
    passw: string;
    administrator: boolean;
    deleted: boolean;
}

export default User;
