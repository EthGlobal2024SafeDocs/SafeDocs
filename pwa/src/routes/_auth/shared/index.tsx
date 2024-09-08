import { ShareListPage } from '@/app/Shared/ShareListPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/shared/')({
  component: ShareListPage
})