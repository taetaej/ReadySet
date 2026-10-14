import { describe, it, expect } from 'vitest'
import { computeAllocation, MediaFixedInput, ProductInput, AllocationResult } from './BOStep2'

// ─────────────────────────────────────────────────────────────
// 속성 기반 테스트 (property-based)
// 랜덤 입력을 수천 개 생성해, "항상 참이어야 하는 불변식"이 깨지는 입력을 찾는다.
// 사람이 떠올리지 못한 조합을 기계가 공격한다.
// ─────────────────────────────────────────────────────────────

// 시드 가능한 간단한 PRNG (재현 가능하도록)
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

const UNIT = 10_000 // 만원 단위 (금액은 만원 배수로 생성 → 깔끔한 정수 비교)

// 랜덤 시나리오 생성 — R1(계층 제약)·R3(잠금 금액>0)를 위반하지 않는 '유효 입력'만 생성.
// (computeAllocation은 R4/R5/R6만 담당. R1/R3는 BOStep2의 별도 로직이므로,
//  property test는 R1/R3를 통과한 유효 입력에 대해 R4/R5/R6 + 상태 판정의 불변식을 공격한다.)
function genScenario(rng: () => number) {
  const mediaCount = 1 + Math.floor(rng() * 4) // 1~4 매체
  const totalMan = 10 + Math.floor(rng() * 200) // 10~210 만원
  const totalBudget = totalMan * UNIT

  const mediaFixed: MediaFixedInput[] = []
  const products: ProductInput[] = []

  for (let m = 0; m < mediaCount; m++) {
    const mediaId = `M${m}`
    const mediaLocked = rng() < 0.4
    const prodCount = 1 + Math.floor(rng() * 3) // 1~3 상품

    if (mediaLocked) {
      // 매체 잠금: 하위 일부를 잠그되 하위 잠금합 ≤ 매체액 유지(R1 준수), 비잠금 상품 1개 이상 보장.
      const mediaAmt = (5 + Math.floor(rng() * 60)) * UNIT
      mediaFixed.push({ mediaId, isFixed: true, fixedAmount: mediaAmt })
      let budgetLeft = mediaAmt
      for (let p = 0; p < prodCount; p++) {
        const isLast = p === prodCount - 1
        // 마지막 상품은 비잠금으로 둬 R1(하위 전부 잠금 시 합=매체액) 복잡도 회피
        const lock = !isLast && rng() < 0.4 && budgetLeft > 2 * UNIT
        if (lock) {
          const amt = (1 + Math.floor(rng() * ((budgetLeft / UNIT) - 1))) * UNIT
          budgetLeft -= amt
          products.push({ mediaId, productName: `${mediaId}-p${p}`, isFixed: true, fixedAmount: amt })
        } else {
          products.push({ mediaId, productName: `${mediaId}-p${p}`, isFixed: false, fixedAmount: 0 })
        }
      }
    } else {
      // 매체 비잠금: 하위 상품은 잠금/비잠금 랜덤. 잠긴 상품은 금액 > 0 (R3 준수).
      mediaFixed.push({ mediaId, isFixed: false, fixedAmount: 0 })
      for (let p = 0; p < prodCount; p++) {
        const prodLocked = rng() < 0.45
        const prodAmt = (1 + Math.floor(rng() * 40)) * UNIT
        products.push({ mediaId, productName: `${mediaId}-p${p}`, isFixed: prodLocked, fixedAmount: prodLocked ? prodAmt : 0 })
      }
    }
  }
  return { totalBudget, mediaFixed, products }
}

