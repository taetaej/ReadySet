import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// ReachCaster 컴포넌트
import { SlotBoardLayout } from './components/reachcaster/WorkspaceLayout'
import { CreateScenario } from './components/reachcaster/CreateScenario'
import { RatioFinderResult } from './components/reachcaster/RatioFinderResult'
import { ReachPredictorResult } from './components/reachcaster/ReachPredictorResult'
import { SplashCursor } from './components/common/SplashCursor'
// DataShot 컴포넌트
import { DatasetList, CreateDataset, DatasetDetail } from './components/datashot'

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
        <Route path="/reachcaster/scenario/ratio-finder/result" element={<RatioFinderResult />} />
        <Route path="/reachcaster/scenario/reach-predictor/result" element={<ReachPredictorResult />} />
        <Route path="/datashot" element={<DatasetList />} />
        <Route path="/datashot/new" element={<CreateDataset />} />
        <Route path="/datashot/:id" element={<DatasetDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App