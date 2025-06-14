import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { useFamilyEditor } from "./family-editor-context";

interface FamilyEditorControlsProps {
  onDone: () => void;
}

export function FamilyEditorControls({ onDone }: FamilyEditorControlsProps) {
  const {
    availableFriends,
    familyMembers,
    selectedFriends,
    addSelectedFriends,
    addAllFriends,
    selectedMembers,
    removeSelectedMembers,
    removeAllMembers,
  } = useFamilyEditor();

  return (
    <div className="flex w-full flex-col gap-2 pt-4">
      <div className="flex w-full justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={addSelectedFriends}
          disabled={selectedFriends.length === 0}
        >
          <ChevronRight className="mr-1 h-4 w-4" /> Add Selected
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={addAllFriends}
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
          onClick={removeSelectedMembers}
          disabled={selectedMembers.length === 0}
        >
          <X className="mr-1 h-4 w-4" /> Remove Selected
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={removeAllMembers}
          disabled={familyMembers.length === 0}
        >
          <X className="mr-1 h-4 w-4" /> Remove All
        </Button>
      </div>
      <Button className="mt-2 w-full" onClick={onDone}>
        Done Editing
      </Button>
    </div>
  );
}
