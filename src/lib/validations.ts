import { z } from 'zod'

export const createHabitSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50),
  emoji: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  energyLevel: z.enum(['high', 'medium', 'low']),
  order: z.number().int().min(0),
  createdAt: z.string(),
})

export const updateHabitSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  emoji: z.string().min(1).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  energyLevel: z.enum(['high', 'medium', 'low']).optional(),
  order: z.number().int().min(0).optional(),
  archivedAt: z.string().nullable().optional(),
})

export const reorderHabitsSchema = z.object({
  orderedIds: z.array(z.string().min(1)),
})

export const upsertDailyLogSchema = z.object({
  energyLevel: z.enum(['high', 'medium', 'low']),
  completedHabitIds: z.array(z.string()),
})

export const toggleHabitSchema = z.object({
  habitId: z.string().min(1),
})

export const importDataSchema = z.object({
  habits: z.array(z.object({
    id: z.string(),
    name: z.string(),
    emoji: z.string(),
    color: z.string(),
    energyLevel: z.enum(['high', 'medium', 'low']),
    order: z.number(),
    createdAt: z.string(),
    archivedAt: z.string().nullable().optional(),
  })),
  dailyLogs: z.record(z.string(), z.object({
    date: z.string(),
    energyLevel: z.enum(['high', 'medium', 'low']),
    completedHabitIds: z.array(z.string()),
    loggedAt: z.string(),
  })),
  version: z.number().optional(),
})
