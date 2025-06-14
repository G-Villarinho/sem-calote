import { api } from "@/lib/axios";

export interface DeleteFamilyParams {
  subscriptionId: string;
}

export interface DeleteFamilyRequest {
  friendIds: string[];
}

export async function deleteFamily({
  subscriptionId,
  ...data
}: DeleteFamilyRequest & DeleteFamilyParams): Promise<void> {
  const request: DeleteFamilyRequest = {
    friendIds: data.friendIds,
  };

  await api.delete(`/subscriptions/${subscriptionId}/family/members`, {
    data: request,
  });
}
