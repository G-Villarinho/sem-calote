import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UpdateFriendSheetForm } from "./update-friend-sheet-form";

interface UpdateFriendSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friend: {
    id: string;
    name: string;
    email: string;
  };
}

export function UpdateFriendSheet({
  open,
  onOpenChange,
  friend,
}: UpdateFriendSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <UpdateFriendSheetForm onOpenChange={onOpenChange} friend={friend} />
      </SheetContent>
    </Sheet>
  );
}
