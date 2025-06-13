import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { UpdateSubscriptionSheetForm } from "./update-subscription-sheet-form";

interface UpdateSubscriptionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: {
    id: string;
    name: string;
    total_price: number;
    due_day: number;
  };
}

export function UpdateSubscriptionSheet({
  subscription,
  open,
  onOpenChange,
}: UpdateSubscriptionSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Subscription</SheetTitle>
          <SheetDescription>
            Add a new subscription to track your recurring payments.
          </SheetDescription>
        </SheetHeader>

        {subscription ? (
          <UpdateSubscriptionSheetForm
            onClose={() => onOpenChange(false)}
            subscription={subscription}
          />
        ) : (
          <p className="text-center mt-8">Subscription not found.</p>
        )}
      </SheetContent>
    </Sheet>
  );
}
