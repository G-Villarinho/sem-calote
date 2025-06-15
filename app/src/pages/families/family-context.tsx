import { createContext, useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createFamily } from "@/api/create-family";
import { deleteFamily } from "@/api/delete-family";
import type { Friend } from "@/api/types/friend";
import { queryKeys } from "@/lib/query-keys";
import type { Subscription } from "@/api/types/subscription";

interface FamilyContextValue {
  availableFriends: Friend[];
  setAvailableFriends: (value: Friend[]) => void;
  familyMembers: Friend[];
  setFamilyMembers: (value: Friend[]) => void;
  selectedFriends: string[];
  setSelectedFriends: (value: string[]) => void;
  selectedMembers: string[];
  setSelectedMembers: (value: string[]) => void;
  toggleFriendSelection: (friendId: string) => void;
  toggleMemberSelection: (friendId: string) => void;
  handleAddMember: (friendIds: string[]) => void;
  handleRemoveMember: (friendIds: string[]) => void;
  isAdding: boolean;
  isRemoving: boolean;
}

export const FamilyContext = createContext<FamilyContextValue | null>(null);

interface FamilyProviderProps {
  children: ReactNode;
  initialMembers: Friend[];
  initialAvailableFriends: Friend[];
  subscriptionId: string;
}

export function FamilyProvider({
  children,
  initialMembers,
  initialAvailableFriends,
  subscriptionId,
}: FamilyProviderProps) {
  const queryClient = useQueryClient();
  const [availableFriends, setAvailableFriends] = useState<Friend[]>(
    initialAvailableFriends
  );
  const [familyMembers, setFamilyMembers] = useState<Friend[]>(initialMembers);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const { mutate: addMembers, isPending: isAdding } = useMutation({
    mutationFn: createFamily,
    onSuccess: (_, variables) => {
      const queryKey = queryKeys.subscriptions.all(true);

      queryClient.setQueryData<Subscription[]>(queryKey, (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return oldData.map((subscription) => {
          if (subscription.id === subscriptionId) {
            return {
              ...subscription,
              friends: [
                ...(subscription.friends || []),
                ...availableFriends.filter((friendId) =>
                  variables.friend_ids.includes(friendId.id)
                ),
              ],
            };
          }
          return subscription;
        });
      });

      setAvailableFriends((prev) =>
        prev.filter((f) => !variables.friend_ids.includes(f.id))
      );
    },
    onError: (_, variables) => {
      setFamilyMembers((prev) =>
        prev.filter((m) => !variables.friend_ids.includes(m.id))
      );
      toast.error("Falha ao adicionar membro(s)");
    },
  });

  const { mutate: removeMembers, isPending: isRemoving } = useMutation({
    mutationFn: deleteFamily,
    onSuccess: (_, variables) => {
      const queryKey = queryKeys.subscriptions.all(true);

      queryClient.setQueryData<Subscription[]>(queryKey, (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return oldData.map((subscription) => {
          if (subscription.id === subscriptionId) {
            return {
              ...subscription,
              friends: subscription.friends?.filter(
                (friend) => !variables.friend_ids.includes(friend.id)
              ),
            };
          }
          return subscription;
        });
      });
    },
    onError: (_, variables) => {
      const restored = availableFriends.filter((f) =>
        variables.friend_ids.includes(f.id)
      );
      setFamilyMembers((prev) => [...prev, ...restored]);
      toast.error("Falha ao remover membro(s)");
    },
  });

  function toggleFriendSelection(friendId: string) {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  }

  function toggleMemberSelection(memberId: string) {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  }

  function handleAddMember(friendIds: string[]) {
    if (friendIds.length === 0) return;
    const added = availableFriends.filter((f) => friendIds.includes(f.id));

    setFamilyMembers((prev) => [...prev, ...added]);

    addMembers({
      subscriptionId,
      friend_ids: friendIds,
    });
  }

  function handleRemoveMember(friendIds: string[]) {
    if (friendIds.length === 0) return;

    setFamilyMembers((prev) =>
      prev.filter((memberId) => !friendIds.includes(memberId.id))
    );

    removeMembers({
      subscriptionId,
      friend_ids: friendIds,
    });
  }

  return (
    <FamilyContext.Provider
      value={{
        availableFriends,
        setAvailableFriends,
        familyMembers,
        setFamilyMembers,
        selectedFriends,
        setSelectedFriends,
        selectedMembers,
        setSelectedMembers,
        toggleFriendSelection,
        toggleMemberSelection,
        handleAddMember,
        handleRemoveMember,
        isAdding,
        isRemoving,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}
