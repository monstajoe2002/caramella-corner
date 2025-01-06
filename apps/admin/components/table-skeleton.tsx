import { Skeleton } from "@caramella-corner/ui/components/skeleton";
import React from "react";

export const TableSkeleton = () => {
  return (
    <>
      <Skeleton className=" h-10 mb-4 w-1/3" />
      <Skeleton className="h-[200px] mb-4" />
    </>
  );
};
