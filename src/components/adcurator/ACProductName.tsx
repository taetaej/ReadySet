import { Fragment } from 'react'

/**
 * 광고상품명 표시: 카탈로그 원문 그대로 두되, `_`·공백 뒤에서 먼저 줄바꿈되게 함
 * (`CPA`처럼 단어 중간이 끊기지 않게. 한 덩어리가 칸보다 길 때만 글자 단위로 끊김)
 */
export function ACProductName({ name }: { name: string }) {
  const parts = name.split(/(?<=_)/)
  return (
    <span className="[overflow-wrap:anywhere]">
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p}
          {i < parts.length - 1 && <wbr />}
        </Fragment>
      ))}
    </span>
  )
}
