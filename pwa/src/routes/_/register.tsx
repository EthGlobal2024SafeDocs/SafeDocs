import { createFileRoute, redirect } from '@tanstack/react-router'
import { RegisterPage } from '@/app/Home/RegisterPage'

export const Route = createFileRoute('//register')({
  component: RegisterPage,
  beforeLoad: ({ context }) => {
    if (context.isLoggedIn) {
      console.log('redirect auth uer')
      throw redirect({ to: "/documents" });
    }
  }
})