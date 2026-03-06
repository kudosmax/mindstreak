'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export default function HydrateStore() {
  const hydrate = useAppStore((s) => s.hydrate)
  const isHydrated = useAppStore((s) => s.isHydrated)

  useEffect(() => {
    if (!isHydrated) {
      hydrate()
    }
  }, [hydrate, isHydrated])

  return null
}
