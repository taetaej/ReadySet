// Scenario 관련 유틸리티 함수

// 리치커브 구간 생성 함수 (옵션 A: 마지막 구간을 예산 상한으로 제한)
export const generateReachCurveIntervals = (
  minBudget: number,
  maxBudget: number,
  intervalAmount: number
): number[] => {
  const intervals: number[] = []
  let currentBudget = minBudget
  
  while (currentBudget < maxBudget) {
    intervals.push(currentBudget)
    currentBudget += intervalAmount
  }
  
  // 마지막 구간을 예산 상한으로 추가 (중복 방지)
  if (intervals[intervals.length - 1] !== maxBudget) {
    intervals.push(maxBudget)
  }
  
  return intervals
}

// 구간 수로부터 구간별 금액 계산
export const calculateIntervalAmount = (
  minBudget: number,
  maxBudget: number,
  intervalCount: number
): number => {
  return Math.ceil((maxBudget - minBudget) / intervalCount)
}

// 구간별 금액으로부터 실제 구간 수 계산
export const calculateActualIntervalCount = (
  minBudget: number,
  maxBudget: number,
  intervalAmount: number
): number => {
  const intervals = generateReachCurveIntervals(minBudget, maxBudget, intervalAmount)
  return intervals.length
}

// 숫자를 한글로 변환
export const numberToKorean = (num: number): string => {
  if (num === 0) return ''
  
  const koreanNumbers = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
  const units = ['', '만', '억', '조']
  const smallUnits = ['', '십', '백', '천']
  
  let result = ''
  let unitIndex = 0
  
  while (num > 0) {
    const part = num % 10000
    if (part > 0) {
      let partStr = ''
      let tempPart = part
      let smallUnitIndex = 0
      
      while (tempPart > 0) {
        const digit = tempPart % 10
        if (digit > 0) {
          // 1은 십백천 앞에서 생략, 만억조 앞에서는 표시
          if (digit === 1 && smallUnitIndex > 0) {
            partStr = smallUnits[smallUnitIndex] + partStr
          } else {
            partStr = koreanNumbers[digit] + smallUnits[smallUnitIndex] + partStr
          }
        }
        tempPart = Math.floor(tempPart / 10)
        smallUnitIndex++
      }
      
      result = partStr + units[unitIndex] + result
    }
    num = Math.floor(num / 10000)
    unitIndex++
  }
  
  return result + '원'
}

