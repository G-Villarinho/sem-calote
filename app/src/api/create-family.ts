import { api } from "@/lib/axios";

interface CreateFamilyParams {
  subscriptionId: string;
}

interface CreateFamilyRequest {
  friendsIds: string[];
}

export async function createFamily({
  subscriptionId,
  ...data
}: CreateFamilyRequest & CreateFamilyParams): Promise<void> {
  const request: CreateFamilyRequest = {
    friendsIds: data.friendsIds,
  };

  await api.post(`/subscriptions/${subscriptionId}/family/members`, request);
}
