# Lucide 아이콘 매핑 가이드

## 📋 워크스페이스에서 사용할 아이콘들

### 기본 UI 아이콘
```typescript
import {
  // 네비게이션
  Menu,           // ☰ (햄버거 메뉴)
  ChevronLeft,    // ← (뒤로가기)
  ChevronRight,   // → (앞으로가기)
  ChevronDown,    // ▼ (드롭다운)
  
  // 액션
  Plus,           // + (추가)
  Search,         // 🔍 (검색)
  MoreVertical,   // ⋯ (더보기 메뉴)
  Filter,         // 필터
  
  // 상태
  Check,          // ✓ (완료)
  X,              // ✗ (닫기)
  AlertCircle,    // ⚠ (경고)
  Info,           // ℹ (정보)
  
} from 'lucide-react'
```

### 워크스페이스 특화 아이콘
```typescript
import {
  // 프로젝트 구조
  Building2,      // 🏢 (워크스페이스)
  Folder,         // 📁 (폴더)
  FolderOpen,     // 📂 (열린 폴더)
  
  // 솔루션별 아이콘
  Target,         // 🎯 (Reach Caster)
  DollarSign,     // 💰 (Budget Optimizer)  
  TrendingUp,     // 📈 (Benchmark)
  
  // 상태 표시
  Eye,            // 👁 (가시성)
  EyeOff,         // 가시성 숨김
  Lock,           // 🔒 (Private)
  Users,          // 👥 (Internal)
  Globe,          // 🌐 (Shared)
  
} from 'lucide-react'
```

### 데이터 & 분석 아이콘
```typescript
import {
  // 차트 & 그래프
  BarChart3,      // 막대 차트
  LineChart,      // 선 차트
  PieChart,       // 파이 차트
  Activity,       // 활동 지표
  
  // 데이터
  Database,       // 데이터베이스
  FileText,       // 문서
  Download,       // 다운로드
  Upload,         // 업로드
  
  // 시간
  Clock,          // 시계
  Calendar,       // 달력
  
} from 'lucide-react'
```

---

## 🔄 아이콘 교체 매핑

### 현재 이모티콘 → Lucide 아이콘
```typescript
// 기존 이모티콘들을 Lucide 아이콘으로 교체
const iconMapping = {
  // 네비게이션
  '🏢': 'Building2',     // 워크스페이스
  '📁': 'Folder',        // 폴더
  '📂': 'FolderOpen',    // 열린 폴더
  
  // 솔루션
  '🎯': 'Target',        // Reach Caster
  '💰': 'DollarSign',    // Budget Optimizer
  '📈': 'TrendingUp',    // Benchmark
  
  // UI 요소
  '☰': 'Menu',           // 햄버거 메뉴
  '←': 'ChevronLeft',    // 뒤로가기
  '▶': 'ChevronRight',   // 확장 화살표
  '🔍': 'Search',        // 검색
  '+': 'Plus',           // 추가
  '⋯': 'MoreVertical',   // 더보기
  
  // 상태
  '✓': 'Check',          // 완료
  '✗': 'X',              // 닫기
  '⚠': 'AlertCircle',    // 경고
}
```

---

## 🎨 아이콘 컴포넌트 구현

### 기본 아이콘 컴포넌트
```typescript
// components/ui/Icon.tsx
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconProps {
  icon: LucideIcon
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5', 
  lg: 'w-6 h-6'
}

export function Icon({ icon: IconComponent, size = 'md', className }: IconProps) {
  return (
    <IconComponent 
      className={cn(sizeMap[size], className)} 
    />
  )
}
```

