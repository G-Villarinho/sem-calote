import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, House, X } from "lucide-react";
import { useState } from "react";
import { EditFamilyDisplay } from "./edit-family-display";
import { FamilyEditorControls } from "./family-editor-controls";
import { FamilyMembersDisplay } from "./family-members-display";
import { useFamily } from "./use-family";
import { cn } from "@/lib/utils";

interface FamilyManagementCardProps {
  subscriptionName: string;
}

export function FamilyManagementCard({
  subscriptionName,
}: FamilyManagementCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { familyMembers } = useFamily();

  return (
    <Card className="border-border/40 shadow-sm py-0 animate-fadeIn">
      <CardHeader className="bg-muted/50 ">
        <div className="flex items-center justify-between py-3">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold items-center flex">
              <House className="inline h-5 w-5 mr-2" />
              {subscriptionName}'s Family
            </CardTitle>
            <CardDescription>
              {familyMembers?.length} member
              {familyMembers?.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit
                className={cn(
                  "absolute h-4 w-4 transition-all duration-300",
                  isEditing
                    ? "rotate-45 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                )}
              />

              <X
                className={cn(
                  "absolute h-4 w-4 transition-all duration-300",
                  isEditing
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-45 scale-0 opacity-0"
                )}
              />
              <span className="sr-only">Edit</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        {isEditing && <EditFamilyDisplay />}

        {!isEditing && <FamilyMembersDisplay friends={familyMembers} />}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4 pt-0">
        {isEditing && <FamilyEditorControls />}
      </CardFooter>
    </Card>
  );
}
