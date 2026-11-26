# Design Document: Reach Predictor Phase 1

## Overview

This design document specifies the implementation of Reach Predictor Phase 1 in the CreateScenario component. The implementation adds basic media selection UI with support for both linked media (with product hierarchies) and unlinked media (standalone platforms). This phase establishes the foundation for future phases that will add auto-calculation logic, period/targeting settings, and reach curve configuration.

**Key Features:**
- Media selection table with two media types (linked and unlinked)
- Input fields for confirmed budget, expected impressions, and auto-calculated CPM
- Media add/delete functionality
- Total budget sum display
- Basic validation
- Real-time Configuration Summary updates

**Design Principles:**
- Follow existing Ratio Finder UI patterns for consistency
- Use targeted code modifications (strReplace) rather than full file rewrites
- Maintain all existing functionality
- Keep code organized for future phase implementations

## Architecture

### Component Structure

The Reach Predictor Phase 1 implementation extends the existing CreateScenario component without creating new components. All functionality is integrated into the existing Step 2 conditional rendering for Reach Predictor.

```
CreateScenario Component
├── Step 1: Basic Information (existing)
├── Step 2: Module Configuration
│   ├── Ratio Finder (existing)
│   └── Reach Predictor (Phase 1 implementation)
│       ├── Media Selection Table
│       ├── Media Selection Dialog
│       │   ├── Linked Media Tab
│       │   └── Unlinked Media Tab
│       ├── Product Selection Dialog (reuse from Ratio Finder)
│       └── Total Budget Display
└── Step 3: Review & Execute (existing)
```

### State Management

New state variables to be added to the CreateScenario component:

```typescript
// Reach Predictor media configuration
const [reachPredictorMedia, setReachPredictorMedia] = useState<{
  [key: string]: {
    type: 'linked' | 'unlinked'
    mediaName: string
    category?: 'DIGITAL' | 'TV'  // Only for linked media
    products?: string[]           // Only for linked media
    budget: number | undefined
    impressions: number | undefined
    cpm: number | undefined
  }
}>({})

// Media selection dialog state
const [rpMediaSelectionDialog, setRpMediaSelectionDialog] = useState<{
  open: boolean
  type: 'linked' | 'unlinked'
}>({ open: false, type: 'linked' })

// Selected media in dialog (before confirmation)
const [rpSelectedMediaInDialog, setRpSelectedMediaInDialog] = useState<{
  mediaKey: string
  type: 'linked' | 'unlinked'
  category?: 'DIGITAL' | 'TV'
  mediaName: string
} | null>(null)
```

### Data Flow

1. **Media Selection Flow:**
   - User clicks "매체 추가" button
   - Dialog opens with two tabs (linked/unlinked)
   - User selects media type and specific media
   - For linked media: Product selection dialog opens
   - For unlinked media: Media row is added immediately
   - Dialog closes and media row appears in table

2. **Budget Input Flow:**
   - User enters confirmed budget in input field
   - Value is formatted with thousand separators
   - If impressions exist, CPM is recalculated
   - Total budget sum is updated
   - Configuration Summary is updated

3. **CPM Calculation Flow:**
   - User enters budget and/or impressions
   - System checks if both values exist and are > 0
   - CPM = (budget / impressions) × 1000
   - CPM is displayed in read-only field

4. **Validation Flow:**
   - User attempts to proceed to Step 3
   - System validates: at least 1 media, all budgets > 0
   - If valid: Enable "다음" button
   - If invalid: Show error messages with red borders

## Components and Interfaces

### Media Selection Table

**Location:** Step 2, Reach Predictor section

**Structure:**
```tsx
<div style={{ marginBottom: '24px' }}>
  <label>매체 설정 *</label>
  <div style={{ border, borderRadius, overflow: 'hidden' }}>
    {/* Header */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 150px 150px 40px' }}>
      <div>매체명</div>
      <div>확정 예산 (천원) *</div>
      <div>예상 노출</div>
      <div>CPM (원)</div>
      <div></div>
    </div>
    
    {/* Media Rows */}
    {Object.entries(reachPredictorMedia).map(([key, media]) => (
      <MediaRow key={key} media={media} onDelete={...} onUpdate={...} />
    ))}
    
    {/* Empty State */}
    {Object.keys(reachPredictorMedia).length === 0 && (
      <div>매체를 추가해주세요</div>
    )}
    
    {/* Add Button */}
    <button onClick={() => openMediaDialog()}>+ 매체 추가</button>
    
    {/* Total Budget */}
    <div style={{ borderTop, padding }}>
      <div>총 예산 합계</div>
      <div>{totalBudget.toLocaleString()}천원</div>
    </div>
  </div>
</div>
```

**Styling:**
- Use same card styling as Ratio Finder
- Grid layout for table structure
- Consistent spacing and borders
- Dark mode compatible with hsl variables

### Media Row Component (Inline)

