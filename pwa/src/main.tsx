import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRouter } from "@tanstack/react-router";

import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import AuthProvider from "./providers/auth-provider";
import QueryProvider from "./providers/query-provider";
import CookieProvider from "./providers/cookie-provider";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    isLoggedIn: undefined!,
    login: undefined!,
    token: undefined!
  }
});

export type RouterType = typeof router;
// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <CookieProvider>
        <QueryProvider>
          <AuthProvider router={router} />
        </QueryProvider>
      </CookieProvider>
    </StrictMode>
  );
}
