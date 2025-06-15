import { api } from "@/lib/axios";

export interface FamilyMemberDeletionParams {
  subscriptionId: string;
}

export interface RemoveFamilyMemberRequest {
  friend_ids: string[];
}

export async function deleteFamilyMember({
  subscriptionId,
  ...data
}: RemoveFamilyMemberRequest & FamilyMemberDeletionParams): Promise<void> {
  const request: RemoveFamilyMemberRequest = {
    friend_ids: data.friend_ids,
  };

  await api.delete(`/subscriptions/${subscriptionId}/family/members`, {
    data: request,
  });
}
