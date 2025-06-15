import { SelectableListColumn } from "./selectable-list-cloumn";
import { useFamily } from "./use-family";

export function EditFamilyDisplay() {
  const {
    availableFriends,
    familyMembers,
    selectedFriends,
    toggleFriendSelection,
    selectedMembers,
    toggleMemberSelection,
  } = useFamily();

  const filteredFriends = availableFriends.filter(
    (friend) => !familyMembers.some((member) => member.id === friend.id)
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SelectableListColumn
        title="Available Friends"
        items={filteredFriends}
        selectedItems={selectedFriends}
        onToggleSelection={toggleFriendSelection}
        emptyListMessage="No available friends to add."
      />

      <SelectableListColumn
        title="Family Members"
        items={familyMembers}
        selectedItems={selectedMembers}
        onToggleSelection={toggleMemberSelection}
        emptyListMessage="No family members added yet."
      />
    </div>
  );
}
