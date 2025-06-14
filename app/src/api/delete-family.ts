import { api } from "@/lib/axios";

export interface DeleteFamilyParams {
  subscriptionId: string;
}

export interface DeleteFamilyRequest {
  friend_ids: string[];
}

export async function deleteFamily({
  subscriptionId,
  ...data
}: DeleteFamilyRequest & DeleteFamilyParams): Promise<void> {
  const request: DeleteFamilyRequest = {
    friend_ids: data.friend_ids,
  };

  await api.delete(`/subscriptions/${subscriptionId}/family/members`, {
    data: request,
  });
}
