import * as React from 'react'
import { useEffect, useState, useRef } from 'react'
import { MenuIcon, Search } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
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
import { Link, useRouter, useRouterState } from '@tanstack/react-router'
import CartSheet from '../../features/storefront/cart/components/cart-sheet'
import UserAvatar from './user-avatar'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { useDebounceFn } from '@/hooks/use-debounce-fn'
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

const navigationLinks: NavItem[] = [
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
]
export const Navbar = React.forwardRef<HTMLElement>(({ ...props }, ref) => {
  const [isMobile, setIsMobile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLElement>(null)
  const isSyncingFromUrlRef = useRef(false)

  const routerState = useRouterState()
  const router = useRouter()

  // Debounced navigation function
  const { run: debouncedNavigate, cancel: cancelDebouncedNavigate } =
    useDebounceFn(
      (query: string) => {
        // Don't navigate if we're syncing from URL
        if (isSyncingFromUrlRef.current) {
          return
        }
        const trimmedQuery = query.trim()
        const location = routerState.location
        const currentQuery = (location.search as { q?: string })?.q || ''

        // Only navigate if there's a query and it has changed
        if (trimmedQuery && trimmedQuery !== currentQuery) {
          router.navigate({
            to: '/products',
            search: { q: trimmedQuery },
          })
        } else if (
          !trimmedQuery &&
          currentQuery &&
          location.pathname === '/products'
        ) {
          // If query is cleared and we're on products page, clear the search param
          router.navigate({
            to: '/products',
            search: {},
          })
        }
        // If query is empty and we're not on products page, don't navigate
      },
      500, // 500ms debounce delay
    )

  // Sync search query with URL when on products page
  useEffect(() => {
    const location = routerState.location
    if (location.pathname === '/products') {
      const q = (location.search as { q?: string })?.q || ''
      if (q !== searchQuery) {
        isSyncingFromUrlRef.current = true
        setSearchQuery(q)
        // Reset the flag after state update completes
        requestAnimationFrame(() => {
          isSyncingFromUrlRef.current = false
        })
      }
    }
  }, [routerState.location.pathname, routerState.location.search])

  // Debounce search navigation when search query changes (only when user types)
  useEffect(() => {
    if (!isSyncingFromUrlRef.current) {
      debouncedNavigate(searchQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

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

  return (
    <header
      ref={combinedRef}
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 md:px-6 **:no-underline',
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
                      <CartSheet />
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
              <div className="text-2xl">
                <Logo />
              </div>
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
            {/* Search input */}
            <form
              className="max-w-xs w-full"
              onSubmit={(e) => {
                e.preventDefault()
                // Cancel any pending debounced navigation
                cancelDebouncedNavigate()
                const query = searchQuery.trim()
                if (query) {
                  router.navigate({
                    to: '/products',
                    search: { q: query },
                  })
                }
                // Don't navigate if search field is empty
              }}
            >
              <InputGroup className="w-full">
                <InputGroupInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </form>
          </div>
        </div>
        {/* Right side */}
        {!isMobile && (
          <div className="flex items-center gap-3">
            <CartSheet />
          </div>
        )}
        <UserAvatar />
      </div>
    </header>
  )
})
export default Navbar
