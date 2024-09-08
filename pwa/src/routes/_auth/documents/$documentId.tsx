import { createFileRoute } from "@tanstack/react-router";
import { DocumentPage } from "@/app/Documents/DocumentPage";

export const Route = createFileRoute("/_auth/documents/$documentId")({
  component: DocumentPage,
});
