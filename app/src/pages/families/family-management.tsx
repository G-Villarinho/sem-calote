import type { Friend } from "@/api/types/friend";
import type { Subscription } from "@/api/types/subscription";
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
import { FriendsDisplay } from "./friends-display";
import { EditFamilyDisplay } from "./edit-family-display";
import { FamilyEditorControls } from "./family-editor-controls";

interface FamilyManagementProps {
  availableFriends: Friend[];
  subscription: Subscription;
}

export function FamilyManagement({
  availableFriends,
  subscription,
}: FamilyManagementProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold">
              {subscription.name}'s Family
            </CardTitle>
            <CardDescription>
              {subscription.friends?.length} member
              {subscription.friends?.length !== 1 ? "s" : ""}
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
        {!isEditing && <FriendsDisplay friends={subscription.friends || []} />}
        {isEditing && (
          <EditFamilyDisplay
            availableFriends={availableFriends}
            familyMembers={subscription.friends || []}
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4 pt-0">
        {isEditing && <FamilyEditorControls />}
      </CardFooter>
    </Card>
  );
}
