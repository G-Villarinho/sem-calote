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
import { useState } from "react";
import { EditFamilyDisplay } from "./edit-family-display";
import { FamilyEditorControls } from "./family-editor-controls";
import { useMutation } from "@tanstack/react-query";
import { createFamily } from "@/api/create-family";
import toast from "react-hot-toast";
import { deleteFamily } from "@/api/delete-family";
import { FamilyMembersDisplay } from "./family-members-display";

interface FamilyManagementProps {
  availableFriends: Friend[];
  subscription: Subscription;
}

export function FamilyManagement({
  availableFriends,
  subscription,
}: FamilyManagementProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [familyMembers, setFamilyMembers] = useState<Friend[]>(
    subscription.friends || []
  );
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const filteredAvailableFriends = availableFriends.filter(
    (friend) => !familyMembers.some((member) => member.id === friend.id)
  );

  const { mutate: addMembersMutation, isPending: isAdding } = useMutation({
    mutationFn: createFamily,
    onSuccess(_, variables) {
      const friendsToAdd = availableFriends.filter((f) =>
        variables.friend_ids.includes(f.id)
      );
      setFamilyMembers((prev) => [...prev, ...friendsToAdd]);
    },
    onError: () => toast.error("Failed to add members."),
  });

  const { mutate: removeMembersMutation, isPending: isRemoving } = useMutation({
    mutationFn: deleteFamily,
    onSuccess(_, variables) {
      setFamilyMembers((prev) =>
        prev.filter((m) => !variables.friend_ids.includes(m.id))
      );
    },
    onError: () => toast.error("Failed to remove members."),
  });

  function addMembers(friendIds: string[]) {
    if (friendIds.length === 0) return;
    addMembersMutation({
      subscriptionId: subscription.id,
      friend_ids: friendIds,
    });
    setSelectedFriends([]);
  }

  function removeMembers(memberIds: string[]) {
    if (memberIds.length === 0) return;
    removeMembersMutation({
      subscriptionId: subscription.id,
      friend_ids: memberIds,
    });
    setSelectedMembers([]);
  }

  const toggleFriendSelection = (id: string) =>
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );

  const toggleMemberSelection = (id: string) =>
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );

  return (
    <Card className="border-border/40 shadow-sm py-0">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between py-0">
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

      <CardContent className="p-4 space-y-6">
        {isEditing && (
          <EditFamilyDisplay
            availableFriends={filteredAvailableFriends}
            familyMembers={familyMembers}
            selectedFriends={selectedFriends}
            toggleFriendSelection={toggleFriendSelection}
            selectedMembers={selectedMembers}
            toggleMemberSelection={toggleMemberSelection}
          />
        )}

        {!isEditing && <FamilyMembersDisplay friends={familyMembers} />}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4 pt-0">
        {isEditing && (
          <FamilyEditorControls
            onDone={() => setIsEditing(false)}
            availableFriends={filteredAvailableFriends}
            familyMembers={familyMembers}
            selectedFriends={selectedFriends}
            selectedMembers={selectedMembers}
            addMembers={addMembers}
            removeMembers={removeMembers}
            isPending={isAdding || isRemoving}
          />
        )}
      </CardFooter>
    </Card>
  );
}
