import { addressFormSchema } from '@/lib/zod-schemas'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'

export function AddressForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      address: '',
      paymentMethod: 'cash',
    },
    validators: {
      onSubmit: addressFormSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success('Form submitted successfully')
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      {/* ... */}
    </form>
  )
}
