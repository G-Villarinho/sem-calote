import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Friend } from "@/api/types/friend";

interface EditFamilyDisplayProps {
  availableFriends: Friend[];
  familyMembers: Friend[];
  selectedFriends: string[];
  toggleFriendSelection: (id: string) => void;
  selectedMembers: string[];
  toggleMemberSelection: (id: string) => void;
}

export function EditFamilyDisplay({
  availableFriends,
  familyMembers,
  selectedFriends,
  toggleFriendSelection,
  selectedMembers,
  toggleMemberSelection,
}: EditFamilyDisplayProps) {
  const filteredFriends = availableFriends.filter(
    (friend) => !familyMembers.some((member) => member.id === friend.id)
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Available Friends</h3>
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
                        onCheckedChange={() => toggleFriendSelection(friend.id)}
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
            {filteredFriends.length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No available friends to add.
              </p>
            )}
          </ScrollArea>
        </Card>
      </div>

      {/* Coluna de Membros */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Family Members</h3>
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
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => toggleMemberSelection(member.id)}
                    />
                    <span>{member.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {familyMembers.length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No family members added yet.
              </p>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
