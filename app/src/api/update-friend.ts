import { api } from "@/lib/axios";

export interface UpdateFriendParams {
  friendId: string;
}

export interface UpdateFriendRequest {
  name: string;
  email: string;
}

export interface UpdateFriendResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export async function updateFriend({
  friendId,
  ...data
}: UpdateFriendParams & UpdateFriendRequest): Promise<UpdateFriendResponse> {
  const response = await api.put<UpdateFriendResponse>(
    `/friends/${friendId}`,
    data
  );
  return response.data;
}
