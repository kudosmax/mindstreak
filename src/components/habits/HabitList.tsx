'use client'

import { useState } from 'react'
import type { Habit } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import { getActiveHabits } from '@/store/selectors'
import HabitItem from './HabitItem'
import HabitForm from './HabitForm'
import BottomSheet from '@/components/shared/BottomSheet'

export default function HabitList() {
  const habits = useAppStore((s) => s.habits)
  const addHabit = useAppStore((s) => s.addHabit)
  const updateHabit = useAppStore((s) => s.updateHabit)
  const archiveHabit = useAppStore((s) => s.archiveHabit)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)

  const active = getActiveHabits(habits)

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">내 습관</h2>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
        >
          <span className="text-lg leading-none">+</span>
          <span>추가</span>
        </button>
      </div>

      {active.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4">🌱</div>
          <p className="font-semibold text-base mb-1">아직 습관이 없어요</p>
          <p className="text-sm text-muted-foreground mb-6">
            첫 번째 습관을 추가해 시작해 보세요
          </p>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
          >
            습관 추가하기
          </button>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {active.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onEdit={setEditingHabit}
              onArchive={archiveHabit}
            />
          ))}
        </div>
      )}

      {/* Add Bottom Sheet */}
      <BottomSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="습관 추가"
      >
        <HabitForm
          onSubmit={(data) => {
            addHabit(data)
            setIsAddOpen(false)
          }}
          onCancel={() => setIsAddOpen(false)}
        />
      </BottomSheet>

      {/* Edit Bottom Sheet */}
      <BottomSheet
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        title="습관 수정"
      >
        {editingHabit && (
          <HabitForm
            initial={editingHabit}
            onSubmit={(data) => {
              updateHabit(editingHabit.id, data)
              setEditingHabit(null)
            }}
            onCancel={() => setEditingHabit(null)}
          />
        )}
      </BottomSheet>
    </>
  )
}
