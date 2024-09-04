import PublicLayout from "@/app/Layouts/PublicLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: PublicLayout,
  beforeLoad: ({ context }) => {
    if (context.isLoggedIn) {
      console.log('redirect auth uer')
      throw redirect({ to: "/documents" });
    }
  }
});
