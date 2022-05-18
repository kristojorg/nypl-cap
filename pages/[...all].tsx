import type { NextPage } from 'next'

import dynamic from 'next/dynamic'

const App = dynamic(() => import('../components/App'), {
  ssr: false,
})

const All: NextPage = () => {
  return <App />
}

export default All
