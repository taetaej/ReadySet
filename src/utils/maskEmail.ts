/**
 * 이메일 주소의 로컬 파트를 마스킹 처리합니다.
 * 예: hongkildong@gmail.com -> hong***@gmail.com
 * 
 * @param email - 마스킹할 이메일 주소
 * @returns 마스킹된 이메일 주소
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return email
  }

  const [localPart, domain] = email.split('@')
  
  // 로컬 파트가 4자 이하면 첫 글자만 보이고 나머지 마스킹
  if (localPart.length <= 4) {
    return `${localPart[0]}***@${domain}`
  }
  
  // 로컬 파트가 4자 초과면 앞 4자만 보이고 나머지 마스킹
  const visiblePart = localPart.substring(0, 4)
  return `${visiblePart}***@${domain}`
}
