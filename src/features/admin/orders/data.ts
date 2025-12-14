import { createServerFn } from '@tanstack/react-start'
import { OrderWithCustomer } from '@/db/types'
import * as Sentry from '@sentry/tanstackstart-react'

// Mock data for now since there are no customers/orders yet
const mockOrders: OrderWithCustomer[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    paymentId: '750e8400-e29b-41d4-a716-446655440000',
    orderNumber: 'ORD-001',
    quantity: 2,
    price: '500', // 500 EGP in piasters
    customerId: '650e8400-e29b-41d4-a716-446655440000',
    status: 'pending',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    orderItems: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        quantity: 2,
        priceAtOrder: '500',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        orderId: '550e8400-e29b-41d4-a716-446655440000',
        variantId: '550e8400-e29b-41d4-a716-446655440000',
        variant: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          sku: '1234567890',
          productId: '550e8400-e29b-41d4-a716-446655440000',
          color: 'red',
          size: 'M',
        },
      },
    ],
    customer: {
      id: '650e8400-e29b-41d4-a716-446655440000',
      name: 'Ahmed Mohamed',
      email: 'ahmed@example.com',
      address: '123 Main St, Cairo',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
    },
    payment: {
      id: '750e8400-e29b-41d4-a716-446655440000',
      status: 'pending',
      orderId: '550e8400-e29b-41d4-a716-446655440000',
      amount: '500',
      paymentMethod: 'credit',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    paymentId: '750e8400-e29b-41d4-a716-446655440001',
    orderNumber: 'ORD-002',
    quantity: 1,
    price: '300',
    customerId: '650e8400-e29b-41d4-a716-446655440001',
    status: 'delivered',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
    customer: {
      id: '650e8400-e29b-41d4-a716-446655440001',
      name: 'Sara Ali',
      email: 'sara@example.com',
      address: '456 Oak Ave, Alexandria',
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
    },
    payment: {
      id: '750e8400-e29b-41d4-a716-446655440001',
      status: 'completed',
      orderId: '550e8400-e29b-41d4-a716-446655440001',
      amount: '300',
      paymentMethod: 'cash',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16'),
    },
    orderItems: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        quantity: 2,
        priceAtOrder: '500',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        orderId: '550e8400-e29b-41d4-a716-446655440000',
        variantId: '550e8400-e29b-41d4-a716-446655440000',
        variant: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          sku: '1234567890',
          productId: '550e8400-e29b-41d4-a716-446655440000',
          color: 'blue',
          size: 'L',
        },
      },
    ],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    paymentId: '750e8400-e29b-41d4-a716-446655440002',
    orderNumber: 'ORD-003',
    quantity: 3,
    price: '750',
    customerId: '650e8400-e29b-41d4-a716-446655440002',
    status: 'canceled',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    orderItems: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        quantity: 2,
        priceAtOrder: '500',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        orderId: '550e8400-e29b-41d4-a716-446655440000',
        variantId: '550e8400-e29b-41d4-a716-446655440000',
        variant: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          sku: '1234567890',
          productId: '550e8400-e29b-41d4-a716-446655440000',
          color: 'green',
          size: 'XL',
        },
      },
    ],
    customer: {
      id: '650e8400-e29b-41d4-a716-446655440002',
      name: 'Mohamed Hassan',
      email: 'mohamed@example.com',
      address: '789 Pine Rd, Giza',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
    },
    payment: {
      id: '750e8400-e29b-41d4-a716-446655440002',
      status: 'failed',
      orderId: '550e8400-e29b-41d4-a716-446655440002',
      amount: '750',
      paymentMethod: 'credit',
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13'),
    },
  },
]

export const getOrders = createServerFn().handler(async () => {
  return await Sentry.startSpan({ name: 'getOrders' }, async () => {
    // For now, return mock data
    // Once we have real data, uncomment the line below and remove mockOrders
    // return await getOrdersWithCustomers()
    return mockOrders
  })
})
