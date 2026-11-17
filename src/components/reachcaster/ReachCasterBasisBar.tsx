import { AnalysisBasisBar } from '../common/AnalysisBasisBar'

/** Reach Caster 결과(Reach Predictor / Ratio Finder) 공통 분석 근거 슬롯 */
export function ReachCasterBasisBar() {
  return (
    <AnalysisBasisBar
      model="reachcaster"
      population={{ value: '46,039,423명', basis: '통계청 (2024년)' }}
      dataSource={
        <div className="font-[Paperlogy,sans-serif] text-[12px] leading-[1.6]">
          <div className="text-[13px] font-semibold mb-2">데이터 출처</div>
          <div className="mb-[10px]">
            <div className="font-semibold mb-1">Digital</div>
            <div className="text-[hsl(var(--muted-foreground))]">
              CJ 메조미디어가 실제 집행한 캠페인 데이터에 매체 간 중복 이용률, 매체 리텐션 데이터를 적용해 GBRT 기반 모델이 도달률을 예측합니다.
            </div>
            <div className="text-[hsl(var(--muted-foreground))] text-[11px] mt-1 opacity-80">※ 분석 범위: 모바일 앱(App) 환경에 한정</div>
          </div>
          <div className="mb-[10px]">
            <div className="font-semibold mb-1">TVC</div>
            <div className="text-[hsl(var(--muted-foreground))]">
              방송통계포털(시청점유율), 방송매체 이용행태조사, 통계청 인구총조사를 기반으로 타겟별 도달률을 산출합니다.
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1">통합 도달률</div>
            <div className="text-[hsl(var(--muted-foreground))]">
              Digital과 TVC 간 중복 시청자를 자체 확률 모델로 보정하여 순 도달(Net Reach)을 산출합니다.
            </div>
          </div>
        </div>
      }
    />
  )
}
