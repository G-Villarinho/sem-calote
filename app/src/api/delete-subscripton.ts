import { api } from "@/lib/axios";

export interface DeleteSubscriptionParams {
  subscriptionId: string;
}

export async function deleteSubscription({
  subscriptionId,
}: DeleteSubscriptionParams): Promise<void> {
  await api.delete(`/subscriptions/${subscriptionId}`);
}
