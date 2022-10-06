interface User {
    id: number;
    email?: string;
    username: string;
    passw: string;
    administrator: boolean | number;
}

export default User;
