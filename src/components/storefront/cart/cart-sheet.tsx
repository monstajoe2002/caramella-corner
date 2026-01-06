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
import { ScanBarcode, Trash2 } from 'lucide-react'
import { Image } from '@imagekit/react'
import { formatVariant } from '@/lib/utils'

export default function CartSheet() {
  const cartItems = useCartStore((c) => c.items)
  const cartQuantity = useCartStore((c) => c.totalQuantity)
  const removeFromCart = useCartStore((c) => c.removeFromCart)
  const totalPrice = cartItems
    .reduce((sum, item) => sum + Number(item.price) * item.quantity!, 0)
    .toFixed(2)
  return (
    <Sheet>
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
          {cartItems.map((item) => (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded-md">
                  <Image src={item.image.ikThumbnailUrl} />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium text-sm">
                    {item.name} (x{item.quantity})
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    <b>{item.variant.sku}</b>:{' '}
                    {formatVariant(
                      item.variant.color ?? '',
                      item.variant.size ?? '',
                    )}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      EGP {Number(item.price) * item.quantity!}
                    </span>
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      className="h-6 w-6"
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
        <Button className="m-4">
          <span className="sr-only">Proceed to checkout</span>
          <ScanBarcode />
          Proceed to checkout
        </Button>
      </SheetContent>
    </Sheet>
  )
}
