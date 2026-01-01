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
import { Trash2 } from 'lucide-react'

export default function CartItems() {
  const cartItems = useCartStore((c) => c.items)
  const cartQuantity = useCartStore((c) => c.totalQuantity)
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
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
            {cartQuantity} item(s) in your shopping cart
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {cartItems.map((item) => (
            <div className="space-y-4">
              <div className="flex gap-4 border-b pb-4">
                <div className="h-20 w-20 rounded-md bg-muted" />
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-muted-foreground text-xs">
                    Black, Standard
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      EGP {item.price}
                    </span>
                    <Button className="h-6 w-6" size="icon" variant="ghost">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>$147.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>$10.00</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-medium">
              <span>Total</span>
              <span>$157.00</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
