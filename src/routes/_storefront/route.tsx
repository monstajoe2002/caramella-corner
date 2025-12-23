import Navbar from '@/components/storefront/navbar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront')({
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
