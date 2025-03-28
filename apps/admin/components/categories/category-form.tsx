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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@caramella-corner/database/dtos/category";

interface CategoryFormProps {
  existingCategory?: Category;
  intent?: FormIntent;
}

const formSchema = z.object({
  name: z.string(),
  subcategories: z.array(z.string()).nonempty("Please at least one item"),
});

export default function CategoryForm({
  existingCategory,
  intent = "create",
}: CategoryFormProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["category", existingCategory?.slug || undefined],

    mutationFn:
      intent === "create"
        ? async (category: CreateCategoryDto) =>
            await fetch("/api/categories/new", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(category),
            })
        : async (category: UpdateCategoryDto) =>
            await fetch(`/api/categories/${existingCategory?.slug}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(category),
            }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Success!");
    },
    onError: (error) =>
      toast.error(`Failed to update product: ${error.message}`),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingCategory?.name || "",
      subcategories: existingCategory?.subcategories || [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
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
                <Input placeholder="Clothes" type="" {...field} />
              </FormControl>
              <FormDescription>This is your main category.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subcategories"
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
        <Button disabled={isPending} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
