import { imagekit } from '@/lib/imagekit'
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/admin/upload-auth')({
  server: {
    handlers: {
      GET: async () => {
        const result = imagekit.getAuthenticationParameters()
        return json(result)
      },
    },
  },
})