**Structure:**
```tsx
<div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 150px 150px 40px', gap: '12px', padding: '12px', borderBottom }}>
  {/* Media Name */}
  <div>
    <div>{media.mediaName}</div>
    {media.products && (
      <div style={{ fontSize: '11px', color: 'muted-foreground' }}>
        {media.products.length}개 상품 선택
      </div>
    )}
  </div>
  
  {/* Confirmed Budget Input */}
  <input
    type="text"
    value={media.budget ? media.budget.toLocaleString() : ''}
    onChange={handleBudgetChange}
    placeholder="0"
    className="input"
  />
  
  {/* Expected Impressions Input */}
  <input
    type="text"
    value={media.impressions ? media.impressions.toLocaleString() : ''}
    onChange={handleImpressionsChange}
    placeholder="0"
    className="input"
  />
  
  {/* CPM Display (Read-only) */}
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {media.cpm ? `${media.cpm.toLocaleString()}원` : '—'}
  </div>
  
  {/* Delete Button */}
  <button onClick={handleDelete}>
    <X size={16} />
  </button>
</div>
```

### Media Selection Dialog

**Structure:**
```tsx
<div className="dialog-overlay" onClick={closeDialog}>
  <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
    <div className="dialog-header">
      <h3>매체 선택</h3>
      <p>분석에 포함할 매체를 선택하세요</p>
    </div>
    
    <div style={{ padding: '24px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom, marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('linked')}
          style={{ flex: 1, padding: '12px', borderBottom: activeTab === 'linked' ? '2px solid' : 'none' }}
        >
          연동 매체
        </button>
        <button
          onClick={() => setActiveTab('unlinked')}
          style={{ flex: 1, padding: '12px', borderBottom: activeTab === 'unlinked' ? '2px solid' : 'none' }}
        >
          미연동 매체
        </button>
      </div>
      
      {/* Linked Media List */}
      {activeTab === 'linked' && (
        <div>
          {/* DIGITAL Category */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>DIGITAL</div>
            {Object.keys(mediaData.DIGITAL).map(mediaName => (
              <label key={mediaName} style={{ display: 'flex', alignItems: 'center', padding: '8px', border, borderRadius, marginBottom: '4px' }}>
                <input
                  type="radio"
                  name="linkedMedia"
                  value={`DIGITAL_${mediaName}`}
                  onChange={() => selectLinkedMedia('DIGITAL', mediaName)}
                />
                <span style={{ marginLeft: '8px' }}>{mediaName}</span>
              </label>
            ))}
          </div>
          
          {/* TV Category */}
          <div>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>TV</div>
            {Object.keys(mediaData.TV).map(mediaName => (
              <label key={mediaName} style={{ display: 'flex', alignItems: 'center', padding: '8px', border, borderRadius, marginBottom: '4px' }}>
                <input
                  type="radio"
                  name="linkedMedia"
                  value={`TV_${mediaName}`}
                  onChange={() => selectLinkedMedia('TV', mediaName)}
                />
                <span style={{ marginLeft: '8px' }}>{mediaName}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      {/* Unlinked Media List */}
      {activeTab === 'unlinked' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {unlinkedMedia.map(mediaName => (
            <label key={mediaName} style={{ display: 'flex', alignItems: 'center', padding: '8px', border, borderRadius }}>
              <input
                type="radio"
                name="unlinkedMedia"
                value={mediaName}
                onChange={() => selectUnlinkedMedia(mediaName)}
              />
              <span style={{ marginLeft: '8px', fontSize: '12px' }}>{mediaName}</span>
            </label>
          ))}
        </div>
      )}
    </div>
    
    <div className="dialog-footer">
      <button onClick={closeDialog} className="btn btn-secondary btn-md">
        취소
      </button>
      <button onClick={confirmSelection} className="btn btn-primary btn-md" disabled={!rpSelectedMediaInDialog}>
        확인
      </button>
    </div>
  </div>
</div>
```

### Product Selection Dialog (Reuse)

The product selection dialog from Ratio Finder will be reused for linked media. The existing `productSelectionDialog` state and dialog component will be leveraged with minimal modifications to support Reach Predictor context.

## Data Models

### ReachPredictorMedia Type

```typescript
interface ReachPredictorMedia {
  [key: string]: {
    type: 'linked' | 'unlinked'
    mediaName: string
    category?: 'DIGITAL' | 'TV'  // Only for linked media
    products?: string[]           // Only for linked media
    budget: number | undefined    // In thousands (천원)
    impressions: number | undefined
    cpm: number | undefined       // Auto-calculated
  }
}
```

**Key Generation:**
- Linked media: `linked_${category}_${mediaName}`
- Unlinked media: `unlinked_${mediaName}`

**Example:**
```typescript
{
  "linked_DIGITAL_Google Ads": {
    type: "linked",
    mediaName: "Google Ads",
    category: "DIGITAL",
    products: ["범퍼애드_CPM", "인피드 동영상 광고_CPV"],
    budget: 50000,
    impressions: 1000000,
    cpm: 50
  },
  "unlinked_쿠팡": {
    type: "unlinked",
    mediaName: "쿠팡",
    budget: 30000,
    impressions: undefined,
    cpm: undefined
  }
}
```

### Media Selection Dialog State

```typescript
interface RPMediaSelectionDialog {
  open: boolean
  type: 'linked' | 'unlinked'
}
```

### Selected Media in Dialog State

```typescript
interface RPSelectedMediaInDialog {
  mediaKey: string
  type: 'linked' | 'unlinked'
  category?: 'DIGITAL' | 'TV'
  mediaName: string
} | null
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

