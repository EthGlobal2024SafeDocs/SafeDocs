import { createFileRoute, redirect } from '@tanstack/react-router'
import { DocumentPage } from '@/app/Documents/DocumentPage'
import { GetDocument } from '@/services/api';

export const Route = createFileRoute('/_auth/documents/$documentId')({
  component: DocumentPage,
  beforeLoad: async ({ context, params }) => {
    //const token = context.token;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmQ4YmNhYTI0NjE2Y2IzMGUyMjAyNjQiLCJlbWFpbCI6InRlc3QxQGVtYWlsLmNvbSIsImlhdCI6MTcyNTYxNzI2NSwiZXhwIjoxNzI1NjIwODY1fQ.be9cDwSG80O0f4urGGgtyxsrQUAdwUaSnSgebuA9KUs";
    const documentId = params.documentId;

    // Check if this document is owned by the auth user or exists at all
    try {
      const document = await GetDocument(token!, documentId);

      console.log(document);
    } catch {
      // Caught error and hence we know document doesnt' exist --> redirect
      console.log('redirect auth uer')
      throw redirect({ to: "/documents" });
    }
  }
})