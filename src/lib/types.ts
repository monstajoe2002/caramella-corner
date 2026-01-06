import { Product, Variant, Image } from '@/db/types'
import { authClient } from './auth-client'

// cart item type
export interface CartItem extends Omit<
  Product,
  'price' | 'variants' | 'images'
> {
  variant: Variant
  image: Image
  price: number
}
export type ClientSession = typeof authClient.$Infer.Session
// Define types for state & actions
export interface CartState {
  id: string
  items: CartItem[]
  totalQuantity: number
  addToCart: (product: CartItem) => void
  removeFromCart: (productId: string, variantId?: string) => void
}
