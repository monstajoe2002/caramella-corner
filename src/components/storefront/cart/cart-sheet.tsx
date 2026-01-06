import { useCartStore } from '@/lib/cart-store'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScanBarcode } from 'lucide-react'
import CartItems from './cart-items'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

export default function CartSheet() {
  const [isOpen, setIsOpen] = useState(false)
  const cartItems = useCartStore((c) => c.items)
  const cartQuantity = useCartStore((c) => c.totalQuantity)
  const removeFromCart = useCartStore((c) => c.removeFromCart)
  const cartId = useCartStore((c) => c.id)
  const totalPrice = cartItems
    .reduce((sum, item) => sum + Number(item.price) * item.quantity!, 0)
    .toFixed(2)
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <span className="flex items-baseline gap-2">
            Cart
            <span className="text-primary-foreground/60 text-xs">
              {cartItems.length}
            </span>
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>
            {cartItems.length} item(s) in your shopping cart
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <CartItems cartItems={cartItems} removeFromCart={removeFromCart} />
          <div className="space-y-2 pt-4">
            {/* <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>$147.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>$10.00</span>
            </div> */}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity</span>
              <span>x{cartQuantity}</span>
            </div>

            <div className="flex justify-between border-t pt-2 font-medium">
              <span>Total</span>
              <span>EGP {totalPrice}</span>
            </div>
          </div>
        </div>
        <Button onClick={() => setIsOpen(!isOpen)} asChild className="m-4">
          <Link search={{ c: cartId }} to="/checkout">
            <span className="sr-only">Proceed to checkout</span>
            <ScanBarcode />
            Proceed to checkout
          </Link>
        </Button>
      </SheetContent>
    </Sheet>
  )
}
