import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { lazy, Suspense } from "react";
import { SubscriptionFormSkeleton } from "./subscription-form-skeleton";

const UpdateSubscriptionSheetForm = lazy(() =>
  import("./update-subscription-sheet-form").then((module) => ({
    default: module.UpdateSubscriptionSheetForm,
  }))
);

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

        <Suspense fallback={<SubscriptionFormSkeleton />}>
          <UpdateSubscriptionSheetForm
            onClose={() => onOpenChange(false)}
            subscription={subscription}
          />
        </Suspense>
      </SheetContent>
    </Sheet>
  );
}
