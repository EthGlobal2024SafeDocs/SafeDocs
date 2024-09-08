import { SharedPage } from '@/app/Shared/SharedPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/shared/$attestationId')({
  component: SharedPage
})