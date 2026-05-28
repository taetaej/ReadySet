import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Search, ArrowLeft, Sun, Moon, LogOut, ChevronDown, ArrowUp, Share2, Link, FileText, Check } from 'lucide-react'
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
    // 현재 slug가 속한 섹션 자동 열기
    for (const section of docsStructure) {
      for (const page of section.pages) {
        if (page.slug === slug) return [section.id]
      }
    }
    return ['getting-started']
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [copied, setCopied] = useState<'url' | 'md' | null>(null)
  const [showCopyMenu, setShowCopyMenu] = useState(false)
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
    const results: { page: DocPage; sectionTitle: string; heading?: string; snippet: string }[] = []
    
    for (const section of docsStructure) {
      if (section.disabled) continue
      for (const page of section.pages) {
        if (page.disabled) continue
        const lines = page.content.split('\n')
        let currentHeading = ''
        let matched = false
        
        // 제목 매칭
        if (page.title.toLowerCase().includes(q)) {
          const firstParagraph = lines.find(l => l.trim() && !l.startsWith('#')) || ''
          results.push({
            page,
            sectionTitle: section.title,
            snippet: firstParagraph.slice(0, 80)
          })
          matched = true
        }
        
        // 본문 헤딩 단위 매칭
        for (let i = 0; i < lines.length && results.length < 10; i++) {
          const line = lines[i]
          if (line.startsWith('## ')) currentHeading = line.slice(3)
          else if (line.startsWith('### ')) currentHeading = line.slice(4)
          
          if (!line.startsWith('#') && line.toLowerCase().includes(q)) {
            // 같은 페이지+헤딩 조합 중복 방지
            const key = `${page.id}-${currentHeading}`
            if (!matched || currentHeading) {
              const idx = line.toLowerCase().indexOf(q)
              const start = Math.max(0, idx - 20)
              const end = Math.min(line.length, idx + q.length + 40)
              const snippet = (start > 0 ? '...' : '') + line.slice(start, end) + (end < line.length ? '...' : '')
              
              // 중복 체크
              if (!results.find(r => r.page.id === page.id && r.heading === currentHeading)) {
                results.push({
                  page,
                  sectionTitle: section.title,
                  heading: currentHeading || undefined,
                  snippet
                })
              }
            }
            matched = true
          }
        }
      }
    }
    return results.slice(0, 8)
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
    setShowCopyMenu(false)
    setTimeout(() => setCopied(null), 2000)
  }

  // 마크다운 복사
  const copyMarkdown = () => {
    navigator.clipboard.writeText(currentPage.content)
    setCopied('md')
    setShowCopyMenu(false)
    setTimeout(() => setCopied(null), 2000)
  }

  // 마크다운 렌더링
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let inList = false
    let listItems: React.ReactNode[] = []

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(<ul key={`list-${elements.length}`} className="docs-list">{listItems}</ul>)
        listItems = []
        inList = false
      }
    }

    lines.forEach((line, i) => {
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
    return elements
  }

  const inlineFormat = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.+?)`/g, '<code class="docs-inline-code">$1</code>')
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
                      <span className="docs-search-result-path">
                        {result.sectionTitle} › {result.page.title}{result.heading ? ` › ${result.heading}` : ''}
                      </span>
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
            {/* Share 드롭다운 */}
            <div className="docs-mini-toc-copy-wrapper">
              <button
                className="docs-mini-toc-copy-btn"
                onClick={() => setShowCopyMenu(!showCopyMenu)}
              >
                {copied ? <Check size={14} /> : <Share2 size={14} />}
                <span>{copied ? 'Copied' : 'Share'}</span>
                <ChevronDown size={12} />
              </button>
              {showCopyMenu && (
                <div className="docs-mini-toc-copy-menu">
                  <button className="docs-mini-toc-copy-menu-item" onMouseDown={copyPageLink}>
                    <Link size={13} />
                    <span>Copy Link</span>
                  </button>
                  <button className="docs-mini-toc-copy-menu-item" onMouseDown={copyMarkdown}>
                    <FileText size={13} />
                    <span>Copy as Markdown</span>
                  </button>
                </div>
              )}
            </div>

            <div className="docs-mini-toc-header">
              <div className="docs-mini-toc-title">Table of contents</div>
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
