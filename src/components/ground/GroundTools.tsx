// GroundTools.tsx — /withset/tools · SpinX가 쓸 수 있는 도구(MCP)
//  1) 매체 MCP: 광고주(Slot) 단위로 연결, 실측을 가져온다 (대표 장면 3의 데이터 입구)
//  2) 사내 공통: 회사가 미리 연결해 둔 도구. 켜고 끄기만
//  3) 직접 등록: 내가 쓰는 MCP 서버를 등록. 관리자 검토 전에는 나만, 쓸 때마다 SpinX가 허락을 구한다

import { useState } from 'react'
import { Building2, Plug, Plus, User, X } from 'lucide-react'
import { GroundLayout } from './GroundLayout'

const MEDIA = [
  { name: '메타', account: '삼성전자 · 광고 계정 2개', sync: '11.11 09:00', on: true },
  { name: '구글 Ads', account: '삼성전자 · 광고 계정 1개', sync: '11.11 09:00', on: true },
  { name: '네이버 GFA', account: '삼성전자 · 광고 계정 1개', sync: '11.11 08:30', on: true },
  { name: '카카오 모먼트', account: '—', sync: '—', on: false },
  { name: '틱톡', account: '—', sync: '—', on: false },
]

const COMMON_INIT = [
  { id: 'c1', name: '사내 기간계 · 매체 프로모션', desc: '매체 프로모션 · 신상품 정보 조회 (임직원 전용)', on: true },
  { id: 'c2', name: 'Slack', desc: '워크플로우 결과를 채널 · DM으로 보내기', on: true },
  { id: 'c3', name: 'Google Drive', desc: 'Artifacts를 문서 · 시트로 내보내기', on: false },
  { id: 'c4', name: 'Confluence', desc: '팀 위키 문서 검색', on: false },
]

type Mine = { id: string; name: string; url: string; auth: string; scope: '나만' | '팀'; status: '사용 중' | '검토 중' }
const MINE_INIT: Mine[] = [
  { id: 'm1', name: '광고주 주간 리포트 시트', url: 'https://mcp.example.internal/sheets', auth: 'OAuth', scope: '나만', status: '사용 중' },
]

