import { type LucideIcon } from "lucide-react";

interface HeadingProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

export function Heading({
  title,
  description,
  icon: Icon,
  children,
}: HeadingProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-x-3">
        <div className="p-3 rounded-lg bg-accent border border-primary/50">
          <Icon className="w-8 h-8 text-primary" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
