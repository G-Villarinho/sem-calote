import { Heading } from "@/components/heading";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { CreateSubscriptionSheet } from "./create-subscription-sheet";

export function SubscriptionsPage() {
  return (
    <>
      <div className="bg-muted/50 p-6 rounded-md">
        <Heading
          title="Subscriptions"
          description="Manage your subscriptions"
          icon={CreditCard}
        >
          <div>
            <div className="text-2xl font-bold text-primary">$109.97</div>
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
              <CardDescription>6 active subscription(s)</CardDescription>
            </div>
            <CreateSubscriptionSheet />
          </div>
        </CardHeader>
      </Card>
    </>
  );
}
