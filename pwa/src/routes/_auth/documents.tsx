import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/documents')({
  component: () => <div>Hello /(auth)/documents!</div>
})