import NewDocumentPage from '@/app/Documents/NewDocumentPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/documents/new')({
  component: NewDocumentPage
})