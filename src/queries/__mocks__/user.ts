import User from '../../interfaces/user.interface';

const user1: User = {
    id: 1,
    email: 't1@t1',
    username: 't1',
    passw: 'p1',
    administrator: false,
};
const user2: User = {
    id: 2,
    email: 't2@t2',
    username: 't2',
    passw: 'p2',
    administrator: false,
};
const mockUserData = [user1, user2];

const querySelectAllUsers = async () => {
    return mockUserData as Array<User>;
};

const querySelectUser = async (userId: string) => {
    for (let index = 0; index < mockUserData.length; index++) {
        if (mockUserData[index].id === Number(userId)) {
            return mockUserData[index];
        }
    }
    return null;
};

const querySelectUserByName = async (username: string) => {
    for (let index = 0; index < mockUserData.length; index++) {
        if (mockUserData[index].username === username) {
            return mockUserData[index];
        }
    }
    return null;
};

const querySelectUserBySessionId = async (id: number) => {
    return mockUserData[1];
};

const queryDeleteUser = async (userId: string) => {
    return true;
};

const queryInsertUser = async (
    username: string,
    password: string,
    isAdmin: boolean | number
) => {
    return username === 'testy'
        ? ({
              id: 3,
              username,
              passw: password,
              administrator: isAdmin,
          } as User)
        : null;
};

const queryUpdateUser = async (user: User) => {
    return user.username === 'testy';
};

export {
    querySelectAllUsers,
    querySelectUser,
    querySelectUserByName,
    querySelectUserBySessionId,
    queryDeleteUser,
    queryInsertUser,
    queryUpdateUser,
};
