import { HomeOffice } from '../../interfaces/HomeOffice'

let mockHomeOffices: HomeOffice[] = [
  {
    id: 1,
    name: 'Home Office 1',
    countryCode: 'USA',
  },
  {
    id: 2,
    name: 'Home Office 2',
    countryCode: 'CAN',
  },
  {
    id: 3,
    name: 'Home Office 3',
    countryCode: 'GBR',
  },
  {
    id: 4,
    name: 'Home Office 4',
    countryCode: 'FRA',
  },
  {
    id: 5,
    name: 'Home Office 5',
    countryCode: 'DEU',
  },
]

let idCount: number = 5

export async function getHomeOfficeById(
  homeOfficeId: number
): Promise<HomeOffice | null> {
  let array: Array<HomeOffice> = []
  mockHomeOffices.forEach((element) => {
    if (element.id === homeOfficeId) {
      array.push(element)
    }
  })
  return array.length ? array[0] : null
}

export async function getAllHomeOffices(): Promise<HomeOffice[]> {
  return !mockHomeOffices.length ? [] : mockHomeOffices.map((value) => value)
}

export async function deleteHomeOffice(homeOfficeId: number): Promise<Boolean> {
  mockHomeOffices = mockHomeOffices.filter(
    (element) => element.id !== homeOfficeId
  )
  let index = mockHomeOffices.findIndex(
    (element) => element.id === homeOfficeId
  )
  for (let i = 0; i < mockHomeOffices.length; i++) {
    if (mockHomeOffices[i].id === index) {
      return false
    }
  }
  return true
}

export async function updateHomeOffice(
  homeOffice: HomeOffice
): Promise<Boolean> {
  for (let index = 0; index < mockHomeOffices.length; index++) {
    if (mockHomeOffices[index].id === homeOffice.id) {
      mockHomeOffices[index] = {
        id: mockHomeOffices[index].id,
        name: homeOffice.name,
        countryCode: homeOffice.countryCode,
      }
      return true
    }
  }
  return false
}

export async function insertHomeOffice(
  name: string,
  countryCode: string
): Promise<boolean> {
  let length = mockHomeOffices.length
  mockHomeOffices.push({
    id: idCount + 1,
    name: name,
    countryCode: countryCode,
  })
  if (mockHomeOffices.length > length) {
    return true
  }
  return false
}
