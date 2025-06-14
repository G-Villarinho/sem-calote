import { api } from "@/lib/axios";

interface CreateFamilyParams {
  subscriptionId: string;
}

interface CreateFamilyRequest {
  friend_ids: string[];
}

export async function createFamily({
  subscriptionId,
  ...data
}: CreateFamilyRequest & CreateFamilyParams): Promise<void> {
  const request: CreateFamilyRequest = {
    friend_ids: data.friend_ids,
  };

  await api.post(`/subscriptions/${subscriptionId}/family/members`, request);
}
