import { api } from "@/lib/axios";

export interface DeleteFamilyParams {
  subscriptionId: string;
}

export interface DeleteFamilyRequest {
  friendId: string[];
}

export async function deleteFamily({
  subscriptionId,
  ...data
}: DeleteFamilyRequest & DeleteFamilyParams): Promise<void> {
  const request: DeleteFamilyRequest = {
    friendId: data.friendId,
  };

  await api.delete(`/subscriptions/${subscriptionId}/family/members`, {
    data: request,
  });
}