// 불변식 검사 — 위반 시 메시지 반환, 통과 시 null
function checkInvariants(
  totalBudget: number,
  mediaFixed: MediaFixedInput[],
  products: ProductInput[],
  r: AllocationResult
): string | null {
  const hasError = r.errors.length > 0
  const mediaOf = (id: string) => r.media.find(m => m.mediaId === id)!

  // INV-1: 모든 상품은 정확히 하나의 상태를 가진다 (fixed/auto-confirmed/optimize)
  for (const p of r.products) {
    if (!['fixed', 'auto-confirmed', 'optimize'].includes(p.status)) {
      return `INV-1 위반: 상품 ${p.productName} 상태 비정상 ${p.status}`
    }
    // 잠긴 상품은 반드시 fixed
    const input = products.find(x => x.mediaId === p.mediaId && x.productName === p.productName)!
    if (input.isFixed && p.status !== 'fixed') return `INV-1: 잠긴 상품인데 fixed 아님 ${p.productName}`
    if (!input.isFixed && p.status === 'fixed') return `INV-1: 안 잠긴 상품인데 fixed ${p.productName}`
  }

  // INV-2: auto-confirmed 상품/매체는 금액이 숫자, optimize는 null
  for (const p of r.products) {
    if (p.status === 'auto-confirmed' && (p.amount === null || typeof p.amount !== 'number')) {
      return `INV-2: auto-confirmed 상품인데 금액 없음 ${p.productName}`
    }
    if (p.status === 'optimize' && p.amount !== null) {
      return `INV-2: optimize 상품인데 금액 있음 ${p.productName}`
    }
  }

  // INV-3: 상품 상태 ↔ 매체 상태 일관성
  //   매체 몫이 미정(optimize)이면 그 하위 비잠금 상품은 auto-confirmed일 수 없다
  for (const p of r.products) {
    if (p.status === 'fixed') continue
    const media = mediaOf(p.mediaId)
    if (media.status === 'optimize' && p.status === 'auto-confirmed') {
      return `INV-3: 매체 ${p.mediaId}는 optimize인데 하위 상품 ${p.productName}이 auto-confirmed`
    }
  }

  // INV-4 (에러 없을 때): 예산 보존.
  //   확정된 돈(잠금 매체 + 자동배정 매체) 합 + (최적화 매체들이 받을 전역 잔여) = 총예산.
  //   확정 매체 합은 반드시 ≤ 총예산 이어야 하고,
  //   최적화 매체가 하나라도 있으면 (총예산 − 확정합) ≥ 0 이어야 한다.
  if (!hasError) {
    let confirmedMediaSum = 0 // fixed + auto-confirmed 매체 몫
    let optimizeMediaCount = 0
    for (const media of r.media) {
      if (media.status === 'fixed' || media.status === 'auto-confirmed') {
        confirmedMediaSum += media.amount ?? 0
      } else {
        optimizeMediaCount++
      }
    }
    if (optimizeMediaCount === 0) {
      // 모든 매체 몫이 확정 → 합이 정확히 총예산이어야 (잔여 공중부양이면 R6로 걸렸어야 함)
      if (confirmedMediaSum !== totalBudget) {
        return `INV-4a: 에러 없고 전부 확정 매체인데 합(${confirmedMediaSum}) ≠ 총예산(${totalBudget})`
      }
    } else {
      // 최적화 매체 존재 → 확정합 ≤ 총예산, 남은 몫(총예산−확정합)이 그 매체들에게 간다
      if (confirmedMediaSum > totalBudget) {
        return `INV-4b: 확정 매체 합(${confirmedMediaSum}) > 총예산(${totalBudget})인데 에러 없음`
      }
      if (totalBudget - confirmedMediaSum <= 0) {
        return `INV-4c: 최적화 매체가 있는데 받을 몫(${totalBudget - confirmedMediaSum}) ≤ 0 이고 에러 없음`
      }
    }
  }

  // INV-4d (에러 없을 때): 상품 레벨 총합 보존 — 가장 근본적인 불변식.
  //   각 상품이 받을 돈의 합이 총예산과 맞아야 한다.
  //   fixed = 잠금액, auto-confirmed = amount(확정), optimize = 금액 미정(모델이 나눔).
  //   → optimize 상품/매체가 하나도 없으면: 확정 금액 총합 === 총예산.
  //   → optimize가 있으면: 확정 금액 총합 < 총예산 (남은 돈을 optimize가 받음).
  if (!hasError) {
    // 상품 레벨 확정 금액: fixed 상품 + auto-confirmed 상품.
    // 단, 하위가 전부 잠긴 '매체 자동배정'은 상품 레벨에 안 나타나므로 매체 몫으로 보정.
    let confirmedProductSum = 0
    for (const p of r.products) {
      if (p.status === 'fixed') confirmedProductSum += p.amount ?? 0
      else if (p.status === 'auto-confirmed') confirmedProductSum += p.amount ?? 0
    }
    const anyOptimize =
      r.products.some(p => p.status === 'optimize') || r.media.some(m => m.status === 'optimize')
    if (!anyOptimize) {
      if (confirmedProductSum !== totalBudget) {
        return `INV-4d: 에러 없고 최적화 대상 전무인데 상품 확정합(${confirmedProductSum}) ≠ 총예산(${totalBudget})`
      }
    } else {
      if (confirmedProductSum > totalBudget) {
        return `INV-4d: 상품 확정합(${confirmedProductSum}) > 총예산(${totalBudget})인데 에러 없음`
      }
    }
  }

  // INV-5 (에러 없을 때): auto-confirmed 금액은 > 0 이어야 한다 (0 이하면 R5가 떠야 함)
  if (!hasError) {
    for (const p of r.products) {
      if (p.status === 'auto-confirmed' && (p.amount as number) <= 0) {
        return `INV-5: 에러 없는데 auto-confirmed 상품 금액 ≤ 0 (${p.productName}=${p.amount})`
      }
    }
  }

  // INV-6 (에러 없을 때): 전역 잔여가 음수면 반드시 에러여야 한다 (R4)
  if (!hasError && r.remainingBudget < 0) {
    return `INV-6: 전역 잔여 음수(${r.remainingBudget})인데 에러 없음`
  }

  // INV-7: optimizeProductCount는 실제 optimize 상품 수와 일치
  const actualOpt = r.products.filter(p => p.status === 'optimize').length
  if (r.optimizeProductCount !== actualOpt) {
    return `INV-7: optimizeProductCount(${r.optimizeProductCount}) ≠ 실제(${actualOpt})`
  }

  // INV-8 (에러 없을 때): 전역 잔여 > 0 이면, 그걸 받을 '수령처'가 존재해야 한다.
  //   수령처 = optimize 항목(모델이 나눔) 또는 auto-confirmed 항목(금액 확정으로 받음).
  //   둘 다 없으면 잔여가 공중에 뜸 → R6가 떠야 하므로, 에러 없이 이 상태면 위반.
  if (!hasError && r.remainingBudget > 0) {
    const anyReceiver =
      r.products.some(p => p.status === 'optimize' || p.status === 'auto-confirmed') ||
      r.media.some(m => m.status === 'optimize' || m.status === 'auto-confirmed')
    if (!anyReceiver) {
      return `INV-8: 에러 없는데 잔여(${r.remainingBudget})>0 이고 수령처 없음`
    }
  }

  return null
}

describe('computeAllocation — 속성 기반 테스트 (랜덤 공격)', () => {
  it('50000개 랜덤 시나리오에서 불변식이 깨지지 않는다', () => {
    const N = 50000
    const failures: string[] = []
    for (let seed = 1; seed <= N; seed++) {
      const rng = makeRng(seed)
      const { totalBudget, mediaFixed, products } = genScenario(rng)
      let r: AllocationResult
      try {
        r = computeAllocation(totalBudget, mediaFixed, products)
      } catch (e) {
        failures.push(`seed ${seed}: 예외 발생 ${(e as Error).message}`)
        continue
      }
      const violation = checkInvariants(totalBudget, mediaFixed, products, r)
      if (violation) {
        failures.push(`seed ${seed}: ${violation}\n  입력: total=${totalBudget}, media=${JSON.stringify(mediaFixed)}, products=${JSON.stringify(products)}`)
      }
    }
    if (failures.length > 0) {
      // 처음 5개만 출력 (가독성)
      throw new Error(`${failures.length}개 불변식 위반:\n` + failures.slice(0, 5).join('\n'))
    }
    expect(failures).toHaveLength(0)
  })
})
