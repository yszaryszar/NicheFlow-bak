'use client'

import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <Image
        src="/logo.svg"
        alt="NicheFlow Logo"
        width={32}
        height={32}
        className="[&>path]:fill-emerald-600"
      />
      <span className="text-xl font-bold text-emerald-600">NicheFlow</span>
    </Link>
  )
}
