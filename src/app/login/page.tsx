'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🌱</div>
        <h1 className="text-3xl font-bold mb-2">MindStreak</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          에너지에 맞춰 습관을 가꿔나가세요
        </p>
      </div>

      <button
        onClick={() => signIn('kakao', { callbackUrl: '/' })}
        className="w-full max-w-xs flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-colors"
        style={{ backgroundColor: '#FEE500', color: '#191919' }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.44 4.07 3.6 5.17l-.92 3.36c-.08.28.25.5.49.34l4.01-2.65c.27.03.54.04.82.04 4.42 0 8-2.79 8-6.26C17 3.79 13.42 1 9 1z"
            fill="#191919"
          />
        </svg>
        카카오로 시작하기
      </button>

      <p className="text-xs text-muted-foreground mt-8 text-center">
        로그인하면 기기 간 데이터가 동기화됩니다
      </p>
    </div>
  )
}
