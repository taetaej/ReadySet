// groundSessions.ts — 개인 대화 세션 (프로토타입: localStorage)
// 답은 질문·권한으로 다시 만들 수 있으므로 질문만 저장한다.

import { useSyncExternalStore } from 'react'
import type { GroundSession, Viewer } from './groundTypes'

const KEY = 'ground-sessions-v1'
const listeners = new Set<() => void>()

function read(): GroundSession[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') as GroundSession[] } catch { return [] }
}
let cache: GroundSession[] = read()

function write(next: GroundSession[]) {
  cache = next
  localStorage.setItem(KEY, JSON.stringify(next))
  listeners.forEach(l => l())
}

const titleOf = (q: string) => (q.length > 28 ? `${q.slice(0, 28)}…` : q)

export function createSession(question: string, viewer: Viewer): string {
  const id = `c${Date.now().toString(36)}`
  const now = Date.now()
  write([{ id, title: titleOf(question), viewer, questions: [question], createdAt: now, updatedAt: now }, ...cache])
  return id
}

export function appendQuestion(id: string, question: string) {
  write(cache.map(s => (s.id === id ? { ...s, questions: [...s.questions, question], updatedAt: Date.now() } : s))
    .sort((a, b) => b.updatedAt - a.updatedAt))
}

export function deleteSession(id: string) { write(cache.filter(s => s.id !== id)) }

export const getSession = (id: string) => cache.find(s => s.id === id)

export function useSessions(): GroundSession[] {
  return useSyncExternalStore(
    l => { listeners.add(l); return () => { listeners.delete(l) } },
    () => cache,
    () => cache,
  )
}

/** 상대 시간 (오늘 / 어제 / N일 전) */
export function relDay(ts: number) {
  const d = Math.floor((Date.now() - ts) / 86_400_000)
  return d <= 0 ? '오늘' : d === 1 ? '어제' : `${d}일 전`
}
