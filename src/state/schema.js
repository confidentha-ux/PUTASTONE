// Renaissance Mirror (PebbleTrail) — 공통 User Data Schema
// 출처: claude/data-state-flow-v1.md, claude/final-analysis-architecture-v1.2.md, 대화 중 사용자가 재확인한 구조:
//
//   USER
//   ├─ Lectio        (Open / Closed / Closing Logic / Opening Condition)
//   ├─ Meditatio      (Default Strategy / Affect / Judgment Process / Pressure Structure)
//   ├─ Speculum Sessions (세션 단위 독립 저장)
//   └─ Judgment Paths  (누적 Evidence에서 생성되는 종합 층)
//
// 원칙(반드시 지킬 것):
//  - 원응답(raw)과 분석값(derived)을 분리해서 저장한다.
//  - Speculum은 세션 단위로 독립 저장한다 — 덮어쓰지 않는다.
//  - 버전 정보를 함께 저장한다(나중에 라우팅/분석 규칙이 바뀌어도 과거 세션이 무엇을 근거로 했는지 추적 가능해야 함).

export const SCHEMA_VERSIONS = {
  meditatioQuestionnaireVersion: "meditatio-v1.0",
  familyRoutingMatrixVersion: "v1",
  personaProtocolVersion: "v1",
  finalAnalysisArchitectureVersion: "v1.2",
};

// ---------------------------------------------------------------------------
// Lectio Object — 항목별 저장 단위
// ---------------------------------------------------------------------------
// {
//   itemId,
//   label,
//   status: "open" | "closed",
//   closingLogic: { text, domain } | null,   // closed 항목의 q3 선택 (구 belief)
//   openingCondition: string | null,          // closed 항목의 q4 답변 ("잘 모르겠다"면 null)
// }
export function makeLectioItemResult({ itemId, label, status, closingLogic = null, openingCondition = null }) {
  return { itemId, label, status, closingLogic, openingCondition };
}

// Lectio 세션 전체
// {
//   completedAt,
//   items: LectioItemResult[],
//   dominantDomain: { domain, n } | null,   // 같은 domain이 2회 이상일 때만 채택 (topAxis 로직 계승)
// }

// ---------------------------------------------------------------------------
// Meditatio Object — 구조화 결과 (raw와 분리)
// ---------------------------------------------------------------------------
// raw: { [questionId]: optionN | optionN[] }  // multi 문항은 배열
// derived: {
//   defaultStrategy: "understanding" | "action" | "connection" | "stability" | "intuition" | null,
//   affect: string[],                          // 수집된 Affect Signal 목록 (중복 허용 → 빈도 계산 가능)
//   judgmentProcess: { attention, evidence, primaryQuestion, confidence, stopping, update },
//   pressure: { trigger, response, maintenance, release },
//   narrative: string,                         // 5단계 공식 문법으로 만든 결과 문장 (규칙 기반 초안)
// }

// ---------------------------------------------------------------------------
// Speculum Session — 세션 단위 독립 저장
// ---------------------------------------------------------------------------
// {
//   sessionId, timestamp, personaId, personaVersion,
//   initialJudgment,
//   operationData: {},        // 페르소나마다 다름
//   newInformation: string,
//   judgmentShift: "same" | "reason_shift" | "different" | "unclear",
//   rejudgment: string,
//   changeStrength: number | null,   // 필요한 경우만 (Final Analysis Architecture v1.2 2번)
//   reflection: string,
//   rawAnswers: {},
//   routingMeta: {
//     source: "recommended" | "user_selected",
//     familyRoutingMatrixVersion: null,
//     familyCandidates: null,
//     eligibilityPassed: null,
//   },
// }
export function makeSpeculumSession(partial) {
  return {
    sessionId: partial.sessionId,
    timestamp: partial.timestamp ?? Date.now(),
    personaId: partial.personaId,
    personaVersion: partial.personaVersion ?? null,
    initialJudgment: partial.initialJudgment ?? "",
    operationData: partial.operationData ?? {},
    newInformation: partial.newInformation ?? "",
    judgmentShift: partial.judgmentShift ?? null,
    rejudgment: partial.rejudgment ?? "",
    changeStrength: partial.changeStrength ?? null,
    reflection: partial.reflection ?? "",
    rawAnswers: partial.rawAnswers ?? {},
    routingMeta: {
      source: partial.routingMeta?.source ?? "user_selected",
      familyRoutingMatrixVersion: partial.routingMeta?.familyRoutingMatrixVersion ?? null,
      familyCandidates: partial.routingMeta?.familyCandidates ?? null,
      eligibilityPassed: partial.routingMeta?.eligibilityPassed ?? null,
    },
  };
}

// ---------------------------------------------------------------------------
// Judgment Paths — 누적 Evidence에서 생성되는 종합 층 (Speculum 세션이 쌓인 뒤에만 생성)
// Final Analysis Architecture v1.2 7번 "V. 나의 Judgment Paths" 5요소를 그대로 따른다.
// ---------------------------------------------------------------------------
// {
//   pathId, generatedAt, basedOnSessionIds: [],
//   start: { text, sourceSessionIds: [] },              // 시작 — 어떤 상황에서 이 흐름이 나타나는가
//   movement: { text, sourceMeditatioIds: [], sourceSessionIds: [] }, // 판단의 움직임
//   criticalMoment: { text, sourceMeditatioIds: [] },   // 중요한 순간
//   releasePoint: { text, sourceSessionIds: [] },       // 다시 움직이는 지점
//   observedChange: { text, sourceSessionIds: [], outcomeType: "shifted" | "confirmed" }, // 확인된 변화
// }

// ---------------------------------------------------------------------------
// 전체 User State 초기값
// ---------------------------------------------------------------------------
export function createInitialUserState() {
  return {
    schemaVersion: 1,
    versions: { ...SCHEMA_VERSIONS },
    profile: {
      // 로그인/인증은 뒷단계(로드맵 8번) — 지금은 로컬 단일 사용자만 가정
      displayName: null,
    },
    lectio: {
      raw: {},          // { [itemId]: { status, q3Index, q4Index } } 원응답
      items: [],         // LectioItemResult[]
      dominantDomain: null,
      completedAt: null,
    },
    meditatio: {
      raw: {},           // { [questionId]: optionN | optionN[] }
      derived: null,      // 완료 시 채워짐 (defaultStrategy/affect/judgmentProcess/pressure/narrative)
      completedAt: null,
    },
    speculumSessions: [], // SpeculumSession[]
    judgmentPaths: [],    // JudgmentPath[]
    judgmentPathsGeneratedAt: null,
    // "첫 여정을 마치며" 화면을 이미 봤는지 — 01·02·03을 처음 한 바퀴 돈 뒤 현재의 돌탑에
    // 처음 들어갈 때 한 번만 보여주고, 그 이후로는 다시 안 보여준다. 로컬에만 저장한다
    // (Supabase 테이블에는 아직 없음 — 기기를 바꾸면 다시 한 번 보일 수 있다).
    hasSeenFirstJourneyEnding: false,
  };
}
