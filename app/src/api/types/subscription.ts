import type { Friend } from "./friend";

export interface Subscription {
  id: string;
  name: string;
  total_price: number;
  next_billing_date: string;
  days_left: number;
  due_day: number;
  created_at: string;
  friends?: Friend[];
}
