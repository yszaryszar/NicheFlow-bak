'use client'

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-white shadow-lg rounded-lg',
            headerTitle: 'text-2xl font-bold text-center',
            headerSubtitle: 'text-gray-600 text-center',
            socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
            formButtonPrimary: 'bg-primary-500 hover:bg-primary-600',
            footerActionLink: 'text-primary-600 hover:text-primary-700',
          },
          layout: {
            socialButtonsPlacement: 'bottom',
            socialButtonsVariant: 'blockButton',
          },
        }}
        signUpUrl="/sign-up"
      />
    </div>
  )
}
