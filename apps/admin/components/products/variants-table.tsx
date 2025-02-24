import { Variant } from "@caramella-corner/database/types/index";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@caramella-corner/ui/components/table";

import React from "react";

interface VariantsTableProps {
  variants: Variant[];
}

export const VariantsTable = ({ variants }: VariantsTableProps) => {
  if (!variants.length) return null;
  return (
    <Table className="mb-4">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">SKU</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Size</TableHead>
        </TableRow>
      </TableHeader>
      {variants.map((variant) => (
        <TableRow key={variant.sku}>
          <TableCell>{variant.sku}</TableCell>
          <TableCell>{variant.quantity}</TableCell>
          <TableCell>{variant.color}</TableCell>
          <TableCell>{variant.size}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
};
