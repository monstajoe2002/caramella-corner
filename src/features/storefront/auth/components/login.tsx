'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { customerFormSchema } from '@/lib/zod-schemas'
import { ShoppingBagIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { authClient } from '@/lib/auth-client'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { useState } from 'react'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: customerFormSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      const { data, error } = await authClient.signIn.magicLink({
        email: value.email,
        callbackURL: '/',
        newUserCallbackURL: '/login',
      })
      if (error) toast.error(error.statusText)
      if (data)
        toast.success(
          'Success! Please check your inbox for a link to verify your email.',
        )
      setIsLoading(false)
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative max-w-sm w-full border rounded-xl px-8 py-8 shadow-lg/5 dark:shadow-xl dark:overflow-hidden">
        <div className="absolute inset-0 z-0 -top-px -left-px" />

        <div className="relative isolate flex flex-col items-center">
          <ShoppingBagIcon />
          <p className="mt-4 text-xl font-semibold tracking-tight mb-8">
            Log in to Caramella Corner
          </p>

          <form
            className="w-full space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="janedoe@example.com"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
              <LoadingSwap
                isLoading={isLoading}
                className="flex gap-2 items-center"
              >
                Continue
              </LoadingSwap>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
