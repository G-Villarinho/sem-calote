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
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/query-keys";
import { ConfirmDialog } from "@/components/dialogs/Confirm";
import type { GetAllSubscriptionsResponse } from "@/api/get-all-subscriptions";
import { deleteSubscription } from "@/api/delete-subscripton";
import { UpdateSubscriptionSheet } from "./update-subscription-sheet";

interface SubscriptionTableCellActionsProps {
  subscriptionId: string;
}

export function SubscriptionTableCellActions({
  subscriptionId,
}: SubscriptionTableCellActionsProps) {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const queryClient = useQueryClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  function handleUpdateSubscriptionCache() {
    const subscriptionsQueryKey = queryKeys.subscriptions.all();

    queryClient.setQueryData<GetAllSubscriptionsResponse[]>(
      subscriptionsQueryKey,
      (oldData) => {
        if (!oldData) {
          return [];
        }

        return oldData.filter(
          (subscription) => subscription.id !== subscriptionId
        );
      }
    );
  }

  const { mutateAsync: deleteSubscriptionMutation } = useMutation({
    mutationFn: deleteSubscription,
  });

  async function handleDeleteSubscription() {
    await deleteSubscriptionMutation(
      { subscriptionId },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          handleUpdateSubscriptionCache();
          toast.success("Subscription deleted successfully!");
        },
        onError: () => {
          toast.error(
            "Oops! Something went wrong while deleting the subscription. Please try again."
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
        onConfirm={handleDeleteSubscription}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        description="All families associated with this subscription will be deleted. Are you sure you want to delete this subscription?"
      />
      <UpdateSubscriptionSheet
        subscriptionId={subscriptionId}
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
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
            onClick={() => setIsEditSheetOpen(true)}
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
