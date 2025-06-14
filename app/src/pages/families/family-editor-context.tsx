import type { Friend } from "@/api/types/friend";
import { createContext, useContext, useState, type ReactNode } from "react";

interface FamilyEditorContextType {
  // Dados para renderizar as listas
  availableFriends: Friend[];
  familyMembers: Friend[];

  // Estado e handlers da lista de amigos disponíveis
  selectedFriends: string[];
  toggleFriendSelection: (id: string) => void;
  addSelectedFriends: () => void;
  addAllFriends: () => void;

  // Estado e handlers da lista de membros da família
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

  const toggleFriendSelection = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };
  const toggleMemberSelection = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  // Funções que chamam o pai e limpam o estado local
  const addSelectedFriends = () => {
    onAddMembers(selectedFriends);
    setSelectedFriends([]);
  };
  const addAllFriends = () => {
    onAddAllMembers();
  };
  const removeSelectedMembers = () => {
    onRemoveMembers(selectedMembers);
    setSelectedMembers([]);
  };
  const removeAllMembers = () => {
    onRemoveAllMembers();
  };

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

export function useFamilyEditor() {
  const context = useContext(FamilyEditorContext);
  if (context === undefined) {
    throw new Error(
      "useFamilyEditor must be used within a FamilyEditorProvider"
    );
  }
  return context;
}
