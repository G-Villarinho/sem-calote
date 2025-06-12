import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateSubscriptionSheetForm } from "./create-subscription-sheet-form";

export function CreateSubscriptionSheet() {
  const [isCreateSubscriptionSheetOpen, setIsCreateSubscriptionSheetOpen] =
    useState(false);

  return (
    <Sheet
      open={isCreateSubscriptionSheetOpen}
      onOpenChange={setIsCreateSubscriptionSheetOpen}
    >
      <SheetTrigger asChild>
        <Button size="lg" className="mr-2">
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

        <CreateSubscriptionSheetForm
          onClose={() => setIsCreateSubscriptionSheetOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
