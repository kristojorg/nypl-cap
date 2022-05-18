import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.kristojorgenson.nyplcap',
  appName: 'nypl-cap',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    url: 'http://localhost:3000',
  },
}

export default config
