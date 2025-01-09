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
import { Label } from "@caramella-corner/ui/components/label";
import { Separator } from "@caramella-corner/ui/components/separator";
import { ChartNoAxesGantt } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export const VariantDialog = () => {
  const { control, setValue } = useFormContext();
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
        <div>
          {fields.map((field, index) => (
            <div key={field.id}>
              <FormControl>
                <div>
                  <h2 className="my-4 font-medium">Variant #{index + 1}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        placeholder={"CC001"}
                        name={`value.${index}.sku`}
                        onChange={(e) =>
                          setValue(`value.${index}.sku`, e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder={`10`}
                        name={`value.${index}.quantity`}
                        onChange={(e) =>
                          setValue(`variants.${index}.quantity`, e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        placeholder="Pink"
                        name={`value.${index}.color`}
                        onChange={(e) =>
                          setValue(`variants.${index}.color`, e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Input
                        id="size"
                        placeholder="L / 42"
                        name={`value.${index}.size`}
                        onChange={(e) =>
                          setValue(`variants.${index}.size`, e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </FormControl>
              <Button
                className="mt-4"
                type="button"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
              <Separator className="mt-4" />
            </div>
          ))}
          <Button
            type="button"
            className="mt-4"
            onClick={() =>
              append({
                sku: "",
                quantity: 0,
                color: "",
                size: "",
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
