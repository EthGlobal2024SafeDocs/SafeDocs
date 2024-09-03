import LoggedInLayout from "@/app/LoggedInLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: LoggedInLayout,
  beforeLoad: ({ context }) => {
    context.isLoggedIn = true;
  },
  
});
