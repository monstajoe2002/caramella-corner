import React, { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getProductsWithVariants } from '../../features/admin/products/data'
import { Image } from '@imagekit/react'

export const Route = createFileRoute('/_storefront/')({
  component: App,
  loader: () => getProductsWithVariants(),
})

function App() {
  const products = Route.useLoaderData()

  return (
    <div>
      <header>
        <h1>Welcome to Caramella Corner</h1>
        <p>Your one-stop shop for all your needs</p>
      </header>
      <section style={{ marginBottom: 40 }}>
        <h2>Featured Products</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
          }}
        >
          {products.slice(0, 3).map((product) => {
            const [image] = product.images
            return (
              <div
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 5,
                  padding: 10,
                  width: 180,
                  textAlign: 'center',
                }}
              >
                <Image
                  src={
                    image.ikThumbnailUrl || 'https://via.placeholder.com/150'
                  }
                  alt={product.name}
                />
                <h3>{product.name}</h3>
                <p>${product.price}</p>
              </div>
            )
          })}
        </div>
      </section>
      <section>
        <h2>About Us</h2>
        <p>
          We are passionate about bringing you the best products at the best
          prices. Shop with confidence and enjoy fast shipping.
        </p>
      </section>
    </div>
  )
}
