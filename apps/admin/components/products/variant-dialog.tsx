import { Button } from "@caramella-corner/ui/components/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@caramella-corner/ui/components/dialog";
import React from "react";

export const VariantDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Manage Variants</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Variants</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
