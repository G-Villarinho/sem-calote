import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";

export function FamilyEditorControls() {
  return (
    <>
      <div className="flex w-full justify-center gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <ChevronRight className="mr-1 h-4 w-4" />
          Add Selected
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <ChevronRight className="mr-1 h-4 w-4" />
          Add All
        </Button>
      </div>
      <div className="flex w-full justify-center gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <X className="mr-1 h-4 w-4" />
          Remove Selected
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <X className="mr-1 h-4 w-4" />
          Remove All
        </Button>
      </div>
      <Button className="mt-2 w-full">Done Editing</Button>
    </>
  );
}