### 트리 노드 아이콘 컴포넌트
```typescript
// components/TreeNodeIcon.tsx
import { 
  Building2, 
  Folder, 
  FolderOpen, 
  Target, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react'

interface TreeNodeIconProps {
  type: 'workspace' | 'folder' | 'solution'
  solutionType?: 'reach-caster' | 'budget-optimizer' | 'benchmark'
  isOpen?: boolean
  className?: string
}

export function TreeNodeIcon({ 
  type, 
  solutionType, 
  isOpen, 
  className 
}: TreeNodeIconProps) {
  if (type === 'workspace') {
    return <Building2 className={className} />
  }
  
  if (type === 'folder') {
    return isOpen ? 
      <FolderOpen className={className} /> : 
      <Folder className={className} />
  }
  
  if (type === 'solution') {
    const solutionIcons = {
      'reach-caster': Target,
      'budget-optimizer': DollarSign,
      'benchmark': TrendingUp
    }
    
    const IconComponent = solutionIcons[solutionType!]
    return <IconComponent className={className} />
  }
  
  return null
}
```

---

## 📝 업데이트된 HTML 구조

### 사이드바 트리 (아이콘 적용)
```html
<aside class="workspace-sidebar">
  <div class="sidebar-header">
    <h2 class="sidebar-title">폴더 탐색기</h2>
    <button class="sidebar-toggle">
      <ChevronLeft className="w-4 h-4" />
    </button>
  </div>
  
  <nav class="sidebar-tree">
    <div class="tree-node tree-node--root">
      <div class="tree-node__header">
        <Building2 className="w-4 h-4 text-blue-600" />
        <span class="tree-node__label">워크스페이스 (Adly)</span>
      </div>
      
      <div class="tree-node__children">
        <div class="tree-node tree-node--folder">
          <div class="tree-node__header" data-expandable>
            <ChevronRight className="w-3 h-3 tree-node__expand" />
            <Folder className="w-4 h-4 text-amber-600" />
            <span class="tree-node__label">삼성 갤럭시 S24 캠페인</span>
            <span class="tree-node__count">5</span>
          </div>
          
          <div class="tree-node__children tree-node__children--collapsed">
            <div class="tree-node tree-node--solution tree-node--active">
              <div class="tree-node__header">
                <Target className="w-4 h-4 text-indigo-600" />
                <span class="tree-node__label">Reach Caster</span>
                <span class="tree-node__count">3</span>
              </div>
            </div>
            
            <div class="tree-node tree-node--solution tree-node--disabled">
              <div class="tree-node__header">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span class="tree-node__label">Budget Optimizer</span>
                <span class="tree-node__badge">준비중</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
  
  <div class="sidebar-footer">
    <button class="btn btn--ghost btn--sm">
      <Plus className="w-4 h-4" />
      새 폴더
    </button>
  </div>
</aside>
```

### 헤더 (아이콘 적용)
```html
<header class="workspace-header">
  <div class="workspace-header__content">
    <div class="workspace-header__left">
      <button class="sidebar-toggle-btn">
        <Menu className="w-5 h-5" />
      </button>
      <div class="breadcrumb">
        <span class="breadcrumb__item">워크스페이스</span>
        <ChevronRight className="w-4 h-4 breadcrumb__separator" />
        <span class="breadcrumb__item breadcrumb__item--current">전체 폴더</span>
      </div>
    </div>
    <div class="workspace-header__right">
      <button class="btn btn--primary">
        <Plus className="w-4 h-4" />
        새 폴더
      </button>
    </div>
  </div>
</header>
```

---

## 🎨 아이콘 색상 시스템

### 타입별 색상
```css
/* 워크스페이스 */
.icon--workspace { @apply text-blue-600; }

/* 폴더 */
.icon--folder { @apply text-amber-600; }
.icon--folder-open { @apply text-amber-500; }

/* 솔루션 */
.icon--reach-caster { @apply text-indigo-600; }
.icon--budget-optimizer { @apply text-green-600; }
.icon--benchmark { @apply text-purple-600; }

/* 상태 */
.icon--active { @apply text-indigo-600; }
.icon--disabled { @apply text-gray-400; }
.icon--success { @apply text-green-600; }
.icon--warning { @apply text-amber-600; }
.icon--error { @apply text-red-600; }
```

이제 모든 이모티콘을 Lucide 아이콘으로 교체할 수 있습니다!