import { api } from "@/lib/axios";

interface AddFamilyMemberParams {
  subscriptionId: string;
}

interface AddFamilyMemberRequest {
  friend_ids: string[];
}

export async function addFamilyMember({
  subscriptionId,
  ...data
}: AddFamilyMemberRequest & AddFamilyMemberParams): Promise<void> {
  const request: AddFamilyMemberRequest = {
    friend_ids: data.friend_ids,
  };

  await api.post(`/subscriptions/${subscriptionId}/family/members`, request);
}
