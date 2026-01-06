import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/cart-store'
import { CartItem, CartState } from '@/lib/types'
import { formatVariant } from '@/lib/utils'
import { Image } from '@imagekit/react'
import { Trash2 } from 'lucide-react'

type CartItemsProps = {
  cartItems: CartItem[]
  removeFromCart?: CartState['removeFromCart']
}

export default function CartItems({
  cartItems,
  removeFromCart,
}: CartItemsProps) {
  const cartQuantity = useCartStore((c) => c.totalQuantity)
  const totalPrice = cartItems
    .reduce((sum, item) => sum + Number(item.price) * item.quantity!, 0)
    .toFixed(2)
  return (
    <div className="space-y-2 pt-4">
      {cartItems.map((item, idx) => (
        <div key={idx}>
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
                {removeFromCart && (
                  <Button
                    onClick={() => removeFromCart(item.id, item.variant.id)}
                    className="h-6 w-6"
                    size="icon"
                    variant="ghost"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Quantity</span>
        <span>x{cartQuantity}</span>
      </div>

      <div className="flex justify-between border-t pt-2 font-medium">
        <span>Total</span>
        <span>EGP {totalPrice}</span>
      </div>
    </div>
  )
}
