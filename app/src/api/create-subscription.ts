import { api } from "@/lib/axios";

export interface CreateSubscriptionRequest {
  name: string;
  total_price: number;
  due_day: number;
}

export interface CreateSubscriptionResponse {
  id: string;
  name: string;
  total_price: number;
  next_billing_date: string;
  days_left: number;
  due_day: number;
  created_at: string;
}

export async function createSubscription({
  name,
  total_price,
  due_day,
}: CreateSubscriptionRequest) {
  const response = await api.post<CreateSubscriptionResponse>(
    "/subscriptions",
    {
      name,
      total_price,
      due_day,
    }
  );

  return response.data;
}
