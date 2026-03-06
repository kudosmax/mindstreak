import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function getAuthenticatedUser() {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }
  return session.user
}

export function unauthorized() {
  return NextResponse.json(
    { success: false, error: '로그인이 필요합니다.' },
    { status: 401 }
  )
}

export function badRequest(message: string) {
  return NextResponse.json(
    { success: false, error: message },
    { status: 400 }
  )
}

export function success<T>(data: T) {
  return NextResponse.json({ success: true, data })
}

export function serverError(message = '서버 오류가 발생했습니다.') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 500 }
  )
}
