import { describe, it, expect } from 'vitest'
import {
  computeAllocation,
  MediaFixedInput,
  ProductInput,
  AllocationResult
} from './BOStep2'

// 테스트 헬퍼: 간결한 입력 구성
const media = (mediaId: string, isFixed: boolean, fixedAmount = 0): MediaFixedInput => ({ mediaId, isFixed, fixedAmount })
const prod = (mediaId: string, productName: string, isFixed: boolean, fixedAmount = 0): ProductInput => ({ mediaId, productName, isFixed, fixedAmount })

const rules = (r: AllocationResult) => r.errors.map(e => e.rule)
const productOf = (r: AllocationResult, mediaId: string, name: string) =>
  r.products.find(p => p.mediaId === mediaId && p.productName === name)!
const mediaOf = (r: AllocationResult, mediaId: string) => r.media.find(m => m.mediaId === mediaId)!

const M = 10_000  // 만원 단위 축약 (1만 = 10,000원)

describe('computeAllocation — 11개 필수 케이스', () => {
  it('Q1: NAVER 매체잠금 100만 + Meta 비잠금(하위 2상품 모두 잠금 300+500) → R6', () => {
    const r = computeAllocation(
      1000 * M,
      [media('NAVER', true, 100 * M), media('Meta', false)],
      [
        prod('NAVER', 'N1', false),
        prod('Meta', 'M1', true, 300 * M),
        prod('Meta', 'M2', true, 500 * M)
      ]
    )
    expect(rules(r)).toContain('R6')
    // Meta 매체 행: 몫 900만 자동 확정 (하위 전부 잠금)
    const meta = mediaOf(r, 'Meta')
    expect(meta.status).toBe('auto-confirmed')
    expect(meta.amount).toBe(900 * M)
    // NAVER 하위 비잠금 상품: 자동 확정 100만
    const n1 = productOf(r, 'NAVER', 'N1')
    expect(n1.status).toBe('auto-confirmed')
    expect(n1.amount).toBe(100 * M)
  })

  it('C1: 매체잠금없음, TP(2상품 모두잠금 100+100) + TT(1상품잠금100 + 1비잠금) → 통과, TT 자동확정 700만', () => {
    const r = computeAllocation(
      1000 * M,
      [media('TP', false), media('TT', false)],
      [
        prod('TP', 'TP1', true, 100 * M),
        prod('TP', 'TP2', true, 100 * M),
        prod('TT', 'TT1', true, 100 * M),
        prod('TT', 'TT2', false)
      ]
    )
    expect(r.errors).toHaveLength(0)
    const tt2 = productOf(r, 'TT', 'TT2')
    expect(tt2.status).toBe('auto-confirmed')
    expect(tt2.amount).toBe(700 * M)
  })

  it('C2: 매체잠금없음, TP(1상품잠금100) + TT(1상품잠금100), 비잠금상품0, 잔여800만 공중 → R6', () => {
    const r = computeAllocation(
      1000 * M,
      [media('TP', false), media('TT', false)],
      [
        prod('TP', 'TP1', true, 100 * M),
        prod('TT', 'TT1', true, 100 * M)
      ]
    )
    expect(rules(r)).toContain('R6')
    expect(r.remainingBudget).toBe(800 * M)
  })

  it('C5: A매체잠금400 + B매체잠금500, 하위 비잠금, 잔여100만 받을 매체 없음 → R6', () => {
    const r = computeAllocation(
      1000 * M,
      [media('A', true, 400 * M), media('B', true, 500 * M)],
      [
        prod('A', 'A1', false),
        prod('B', 'B1', false)
      ]
    )
    expect(rules(r)).toContain('R6')
    expect(r.remainingBudget).toBe(100 * M)
  })

  it('C6: 잠금없음, A·B 상품 전부 비잠금 → 통과(전부 최적화 대상)', () => {
    const r = computeAllocation(
      1000 * M,
      [media('A', false), media('B', false)],
      [
        prod('A', 'A1', false),
        prod('B', 'B1', false)
      ]
    )
    expect(r.errors).toHaveLength(0)
    expect(r.optimizeProductCount).toBe(2)
    expect(productOf(r, 'A', 'A1').status).toBe('optimize')
    expect(productOf(r, 'B', 'B1').status).toBe('optimize')
  })

  it('C7: 총100만, A매체잠금100만(=총예산), B 상품 비잠금 → B 받을돈 0 → R5', () => {
    const r = computeAllocation(
      100 * M,
      [media('A', true, 100 * M), media('B', false)],
      [
        prod('A', 'A1', false),
        prod('B', 'B1', false)
      ]
    )
    expect(rules(r)).toContain('R5')
  })

  it('C9: 총200만, A매체잠금100+하위1상품잠금100(=매체몫)+1비잠금, B매체잠금100 → A 비잠금상품 0 → R5', () => {
    const r = computeAllocation(
      200 * M,
      [media('A', true, 100 * M), media('B', true, 100 * M)],
      [
        prod('A', 'A1', true, 100 * M),
        prod('A', 'A2', false),
        prod('B', 'B1', false)
      ]
    )
    expect(rules(r)).toContain('R5')
  })

  it('C10: 잠금없음, A(2상품비잠금), B(2상품비잠금) → 통과', () => {
    const r = computeAllocation(
      1000 * M,
      [media('A', false), media('B', false)],
      [
        prod('A', 'A1', false),
        prod('A', 'A2', false),
        prod('B', 'B1', false),
        prod('B', 'B2', false)
      ]
    )
    expect(r.errors).toHaveLength(0)
    expect(r.optimizeProductCount).toBe(4)
  })

  it('C11: 총500만, A매체잠금500 + 하위2상품비잠금 → 통과(최적화 대상 2개)', () => {
    const r = computeAllocation(
      500 * M,
      [media('A', true, 500 * M)],
      [
        prod('A', 'A1', false),
        prod('A', 'A2', false)
      ]
    )
    expect(r.errors).toHaveLength(0)
    expect(r.optimizeProductCount).toBe(2)
    expect(productOf(r, 'A', 'A1').status).toBe('optimize')
    expect(productOf(r, 'A', 'A2').status).toBe('optimize')
  })

  it('C12: NAVER매체잠금100 + Meta비잠금(하위2상품잠금 400+500=900) → 통과, Meta 자동확정 900만', () => {
    const r = computeAllocation(
      1000 * M,
      [media('NAVER', true, 100 * M), media('Meta', false)],
      [
        prod('NAVER', 'N1', false),
        prod('Meta', 'M1', true, 400 * M),
        prod('Meta', 'M2', true, 500 * M)
      ]
    )
    expect(r.errors).toHaveLength(0)
    expect(r.remainingBudget).toBe(0)
    const meta = mediaOf(r, 'Meta')
    expect(meta.status).toBe('auto-confirmed')
    expect(meta.amount).toBe(900 * M)
  })

  it('C13: NAVER매체잠금100 + Meta비잠금(1상품잠금300 + 1비잠금) → 통과, 비잠금상품 자동확정 600만', () => {
    const r = computeAllocation(
      1000 * M,
      [media('NAVER', true, 100 * M), media('Meta', false)],
      [
        prod('NAVER', 'N1', false),
        prod('Meta', 'M1', true, 300 * M),
        prod('Meta', 'M2', false)
      ]
    )
    expect(r.errors).toHaveLength(0)
    const m2 = productOf(r, 'Meta', 'M2')
    expect(m2.status).toBe('auto-confirmed')
    expect(m2.amount).toBe(600 * M)
  })
})

