import { useContext } from "react";
import { FamilyContext } from "./family-context";

export function useFamily() {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error("useFamilyManagement must be used within a FamilyProvider");
  }
  return context;
}
