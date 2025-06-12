import { Navbar } from "@/components/navbar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-12">
        <Outlet />
      </main>
    </div>
  );
}
