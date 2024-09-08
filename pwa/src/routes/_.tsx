import PublicLayout from "@/app/Layouts/PublicLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: PublicLayout,
  beforeLoad: ({ context }) => {
    console.log("route _ ", context.token);
    if (context.token) {
      throw redirect({ to: "/documents" });
    }
  }
});
