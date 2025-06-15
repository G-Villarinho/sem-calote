import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Friend } from "@/api/types/friend";

interface SelectableListColumnProps {
  title: string;
  items: Friend[];
  selectedItems: string[];
  onToggleSelection: (id: string) => void;
  emptyListMessage: string;
}

export function SelectableListColumn({
  title,
  items,
  selectedItems,
  onToggleSelection,
  emptyListMessage,
}: SelectableListColumnProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <Card className="border-dashed py-0">
        <ScrollArea className="h-[200px]">
          {items.length > 0 && (
            <ul className="divide-y">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between p-2 hover:bg-muted/50",
                    selectedItems.includes(item.id) && "bg-muted/50"
                  )}
                >
                  <div className="flex flex-1 items-center min-w-0">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => onToggleSelection(item.id)}
                      className="mr-2"
                    />
                    <span className="truncate text-xs" title={item.name}>
                      {item.name}
                    </span>
                  </div>

                  <span
                    className="ml-4 flex-shrink-0 text-xs text-muted-foreground"
                    title={item.email}
                  >
                    {item.email}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {items.length === 0 && (
            <p className="p-4 text-center text-sm text-muted-foreground">
              {emptyListMessage}
            </p>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}
