// useViewer.ts — 프로토타입 권한 시뮬레이션 상태. 여러 컴포넌트가 같은 값을 구독한다.

import { useSyncExternalStore } from 'react'
import type { Viewer } from './groundTypes'

const KEY = 'ground-viewer'
const listeners = new Set<() => void>()

let current: Viewer =
  typeof window !== 'undefined' && sessionStorage.getItem(KEY) === 'external' ? 'external' : 'internal'

function setViewer(v: Viewer) {
  current = v
  sessionStorage.setItem(KEY, v)
  listeners.forEach(l => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

export function useViewer(): [Viewer, (v: Viewer) => void] {
  const v = useSyncExternalStore(subscribe, () => current, () => current)
  return [v, setViewer]
}
