import { createRootRouteWithContext } from "@tanstack/react-router";

export interface RouterContext {
  isLoggedIn: boolean;
  token?: string;
  login: (token:string) => Promise<void>;

}

export const Route = createRootRouteWithContext<RouterContext>()({});
