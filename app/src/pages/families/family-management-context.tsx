import { createContext, useContext, type ReactNode, useState } from "react";
import type { Friend } from "@/api/types/friend";

interface FamilyManagementContextType {
  familyMembers: Friend[];
  selectedFriends: string[];
  selectedMembers: string[];
  setFamilyMembers: (members: Friend[]) => void;
  addFamilyMembers: (newMembers: Friend[]) => void;
  removeFamilyMembers: (memberIds: string[]) => void;
  toggleFriendSelection: (id: string) => void;
  toggleMemberSelection: (id: string) => void;
  clearSelections: () => void;
}

const FamilyManagementContext =
  createContext<FamilyManagementContextType | null>(null);

export function useFamilyManagement() {
  const context = useContext(FamilyManagementContext);
  if (!context) {
    throw new Error(
      "useFamilyManagement must be used within a FamilyManagementProvider"
    );
  }
  return context;
}

interface FamilyManagementProviderProps {
  initialFamilyMembers: Friend[];
  children: ReactNode;
}

export function FamilyManagementProvider({
  initialFamilyMembers,
  children,
}: FamilyManagementProviderProps) {
  const [familyMembers, setFamilyMembers] =
    useState<Friend[]>(initialFamilyMembers);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const addFamilyMembers = (newMembers: Friend[]) => {
    setFamilyMembers((prev) => [...prev, ...newMembers]);
  };

  const removeFamilyMembers = (memberIds: string[]) => {
    setFamilyMembers((prev) =>
      prev.filter((member) => !memberIds.includes(member.id))
    );
  };

  const toggleFriendSelection = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id)
        ? prev.filter((friendId) => friendId !== id)
        : [...prev, id]
    );
  };

  const toggleMemberSelection = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  const clearSelections = () => {
    setSelectedFriends([]);
    setSelectedMembers([]);
  };

  const value = {
    familyMembers,
    selectedFriends,
    selectedMembers,
    setFamilyMembers,
    addFamilyMembers,
    removeFamilyMembers,
    toggleFriendSelection,
    toggleMemberSelection,
    clearSelections,
  };

  return (
    <FamilyManagementContext.Provider value={value}>
      {children}
    </FamilyManagementContext.Provider>
  );
}
