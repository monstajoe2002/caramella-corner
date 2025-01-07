"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@caramella-corner/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@caramella-corner/ui/components/form";
import { Input } from "@caramella-corner/ui/components/input";
import { Textarea } from "@caramella-corner/ui/components/textarea";
import LocationSelector from "@caramella-corner/ui/components/location-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@caramella-corner/ui/components/select";
import { Switch } from "@caramella-corner/ui/components/switch";
import { Product } from "@caramella-corner/database/lib/types";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  material: z.string(),
  priceInPiasters: z.number().positive({ message: "Price must be positive" }),
  countryOfOrigin: z.string(),
  image: z.string(),
  subcategory: z.string(),
  active: z.boolean(),
});
interface ProductFormProps {
  productSlug?: string;
}

export default function ProductForm({ productSlug }: ProductFormProps) {
  const { data: product } = useQuery<Product>({
    queryKey: ["products", productSlug],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productSlug}`);
      const data = await response.json();
      return data;
    },
  });

  const [, setCountryName] = useState<string>(product?.countryOfOrigin || "");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      material: "",
      priceInPiasters: 0,
      countryOfOrigin: "",
      image: "",
      subcategory: "",
      active: false,
    },
  });
  useEffect(() => {
    if (product) {
      form.reset(product);
    }
  }, [form, product]);
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Blue Blouse" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Flattering, relaxed fit that effortlessly transitions from work to weekend"
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="material"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material</FormLabel>
              <FormControl>
                <Input placeholder="100% cotton" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priceInPiasters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (in Piasters)</FormLabel>
              <FormControl>
                <Input placeholder="100,000" type="number" {...field} />
              </FormControl>
              <FormDescription>
                Enter the price in Piasters. 1 EGP is equivalent to 100
                Piasters. e.g. 100EGP=100,000 Piasters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="countryOfOrigin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country of Origin</FormLabel>
              <FormControl>
                <LocationSelector
                  onCountryChange={(country) => {
                    setCountryName(country?.name || "");
                    form.setValue(field.name, country?.name || "");
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input placeholder="" type="file" {...field} />
              </FormControl>
              <FormDescription>
                Select the image that best represents your product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subcategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Mark as Active</FormLabel>
                <FormDescription>
                  This product will appear on the storefront, not kept as a
                  draft.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
