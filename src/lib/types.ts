import { Product, Variant, Image } from '@/db/types'

// cart item type
export interface CartItem extends Omit<Product, 'price'> {
  variant: Variant
  image: Image
  price: number
}
