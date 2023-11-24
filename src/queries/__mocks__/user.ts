import User from '../../interfaces/user.interface'

// note: this mock is very basic and its purpose is for jest to run through routes

const user1: User = {
  id: 1,
  username: 't1',
  email: 't1@t.est',
  passw: 'p1',
  administrator: false,
  deleted: false,
}
const user2: User = {
  id: 2,
  username: 't2',
  email: 't2@t.est',
  passw: 'p2',
  administrator: true,
  deleted: false,
}
const user3: User = {
  id: 3,
  username: 't3',
  email: 't3@t.est',
  passw: 'p3',
  administrator: false,
  deleted: true,
}
const mockUserData = [user1, user2, user3]

export const querySelectAllExistingUsers = async (userId: string) => {
  let array: Array<User> = []
  mockUserData.forEach((element) => {
    if (!element.deleted) {
      array.push(element)
    }
  })
  return array as Array<User>
}

export const querySelectAllUsers = async () => {
  return mockUserData as Array<User>
}

export const querySelectUser = async (userId: number) => {
  for (let index = 0; index < mockUserData.length; index++) {
    if (mockUserData[index].id === userId) {
      return mockUserData[index]
    }
  }
  return null
}

export const querySelectUserBySessionId = async (sessionId: number) => {
  return mockUserData[1]
}

export const querySelectUserByUsername = async (username: string) => {
  for (let index = 0; index < mockUserData.length; index++) {
    if (mockUserData[index].username === username) {
      return mockUserData[index]
    }
  }
  return null
}

export const queryHardDeleteUser = async (userId: string) => {
  return true
}

export const querySoftDeleteUser = async (userId: string) => {
  return true
}

export const queryInsertUser = async (
  username: string,
  email: string,
  password: string,
  isAdmin: boolean | number
) => {
  return username === 'testy'
    ? ({
        id: 3,
        username,
        email,
        passw: password,
        administrator: isAdmin,
      } as User)
    : null
}

export const queryUpdateUser = async (user: User) => {
  return user.username === 'testy'
}
