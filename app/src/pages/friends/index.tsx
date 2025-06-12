import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { CreateFriendSheet } from "./create-friend-sheet";
import { useState } from "react";

export function FriendsPage() {
  const [isCreateFriendSheetOpen, setIsCreateFriendSheetOpen] = useState(false);

  return (
    <>
      <CreateFriendSheet
        open={isCreateFriendSheetOpen}
        onOpenChange={setIsCreateFriendSheetOpen}
      />

      <Heading
        title="Friends"
        description="Manage your friends and friend requests."
        icon={Users}
      >
        <Button
          type="button"
          size="lg"
          className="flex items-center gap-2 "
          onClick={() => setIsCreateFriendSheetOpen(true)}
        >
          <PlusCircle className="w-4 h-4" />
          Add Friend
        </Button>
      </Heading>
    </>
  );
}
