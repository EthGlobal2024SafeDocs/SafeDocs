import {
  createRootRouteWithContext} from "@tanstack/react-router";
import PublicLayout from "@/app/PublicLayout";

export interface RouterContext {
  isLoggedIn: boolean;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: PublicLayout
});
