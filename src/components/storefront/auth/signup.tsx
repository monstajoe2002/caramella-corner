'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { customerFormSchema } from '@/lib/schemas'
import { Link } from '@tanstack/react-router'
import { ShoppingBagIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Field, FieldLabel, FieldError } from '../../ui/field'
import { authClient } from '@/lib/auth-client'

const SignUp = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
    validators: {
      onSubmit: customerFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.signIn.magicLink({
        email: value.email,
        name: value.email,
        callbackURL: '/',
        newUserCallbackURL: '/login',
      })
      if (error) toast.error(error.statusText)
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative max-w-sm w-full border rounded-xl px-8 py-8 shadow-lg/5 dark:shadow-xl dark:overflow-hidden">
        <div className="absolute inset-0 z-0 -top-px -left-px" />

        <div className="relative isolate flex flex-col items-center">
          <ShoppingBagIcon />
          <p className="mt-4 text-xl font-semibold tracking-tight mb-8">
            Sign up for Caramella Corner
          </p>

          <form
            className="w-full space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Jane Doe"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
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

            <Button type="submit" className="mt-4 w-full">
              Continue
            </Button>
          </form>

          <p className="mt-5 text-sm text-center">
            Already have an account?
            <Link to="." className="ml-1 underline text-muted-foreground">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
