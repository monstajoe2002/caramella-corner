import Navbar from '@/components/storefront/navbar'
import { storefrontAuthMiddleware } from '@/features/storefront/middleware'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront')({
  server: {
    middleware: [storefrontAuthMiddleware],
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Navbar />
      <main className="container container-storefront">
        <Outlet />
      </main>
    </div>
  )
}
