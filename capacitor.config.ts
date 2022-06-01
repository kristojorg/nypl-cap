import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'org.nypl.hybrid-test',
  appName: 'NYPL Hybrid',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    url: 'http://localhost:3000',
    // hostname: '192.168.178.31',
    hostname: 'nypl-hybrid.com',
    // androidScheme: 'https',
    // cleartext: true,
  },
}

export default config
