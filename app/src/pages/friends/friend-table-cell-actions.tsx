import { MoreHorizontal, PenSquare, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateFriendSheet } from "./update-friend-sheet";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFriend } from "@/api/delete-friend";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/query-keys";
import type { GetAllFriendsResponse } from "@/api/get-all-friends";
import { ConfirmDialog } from "@/components/dialogs/Confirm";

interface FriendTableCellActionsProps {
  friendId: string;
}

export function FriendTableCellActions({
  friendId,
}: FriendTableCellActionsProps) {
  const queryClient = useQueryClient();

  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  function handleUpdateFriendCache() {
    const friendsQueryKey = queryKeys.friends.all();

    queryClient.setQueryData<GetAllFriendsResponse[]>(
      friendsQueryKey,
      (oldData) => {
        if (!oldData) {
          return [];
        }

        return oldData.filter((friend) => friend.id !== friendId);
      }
    );
  }

  const { mutateAsync: deleteFriendMutate } = useMutation({
    mutationFn: deleteFriend,
  });

  async function handleDeleteFriend() {
    await deleteFriendMutate(
      { friendId },
      {
        onSuccess: () => {
          setIsUpdateSheetOpen(false);
          handleUpdateFriendCache();
          toast.success("Friend deleted successfully!");
        },
        onError: () => {
          toast.error(
            "Oops! Something went wrong while deleting the friend. Please try again."
          );
        },
      }
    );
  }

  function handleOpenDeleteDialog(e: React.MouseEvent) {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  }

  return (
    <>
      <ConfirmDialog
        onConfirm={handleDeleteFriend}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        description="All subscriptions associated with this friend will be deleted. Are you sure you want to delete this friend?"
      />
      <UpdateFriendSheet
        open={isUpdateSheetOpen}
        onOpenChange={setIsUpdateSheetOpen}
        friendId={friendId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsUpdateSheetOpen(true)}
          >
            <PenSquare className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-500 focus:text-red-500"
            onClick={handleOpenDeleteDialog}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
