// store.ts
import { create } from 'zustand'
import { combine, persist } from 'zustand/middleware'
import { CartItem } from './types'

// Define types for state & actions
interface CartState {
  items: CartItem[]
  totalQuantity: number
  addToCart: (product: CartItem) => void
  removeFromCart: (productId: string) => void
}

// Create store using the curried form of `create`
export const useCartStore = create<CartState>()(
  persist(
    combine({ items: [] as CartItem[], totalQuantity: 0 }, (set) => ({
      addToCart: (item) =>
        set((state) => {
          // check if an item exists
          const existingItem = state.items.find(
            (cartItem) => cartItem.id === item.id,
          )
          // if yes, then increment quantity
          if (existingItem) {
            return {
              totalQuantity: state.totalQuantity + item.quantity!,
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity! + item.quantity!,
                    }
                  : cartItem,
              ),
            }
          }
          return {
            totalQuantity: state.totalQuantity + item.quantity!,
            items: [...state.items, { ...item, quantity: item.quantity! }],
          }
        }),
      removeFromCart: (id) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === id)
          return {
            totalQuantity: state.totalQuantity - existingItem?.quantity!,
            items: state.items.filter((item) => item.id !== id),
          }
        }),
    })),
    { name: 'cc-cart-store' },
  ),
)
