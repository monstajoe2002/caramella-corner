import Navbar from '@/components/storefront/navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/')({ component: App })

function App() {
  return (
    <div>
      <Navbar />
    </div>
  )
}
