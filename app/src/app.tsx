import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { router } from "@/routes";
import { toastOptions } from "@/lib/toast";

import "@/index.css";

export function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster reverseOrder={false} toastOptions={toastOptions} />
    </QueryClientProvider>
  );
}
