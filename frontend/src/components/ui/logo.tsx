'use client'

import Link from 'next/link'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M16 2C23.732 2 30 8.268 30 16C30 23.732 23.732 30 16 30C8.268 30 2 23.732 2 16C2 8.268 8.268 2 16 2ZM16 6C10.477 6 6 10.477 6 16C6 21.523 10.477 26 16 26C21.523 26 26 21.523 26 16C26 10.477 21.523 6 16 6ZM20.5 11.5L23 14L16 21L9 14L11.5 11.5L16 16L20.5 11.5Z"
          fill="currentColor"
        />
      </svg>
      <span className="text-xl font-bold text-primary">NicheFlow</span>
    </Link>
  )
}
