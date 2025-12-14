import React from 'react'
import { OrderItem } from '@/db/types'
type Props = {
  orderItems: OrderItem[]
}

export default function OrderItems({ orderItems }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Order Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orderItems.map((orderItem) => (
          <div key={orderItem.id}>
            <h3 className="text-lg font-bold">
              {orderItem.quantity} x {orderItem.priceAtOrder}
            </h3>
          </div>
        ))}
      </div>
    </div>
  )
}