describe('computeAllocation — 추가 엣지 케이스', () => {
  it('E1: 비잠금 매체 2개, 각 매체 하위가 섞여 잠김 → 두 매체 모두 미정(최적화)', () => {
    // A(1잠금100 + 1비잠금), B(1잠금200 + 1비잠금). realFree=[A,B] 2개 → 미정
    const r = computeAllocation(
      1000 * M,
      [media('A', false), media('B', false)],
      [
        prod('A', 'A1', true, 100 * M),
        prod('A', 'A2', false),
        prod('B', 'B1', true, 200 * M),
        prod('B', 'B2', false)
      ]
    )
    expect(r.errors).toHaveLength(0)
    expect(productOf(r, 'A', 'A2').status).toBe('optimize')
    expect(productOf(r, 'B', 'B2').status).toBe('optimize')
    expect(r.optimizeProductCount).toBe(2)
  })

  it('E2: R4 — 전체 잠금 합이 총예산 초과', () => {
    const r = computeAllocation(
      100 * M,
      [media('A', true, 80 * M), media('B', true, 80 * M)],
      [prod('A', 'A1', false), prod('B', 'B1', false)]
    )
    expect(rules(r)).toContain('R4')
    expect(r.remainingBudget).toBeLessThan(0)
  })

  it('E3: 비잠금 매체 1개 + 하위 2상품 비잠금 → 매체 몫 확정이나 상품은 모델이 나눔(최적화)', () => {
    // 단일 토글-비잠금 매체, 하위 2비잠금 → 매체행은 optimize(비잠금상품>=2)
    const r = computeAllocation(
      1000 * M,
      [media('NAVER', true, 300 * M), media('Meta', false)],
      [
        prod('NAVER', 'N1', false),
        prod('Meta', 'M1', false),
        prod('Meta', 'M2', false)
      ]
    )
    expect(r.errors).toHaveLength(0)
    // Meta 몫 = 700만 확정 → 매체 행은 자동확정(몫 700만), 하위 2비잠금 상품은 모델이 나눔 → optimize
    const meta = mediaOf(r, 'Meta')
    expect(meta.status).toBe('auto-confirmed')
    expect(meta.amount).toBe(700 * M)
    expect(productOf(r, 'Meta', 'M1').status).toBe('optimize')
    expect(productOf(r, 'Meta', 'M2').status).toBe('optimize')
    expect(r.optimizeProductCount).toBe(2)
  })

  it('E4: 혼합 — 실질 자유 매체 1개(하위 비잠금) + 전부잠금 매체 1개 + 매체잠금 매체 1개', () => {
    // 총 1000. X 매체잠금 200(하위 비잠금 1상품). Y 비잠금 전부잠금(100+100). Z 비잠금 1상품 비잠금.
    // freeByToggle=[Y,Z], Y 전부잠금 → realFree=[Z] 1개.
    // Z 몫 = 1000 − 매체잠금(X 200) − Y childLock(200) = 600 → Z1 자동확정 600만.
    const r = computeAllocation(
      1000 * M,
      [media('X', true, 200 * M), media('Y', false), media('Z', false)],
      [
        prod('X', 'X1', false),
        prod('Y', 'Y1', true, 100 * M),
        prod('Y', 'Y2', true, 100 * M),
        prod('Z', 'Z1', false)
      ]
    )
    expect(r.errors).toHaveLength(0)
    const z1 = productOf(r, 'Z', 'Z1')
    expect(z1.status).toBe('auto-confirmed')
    expect(z1.amount).toBe(600 * M)
    // X 하위 비잠금 상품: 매체 몫 200만 자동확정
    const x1 = productOf(r, 'X', 'X1')
    expect(x1.status).toBe('auto-confirmed')
    expect(x1.amount).toBe(200 * M)
  })

  it('E5: 매체 3개 잠금(10+10+50) + 비잠금 매체 1개(하위 1상품) → 매체행·상품 모두 자동확정 30만', () => {
    // 총 100만. A·B·C 매체잠금. D 비잠금 + 하위 1상품 비잠금.
    // D 몫 = 100 − (10+10+50) = 30만 확정, 비잠금 상품 1개 → 자동확정 30만.
    const r = computeAllocation(
      100 * M,
      [media('A', true, 10 * M), media('B', true, 10 * M), media('C', true, 50 * M), media('D', false)],
      [
        prod('A', 'A1', false),
        prod('B', 'B1', false),
        prod('C', 'C1', false),
        prod('D', 'D1', false)
      ]
    )
    expect(r.errors).toHaveLength(0)
    // D 매체 행: 자동확정 30만
    const d = mediaOf(r, 'D')
    expect(d.status).toBe('auto-confirmed')
    expect(d.amount).toBe(30 * M)
    // D 하위 상품: 자동확정 30만
    const d1 = productOf(r, 'D', 'D1')
    expect(d1.status).toBe('auto-confirmed')
    expect(d1.amount).toBe(30 * M)
    // A·B·C 하위 비잠금 상품: 각 매체 몫 자동확정
    expect(productOf(r, 'C', 'C1').status).toBe('auto-confirmed')
    expect(productOf(r, 'C', 'C1').amount).toBe(50 * M)
    // 최적화 대상 0개 (전부 자동확정)
    expect(r.optimizeProductCount).toBe(0)
  })

  it('E7: 매체잠금만으로 총예산 소진 + 최적화 매체 2개 존재 → 줄 돈 0 → R5 (매체 간 배분0)', () => {
    // 총 100만. M0 매체잠금 59만, M3 매체잠금 41만 (합 100만 = 총예산 → 전역 잔여 0).
    // M1·M2 비잠금 매체(하위 비잠금) → 실질 자유 매체 2개지만 받을 돈 0.
    // 과거 R5(확정 매체만)·R6(실질자유 0개만) 사이로 빠지던 사각지대. 속성 테스트로 발견.
    const r = computeAllocation(
      100 * M,
      [media('M0', true, 59 * M), media('M1', false), media('M2', false), media('M3', true, 41 * M)],
      [
        prod('M0', 'a', false),
        prod('M1', 'b', false),
        prod('M2', 'c', false),
        prod('M3', 'd', false)
      ]
    )
    expect(rules(r)).toContain('R5')
  })

  it('E6: 매체3개 각 하위3상품. 매체1·2 잠금. 매체3 비잠금(하위3상품 비잠금) → 매체3 행=자동확정(몫), 하위상품=최적화', () => {
    // 총 1000만. M1 매체잠금 300, M2 매체잠금 200. M3 비잠금 + 하위 3상품 비잠금.
    // M3 몫 = 1000 − 500 = 500만 확정 (비잠금 매체 M3 하나뿐).
    // → M3 매체 행: 자동확정 500만 (매체 총 몫은 정해짐)
    // → M3 하위 3상품: 500만을 모델이 나눔 → 최적화 대상
    const r = computeAllocation(
      1000 * M,
      [media('M1', true, 300 * M), media('M2', true, 200 * M), media('M3', false)],
      [
        prod('M1', 'a', false), prod('M1', 'b', false), prod('M1', 'c', false),
        prod('M2', 'd', false), prod('M2', 'e', false), prod('M2', 'f', false),
        prod('M3', 'g', false), prod('M3', 'h', false), prod('M3', 'i', false)
      ]
    )
    expect(r.errors).toHaveLength(0)
    // M3 매체 행: 몫 500만 확정
    const m3 = mediaOf(r, 'M3')
    expect(m3.status).toBe('auto-confirmed')
    expect(m3.amount).toBe(500 * M)
    // M3 하위 상품: 최적화 대상 (모델이 500만을 셋으로 나눔)
    expect(productOf(r, 'M3', 'g').status).toBe('optimize')
    expect(productOf(r, 'M3', 'h').status).toBe('optimize')
    expect(productOf(r, 'M3', 'i').status).toBe('optimize')
    // M1·M2는 매체잠금이지만 하위 상품이 비잠금 → 그 매체 잠금액 안에서 모델이 나눔 → 최적화 대상
    expect(productOf(r, 'M1', 'a').status).toBe('optimize')
    expect(productOf(r, 'M2', 'd').status).toBe('optimize')
    // 매체 행은 셋 다 몫 확정: M1·M2는 잠금(fixed), M3는 자동확정
    expect(mediaOf(r, 'M1').status).toBe('fixed')
    expect(mediaOf(r, 'M2').status).toBe('fixed')
    // 최적화 대상 상품 = 9개 (3매체 × 하위 3상품, 전부 비잠금)
    expect(r.optimizeProductCount).toBe(9)
  })
})