export function GroundTools() {
  const [common, setCommon] = useState(COMMON_INIT)
  const [mine, setMine] = useState<Mine[]>(MINE_INIT)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', url: '', auth: 'OAuth', scope: '나만' as Mine['scope'] })
  const valid = form.name.trim() && /^https:\/\//.test(form.url.trim())

  const add = () => {
    if (!valid) return
    setMine(m => [...m, { id: `m${Date.now()}`, name: form.name.trim(), url: form.url.trim(), auth: form.auth, scope: form.scope, status: form.scope === '팀' ? '검토 중' : '사용 중' }])
    setForm({ name: '', url: '', auth: 'OAuth', scope: '나만' }); setOpen(false)
  }

  return (
    <GroundLayout title="Tools - WithSet">
      <div className="gd-container gd-page">
        <header className="gd-page-head">
          <h1 className="gd-page-title">Tools</h1>
          <p className="gd-page-sub">SpinX가 일할 때 쓰는 도구예요. 연결해 두면 대화와 워크플로우에서 꺼내 써요.</p>
        </header>

        {/* 1. 매체 MCP */}
        <section className="tl-sec" aria-labelledby="tl-media">
          <header className="tl-head"><h2 id="tl-media" className="gd-sec-t">매체</h2><p className="gd-sec-d">실제 집행 성과를 가져와 시나리오와 비교해요. 광고주(Slot) 단위로 연결돼요.</p></header>
          <div className="tl-list">
            {MEDIA.map(m => (
              <div key={m.name} className="tl-row">
                <span className="tl-ic"><Plug size={14} aria-hidden /></span>
                <span className="tl-main"><b>{m.name}</b><span>{m.account}{m.on && ` · 마지막 동기화 ${m.sync}`}</span></span>
                {m.on ? <span className="tl-on">연결됨</span> : <button type="button" className="gd-wf-save tl-connect" disabled>연결하기</button>}
              </div>
            ))}
          </div>
        </section>

        {/* 2. 사내 공통 */}
        <section className="tl-sec" aria-labelledby="tl-common">
          <header className="tl-head"><h2 id="tl-common" className="gd-sec-t">사내 공통</h2><p className="gd-sec-d">회사가 미리 연결해 둔 도구예요. 필요한 것만 켜서 써요.</p></header>
          <div className="tl-list">
            {common.map(c => (
              <div key={c.id} className="tl-row">
                <span className="tl-ic"><Building2 size={14} aria-hidden /></span>
                <span className="tl-main"><b>{c.name}</b><span>{c.desc}</span></span>
                <button type="button" role="switch" aria-checked={c.on} aria-label={`${c.name} 사용`} className="ob-toggle tl-switch" onClick={() => setCommon(cs => cs.map(x => (x.id === c.id ? { ...x, on: !x.on } : x)))}>
                  <span className="ob-toggle-l">{c.on ? '켜짐' : '꺼짐'}</span><span className="ob-switch" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 직접 등록 */}
        <section className="tl-sec" aria-labelledby="tl-mine">
          <header className="tl-head tl-head-row">
            <div><h2 id="tl-mine" className="gd-sec-t">내가 등록한 도구</h2><p className="gd-sec-d">쓰고 있는 MCP 서버를 직접 등록해요. 팀에 공유하려면 관리자 검토를 거쳐요.</p></div>
            {!open && <button type="button" className="gd-wf-save tl-add" onClick={() => setOpen(true)}><Plus size={13} aria-hidden />MCP 등록</button>}
          </header>
          <div className="tl-list">
            {mine.map(m => (
              <div key={m.id} className="tl-row">
                <span className="tl-ic"><User size={14} aria-hidden /></span>
                <span className="tl-main"><b>{m.name}</b><span>{m.url} · {m.auth} · {m.scope}</span></span>
                <span className={`tl-status ${m.status === '검토 중' ? 'is-wait' : ''}`}>{m.status}</span>
              </div>
            ))}
            {open && (
              <div className="tl-form" role="group" aria-label="MCP 등록">
                <div className="tl-form-top"><b>MCP 등록</b><button type="button" className="gd-map-panel-x" aria-label="닫기" onClick={() => setOpen(false)}><X size={14} /></button></div>
                <label className="gf-field"><span>이름</span><input value={form.name} placeholder="예: 광고주 주간 리포트 시트" onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></label>
                <label className="gf-field"><span>서버 주소</span><input value={form.url} placeholder="https://" onChange={e => setForm(f => ({ ...f, url: e.target.value }))} /></label>
                <div className="tl-form-row">
                  <label className="gf-field"><span>인증</span>
                    <select value={form.auth} onChange={e => setForm(f => ({ ...f, auth: e.target.value }))}><option>OAuth</option><option>API 키</option><option>없음</option></select>
                  </label>
                  <div className="gf-field"><span>공유 범위</span>
                    <div className="gd-segment" role="group" aria-label="공유 범위">
                      {(['나만', '팀'] as const).map(s => <button key={s} type="button" aria-pressed={form.scope === s} onClick={() => setForm(f => ({ ...f, scope: s }))}>{s}</button>)}
                    </div>
                  </div>
                </div>
                <ul className="tl-guard">
                  <li>SpinX는 이 도구를 쓰기 전에 매번 허락을 구해요.</li>
                  <li>도구에는 내 권한 안의 데이터만 보내요. 임직원 전용 자료는 보내지 않아요.</li>
                  {form.scope === '팀' && <li>팀 공유는 관리자 검토 후 켜져요.</li>}
                </ul>
                <div className="tl-form-acts">
                  <button type="button" className="gd-btn-pill gd-btn-inline tl-submit" disabled={!valid} onClick={add}>{form.scope === '팀' ? '검토 요청' : '등록'}</button>
                  {!valid && (form.name || form.url) && <span className="gd-muted tl-hint">이름과 https 주소를 넣어주세요</span>}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </GroundLayout>
  )
}
