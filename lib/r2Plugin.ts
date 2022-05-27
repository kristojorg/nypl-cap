import { registerPlugin } from '@capacitor/core'

export interface R2Plugin {
  present(options: { message: string }): void
  openBook(): void
}

const R2 = registerPlugin<R2Plugin>('R2')

export default R2
