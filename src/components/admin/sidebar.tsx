import { Home, LayoutGrid, Package, Truck } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/admin',
    icon: Home,
  },
  {
    title: 'Products',
    url: '/admin/products',
    icon: Package,
  },
  {
    title: 'Orders',
    url: '#',
    icon: Truck,
  },
  {
    title: 'Categories',
    url: '/admin/categories',
    icon: LayoutGrid,
  },
]

export default function AdminSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
