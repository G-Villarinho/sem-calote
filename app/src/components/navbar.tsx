import { Users, CreditCard, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-40 flex h-16 items-center justify-between">
        <div className="flex items-center gap-x-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <span className="text-sm font-bold text-white">SC</span>
            </div>
            <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-white/50 to-white bg-clip-text text-transparent">
              Sem Calote
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/friends" className="flex items-center gap-x-2">
                <Users className="size-4" />
                <span>Friends</span>
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/subscription" className="flex items-center gap-x-2">
                <CreditCard className="size-4" />
                <span>Subscription</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
