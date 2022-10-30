import User from './user.interface';

interface Book_list {
    id?: number;
    user: User | number;
    name: string;
}

export default Book_list;