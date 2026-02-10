import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// SlotBoard 버전 사용
import { SlotBoardLayout } from './components/WorkspaceLayout'
import { CreateScenario } from './components/CreateScenario'
import { SplashCursor } from './components/common/SplashCursor'

function App() {
  console.log('App 컴포넌트 렌더링됨 - SlotBoardLayout 사용')
  return (
    <BrowserRouter>
      <SplashCursor />
      <Routes>
        <Route path="/" element={<SlotBoardLayout />} />
        <Route path="/slotboard" element={<SlotBoardLayout />} />
        <Route path="/reachcaster" element={<SlotBoardLayout initialView="slotDetail" />} />
        <Route path="/reachcaster/scenario/new" element={<CreateScenario />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App