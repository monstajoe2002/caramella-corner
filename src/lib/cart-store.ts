// store.ts
import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { CartItem } from './types'

// Define types for state & actions
interface CartState {
  items: CartItem[]
  totalQuantity: number
  totalPrice: number
  addToCart: (product: CartItem) => void
  removeFromCart: (productId: string) => void
}

// Create store using the curried form of `create`
export const useCartStore = create<CartState>()(
  combine(
    { items: [] as CartItem[], totalQuantity: 0, totalPrice: 0 },
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
              totalQuantity: state.totalQuantity + item.quantity!,
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity! + item.quantity!,
                    }
                  : cartItem,
              ),
              totalPrice: state.totalPrice + Number(item.price),
            }
          }
          return {
            totalQuantity: state.totalQuantity + item.quantity!,
            totalPrice: state.totalPrice + Number(item.price),
            items: [...state.items, { ...item, quantity: item.quantity! }],
          }
        }),
      removeFromCart: (id) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === id)
          if (existingItem && existingItem.quantity! > 1) {
            return {
              totalQuantity: state.totalQuantity - existingItem.quantity!,
              items: state.items.map((cartItem) =>
                cartItem.id === id
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity! - existingItem.quantity!,
                    }
                  : cartItem,
              ),
            }
          }
          return {
            totalPrice: state.totalPrice - Number(existingItem?.price),
            totalQuantity: state.totalQuantity - 1,
            items: state.items.filter((item) => item.id !== id),
          }
        }),
    }),
  ),
)
