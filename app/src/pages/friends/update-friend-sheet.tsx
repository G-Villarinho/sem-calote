import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getAllFriends } from "@/api/get-all-friends";
import { UpdateFriendSheetForm } from "./update-friend-sheet-form";
import { Loader2 } from "lucide-react";

interface UpdateFriendSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friendId: string;
}

export function UpdateFriendSheet({
  open,
  onOpenChange,
  friendId,
}: UpdateFriendSheetProps) {
  const { data: friendToUpdate, isLoading } = useQuery({
    queryKey: queryKeys.friends.all(),
    queryFn: getAllFriends,
    select: (friends) => friends.find((friend) => friend.id === friendId),
    enabled: !!friendId,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        {isLoading && <Loader2 className="animate-spin mx-auto mt-8" />}

        {friendToUpdate ? (
          <UpdateFriendSheetForm
            onOpenChange={onOpenChange}
            friend={friendToUpdate}
          />
        ) : (
          !isLoading && <p className="text-center mt-8">Friend not found.</p>
        )}
      </SheetContent>
    </Sheet>
  );
}
