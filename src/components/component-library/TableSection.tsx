import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Section, ComponentGroup } from './Section'

export function TableSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const totalPages = 10

  return (
    <Section title="Tables & Pagination" description="데이터 테이블 및 페이지 네비게이션">
      <ComponentGroup label="Data Table (Slot List Style)">
        <div style={{ 
          width: '100%', 
          maxWidth: '1200px',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                backgroundColor: 'hsl(var(--muted))',
                borderBottom: '1px solid hsl(var(--border))'
              }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: 'hsl(var(--muted-foreground))', width: '80px' }}>ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: 'hsl(var(--muted-foreground))' }}>Slot</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: 'hsl(var(--muted-foreground))' }}>광고주</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: 'hsl(var(--muted-foreground))', width: '100px' }}>가시성</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: 'hsl(var(--muted-foreground))', width: '120px' }}>수정일</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'S001', name: '2024 Q4 캠페인', advertiser: '삼성전자', visibility: 'Private', date: '2024.03.10' },
                { id: 'S002', name: '신제품 런칭', advertiser: '카카오', visibility: 'Shared', date: '2024.03.09' },
                { id: 'S003', name: '브랜드 인지도 향상', advertiser: '현대자동차', visibility: 'Private', date: '2024.03.08' }
              ].map((row, idx) => (
                <tr key={idx} style={{ 
                  borderBottom: '1px solid hsl(var(--border))',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>{row.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: 'hsl(var(--foreground))' }}>{row.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'hsl(var(--foreground))' }}>{row.advertiser}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      backgroundColor: row.visibility === 'Private' ? 'hsl(var(--muted))' : 'hsl(var(--primary) / 0.1)',
                      color: row.visibility === 'Private' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--primary))',
                      border: `1px solid ${row.visibility === 'Private' ? 'hsl(var(--border))' : 'hsl(var(--primary) / 0.3)'}`
                    }}>
                      {row.visibility}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentGroup>

      <ComponentGroup label="Pagination with Page Count">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px' }}>
          <div style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>페이지당 표시:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="input"
              style={{ width: '70px', padding: '4px 8px', height: '28px', minHeight: '28px', cursor: 'pointer', fontSize: '13px' }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="btn btn-ghost btn-sm" style={{ width: '32px', height: '32px', padding: '0', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
              <ChevronsLeft size={16} />
            </button>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="btn btn-ghost btn-sm" style={{ width: '32px', height: '32px', padding: '0', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`} style={{ width: '32px', height: '32px', padding: '0', fontSize: '14px', fontWeight: currentPage === page ? '600' : '400' }}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="btn btn-ghost btn-sm" style={{ width: '32px', height: '32px', padding: '0', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="btn btn-ghost btn-sm" style={{ width: '32px', height: '32px', padding: '0', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>
              <ChevronsRight size={16} />
            </button>
          </div>

          <div style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
            1-20 / 247개
          </div>
        </div>
      </ComponentGroup>
    </Section>
  )
}
