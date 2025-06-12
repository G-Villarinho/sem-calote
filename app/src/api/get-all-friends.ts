import { api } from "@/lib/axios";

export interface GetAllFriendsResponse {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export async function getAllFriends() {
  const response = await api.get<GetAllFriendsResponse[]>("/friends");
  return response.data;
}
