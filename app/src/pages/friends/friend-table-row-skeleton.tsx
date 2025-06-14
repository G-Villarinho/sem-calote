import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function FriendTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-[150px]" />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-[250px]" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </TableCell>

      <TableCell>
        <Skeleton className="h-5 w-[120px]" />
      </TableCell>

      <TableCell>
        <div className="flex justify-end">
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
    </TableRow>
  );
}
