import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit } from "lucide-react";
import { useState } from "react";
import { EditFamilyDisplay } from "./edit-family-display";
import { FamilyEditorControls } from "./family-editor-controls";
import { FamilyMembersDisplay } from "./family-members-display";
import { useFamily } from "./use-family";

interface FamilyManagementCardProps {
  subscriptionName: string;
}

export function FamilyManagementCard({
  subscriptionName,
}: FamilyManagementCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { familyMembers, isAdding, isRemoving } = useFamily();

  return (
    <Card className="border-border/40 shadow-sm py-0">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between py-0">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold">
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
              <Edit className="h-4 w-4" />
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
        {isEditing && (
          <FamilyEditorControls
            onDone={() => setIsEditing(false)}
            isPending={isAdding || isRemoving}
          />
        )}
      </CardFooter>
    </Card>
  );
}
