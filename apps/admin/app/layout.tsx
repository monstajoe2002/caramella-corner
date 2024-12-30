import { Geist, Geist_Mono } from "next/font/google";

import "@caramella-corner/ui/globals.css";
import { Providers } from "@/components/providers";
import { SidebarTrigger } from "@caramella-corner/ui/components/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <Providers>
          <aside className="inline-flex p-2">
            <AdminSidebar />
            <SidebarTrigger />
          </aside>
          <main className="inline-block min-h-screen p-6 md:p-4 container">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
