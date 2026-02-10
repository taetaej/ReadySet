// Scenario 관련 유틸리티 함수

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
