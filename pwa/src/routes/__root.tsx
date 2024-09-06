import { createRootRouteWithContext } from "@tanstack/react-router";

export interface RouterContext {
  token?: string;
  login: (token: string, expiresIn: number) => Promise<void>;
  logout: () => Promise<void>;
}

export const Route = createRootRouteWithContext<RouterContext>()({});
