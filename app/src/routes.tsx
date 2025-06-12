import { createBrowserRouter } from "react-router-dom";

// Layouts
import { AppLayout } from "@/pages/_layouts/app";

// Pages
import { FriendsPage } from "@/pages/friends";
import { SubscriptionsPage } from "@/pages/subscriptions";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "friends",
        element: <FriendsPage />,
      },
      {
        path: "subscriptions",
        element: <SubscriptionsPage />,
      },
    ],
  },
]);
