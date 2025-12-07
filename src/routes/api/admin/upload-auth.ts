import { createFileRoute } from '@tanstack/react-router'
import ImageKit from '@imagekit/nodejs'
const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
})
export const Route = createFileRoute('/api/admin/upload-auth')({
  server: {
    handlers: {
      GET: async () => {
        // Your application logic to authenticate the user
        // For example, you can check if the user is logged in or has the necessary permissions
        // If the user is not authenticated, you can return an error response
        const { token, expire, signature } =
          client.helper.getAuthenticationParameters()

        return new Response(
          JSON.stringify({
            token,
            expire,
            signature,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
          }),
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers':
                'Origin, X-Requested-With, Content-Type, Accept',
            },
          },
        )
      },
    },
  },
})

export async function GET() {}
