import { getAllFriends } from "@/api/get-all-friends";
import { getAllSubscriptions } from "@/api/get-all-subscriptions";
import { Heading } from "@/components/heading";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { House } from "lucide-react";
import { FamilyManagementCard } from "./family-management-card";
import { FamilyProvider } from "./family-context";

const WITH_FRIENDS = true;

export function FamiliesPage() {
  const { data: subscriptions } = useQuery({
    queryKey: queryKeys.subscriptions.all(WITH_FRIENDS),
    queryFn: () =>
      getAllSubscriptions({
        withFriends: WITH_FRIENDS,
      }),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { data: AvailableFriends } = useQuery({
    queryKey: queryKeys.friends.all(),
    queryFn: () => getAllFriends(),
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <>
      <div className="bg-muted/50 p-6 rounded-md mb-8">
        <Heading
          title="Families"
          description="Manage your family memberships and subscriptions"
          icon={House}
        />
      </div>
      {subscriptions && subscriptions.length > 0 && (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {subscriptions.map((subscription) => (
            <FamilyProvider
              key={subscription.id}
              initialMembers={subscription.friends || []}
              initialAvailableFriends={AvailableFriends || []}
              subscriptionId={subscription.id}
            >
              <FamilyManagementCard
                key={subscription.id}
                subscriptionName={subscription.name}
              />
            </FamilyProvider>
          ))}
        </div>
      )}
    </>
  );
}
