import type { Friend } from "@/api/types/friend";
import { createContext, useContext, useState, type ReactNode } from "react";

interface FamilyEditorContextType {
  // Data for rendering the lists
  availableFriends: Friend[];
  familyMembers: Friend[];

  // State and handlers for the available friends list
  selectedFriends: string[];
  toggleFriendSelection: (id: string) => void;
  addSelectedFriends: () => void;
  addAllFriends: () => void;

  // State and handlers for the family members list
  selectedMembers: string[];
  toggleMemberSelection: (id: string) => void;
  removeSelectedMembers: () => void;
  removeAllMembers: () => void;
}

const FamilyEditorContext = createContext<FamilyEditorContextType | undefined>(
  undefined
);

interface FamilyEditorProviderProps {
  children: ReactNode;
  availableFriends: Friend[];
  familyMembers: Friend[];
  onAddMembers: (friendIds: string[]) => void;
  onAddAllMembers: () => void;
  onRemoveMembers: (memberIds: string[]) => void;
  onRemoveAllMembers: () => void;
}

export function FamilyEditorProvider({
  children,
  availableFriends,
  familyMembers,
  onAddMembers,
  onAddAllMembers,
  onRemoveMembers,
  onRemoveAllMembers,
}: FamilyEditorProviderProps) {
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

  // Functions that call the parent and clear local state
  function addSelectedFriends() {
    onAddMembers(selectedFriends);
    setSelectedFriends([]);
  }

  function addAllFriends() {
    onAddAllMembers();
  }

  function removeSelectedMembers() {
    onRemoveMembers(selectedMembers);
    setSelectedMembers([]);
  }

  function removeAllMembers() {
    onRemoveAllMembers();
  }

  const value = {
    availableFriends,
    familyMembers,
    selectedFriends,
    toggleFriendSelection,
    addSelectedFriends,
    addAllFriends,
    selectedMembers,
    toggleMemberSelection,
    removeSelectedMembers,
    removeAllMembers,
  };

  return (
    <FamilyEditorContext.Provider value={value}>
      {children}
    </FamilyEditorContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFamilyEditor() {
  const context = useContext(FamilyEditorContext);
  if (context === undefined) {
    throw new Error(
      "useFamilyEditor must be used within a FamilyEditorProvider"
    );
  }
  return context;
}
