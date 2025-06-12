import { createBrowserRouter } from "react-router-dom";

// Layouts
import { AppLayout } from "@/pages/_layouts/app";

// Pages
import { FriendsPage } from "@/pages/friends";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "friends",
        element: <FriendsPage />,
      },
    ],
  },
]);
