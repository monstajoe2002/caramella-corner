import { useCartStore } from '@/lib/cart-store'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Button } from '../ui/button'

export default function CartItems() {
  const cartItems = useCartStore((c) => c.items)
  const cartQuantity = useCartStore((c) => c.totalQuantity)
  return (
    <Sheet>
      <SheetTrigger>
        <Button
          size="sm"
          className="text-sm font-medium px-4 h-9 rounded-md shadow-sm"
        >
          <span className="flex items-baseline gap-2">
            Cart
            <span className="text-primary-foreground/60 text-xs">
              {cartQuantity}
            </span>
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
