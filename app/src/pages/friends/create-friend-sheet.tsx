import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CreateFriendSheetForm } from "./create-friend-sheet-form";

interface CreateFriendSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFriendSheet({
  open,
  onOpenChange,
}: CreateFriendSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <CreateFriendSheetForm onOpenChange={onOpenChange} />
      </SheetContent>
    </Sheet>
  );
}
