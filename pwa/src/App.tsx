import { useState } from 'react'
import PWABadge from './PWABadge.tsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='text-4xl'>test</h1>
        
      <PWABadge />
    </>
  )
}

export default App
