import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Friend } from "@/api/types/friend";

interface FriendsDisplayProps {
  friends: Friend[];
}

export function FriendsDisplay({ friends }: FriendsDisplayProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Family Members</h3>
      <Card className="border-dashed py-0">
        <ScrollArea className="h-[200px]">
          {friends.length > 0 && (
            <ul className="divide-y">
              {friends.map((friend) => (
                <li
                  key={friend.id}
                  className="flex items-center justify-between p-2"
                >
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{friend.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {friend.email}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {friends.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No family members added yet.
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}
