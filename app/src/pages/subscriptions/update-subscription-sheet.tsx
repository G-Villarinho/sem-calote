import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Loader2 } from "lucide-react";
import { getAllSubscriptions } from "@/api/get-all-subscriptions";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { UpdateSubscriptionSheetForm } from "./update-subscription-sheet-form";

interface UpdateSubscriptionSheetProps {
  subscriptionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateSubscriptionSheet({
  subscriptionId,
  open,
  onOpenChange,
}: UpdateSubscriptionSheetProps) {
  const { data: subscriptionToUpdate, isLoading } = useQuery({
    queryKey: queryKeys.subscriptions.all(),
    queryFn: () => getAllSubscriptions({}),
    select: (subscriptions) =>
      subscriptions.find((sub) => sub.id === subscriptionId),
    enabled: !!subscriptionId,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Subscription</SheetTitle>
          <SheetDescription>
            Add a new subscription to track your recurring payments.
          </SheetDescription>
        </SheetHeader>

        {isLoading && <Loader2 className="animate-spin mx-auto mt-8" />}

        {subscriptionToUpdate ? (
          <UpdateSubscriptionSheetForm
            onClose={() => onOpenChange(false)}
            subscription={subscriptionToUpdate}
          />
        ) : (
          !isLoading && (
            <p className="text-center mt-8">Subscription not found.</p>
          )
        )}
      </SheetContent>
    </Sheet>
  );
}
