import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.kristojorgenson.nyplcap',
  appName: 'nypl-cap',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    // url: 'http://localhost:3000',
    url: 'http://kmbp:3000',
    // hostname: '192.168.178.31',
    cleartext: true,
  },
}

export default config
