export const queryKeys = {
  friends: {
    all: () => ["friends"],
    detail: (friendId: string) => [...queryKeys.friends.all(), friendId],
  },
  subscriptions: {
    all: () => ["subscriptions"],
    detail: (subscriptionId: string) => [
      ...queryKeys.subscriptions.all(),
      subscriptionId,
    ],
  },
};
