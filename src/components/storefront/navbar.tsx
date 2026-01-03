import * as React from 'react'
import { useEffect, useState, useRef, useId } from 'react'
import { MenuIcon, SearchIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import CartItems from './cart/cart-items'
// Simple logo component for the navbar
const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 324 323"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...(props as any)}
    >
      <rect
        x="88.1023"
        y="144.792"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 88.1023 144.792)"
        fill="currentColor"
      />
      <rect
        x="85.3459"
        y="244.537"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 85.3459 244.537)"
        fill="currentColor"
      />
    </svg>
  )
}

// Types
export interface NavItem {
  href?: string
  label: string
}
export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  logoHref?: string
  navigationLinks?: NavItem[]

  searchPlaceholder?: string
  onCartClick?: () => void
  onSearchSubmit?: (query: string) => void
}
// Default navigation links
const defaultNavigationLinks: NavItem[] = [
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
]
export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      logo = <Logo />,
      logoHref = '#',
      navigationLinks = defaultNavigationLinks,

      searchPlaceholder = 'Search...',

      onCartClick,
      onSearchSubmit,
      ...props
    },
    ref,
  ) => {
    const [isMobile, setIsMobile] = useState(false)
    const containerRef = useRef<HTMLElement>(null)
    const searchId = useId()
    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth
          setIsMobile(width < 768) // 768px is md breakpoint
        }
      }
      checkWidth()
      const resizeObserver = new ResizeObserver(checkWidth)
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }
      return () => {
        resizeObserver.disconnect()
      }
    }, [])
    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref],
    )
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const query = formData.get('search') as string
      if (onSearchSubmit) {
        onSearchSubmit(query)
      }
    }
    return (
      <header
        ref={combinedRef}
        className={cn(
          'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 md:px-6 **:no-underline',
          className,
        )}
        {...(props as any)}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex flex-1 items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <MenuIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-fit">
                  <NavigationMenu viewport={isMobile}>
                    <NavigationMenuList className="flex-col items-start gap-0">
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index}>
                          <NavigationMenuLink asChild>
                            <Link to={link.href}>{link.label}</Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                      <NavigationMenuItem
                        className="w-full"
                        role="presentation"
                        aria-hidden={true}
                      >
                        <div
                          role="separator"
                          aria-orientation="horizontal"
                          className="bg-border -mx-1 my-1 h-px"
                        />
                      </NavigationMenuItem>
                      <NavigationMenuItem className="w-full">
                        <CartItems />
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav */}
            <div className="flex flex-1 items-center gap-6 max-md:justify-between">
              <button
                onClick={(e) => e.preventDefault()}
                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
              >
                <div className="text-2xl">{logo}</div>
                <span className="hidden font-bold text-xl sm:inline-block">
                  Caramella Corner
                </span>
              </button>
              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex w-fit">
                  <NavigationMenuList className="gap-1 ">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        <NavigationMenuLink className="bg-none" asChild>
                          <Link
                            className={buttonVariants({ variant: 'link' })}
                            to={link.href}
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
              {/* Search form */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  id={searchId}
                  name="search"
                  className="peer h-8 ps-8 pe-2"
                  placeholder={searchPlaceholder}
                  type="search"
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                  <SearchIcon size={16} />
                </div>
              </form>
            </div>
          </div>
          {/* Right side */}
          {!isMobile && (
            <div className="flex items-center gap-3">
              <CartItems />
            </div>
          )}
        </div>
      </header>
    )
  },
)
export default Navbar
