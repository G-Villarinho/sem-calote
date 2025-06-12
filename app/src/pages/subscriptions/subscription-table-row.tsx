import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { CreditCard, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SubscriptionTableCellActions } from "./subscription-table-cell-action";

interface SubscriptionTableRowProps {
  subscription: {
    id: string;
    name: string;
    total_price: number;
    next_billing_date: string;
    days_left: number;
    due_day: number;
    created_at: string;
  };
}

export function SubscriptionTableRow({
  subscription,
}: SubscriptionTableRowProps) {
  function formatDaysLeftText(daysLeft: number): string {
    switch (daysLeft) {
      case 0:
        return "Due Today";
      case 1:
        return "Due Tomorrow";
      default:
        return `${daysLeft} days left`;
    }
  }

  function getBadgeVariantByDaysLeft(
    daysLeft: number
  ): "destructive" | "secondary" | "outline" {
    if (daysLeft <= 3) {
      return "destructive";
    }
    if (daysLeft <= 7) {
      return "secondary";
    }
    return "outline";
  }

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span>{subscription.name}</span>
        </div>
      </TableCell>
      <TableCell className="font-semibold">
        {subscription.total_price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <span className="font-medium">Day {subscription.due_day}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(subscription.next_billing_date, "MMM d, yyyy")}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getBadgeVariantByDaysLeft(subscription.days_left)}>
          {formatDaysLeftText(subscription.days_left)}
        </Badge>
      </TableCell>
      <TableCell>
        <SubscriptionTableCellActions subscriptionId={subscription.id} />
      </TableCell>
    </TableRow>
  );
}
