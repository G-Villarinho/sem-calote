import type { Friend } from "@/api/types/friend";
import type { Subscription } from "@/api/types/subscription";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { FriendsDisplay } from "./friends-display";
import { EditFamilyDisplay } from "./edit-family-display";
import { FamilyEditorControls } from "./family-editor-controls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFamily } from "@/api/create-family";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/query-keys";
import { deleteFamily } from "@/api/delete-family";
import { FamilyEditorProvider } from "./family-editor-context";

interface FamilyManagementProps {
  availableFriends: Friend[];
  subscription: Subscription;
}

export function FamilyManagement({
  availableFriends,
  subscription,
}: FamilyManagementProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const [optimisticFamily, setOptimisticFamily] = useOptimistic(
    subscription.friends || [],
    (
      currentMembersParam,
      {
        action,
        payload,
      }: { action: "add" | "remove"; payload: string[] | "all" }
    ) => {
      const currentMembers = currentMembersParam || [];
      if (action === "add") {
        if (payload === "all") {
          return [
            ...currentMembers,
            ...availableFriends.filter(
              (f) => !currentMembers.some((m) => m.id === f.id)
            ),
          ];
        }
        const friendsToAdd = availableFriends.filter((f) =>
          payload.includes(f.id)
        );
        return [...currentMembers, ...friendsToAdd];
      }
      if (action === "remove") {
        if (payload === "all") return [];
        return currentMembers.filter((m) => !payload.includes(m.id));
      }
      return currentMembers;
    }
  );

  const { mutateAsync: addMembersMutation } = useMutation({
    mutationFn: createFamily,
    onSuccess: () => {
      toast.success("Members added successfully!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.all(true),
      });
    },
    onError: () => {
      toast.error("Failed to add members. Please try again.");
    },
  });

  const { mutateAsync: removeMembersMutation } = useMutation({
    mutationFn: deleteFamily,
    onSuccess: () => {
      toast.success("Members removed successfully!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.all(true),
      });
    },
    onError: () => {
      toast.error("Failed to remove members. Please try again.");
    },
  });

  async function handleAddMembers(friendIds: string[]) {
    if (friendIds.length === 0) return;
    startTransition(() => {
      setOptimisticFamily({ action: "add", payload: friendIds });
    });
    await addMembersMutation({
      subscriptionId: subscription.id,
      friend_ids: friendIds,
    });
  }

  async function handleAddAllMembers() {
    const friendIds = availableFriends.map((f) => f.id);
    if (friendIds.length === 0) return;
    startTransition(() => {
      setOptimisticFamily({ action: "add", payload: "all" });
    });
    await addMembersMutation({
      subscriptionId: subscription.id,
      friend_ids: friendIds,
    });
  }

  async function handleRemoveMembers(memberIds: string[]) {
    if (memberIds.length === 0) return;
    startTransition(() => {
      setOptimisticFamily({ action: "remove", payload: memberIds });
    });
    await removeMembersMutation({
      subscriptionId: subscription.id,
      friendIds: memberIds,
    });
  }

  async function handleRemoveAllMembers() {
    if (optimisticFamily.length === 0) return;
    const memberIds = optimisticFamily.map((m) => m.id);
    startTransition(() => {
      setOptimisticFamily({ action: "remove", payload: "all" });
    });
    await removeMembersMutation({
      subscriptionId: subscription.id,
      friendIds: memberIds,
    });
  }

  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold">
              {subscription.name}'s Family
            </CardTitle>
            <CardDescription>
              {subscription.friends?.length} member
              {subscription.friends?.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <FamilyEditorProvider
        availableFriends={availableFriends}
        familyMembers={optimisticFamily}
        onAddMembers={handleAddMembers}
        onAddAllMembers={handleAddAllMembers}
        onRemoveMembers={handleRemoveMembers}
        onRemoveAllMembers={handleRemoveAllMembers}
      >
        <CardContent className="p-4 space-y-6">
          {isEditing ? (
            <EditFamilyDisplay />
          ) : (
            <FriendsDisplay friends={optimisticFamily} />
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 p-4 pt-0">
          {isEditing && (
            <FamilyEditorControls onDone={() => setIsEditing(false)} />
          )}
        </CardFooter>
      </FamilyEditorProvider>
    </Card>
  );
}
