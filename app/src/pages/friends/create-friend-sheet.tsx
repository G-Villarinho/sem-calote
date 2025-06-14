import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CreateFriendSheetForm } from "./create-friend-sheet-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function CreateFriendSheet() {
  const [isCreateFriendSheetOpen, setIsCreateFriendSheetOpen] = useState(false);

  return (
    <Sheet
      open={isCreateFriendSheetOpen}
      onOpenChange={setIsCreateFriendSheetOpen}
    >
      <SheetTrigger asChild>
        <Button size="lg" className="mr-2">
          <PlusCircle className="h-4 w-4" />
          <span>Add Friend</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <CreateFriendSheetForm onOpenChange={setIsCreateFriendSheetOpen} />
      </SheetContent>
    </Sheet>
  );
}
