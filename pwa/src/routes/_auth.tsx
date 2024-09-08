import LoggedInLayout from "@/app/Layouts/LoggedInLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: LoggedInLayout,
  beforeLoad: ({ context }) => {
    if (!context.token) {
      throw redirect({ to: "/" });
    }
  }
});
