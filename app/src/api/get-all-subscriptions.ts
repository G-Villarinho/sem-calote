import { api } from "@/lib/axios";

export interface GetAllSubscriptionsQueryParams {
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
  friends?: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  }[];
}

export async function getAllSubscriptions({
  withFriends = false,
}: GetAllSubscriptionsQueryParams): Promise<GetAllSubscriptionsResponse[]> {
  const response = await api.get<GetAllSubscriptionsResponse[]>(
    "/subscriptions",
    {
      params: {
        withFriends,
      },
    }
  );

  return response.data;
}
