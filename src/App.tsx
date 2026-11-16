import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
// ReachCaster 컴포넌트
import { SlotBoardLayout } from './components/reachcaster/WorkspaceLayout'
import { SlotHome } from './components/reachcaster/SlotHome'
import { CreateScenario } from './components/reachcaster/CreateScenario'
import { RatioFinderResult } from './components/reachcaster/RatioFinderResult'
import { ReachPredictorResult } from './components/reachcaster/ReachPredictorResult'
import { SplashCursor } from './components/common/SplashCursor'
// DataShot 컴포넌트
import { DatasetList, CreateDataset } from './components/datashot'
import { DatasetDetailRouter } from './components/datashot/DatasetDetailRouter'
// Budget Optimizer 컴포넌트
import { BOScenarioListPage } from './components/budgetoptimizer/BOScenarioListPage'
import { BOCreateScenario } from './components/budgetoptimizer/BOCreateScenario'
import { BOResult } from './components/budgetoptimizer/BOResult'
// WithSet (가칭) — Slot 비종속 독립 공간
import { GroundHome, GroundChat, GroundLibrary, LibraryDetail, GroundFlowList, GroundFlowEditor, GroundArtifacts, ArtifactDetail, GroundSkills, SkillDetail, GroundTools } from './components/ground'
// Component Library
import { ComponentLibrary } from './components/component-library'
// Error Page
import { ErrorPage } from './components/ErrorPage'
// Maintenance Page
import { MaintenancePage } from './components/MaintenancePage'
// Access Log
import { AccessLog } from './components/layout/AccessLog'
// Docs
import { DocsLayout } from './components/docs'
import './components/docs/docs.css'

function App() {
  console.log('App 컴포넌트 렌더링됨 - SlotBoardLayout 사용')
  return (
    <BrowserRouter>
      <SplashCursor />
      <Routes>
        <Route path="/" element={<SlotBoardLayout />} />
        <Route path="/slotboard" element={<SlotBoardLayout />} />
        <Route path="/slot/:slotId" element={<SlotHome />} />
        <Route path="/reachcaster" element={<SlotBoardLayout initialView="slotDetail" />} />
        <Route path="/reachcaster/scenario/new" element={<CreateScenario />} />
        <Route path="/reachcaster/scenario/ratio-finder/result" element={<RatioFinderResult />} />
        <Route path="/reachcaster/scenario/reach-predictor/result" element={<ReachPredictorResult />} />
        <Route path="/datashot" element={<DatasetList />} />
        <Route path="/datashot/new" element={<CreateDataset />} />
        <Route path="/datashot/:id" element={<DatasetDetailRouter />} />
        <Route path="/budgetopt" element={<BOScenarioListPage />} />
        <Route path="/budgetopt/scenario/new" element={<BOCreateScenario />} />
        <Route path="/budgetopt/scenario/:id/result" element={<BOResult />} />
        <Route path="/withset" element={<GroundHome />} />
        <Route path="/withset/chat/:sessionId" element={<GroundChat />} />
        <Route path="/withset/library" element={<GroundLibrary />} />
        <Route path="/withset/library/:id" element={<LibraryDetail />} />
        <Route path="/withset/artifacts" element={<GroundArtifacts />} />
        <Route path="/withset/artifacts/:id" element={<ArtifactDetail />} />
        <Route path="/withset/skills" element={<GroundSkills />} />
        <Route path="/withset/skills/:id" element={<SkillDetail />} />
        <Route path="/withset/flow" element={<GroundFlowList />} />
        <Route path="/withset/flow/:flowId" element={<GroundFlowEditor />} />
        <Route path="/withset/tools" element={<GroundTools />} />
        <Route path="/withset/*" element={<Navigate to="/withset" replace />} />
        {/* 예전 이름(Ground) 주소는 새 주소로 */}
        <Route path="/ground/*" element={<LegacyGround />} />
        <Route path="/ground" element={<LegacyGround />} />
        <Route path="/docs" element={<Navigate to="/docs/intro" replace />} />
        <Route path="/docs/:slug" element={<DocsLayout />} />
        <Route path="/component" element={<ComponentLibrary />} />
        <Route path="/access-log" element={<AccessLog />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

/** /ground/... → /withset/... (경로 · 쿼리 · 해시 유지) */
function LegacyGround() {
  const l = useLocation()
  return <Navigate to={l.pathname.replace(/^\/ground/, '/withset') + l.search + l.hash} replace />
}

export default App