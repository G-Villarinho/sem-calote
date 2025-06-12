export const queryKeys = {
  friends: {
    all: () => ["friends"],
    detail: (friendId: string) => [...queryKeys.friends.all(), friendId],
  },
};
