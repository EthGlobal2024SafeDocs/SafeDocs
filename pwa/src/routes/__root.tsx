import { User } from "@/services/db";
import { createRootRouteWithContext } from "@tanstack/react-router";

export interface RouterContext {
  token?: string;
  userId?: number;
  userEmail?:string;
  login: (user: User, token: string, expiresIn: number) => Promise<void>;
  logout: () => Promise<void>;
}

export const Route = createRootRouteWithContext<RouterContext>()({});
