'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

const TABS = [
  { href: '/', label: '오늘', icon: '☀️' },
  { href: '/calendar', label: '캘린더', icon: '📅' },
  { href: '/habits', label: '습관', icon: '🌱' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (pathname === '/login') return null

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
      <div className="flex">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          )
        })}
        {(() => {
          const isProfileActive = pathname === '/profile'
          return (
            <Link
              href="/profile"
              className={`flex-none flex flex-col items-center py-3 gap-0.5 px-3 transition-colors ${
                isProfileActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-current={isProfileActive ? 'page' : undefined}
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <span className="text-xl leading-none">👤</span>
              )}
              <span className="text-xs font-medium">나</span>
            </Link>
          )
        })()}
      </div>
      <div className="h-safe-area-inset-bottom" />
    </nav>
  )
}
