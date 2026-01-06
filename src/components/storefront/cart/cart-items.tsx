import { Button } from '@/components/ui/button'
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
  return cartItems.map((item, idx) => (
    <div key={idx} className="space-y-4">
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
            {formatVariant(item.variant.color ?? '', item.variant.size ?? '')}
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
  ))
}
