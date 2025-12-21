import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/')({ component: App })

function App() {
  return (
    <div>
      <p>Hello</p>
    </div>
  )
}
