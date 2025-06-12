import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { CreateFriendSheet } from "./create-friend-sheet";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import { FriendTableRow } from "./friend-table-row";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getAllFriends } from "@/api/get-all-friends";

export function FriendsPage() {
  const [isCreateFriendSheetOpen, setIsCreateFriendSheetOpen] = useState(false);

  const { data: friends } = useQuery({
    queryKey: queryKeys.friends.all(),
    queryFn: () => getAllFriends(),
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <>
      <Heading
        title="Friends"
        icon={Users}
        description="Manage your friends list"
      >
        <Button
          size="lg"
          className="mr-2"
          onClick={() => setIsCreateFriendSheetOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Friend</span>
        </Button>
      </Heading>
      <CreateFriendSheet
        open={isCreateFriendSheetOpen}
        onOpenChange={setIsCreateFriendSheetOpen}
      />

      <Card className="border-border/40 shadow-sm">
        <CardContent className="px-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {friends &&
                friends.map((friend) => (
                  <FriendTableRow key={friend.id} friend={friend} />
                ))}

              {friends && friends.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No friends found. Add a new friend to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
