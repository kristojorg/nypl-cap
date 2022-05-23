import { useStorageItem } from '@capacitor-community/storage-react'
import { App } from '@capacitor/app'

export const USER_STORAGE_KEY = 'user'

export type User = {
  token: string
}

export function useUser(): [
  User | undefined,
  (user: User | undefined) => Promise<void>
] {
  const [user, setUser] = useStorageItem<string | undefined>(
    USER_STORAGE_KEY,
    undefined
  )
  async function setUserJson(user: User | undefined) {
    return await setUser(user ? JSON.stringify(user) : undefined)
  }

  const parsedUser = user ? JSON.parse(user) : undefined
  return [parsedUser, setUserJson]
}
