import { Button } from "@/components/ui/button";
import { ChevronRight, X, Loader2 } from "lucide-react";
import type { Friend } from "@/api/types/friend";

interface FamilyEditorControlsProps {
  onDone: () => void;
  availableFriends: Friend[];
  familyMembers: Friend[];
  selectedFriends: string[];
  selectedMembers: string[];
  addMembers: (friendIds: string[]) => void;
  removeMembers: (memberIds: string[]) => void;
  isPending: boolean;
}

export function FamilyEditorControls({
  onDone,
  availableFriends,
  familyMembers,
  selectedFriends,
  selectedMembers,
  addMembers,
  removeMembers,
  isPending,
}: FamilyEditorControlsProps) {
  const handleAddAll = () => {
    const allFriendIds = availableFriends.map((f) => f.id);
    addMembers(allFriendIds);
  };

  const handleRemoveAll = () => {
    const allMemberIds = familyMembers.map((m) => m.id);
    removeMembers(allMemberIds);
  };

  return (
    <div className="flex w-full flex-col gap-2 pt-4">
      <div className="flex w-full justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => addMembers(selectedFriends)}
          disabled={selectedFriends.length === 0 || isPending}
        >
          <ChevronRight className="mr-1 h-4 w-4" /> Add Selected
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleAddAll}
          disabled={availableFriends.length === 0 || isPending}
        >
          <ChevronRight className="mr-1 h-4 w-4" /> Add All
        </Button>
      </div>
      <div className="flex w-full justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => removeMembers(selectedMembers)}
          disabled={selectedMembers.length === 0 || isPending}
        >
          <X className="mr-1 h-4 w-4" /> Remove Selected
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleRemoveAll}
          disabled={familyMembers.length === 0 || isPending}
        >
          <X className="mr-1 h-4 w-4" /> Remove All
        </Button>
      </div>
      <Button className="mt-2 w-full" onClick={onDone} disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Done Editing"
        )}
      </Button>
    </div>
  );
}
