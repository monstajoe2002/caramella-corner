import AdminSidebar from '@/components/admin/sidebar'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { adminAuthMiddleware } from '@/features/admin/middleware'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  server: {
    middleware: [adminAuthMiddleware],
  },
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Caramella Corner Admin',
      },
    ],
  }),
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <SidebarTrigger />
        <main className="container container-admin">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
