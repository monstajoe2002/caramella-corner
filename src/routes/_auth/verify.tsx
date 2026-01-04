import { Button } from '@/components/ui/button'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { authClient } from '@/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import z from 'zod'
const searchSchema = z.object({
  token: z.string().nonempty(),
})
export const Route = createFileRoute('/_auth/verify')({
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  const { token } = Route.useSearch()
  const [isLoading, setIsLoading] = useState(false)
  return (
    <div>
      <Button
        onClick={async () => {
          setIsLoading(true)
          const { data, error } = await authClient.magicLink.verify({
            query: {
              token: token, // required
              callbackURL: '/',
            },
          })
          if (data || error) setIsLoading(false)
        }}
        disabled={isLoading}
      >
        <LoadingSwap isLoading={isLoading} className="flex gap-2 items-center">
          Click to verify
        </LoadingSwap>
      </Button>
    </div>
  )
}
