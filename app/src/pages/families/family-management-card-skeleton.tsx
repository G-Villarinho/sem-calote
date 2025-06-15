import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export function FamilyManagementCardSkeleton() {
  return (
    <Card className="border-border/40 shadow-sm py-0 animate-fadeIn">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between py-3">
          <div className="flex-1">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Card className="py-0">
              <div className="h-[200px] p-2 space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2"
                  >
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-4 rounded mr-2" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-3 w-36" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
