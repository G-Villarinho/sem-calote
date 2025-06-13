import { api } from "@/lib/axios";

export interface UpdateSubscriptionParams {
  subscriptionId: string;
}

export interface UpdateSubscriptionRequest {
  name: string;
  total_price: number;
  due_day: number;
}

export interface UpdateSubscriptionResponse {
  id: string;
  name: string;
  total_price: number;
  next_billing_date: string;
  days_left: number;
  due_day: number;
  created_at: string;
}

export async function updateSubscription({
  subscriptionId,
  ...data
}: UpdateSubscriptionRequest & UpdateSubscriptionParams) {
  const response = await api.put<UpdateSubscriptionResponse>(
    `/subscriptions/${subscriptionId}`,
    data
  );

  return response.data;
}
