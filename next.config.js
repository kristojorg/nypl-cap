const withTM = require('next-transpile-modules')([
  '@ionic/react',
  '@ionic/core',
  '@stencil/core',
  'ionicons',
])

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
})
