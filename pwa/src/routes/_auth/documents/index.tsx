import { DocumentsPage } from '@/app/Documents/DocumentsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/documents/')({
  component: DocumentsPage,
  beforeLoad: async ({ context }) => {
    console.log(context);
  }
})