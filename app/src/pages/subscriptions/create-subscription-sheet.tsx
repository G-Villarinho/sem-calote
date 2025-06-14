import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { lazy, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SubscriptionFormSkeleton } from "./subscription-form-skeleton";

interface CreateSubscriptionSheetProps {
  disabled?: boolean;
}

const CreateSubscriptionSheetForm = lazy(() =>
  import("./create-subscription-sheet-form").then((module) => ({
    default: module.CreateSubscriptionSheetForm,
  }))
);

export function CreateSubscriptionSheet({
  disabled = false,
}: CreateSubscriptionSheetProps) {
  const [isCreateSubscriptionSheetOpen, setIsCreateSubscriptionSheetOpen] =
    useState(false);

  return (
    <Sheet
      open={isCreateSubscriptionSheetOpen}
      onOpenChange={setIsCreateSubscriptionSheetOpen}
    >
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="mr-2 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add subscription</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Subscription</SheetTitle>
          <SheetDescription>
            Add a new subscription to track your recurring payments.
          </SheetDescription>
        </SheetHeader>

        <Suspense fallback={<SubscriptionFormSkeleton />}>
          <CreateSubscriptionSheetForm
            onClose={() => setIsCreateSubscriptionSheetOpen(false)}
          />
        </Suspense>
      </SheetContent>
    </Sheet>
  );
}
