import { Heading } from "@/components/heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { CreateSubscriptionSheet } from "./create-subscription-sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getAllSubscriptions } from "@/api/get-all-subscriptions";
import { SubscriptionTableRow } from "./subscription-table-row";

export function SubscriptionsPage() {
  const { data: subscriptions } = useQuery({
    queryKey: queryKeys.subscriptions.all(),
    queryFn: () => getAllSubscriptions({}),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const totalMonthlyCost = (subscriptions ?? []).reduce(
    (sum, sub) => sum + sub.total_price,
    0
  );

  return (
    <>
      <div className="bg-muted/50 p-6 rounded-md">
        <Heading
          title="Subscriptions"
          description="Manage your subscriptions"
          icon={CreditCard}
        >
          <div>
            <div className="text-2xl font-bold text-primary">
              {totalMonthlyCost.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div className="text-sm text-muted-foreground">
              Total monthly cost
            </div>
          </div>
        </Heading>
      </div>

      <Card className="border-border/40 shadow-sm mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>
                {subscriptions?.length} active subscription(s)
              </CardDescription>
            </div>
            <CreateSubscriptionSheet />
          </div>
        </CardHeader>
        <CardContent className="px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Due Day</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions &&
                subscriptions.map((subscription) => (
                  <SubscriptionTableRow
                    key={subscription.id}
                    subscription={subscription}
                  />
                ))}

              {subscriptions && subscriptions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No subscriptions found. Add a new subscription to get
                    started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Billing Information</CardTitle>
          <CardDescription>
            Understanding how billing dates work with different month lengths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Standard Billing</h4>
              <p className="text-sm text-muted-foreground">
                For due days 1-28, billing occurs on the same day each month.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Adjusted Billing</h4>
              <p className="text-sm text-muted-foreground">
                For due days 29-31, billing adjusts to the last day of shorter
                months.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
