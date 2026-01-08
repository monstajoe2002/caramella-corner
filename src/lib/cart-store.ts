// store.ts
import { create } from 'zustand'
import { combine, persist } from 'zustand/middleware'
import { CartItem, CartState } from './types'
import { toast } from 'sonner'
const initialState = {
  id: crypto.randomUUID() as string,
  items: [] as CartItem[],
  totalQuantity: 0,
}
export const useCartStore = create<CartState>()(
  persist(
    combine(initialState, (set) => ({
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) =>
              cartItem.id === item.id &&
              cartItem.variant.id === item.variant.id,
          )
          if (existingItem) {
            return {
              totalQuantity: state.totalQuantity + item.quantity!,
              items: state.items.map((cartItem) =>
                cartItem.id === item.id &&
                cartItem.variant.id === item.variant.id
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity! + item.quantity!,
                    }
                  : cartItem,
              ),
            }
          }
          toast.success('Added to cart!')
          return {
            totalQuantity: state.totalQuantity + item.quantity!,
            items: [...state.items, { ...item, quantity: item.quantity! }],
          }
        }),
      removeFromCart: (id, variantId) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === id && item.variant.id === variantId,
          )
          if (!existingItem) return state
          return {
            totalQuantity: state.totalQuantity - existingItem.quantity!,
            items: state.items.filter(
              (item) => !(item.id === id && item.variant.id === variantId),
            ),
          }
        }),
      reset: () => set(initialState),
    })),
    { name: 'cc-cart-store' },
  ),
)
