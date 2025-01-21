"use client";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@caramella-corner/ui/components/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

export const DeleteAlert = ({ slug }: { slug: string }) => {
  const queryClient = useQueryClient();
  const { mutate: deleteCategory } = useMutation({
    mutationKey: ["categories", slug],
    mutationFn: async ({ categorySlug }: { categorySlug: string }) => {
      await fetch(`/api/categories/${categorySlug}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this
          category and remove its data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => deleteCategory({ categorySlug: slug })}
        >
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
