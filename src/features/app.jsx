import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";

import Gateway from "@/features/gateway";
import Orders from "@/features/orders";
import Summaries from "@/features/summaries";
import Auth from "@/features/auth";

const router = createHashRouter([
  { path: "/", element: <Gateway /> },
  { path: "/auth", element: <Auth /> },
  { path: "/orders", element: <Orders /> },
  { path: "/summaries", element: <Summaries /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <main className="min-h-screen bg-background font-sans antialiased no-select">
      <RouterProvider router={router} />
      <Toaster />
    </main>
  </React.StrictMode>
);
