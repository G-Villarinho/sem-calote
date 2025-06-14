export const queryKeys = {
  friends: {
    all: () => ["friends"],
    detail: (friendId: string) => [...queryKeys.friends.all(), friendId],
  },
  subscriptions: {
    all: (withFriends?: boolean | null) => ["subscriptions", withFriends],
    detail: (subscriptionId: string, withFriends?: boolean | null) => [
      ...queryKeys.subscriptions.all(withFriends),
      subscriptionId,
    ],
  },
};
