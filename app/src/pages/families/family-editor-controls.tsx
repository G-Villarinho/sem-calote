import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { useFamily } from "./use-family";

export function FamilyEditorControls() {
  const {
    availableFriends,
    familyMembers,
    selectedFriends,
    selectedMembers,
    handleAddMember,
    handleRemoveMember,
  } = useFamily();

  function handleAddAll() {
    const allFriendIds = availableFriends.map((f) => f.id);
    handleAddMember(allFriendIds);
  }

  function handleRemoveAll() {
    const allMemberIds = familyMembers.map((m) => m.id);
    handleRemoveMember(allMemberIds);
  }

  return (
    <div className="flex w-full flex-col gap-2 pt-4 animate-fadeIn">
      <div className="flex w-full justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => handleAddMember(selectedFriends)}
          disabled={selectedFriends.length === 0}
        >
          <ChevronRight className="mr-1 h-4 w-4" /> Add Selected
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleAddAll}
          disabled={availableFriends.length === 0}
        >
          <ChevronRight className="mr-1 h-4 w-4" /> Add All
        </Button>
      </div>
      <div className="flex w-full justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => handleRemoveMember(selectedMembers)}
          disabled={selectedMembers.length === 0}
        >
          <X className="mr-1 h-4 w-4" /> Remove Selected
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleRemoveAll}
          disabled={familyMembers.length === 0}
        >
          <X className="mr-1 h-4 w-4" /> Remove All
        </Button>
      </div>
    </div>
  );
}
