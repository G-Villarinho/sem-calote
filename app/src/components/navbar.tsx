import { Users, CreditCard, Menu, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import logo from "@/assets/images/logo.png";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 md:px-20 lg:px-16 xl:36 flex h-16 items-center justify-between">
        <div className="flex items-center gap-x-6">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="logo do app ícone de símbolo de dólar em estilo minimalista, representando o tema de dinheiro e economia."
              className="h-8 w-8 sm:h-10 sm:w-10"
            />
            <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-white/50 to-white bg-clip-text text-transparent">
              Sem Calote
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-x-1">
            <div className="h-6 w-px bg-border" />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/friends" className="flex items-center gap-x-2">
                <Users className="size-4" />
                <span>Friends</span>
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/subscriptions" className="flex items-center gap-x-2">
                <CreditCard className="size-4" />
                <span>Subscription</span>
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/families" className="flex items-center gap-x-2">
                <Home className="size-4" />
                <span>Families</span>
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
