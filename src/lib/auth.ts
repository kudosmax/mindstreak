import NextAuth from 'next-auth'
import Kakao from 'next-auth/providers/kakao'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { getDb } from '@/lib/db'

function createAuthInstance() {
  return NextAuth({
    adapter: DrizzleAdapter(getDb()),
    providers: [
      Kakao({
        clientId: process.env.KAKAO_CLIENT_ID!,
        clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      }),
    ],
    session: { strategy: 'database' },
    pages: {
      signIn: '/login',
    },
    callbacks: {
      session({ session, user }) {
        return {
          ...session,
          user: { ...session.user, id: user.id },
        }
      },
    },
  })
}

type AuthInstance = ReturnType<typeof createAuthInstance>

let _instance: AuthInstance | null = null

function getAuthInstance(): AuthInstance {
  if (!_instance) {
    _instance = createAuthInstance()
  }
  return _instance
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth: AuthInstance['auth'] = ((...args: any[]) =>
  (getAuthInstance().auth as any)(...args)) as AuthInstance['auth']

export const handlers = {
  GET: (...args: Parameters<AuthInstance['handlers']['GET']>) =>
    getAuthInstance().handlers.GET(...args),
  POST: (...args: Parameters<AuthInstance['handlers']['POST']>) =>
    getAuthInstance().handlers.POST(...args),
}

export const signIn: AuthInstance['signIn'] = ((...args: any[]) =>
  (getAuthInstance().signIn as any)(...args)) as AuthInstance['signIn']

export const signOut: AuthInstance['signOut'] = ((...args: any[]) =>
  (getAuthInstance().signOut as any)(...args)) as AuthInstance['signOut']
