"use client";
import { BookImage, CalendarCheck, Home, ShoppingBag } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@caramella-corner/ui/components/sidebar";
import Link from "next/link";
import { ModeToggle } from "@caramella-corner/ui/components/mode-toggle";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    Icon: Home,
  },
  {
    title: "Products",
    url: "/products",
    Icon: ShoppingBag,
  },
  {
    title: "Orders",
    url: "/orders",
    Icon: CalendarCheck,
  },
  {
    title: "Categories",
    url: "/categories",
    Icon: BookImage,
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {state === "expanded" && (
          <SidebarHeader className="flex flex-row justify-between items-center">
            <span
              className={"pl-2 text-2xl md:pb-0 font-medium tracking-tight"}
            >
              Caramella Corner
            </span>
            <ModeToggle />
          </SidebarHeader>
        )}
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold">
            Admin Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ Icon, title, url }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild tooltip={title}>
                    <Link href={url}>
                      <Icon />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
