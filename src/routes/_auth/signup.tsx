import SignUp from '@/components/storefront/auth/signup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <SignUp />
    </div>
  )
}
