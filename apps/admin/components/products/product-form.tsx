"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { Category, Product } from "@caramella-corner/database/types";
import { VariantDialog } from "./variant-dialog";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  CreateProductDto,
  UpdateProductDto,
} from "@caramella-corner/database/dtos/product";
import { FormIntent } from "@/lib/types";
import { IKUpload, ImageKitProvider } from "imagekitio-next";
import { authenticator } from "@/lib/imagekit";
import { Upload } from "lucide-react";

const updateProduct = async (slug: string, product: UpdateProductDto) => {
  const response = await fetch(`/api/products/${slug}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  return data;
};
const createProduct = async (product: CreateProductDto) => {
  const response = await fetch(`/api/products/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  return data;
};

const variantSchema = z.object({
  sku: z.string(),
  quantity: z.number().positive(),
  color: z.string().optional(),
  size: z.union([z.string(), z.number()]).optional(),
});
const categorySchema = z.object({
  name: z.string({ message: "Name is required" }),
  subcategory: z.string({ message: "Subcategory is required" }),
});
const formSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  material: z.string(),
  priceInPiasters: z
    .number()
    .int()
    .positive({ message: "Price must be a positive integer" }),
  countryOfOrigin: z.string(),
  images: z.array(z.string()),
  variants: z
    .array(variantSchema)
    .nonempty({ message: "Variants are required" }),
  category: categorySchema,
  active: z.boolean(),
});
interface ProductFormProps {
  product?: Product;
  intent: FormIntent;
  slug?: string;
}

export default function ProductForm({
  product,
  intent = "create",
  slug,
}: ProductFormProps) {
  const [countryName, setCountryName] = useState<string>(
    product?.countryOfOrigin || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    product?.category || null
  );
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images ?? []);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      return res.json();
    },
  });
  const { mutate } = useMutation({
    mutationFn:
      intent === "create"
        ? async (product: CreateProductDto) => await createProduct(product)
        : async (product: UpdateProductDto) =>
            await updateProduct(slug!, product),

    onSuccess: () => {
      toast.success("Product submitted successfully");
      router.replace("/products");
    },
    onError: (error) =>
      toast.error(`Failed to submit product: ${error.message}`),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name,
      description: product?.description,
      material: product?.material,
      priceInPiasters: product?.priceInPiasters,
      countryOfOrigin: countryName ?? product?.countryOfOrigin,
      images: imageUrls || product?.images,
      category: product?.category,
      active: product?.active,
      variants: product?.variants,
    },
  });
  const ikUploadRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (product) {
      form.reset(product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedCategory) return;
    mutate({ ...values, category: selectedCategory, images: imageUrls });
  }
  const publicKey = process.env.NEXT_PUBLIC_IK_PUBLIC_KEY!;
  const urlEndpoint = process.env.NEXT_PUBLIC_IK_URL_ENDPOINT!;
  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
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
                  <Input placeholder="Blue Blouse" {...field} />
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
                  <Input placeholder="100% cotton" {...field} />
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
                  <Input
                    placeholder="100,000"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
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
            name="variants"
            render={() => (
              <FormItem>
                <div className="flex flex-col gap-4 mt-2">
                  <FormLabel>Variants</FormLabel>
                  <VariantDialog />
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col gap-2">
                  <FormLabel>Images</FormLabel>
                  <IKUpload
                    multiple
                    onUploadStart={() => setIsUploading(true)}
                    onError={(res) => {
                      setIsUploading(false);
                      toast.error(res.message);
                    }}
                    onSuccess={({ url }) => {
                      setImageUrls([...imageUrls, url]);

                      form.setValue("images", [...imageUrls, url]);
                      setIsUploading(false);
                      toast.success("Image uploaded successfully!");
                    }}
                    useUniqueFileName={true}
                    style={{ display: "none" }}
                    ref={ikUploadRef}
                  />
                  <FormControl>
                    {ikUploadRef && (
                      <Button
                        onClick={() => ikUploadRef.current?.click()}
                        disabled={isUploading}
                        variant={"outline"}
                        type="button"
                        {...field}
                      >
                        <Upload />
                        Upload Images
                      </Button>
                    )}
                  </FormControl>
                </div>
                <FormDescription>
                  Select the images that best represent your product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row gap-4 mt-2 *:w-full">
            <FormField
              control={form.control}
              name="category.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    defaultValue={product?.category?.name || ""}
                    onValueChange={(val) => {
                      field.onChange(val);
                      const cat = categories?.find((c) => c.name === val);
                      if (!cat) return;
                      setSelectedCategory(cat);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedCategory && (
              <FormField
                control={form.control}
                name="category.subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCategory?.subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

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
    </ImageKitProvider>
  );
}
