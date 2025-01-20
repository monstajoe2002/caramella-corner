"use client";

import { toast } from "sonner";
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
import { TagsInput } from "@caramella-corner/ui/components/tags-input";
import type { Category } from "@caramella-corner/database/types";
import { FormIntent } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { CreateCategoryDto } from "@caramella-corner/database/dtos/category";
import { createCategory } from "@caramella-corner/database/admin/categories";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  category?: Category;
  intent: FormIntent;
}

const formSchema = z.object({
  name: z.string(),
  subcategory: z.array(z.string()).nonempty("Please at least one item"),
});

export default function CategoryForm({
  category,
  intent = "create",
}: CategoryFormProps) {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn:
      intent === "create"
        ? async (category: CreateCategoryDto) => await createCategory(category!)
        : undefined,

    onSuccess: () => {
      toast.success("Category updated successfully");
      revalidatePath("/categories");
      router.replace("/categories");
    },
    onError: (error) =>
      toast.error(`Failed to update product: ${error.message}`),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subcategory: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ ...values });
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
          defaultValue={category?.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Clothes" type="" {...field} />
              </FormControl>
              <FormDescription>This is your main category.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subcategory"
          // defaultValue={[...category?.subcategories.map((s) => s.name)]}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategories</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Enter your tags"
                />
              </FormControl>
              <FormDescription>
                These are the branches of your category. Press Enter to create a
                new subcategory
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
