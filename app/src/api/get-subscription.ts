import { api } from "@/lib/axios";

export interface GetSubscriptionQueryParams {
  subscriptionId: string;
  withFriends?: boolean | null;
}

export interface GetSubscriptionResponse {
  id: string;
  name: string;
  total_price: number;
  next_billing_date: string;
  days_left: number;
  due_day: number;
  created_at: string;

  friends: {
    id: string;
    name: string;
    email: string;
  }[];
}

export async function getSubscription({
  subscriptionId,
  withFriends = false,
}: GetSubscriptionQueryParams) {
  const response = await api.get<GetSubscriptionResponse>(
    `/subscriptions/${subscriptionId}`,
    {
      params: {
        withFriends,
      },
    }
  );

  return response.data;
}
