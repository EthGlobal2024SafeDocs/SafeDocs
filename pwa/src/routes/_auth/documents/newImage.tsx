import { NewImagePage } from '@/app/Documents/NewImagePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/documents/newImage')({
  component: NewImagePage
})