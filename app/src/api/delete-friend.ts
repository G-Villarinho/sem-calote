import { api } from "@/lib/axios";

export interface DeleteFriendParams {
  friendId: string;
}

export async function deleteFriend({ friendId }: DeleteFriendParams) {
  await api.delete(`/friends/${friendId}`);
}
