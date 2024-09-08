import { DocumentsPage } from "@/app/Documents/DocumentListPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/documents/")({
  component: DocumentsPage
});
