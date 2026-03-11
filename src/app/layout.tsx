import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import BottomNav from '@/components/layout/BottomNav'
import HydrateStore from '@/components/layout/HydrateStore'
import RegisterSW from '@/components/layout/RegisterSW'

const geist = Geist({ subsets: ['latin'] })

export const viewport: Viewport = {
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'MindStreak',
  description: '에너지 레벨에 맞는 습관 streak 앱',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MindStreak',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body className={geist.className}>
        <SessionProvider>
          <HydrateStore />
          <RegisterSW />
          <div className="min-h-screen bg-background">
            <main className="mx-auto max-w-sm min-h-screen pb-24">
              {children}
            </main>
            <BottomNav />
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
