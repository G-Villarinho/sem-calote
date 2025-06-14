import { Heading } from "@/components/heading";
import { Users } from "lucide-react";
import { CreateFriendSheet } from "./create-friend-sheet";

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
import { FriendTableRowSkeleton } from "./friend-table-row-skeleton";

const SKELETON_COUNT = 2;

export function FriendsPage() {
  const { data: friends, isLoading } = useQuery({
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
        <CreateFriendSheet />
      </Heading>

      <Card className="border-border/40 shadow-sm mt-8 overflow-hidden">
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
              {isLoading &&
                Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <FriendTableRowSkeleton key={index} />
                ))}

              {friends &&
                friends.map((friend) => (
                  <FriendTableRow
                    key={friend.id}
                    friend={friend}
                    className="animate-fadeIn"
                  />
                ))}

              {friends && friends.length === 0 && (
                <TableRow className="animate-fadeIn">
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
