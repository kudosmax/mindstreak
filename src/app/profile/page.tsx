'use client'

import { useSession } from 'next-auth/react'
import { useRef, useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { exportToJson, importFromJson } from '@/lib/exportImport'
import { signOut } from 'next-auth/react'
import { apiPatch } from '@/lib/api-client'

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession()
  const store = useAppStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [notifEnabled, setNotifEnabled] = useState(false)
  const [notifSupported, setNotifSupported] = useState(false)

  useEffect(() => {
    setNotifSupported('serviceWorker' in navigator && 'PushManager' in window)
    if ('Notification' in window) {
      setNotifEnabled(Notification.permission === 'granted')
    }
  }, [])

  const handleNotifToggle = async () => {
    if (!notifSupported) return

    if (notifEnabled) {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await sub.unsubscribe()
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
      }
      setNotifEnabled(false)
      return
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    })
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub),
    })
    setNotifEnabled(true)
  }

  const handleExport = () => {
    exportToJson({
      habits: store.habits,
      dailyLogs: store.dailyLogs,
      version: store.version,
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await importFromJson(file)
      store.importData(data)
      alert('데이터를 성공적으로 가져왔어요!')
    } catch (err) {
      alert(err instanceof Error ? err.message : '파일을 불러오지 못했어요.')
    }
    e.target.value = ''
  }

  const handleStartEdit = () => {
    setNameInput(session?.user?.name ?? '')
    setIsEditingName(true)
  }

  const handleSaveName = async () => {
    const trimmed = nameInput.trim()
    if (!trimmed || trimmed === session?.user?.name) {
      setIsEditingName(false)
      return
    }
    setIsSaving(true)
    try {
      await apiPatch('/api/profile', { name: trimmed })
      await updateSession({ name: trimmed })
      setIsEditingName(false)
    } catch {
      alert('닉네임 변경에 실패했어요.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pb-24 pt-12 px-4">
      <div className="max-w-sm mx-auto space-y-6">
        {/* 프로필 카드 */}
        <div className="flex flex-col items-center gap-3 py-6">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt=""
              className="w-20 h-20 rounded-full border-2 border-border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
          )}
          <div className="flex flex-col items-center">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={20}
                  className="text-lg font-semibold text-center bg-muted rounded-lg px-3 py-1.5 w-40 outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName()
                    if (e.key === 'Escape') setIsEditingName(false)
                  }}
                />
                <button
                  onClick={handleSaveName}
                  disabled={isSaving}
                  className="text-sm text-primary font-medium disabled:opacity-50"
                >
                  {isSaving ? '...' : '저장'}
                </button>
              </div>
            ) : (
              <>
                <p className="text-lg font-semibold">
                  {session?.user?.name ?? '사용자'}
                </p>
                <button
                  onClick={handleStartEdit}
                  className="text-xs text-muted-foreground mt-1 hover:text-foreground transition-colors"
                >
                  닉네임 변경
                </button>
              </>
            )}
            {session?.user?.email && (
              <p className="text-sm text-muted-foreground mt-1">
                {session.user.email}
              </p>
            )}
          </div>
        </div>

        {/* 데이터 섹션 */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-muted-foreground">데이터</h2>
          <div className="rounded-2xl border border-border divide-y divide-border overflow-hidden">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition-colors"
            >
              <span className="text-lg">📤</span>
              <div>
                <p className="text-sm font-medium">백업 내보내기</p>
                <p className="text-xs text-muted-foreground">JSON 파일로 저장</p>
              </div>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition-colors"
            >
              <span className="text-lg">📥</span>
              <div>
                <p className="text-sm font-medium">백업 가져오기</p>
                <p className="text-xs text-muted-foreground">JSON 파일에서 복원</p>
              </div>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* 알림 섹션 */}
        {notifSupported && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-muted-foreground">알림</h2>
            <div className="rounded-2xl border border-border overflow-hidden">
              <button
                onClick={handleNotifToggle}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔔</span>
                  <div className="text-left">
                    <p className="text-sm font-medium">매일 저녁 9시 30분 알림</p>
                    <p className="text-xs text-muted-foreground">매일 습관 기록을 알려드려요</p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors ${notifEnabled ? 'bg-primary' : 'bg-muted'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow m-0.5 transition-transform ${notifEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* 계정 섹션 */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-muted-foreground">계정</h2>
          <div className="rounded-2xl border border-border overflow-hidden">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition-colors"
            >
              <span className="text-lg">🚪</span>
              <p className="text-sm font-medium text-destructive">로그아웃</p>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
