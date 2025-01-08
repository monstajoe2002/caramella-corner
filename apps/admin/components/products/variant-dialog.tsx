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
import { FormControl } from "@caramella-corner/ui/components/form";
import { Input } from "@caramella-corner/ui/components/input";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export const VariantDialog = () => {
  const { control, register, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit">Manage Variants</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Variants</DialogTitle>
          <DialogDescription>
            If your product has multiple variants, you can manage them here. You
            can add different options, e.g. color and size.
          </DialogDescription>
        </DialogHeader>
        <div>
          {fields.map((field, index) => (
            <div key={field.id}>
              <FormControl>
                <div>
                  <Input
                    placeholder={"SKU"}
                    {...register(`variants.${index}.sku`)}
                  />
                  <Input
                    type="number"
                    placeholder={`Quantity`}
                    {...register(`variants.${index}.quantity`)}
                  />
                  <Input
                    placeholder="Options"
                    {...register(`variants.${index}.options`)}
                    onChange={(e) => {
                      const parsed = JSON.parse(e.target.value);
                      setValue(`variants.${index}.options`, parsed || "{}");
                    }}
                  />
                </div>
              </FormControl>
              <Button
                className="mt-4"
                type="button"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            className="mt-4"
            onClick={() =>
              append({
                sku: "",
                quantity: 0,
                options: "",
              })
            }
          >
            Add Variant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
