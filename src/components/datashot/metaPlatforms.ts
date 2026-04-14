// Meta 플랫폼 value 값
export const metaPlatforms = [
  'audience_network',
  'facebook',
  'instagram',
  'messenger',
  'audience_network&facebook',
  'audience_network&instagram',
  'facebook&instagram',
  'facebook&messenger',
  'instagram&messenger',
  'instagram&whatsapp',
  'audience_network&facebook&instagram',
  'audience_network&facebook&messenger',
  'audience_network&instagram&messenger',
  'facebook&instagram&messenger',
  'audience_network&facebook&instagram&messenger',
] as const

export type MetaPlatform = (typeof metaPlatforms)[number]
