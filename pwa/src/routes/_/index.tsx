
import { HomePage } from '@/app/Home/HomePage'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('//')({
  component: HomePage,
  beforeLoad: ({ context }) => {
    if (context.isLoggedIn) {
      console.log('redirect auth uer')
      throw redirect({ to: "/documents" });
    }
  }
})