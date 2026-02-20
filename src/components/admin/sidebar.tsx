import { Home, LayoutGrid, Package, CreditCard, Truck } from 'lucide-react'

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
import { ModeToggle } from '../theme-toggle'

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
    url: '/admin/orders',
    icon: Truck,
  },
  {
    title: 'Payments',
    url: '/admin/payments',
    icon: CreditCard,
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
          <div className="flex justify-between">
            <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
            <ModeToggle />
          </div>
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
