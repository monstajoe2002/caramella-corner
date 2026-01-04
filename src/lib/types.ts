import { Product, Variant, Image } from '@/db/types'
import { authClient } from './auth-client'

// cart item type
export interface CartItem extends Omit<Product, 'price'> {
  variant: Variant
  image: Image
  price: number
}
export type ClientSession = typeof authClient.$Infer.Session
