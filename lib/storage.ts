import { Storage } from '@capacitor/storage'

export const USER_STORAGE_KEY = 'user'

export type User = {
  token: string
}

export async function storeUser(user: User) {
  await Storage.set({
    key: USER_STORAGE_KEY,
    value: JSON.stringify(user),
  })
}

export async function getUser(): Promise<User | undefined> {
  const str = await Storage.get({ key: USER_STORAGE_KEY })
  if (str.value) {
    return JSON.parse(str.value)
  }
}
