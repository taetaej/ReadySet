import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Search, ArrowLeft, Sun, Moon, LogOut, ArrowUp, Link, FileText, Check, ChevronDown } from 'lucide-react'
import { docsStructure, DocPage } from './docsData'
import { Avatar } from '../common/Avatar'
import { getDarkMode, setDarkMode } from '../../utils/theme'

interface DocsLayoutProps {
  isDarkMode?: boolean
  onToggleDarkMode?: () => void
}

export function DocsLayout({ isDarkMode: propDarkMode, onToggleDarkMode: propToggle }: DocsLayoutProps) {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  
  // 다크모드 관리 (localStorage 동기화)
  const [localDarkMode, setLocalDarkMode] = useState(() => getDarkMode())
  const isDarkMode = propDarkMode ?? localDarkMode
  const onToggleDarkMode = propToggle ?? (() => {
    const next = !localDarkMode
    setLocalDarkMode(next)
    setDarkMode(next)
  })

  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    // 모든 섹션 펼침 (disabled 제외)
    return docsStructure.filter(s => !s.disabled).map(s => s.id)
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [copied, setCopied] = useState<'url' | 'md' | null>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // OS 감지
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

  // 외부 클릭 시 프로필 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ⌘K / Ctrl+K 단축키로 검색 포커스
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 현재 페이지 찾기
  const currentPage = useMemo(() => {
    for (const section of docsStructure) {
      for (const page of section.pages) {
        if (page.slug === slug) return page
      }
    }
    return docsStructure[0].pages[0]
  }, [slug])

  // 본문 내 헤딩 추출 (우측 미니 TOC용)
  const headings = useMemo(() => {
    const lines = currentPage.content.split('\n')
    const result: { level: number; text: string; id: string }[] = []
    lines.forEach(line => {
      const match = line.match(/^(#{2,3})\s+(.+)/)
      if (match) {
        const level = match[1].length
        const text = match[2]
        const id = text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, '')
        result.push({ level, text, id })
      }
    })
    return result
  }, [currentPage])

  // 이전/다음 페이지
  const { prevPage, nextPage } = useMemo(() => {
    const allPages: DocPage[] = []
    for (const section of docsStructure) {
      if (!section.disabled) {
        for (const page of section.pages) {
          if (!page.disabled) allPages.push(page)
        }
      }
    }
    const idx = allPages.findIndex(p => p.slug === currentPage.slug)
    return {
      prevPage: idx > 0 ? allPages[idx - 1] : null,
      nextPage: idx < allPages.length - 1 ? allPages[idx + 1] : null
    }
  }, [currentPage])

  // 검색 필터 (좌측 TOC용)
  const filteredStructure = useMemo(() => {
    if (!searchQuery.trim()) return docsStructure
    const q = searchQuery.toLowerCase()
    return docsStructure
      .map(section => ({
        ...section,
        pages: section.pages.filter(page =>
          page.title.toLowerCase().includes(q) ||
          page.content.toLowerCase().includes(q)
        )
      }))
      .filter(section => section.pages.length > 0)
  }, [searchQuery])

  // 예측 검색 결과 (드롭다운용) — 헤딩 단위 + 스니펫
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    const results: { page: DocPage; sectionTitle: string; heading?: string; snippet: string; priority: number }[] = []
    
    for (const section of docsStructure) {
      if (section.disabled) continue
      for (const page of section.pages) {
        if (page.disabled) continue
        const lines = page.content.split('\n')
        let currentHeading = ''
        let matched = false
        
        // 페이지 제목 매칭 (최우선)
        if (page.title.toLowerCase().includes(q)) {
          const firstParagraph = lines.find(l => l.trim() && !l.startsWith('#')) || ''
          results.push({
            page,
            sectionTitle: section.title,
            snippet: firstParagraph.slice(0, 80),
            priority: 0
          })
          matched = true
        }
        
        // 본문 헤딩 단위 매칭
        for (let i = 0; i < lines.length && results.length < 12; i++) {
          const line = lines[i]
          if (line.startsWith('## ')) currentHeading = line.slice(3)
          else if (line.startsWith('### ')) currentHeading = line.slice(4)
          
          // h2/h3 헤딩 자체가 매칭 (높은 우선순위)
          if ((line.startsWith('## ') || line.startsWith('### ')) && line.toLowerCase().includes(q)) {
            const headingText = line.replace(/^#{2,3}\s+/, '')
            const nextLine = lines.slice(i + 1).find(l => l.trim() && !l.startsWith('#')) || ''
            if (!results.find(r => r.page.id === page.id && r.heading === headingText)) {
              results.push({
                page,
                sectionTitle: section.title,
                heading: headingText,
                snippet: nextLine.slice(0, 80),
                priority: 1
              })
            }
            continue
          }
          
          // 본문 매칭 (낮은 우선순위)
          if (!line.startsWith('#') && line.toLowerCase().includes(q)) {
            const key = `${page.id}-${currentHeading}`
            if (!matched || currentHeading) {
              const idx = line.toLowerCase().indexOf(q)
              const start = Math.max(0, idx - 20)
              const end = Math.min(line.length, idx + q.length + 40)
              const snippet = (start > 0 ? '...' : '') + line.slice(start, end) + (end < line.length ? '...' : '')
              
              if (!results.find(r => r.page.id === page.id && r.heading === currentHeading)) {
                results.push({
                  page,
                  sectionTitle: section.title,
                  heading: currentHeading || undefined,
                  snippet,
                  priority: 2
                })
              }
            }
            matched = true
          }
        }
      }
    }
    // 우선순위 정렬: 제목 > 헤딩 > 본문
    return results.sort((a, b) => a.priority - b.priority).slice(0, 8)
  }, [searchQuery])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const navigateToPage = (page: DocPage) => {
    if (page.disabled) return
    navigate(`/docs/${page.slug}`)
  }

  // 앵커 스크롤
  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Top으로 스크롤
  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 페이지 URL 복사
  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied('url')
    setTimeout(() => setCopied(null), 2000)
  }

  // 마크다운 복사
  const copyMarkdown = () => {
    navigator.clipboard.writeText(currentPage.content)
    setCopied('md')
    setTimeout(() => setCopied(null), 2000)
  }

  // 마크다운 렌더링
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let inList = false
    let listItems: React.ReactNode[] = []
    let inTable = false
    let tableHeaders: string[] = []
    let tableRows: string[][] = []

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(<ul key={`list-${elements.length}`} className="docs-list">{listItems}</ul>)
        listItems = []
        inList = false
      }
    }

    const flushTable = () => {
      if (tableHeaders.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="docs-table-wrapper">
            <table className="docs-table">
              <thead>
                <tr>
                  {tableHeaders.map((h, hi) => <th key={hi} dangerouslySetInnerHTML={{ __html: inlineFormat(h.trim()) }} />)}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => <td key={ci} dangerouslySetInnerHTML={{ __html: inlineFormat(cell.trim()) }} />)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        tableHeaders = []
        tableRows = []
        inTable = false
      }
    }

    lines.forEach((line, i) => {
      // 테이블 감지
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        flushList()
        const cells = line.trim().slice(1, -1).split('|')
        // 구분선 행 (|---|---|) 스킵
        if (cells.every(c => c.trim().match(/^-+$/))) {
          return
        }
        if (!inTable) {
          inTable = true
          tableHeaders = cells
        } else {
          tableRows.push(cells)
        }
        return
      } else if (inTable) {
        flushTable()
      }

      if (line.startsWith('# ')) {
        flushList()
        elements.push(<h1 key={i} className="docs-h1">{line.slice(2)}</h1>)
      } else if (line.startsWith('## ')) {
        flushList()
        const text = line.slice(3)
        const id = text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, '')
        elements.push(<h2 key={i} id={id} className="docs-h2">{text}</h2>)
      } else if (line.startsWith('### ')) {
        flushList()
        const text = line.slice(4)
        const id = text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, '')
        elements.push(<h3 key={i} id={id} className="docs-h3">{text}</h3>)
      } else if (line.match(/^- /)) {
        inList = true
        const text = line.slice(2)
        listItems.push(<li key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(text) }} />)
      } else if (line.match(/^\d+\. /)) {
        flushList()
        const text = line.replace(/^\d+\. /, '')
        elements.push(
          <div key={i} className="docs-ordered-item">
            <span className="docs-ordered-number">{line.match(/^(\d+)/)?.[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: inlineFormat(text) }} />
          </div>
        )
      } else if (line.trim() === '') {
        flushList()
      } else {
        flushList()
        elements.push(<p key={i} className="docs-p" dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />)
      }
    })
    flushList()
    flushTable()
    return elements
  }

  const inlineFormat = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(NEW|IMPROVED|FIXED|DEPRECATED)`/g, (_, tag) => {
        const colors: Record<string, string> = {
          'NEW': 'background:hsl(var(--primary));color:hsl(var(--primary-foreground))',
          'IMPROVED': 'background:hsl(var(--foreground)/0.1);color:hsl(var(--foreground))',
          'FIXED': 'background:hsl(142 76% 36%/0.15);color:hsl(142 76% 36%)',
          'DEPRECATED': 'background:hsl(var(--muted));color:hsl(var(--muted-foreground))'
        }
        return `<span class="docs-chip" style="${colors[tag]}">${tag}</span>`
      })
      .replace(/`(.+?)`/g, '<code class="docs-inline-code">$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="docs-link" target="_blank" rel="noopener noreferrer">$1</a>')
  }

  return (
    <div className="docs-layout">
      {/* Header - GNB 스타일 */}
      <header className="docs-header">
        {/* 좌측: 로고 + Docs */}
        <div className="docs-header-left">
          <a 
            href="/slotboard"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          >
            <img 
              src={isDarkMode ? '/readyset_logo_dark_white.svg' : '/readyset_logo_light_black.svg'}
              alt="ReadySet"
              className="docs-logo"
            />
          </a>
          <span className="docs-header-title">Docs</span>
        </div>

        {/* 중앙: 검색 */}
        <div className="docs-header-center">
          <div className="docs-header-search">
            <Search size={14} className="docs-header-search-icon" />
            <input
              type="text"
              placeholder="문서 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="docs-header-search-input"
              ref={searchInputRef}
            />
            <div className="docs-header-search-kbd-wrapper">
              <kbd className="docs-header-search-kbd">{isMac ? '⌘' : 'Ctrl'}K</kbd>
            </div>

            {/* 예측 검색 드롭다운 */}
            {searchFocused && searchQuery.trim() && (
              <div className="docs-search-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map((result, idx) => (
                    <button
                      key={`${result.page.id}-${result.heading || ''}-${idx}`}
                      className="docs-search-result"
                      onMouseDown={() => {
                        navigateToPage(result.page)
                        setSearchQuery('')
                        // 헤딩이 있으면 해당 위치로 스크롤
                        if (result.heading) {
                          setTimeout(() => {
                            const id = result.heading!.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, '')
                            scrollToHeading(id)
                          }, 100)
                        }
                      }}
                    >
                      <span className="docs-search-result-path"
                        dangerouslySetInnerHTML={{
                          __html: `${result.sectionTitle} › ${result.page.title}${result.heading ? ` › ${result.heading}` : ''}`.replace(
                            new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
                            '<mark class="docs-search-highlight">$1</mark>'
                          )
                        }}
                      />
                      <span className="docs-search-result-snippet"
                        dangerouslySetInnerHTML={{
                          __html: result.snippet.replace(
                            new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
                            '<mark class="docs-search-highlight">$1</mark>'
                          )
                        }}
                      />
                    </button>
                  ))
                ) : (
                  <div className="docs-search-empty">검색 결과가 없습니다</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 우측: 플랫폼 돌아가기 + 다크모드 + 프로필 */}
        <div className="docs-header-right">
          <button
            onClick={() => navigate('/')}
            className="docs-back-btn"
          >
            <ArrowLeft size={14} />
            <span>ReadySet 플랫폼 돌아가기</span>
          </button>

          <button
            onClick={onToggleDarkMode}
            className="docs-icon-btn"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* 프로필 */}
          <div 
            ref={profileRef}
            className="docs-profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <Avatar name="Shin Jia" type="user" size={32} userId="USER001" />
            <ChevronDown size={14} className="text-muted-foreground" />

            {showProfileMenu && (
              <div className="docs-profile-menu">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('로그아웃')
                    setShowProfileMenu(false)
                  }}
                  className="docs-profile-menu-item"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="docs-body">
        {/* 좌측 TOC Sidebar */}
        <aside className="docs-sidebar">
          <nav className="docs-toc">
            {docsStructure.map(section => (
              <div key={section.id} className="docs-toc-section">
                <button
                  className={`docs-toc-section-title ${section.disabled ? 'docs-toc--disabled' : ''}`}
                  onClick={() => !section.disabled && toggleSection(section.id)}
                >
                  <ChevronRight
                    size={12}
                    className={`docs-toc-chevron ${expandedSections.includes(section.id) ? 'docs-toc-chevron--open' : ''}`}
                  />
                  <span>{section.title}</span>
                  {section.disabled && (
                    <span className="docs-toc-badge">{section.disabledLabel}</span>
                  )}
                </button>

                {expandedSections.includes(section.id) && !section.disabled && (
                  <div className="docs-toc-pages">
                    {section.pages.map(page => (
                      <button
                        key={page.id}
                        className={`docs-toc-page ${currentPage.slug === page.slug ? 'docs-toc-page--active' : ''} ${page.disabled ? 'docs-toc--disabled' : ''}`}
                        onClick={() => navigateToPage(page)}
                      >
                        {page.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="docs-content" ref={contentRef}>
          <article className="docs-article">
            {renderMarkdown(currentPage.content)}
          </article>

          {/* 업데이트 날짜 */}
          {currentPage.updatedAt && (
            <div className="docs-updated-at">
              마지막 업데이트: {currentPage.updatedAt}
            </div>
          )}

          {/* 이전/다음 네비게이션 */}
          <nav className="docs-pagination">
            {prevPage ? (
              <button
                className="docs-pagination-btn docs-pagination-btn--prev"
                onClick={() => navigateToPage(prevPage)}
              >
                <ChevronLeft size={14} />
                <div>
                  <span className="docs-pagination-label">이전</span>
                  <span className="docs-pagination-title">{prevPage.title}</span>
                </div>
              </button>
            ) : <div />}
            {nextPage ? (
              <button
                className="docs-pagination-btn docs-pagination-btn--next"
                onClick={() => navigateToPage(nextPage)}
              >
                <div>
                  <span className="docs-pagination-label">다음</span>
                  <span className="docs-pagination-title">{nextPage.title}</span>
                </div>
                <ChevronRight size={14} />
              </button>
            ) : <div />}
          </nav>
        </main>

        {/* 우측 미니 TOC (On this page) */}
        {headings.length > 0 && (
          <aside className="docs-mini-toc">
            {/* Copy 버튼들 (드롭다운 없이 직접 노출) */}
            <div className="docs-mini-toc-copy-wrapper">
              <button
                className="docs-mini-toc-copy-btn"
                onClick={copyPageLink}
              >
                {copied === 'url' ? <Check size={14} /> : <Link size={14} />}
                <span>{copied === 'url' ? 'Copied' : 'Copy Link'}</span>
              </button>
              <button
                className="docs-mini-toc-copy-btn"
                onClick={copyMarkdown}
              >
                {copied === 'md' ? <Check size={14} /> : <FileText size={14} />}
                <span>{copied === 'md' ? 'Copied' : 'Copy as Markdown'}</span>
              </button>
            </div>

            <div className="docs-mini-toc-header">
              <div className="docs-mini-toc-title">On this page</div>
            </div>
            <nav className="docs-mini-toc-nav">
              {headings.map((heading, idx) => (
                <button
                  key={idx}
                  className={`docs-mini-toc-item docs-mini-toc-item--h${heading.level}`}
                  onClick={() => scrollToHeading(heading.id)}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
            <button
              className="docs-mini-toc-top"
              onClick={scrollToTop}
            >
              <ArrowUp size={12} />
              <span>Back to top</span>
            </button>
          </aside>
        )}
      </div>
    </div>
  )
}
