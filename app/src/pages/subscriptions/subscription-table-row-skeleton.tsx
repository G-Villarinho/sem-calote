import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function SubscriptionTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </TableCell>

      <TableCell>
        <Skeleton className="h-5 w-[100px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-[70px]" />
      </TableCell>

      <TableCell>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
      </TableCell>

      <TableCell>
        <Skeleton className="h-6 w-[100px] rounded-full" />
      </TableCell>

      <TableCell>
        <div className="flex items-end justify-end">
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
    </TableRow>
  );
}
