import AdminSidebar from '@/components/admin/sidebar'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <SidebarTrigger />
        <main className="container">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
