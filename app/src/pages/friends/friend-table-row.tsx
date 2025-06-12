import { useState, useRef, useEffect } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { FriendTableCellActions } from "./friend-table-cell-actions";

interface FriendTableRowProps {
  friend: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  };
}

export function FriendTableRow({ friend }: FriendTableRowProps) {
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  function handleRevealEmail() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsEmailVisible(true);
    timerRef.current = window.setTimeout(() => {
      setIsEmailVisible(false);
    }, 3000);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const formattedDate = friend.created_at
    ? format(parseISO(friend.created_at), "MMM d, yyyy")
    : "N/A";

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">{friend.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span
            className={cn("transition-all", !isEmailVisible && "blur-[5px]")}
          >
            {friend.email}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleRevealEmail}
          >
            {isEmailVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle email visibility</span>
          </Button>
        </div>
      </TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell className="text-right">
        <FriendTableCellActions friendId={friend.id} />
      </TableCell>
    </TableRow>
  );
}
