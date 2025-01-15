"use client";
import { Button } from "@caramella-corner/ui/components/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@caramella-corner/ui/components/dialog";
import { Separator } from "@caramella-corner/ui/components/separator";
import { ChartNoAxesGantt } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { VariantFormField } from "@/components/products/variant-form-field";

export const VariantDialog = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <ChartNoAxesGantt />
          <span>Manage Variants</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Manage Variants</DialogTitle>
          <DialogDescription>
            If your product has multiple variants, you can manage them here. You
            can add different options, e.g. color and size.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="relative p-4 border rounded-lg">
              <h3 className="font-medium mb-4">Variant #{index + 1}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <VariantFormField
                  index={index}
                  name="sku"
                  label="SKU"
                  placeholder="CC001"
                />
                <VariantFormField
                  index={index}
                  name="quantity"
                  label="Quantity"
                  type="number"
                  placeholder="10"
                />
                <VariantFormField
                  index={index}
                  name="color"
                  label="Color"
                  placeholder="Pink"
                />
                <VariantFormField
                  index={index}
                  name="size"
                  label="Size"
                  placeholder="L / 42"
                />
              </div>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="mt-4"
                onClick={() => remove(index)}
              >
                Remove Variant
              </Button>
              <Separator className="my-4" />
            </div>
          ))}

          <Button
            type="button"
            onClick={() => append({
              sku: "",
              quantity: 0,
              color: "",
              size: "",
            })}
            className="w-full"
          >
            Add New Variant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
