import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'org.nypl.hybrid-test',
  appName: 'NYPL Hybrid',
  webDir: 'out',
  // bundledWebRuntime: false,
  server: {
    url: 'http://kmbp:3000',
    // hostname: '192.168.178.31',
    cleartext: true,
  },
}

export default config
