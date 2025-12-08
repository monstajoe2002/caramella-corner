import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import ImageKit from 'imagekit'
const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL!,
})
export const Route = createFileRoute('/api/admin/upload-auth')({
  server: {
    handlers: {
      GET: async () => {
        const result = client.getAuthenticationParameters()
        return json(result)
      },
    },
  },
})
