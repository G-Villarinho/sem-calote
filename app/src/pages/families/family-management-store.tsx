import type { Friend } from "@/api/types/friend";
import { create } from "zustand";

interface FamilyManagementState {
  // State
  familyMembers: Friend[];
  selectedFriends: string[];
  selectedMembers: string[];

  // Actions
  setFamilyMembers: (members: Friend[]) => void;
  addFamilyMembers: (newMembers: Friend[]) => void;
  removeFamilyMembers: (memberIds: string[]) => void;
  toggleFriendSelection: (id: string) => void;
  toggleMemberSelection: (id: string) => void;
  clearSelections: () => void;
}

export const useFamilyStore = create<FamilyManagementState>((set) => ({
  // Initial state
  familyMembers: [],
  selectedFriends: [],
  selectedMembers: [],

  // Actions that modify the state
  setFamilyMembers: (members) => set({ familyMembers: members }),

  addFamilyMembers: (newMembers) =>
    set((state) => ({
      familyMembers: [...state.familyMembers, ...newMembers],
    })),

  removeFamilyMembers: (memberIds) =>
    set((state) => ({
      familyMembers: state.familyMembers.filter(
        (m) => !memberIds.includes(m.id)
      ),
    })),

  toggleFriendSelection: (id) =>
    set((state) => ({
      selectedFriends: state.selectedFriends.includes(id)
        ? state.selectedFriends.filter((fId) => fId !== id)
        : [...state.selectedFriends, id],
    })),

  toggleMemberSelection: (id) =>
    set((state) => ({
      selectedMembers: state.selectedMembers.includes(id)
        ? state.selectedMembers.filter((mId) => mId !== id)
        : [...state.selectedMembers, id],
    })),

  clearSelections: () => set({ selectedFriends: [], selectedMembers: [] }),
}));
