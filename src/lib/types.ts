import { Product, Variant, Image } from '@/db/types'

// cart item type
export interface CartItem extends Product {
  variant: Variant
  image: Image
}
