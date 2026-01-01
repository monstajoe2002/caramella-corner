// store.ts
import { ProductWithVariants } from '@/db/types'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

// Define types for state & actions
interface CartState {
  items: ProductWithVariants[]
  totalQuantity: number
  totalPrice: number
  addToCart: (product: ProductWithVariants) => void
  removeFromCart: (productId: string) => void
}

// Create store using the curried form of `create`
export const useCartStore = create<CartState>()(
  combine(
    { items: [] as ProductWithVariants[], totalQuantity: 0, totalPrice: 0 },
    (set) => ({
      addToCart: (item) =>
        set((state) => {
          // check if an item exists
          const existingItem = state.items.find(
            (cartItem) => cartItem.id === item.id,
          )
          // if yes, then increment quantity
          if (existingItem) {
            return {
              totalQuantity: state.totalQuantity + 1,
              cart: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity! + 1 }
                  : cartItem,
              ),
              totalPrice: state.totalPrice + Number(item.price),
            }
          }
          return {
            totalQuantity: state.totalQuantity + 1,
            totalPrice: state.totalPrice + Number(item.price),
            cart: [...state.items, { ...item, quantity: 1 }],
          }
        }),
      removeFromCart: (id) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === id)
          if (existingItem && existingItem.quantity! > 1) {
            return {
              count: state.totalQuantity - 1,
              cart: state.items.map((cartItem) =>
                cartItem.id === id
                  ? { ...cartItem, quantity: cartItem.quantity! - 1 }
                  : cartItem,
              ),
            }
          }
          return {
            totalPrice: state.totalPrice - Number(existingItem?.price),
            totalQuantity: state.totalQuantity - 1,
            cart: state.items.filter((item) => item.id !== id),
          }
        }),
    }),
  ),
)
