import { storefrontAuthMiddleware } from '@/features/storefront/middleware'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  server: {
    middleware: [storefrontAuthMiddleware],
  },
})

function RouteComponent() {
  return (
    <main>
      <Outlet />
    </main>
  )
}
