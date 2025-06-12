import { api } from "@/lib/axios";

export interface GetAllSubscriptionsQueryParams {
  subscriptionId: string;
  withFriends?: boolean | null;
}

export interface GetAllSubscriptionsResponse {
  id: string;
  name: string;
  total_price: number;
  next_billing_date: string;
  days_left: number;
  due_day: number;
  created_at: string;
}

export async function getAllSubscriptions({
  subscriptionId,
  withFriends = false,
}: GetAllSubscriptionsQueryParams): Promise<GetAllSubscriptionsResponse[]> {
  const response = await api.get<GetAllSubscriptionsResponse[]>(
    `/subscriptions/${subscriptionId}`,
    {
      params: {
        withFriends,
      },
    }
  );

  return response.data;
}
