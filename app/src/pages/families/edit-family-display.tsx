import type { Friend } from "@/api/types/friend";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EditFamilyDisplayProps {
  availableFriends: Friend[];
  familyMembers: Friend[];
}

export function EditFamilyDisplay({
  availableFriends,
  familyMembers,
}: EditFamilyDisplayProps) {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  function toggleFriendSelection(id: string) {
    setSelectedFriends((prev) =>
      prev.includes(id)
        ? prev.filter((friendId) => friendId !== id)
        : [...prev, id]
    );
  }

  function toggleMemberSelection(id: string) {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  }

  function selectAllFriends() {
    setSelectedFriends(availableFriends.map((friend) => friend.id));
  }

  function selectAllMembers() {
    setSelectedMembers(familyMembers.map((member) => member.id));
  }

  function clearFriendSelection() {
    setSelectedFriends([]);
  }

  function clearMemberSelection() {
    setSelectedMembers([]);
  }

  const filteredFriends = availableFriends.filter(
    (friend) => !familyMembers.some((member) => member.id === friend.id)
  );

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Available Friends</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={selectAllFriends}
                disabled={availableFriends.length === 0}
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={clearFriendSelection}
                disabled={selectedFriends.length === 0}
              >
                Clear
              </Button>
            </div>
          </div>
          <Card className="border-dashed py-0">
            <ScrollArea className="h-[200px]">
              {filteredFriends.length > 0 && (
                <ul className="divide-y">
                  {filteredFriends.map((friend) => (
                    <li
                      key={friend.id}
                      className={cn(
                        "flex items-center justify-between p-2 hover:bg-muted/50",
                        selectedFriends.includes(friend.id) && "bg-muted/50"
                      )}
                    >
                      <div className="flex items-center">
                        <Checkbox
                          checked={selectedFriends.includes(friend.id)}
                          onCheckedChange={() =>
                            toggleFriendSelection(friend.id)
                          }
                          className="mr-2"
                        />
                        <span>{friend.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {friend.email}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {availableFriends.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No available friends to add.
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Family Members</h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={selectAllMembers}
                disabled={familyMembers.length === 0}
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={clearMemberSelection}
                disabled={selectedMembers.length === 0}
              >
                Clear
              </Button>
            </div>
          </div>
          <Card className="border-dashed py-0">
            <ScrollArea className="h-[200px]">
              {familyMembers.length > 0 && (
                <ul className="divide-y">
                  {familyMembers.map((member) => (
                    <li
                      key={member.id}
                      className={cn(
                        "flex items-center justify-between p-2 hover:bg-muted/50",
                        selectedMembers.includes(member.id) && "bg-muted/50"
                      )}
                    >
                      <div className="flex items-center">
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() =>
                            toggleMemberSelection(member.id)
                          }
                          className="mr-2"
                        />
                        <span>{member.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {member.email}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {familyMembers.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No family members.
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </>
  );
}
