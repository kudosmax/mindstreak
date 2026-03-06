import type { AppData } from '@/types'

export function exportToJson(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().split('T')[0]
  a.href = url
  a.download = `mindstreak-backup-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importFromJson(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const parsed = JSON.parse(text) as AppData

        if (!parsed.habits || !parsed.dailyLogs) {
          throw new Error('올바른 MindStreak 백업 파일이 아닙니다.')
        }

        resolve({
          habits: Array.isArray(parsed.habits) ? parsed.habits : [],
          dailyLogs: parsed.dailyLogs ?? {},
          version: parsed.version ?? 1,
        })
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'))
    reader.readAsText(file)
  })
}
