import { FormField, FormItem, FormLabel, FormMessage } from "@caramella-corner/ui/components/form"
import { Input } from "@caramella-corner/ui/components/input"

interface VariantFormFieldProps {
  index: number;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}

export const VariantFormField = ({ index, name, label, placeholder, type = "text" }: VariantFormFieldProps) => {
  return (
    <FormField
      name={`variants.${index}.${name}`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            onChange={(e) => name==='quantity' ? field.onChange(Number(e.target.value)) : field.onChange(e.target.value)}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}