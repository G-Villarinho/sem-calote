import { api } from "@/lib/axios";

export interface CreateFriendRequest {
  name: string;
  email: string;
}

export interface CreateFriendResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export async function createFriend({ name, email }: CreateFriendRequest) {
  const response = await api.post<CreateFriendResponse>("/friends", {
    name,
    email,
  });

  return response.data;
}
