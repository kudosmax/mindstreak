'use client'

import { useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { exportToJson, importFromJson } from '@/lib/exportImport'

export default function SettingsSection() {
  const store = useAppStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    exportToJson({
      habits: store.habits,
      dailyLogs: store.dailyLogs,
      version: store.version,
    })
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
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

  return (
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
          onClick={handleImportClick}
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
  )
}
