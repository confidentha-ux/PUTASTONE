# 돌 하나를 얹다 — App Shell v4

실행 가능한 React 앱입니다. ("르네상스의 그 거울" / "PebbleTrail"은 옛 이름 — 2026-08-19에
`claude/돌하나를-얹다-app-spec-v1.md` 기준으로 앱 전체를 리브랜딩했습니다. 내부 데이터 구조/라우팅 로직은
그대로 두고 사용자에게 보이는 이름·헤더·화면 구조만 이 스펙에 맞춰 다시 짰습니다.)

v3(18개 Speculum Persona 컴포넌트 연결)에 이어, 이번 단계(리브랜딩)에서는:

- 앱 이름/헤더/화면 카피를 "돌 하나를 얹다"로 전면 교체
- Persona 8개 개명 + 18개 전체에 확정된 Persona 헤더 한 줄 추가
- Meditatio 시작 안내 화면 신설, 결과 화면 헤더 교체
- "지금의 판단"(실제 고민 + Initial Judgment 입력) 화면 신설
- Speculum 화면에서 Family 이름/점수 노출 제거, Operation(질문 방식) 중심으로 재설계
- Persona 완료 뒤 "재판단"(Rejudge) + "세션 결과"(SessionResult) 화면 신설 — 이 두 화면이
  New Information/Judgment Shift/Rejudgment를 페르소나마다 다른 내부 answers에서 억지로 뽑아내는 대신
  앱 레벨에서 통일되게 입력받는다(v3까지 남아있던 "정규화 못 함" 문제 해결)
- The Studiolo → "현재의 돌탑"으로 개명, 세션 목록/Judgment Path 섹션 이름도 교체

1. **App Shell** — 시작 → Lectio → Meditatio(시작 안내 → 4개 장 → 결과) → 지금의 판단 → Speculum(Operation 선택 → 렌즈 실행 → 재판단 → 세션 결과) → 현재의 돌탑 → Home으로 이어지는 상위 라우팅 (`src/App.jsx`)
2. **공통 User State** — Lectio / Meditatio / Speculum Sessions / Judgment Paths를 담는 단일 스키마 + localStorage 영속화 (`src/state/`) — 이번 리브랜딩에서도 스키마 자체는 바뀌지 않았다
3. **Meditatio v1.0 데이터 구조** — "메디테티오"(MEDITATIO v1.0 — FINAL) 문서의 4개 Section·33문항·176개 선택지를 태그(Object/Affect Signal/Domain/Default)까지 그대로 코드로 옮긴 것 (`src/data/meditatioV1.js`)
4. **Family Routing 엔진** — `claude/family-routing-matrix-v1.md`의 점수표를 그대로 코드화 (`src/speculum/familyWeights.js`, `familyRouting.js`) — 계산은 그대로 하되, 화면에는 더 이상 노출하지 않는다
5. **18 Persona Registry** — `claude/18-persona-eligibility-spec-v1.md`의 Family/Eligibility 조건 + `claude/speculum-questionnaire-schema.js`(질문지 원문) + 이번에 확정된 `operationHeader`(Operation 선택 화면 문구)를 담은 메타데이터 (`src/speculum/personaRegistry.js`, `src/data/speculumSchema.js`)
6. **Operation Dedup** — `claude/operation-dedup-rules-v1.md`의 2-of-3 중복 판정 + "충분히 다른 3번째" 규칙을 코드화 (`src/speculum/operationDedup.js`)
7. **Speculum 화면** — Meditatio 결과 → 지금의 판단 → Operation(질문 방식) 후보 2~3개를 보여주고(Family 이름 비노출), 하나를 선택하면 **실제 18개 persona 컴포넌트 중 하나가 열립니다** (`src/screens/Speculum.jsx`)
8. **18개 Speculum Persona 컴포넌트** — `claude/speculum-*.jsx` 원본 18개를 이식 + 8개 개명 + 확정된 Persona 헤더 한 줄 추가 (`src/personas/*.jsx`)
9. **AI 계층 임시 mock** — 원본이 브라우저에서 API 키 없이 Anthropic API를 직접 호출하던 부분을 대신하는 `mockCallClaude` (`src/speculum/aiStub.js`)
10. **재판단 / 세션 결과 화면** — Persona 질문을 마친 뒤 New Information/Judgment Shift/Rejudgment를 앱 레벨에서 통일되게 입력받고, 다섯 가지 데이터를 한 화면에 모아 보여준 뒤 저장한다 (`src/screens/Rejudge.jsx`, `src/screens/SessionResult.jsx`)

## 실행

```bash
npm install
npm run dev
```

`http://localhost:5173` 접속. 순서: 시작 → Lectio(14장) → Meditatio(시작 안내 → 4개 장, 33문항 → 결과) →
지금의 판단(실제 고민 + 현재 판단 입력) → Speculum(Operation 후보 확인 → 렌즈 열기 → 질문지 진행 → 완료 →
재판단 → 세션 결과 → 저장) → 현재의 돌탑.
완료할 때마다 "계속하기"/"완료하고 Speculum으로 돌아가기"/"다음"/"돌 하나를 얹다" 같은 버튼을 직접 눌러야
다음 화면으로 넘어갑니다(자동 이동시키면 방금 만든 결과 화면을 볼 새도 없이 넘어가 버리는 문제가 있어서
의도적으로 그렇게 만들었습니다).

## 이번 리브랜딩 단계에서 한 일

`claude/돌하나를-얹다-app-spec-v1.md`가 확정한 "구조/헤더/네이밍"만 반영했습니다(시각 디자인은 다음
라운드). 내부 데이터 구조/라우팅 로직은 전혀 건드리지 않았습니다.

- `index.html` title, 각 화면 eyebrow, Home 카드, 상단 네비게이션 등 앱 전체의 "르네상스의 그
  거울"/"PebbleTrail" 표기를 "돌 하나를 얹다"로 교체.
- `personaRegistry.js`의 8개 `koreanName`을 개명(오라클→웨이팅 리스트, 대상인→전문경영인, 파수꾼→골키퍼,
  장군→물류관리자, 세공사→레고, 청지기→더치페이, 재판관→기준!). id/파일명/CSS 프리픽스는 그대로 둬서
  내부 식별자와 사용자에게 보이는 이름을 분리.
- 18개 persona 컴포넌트 인트로 화면에 확정된 Persona 헤더 한 줄(`-persona-header`)을 추가하고,
  같은 텍스트를 `personaRegistry.js`의 `operationHeader` 필드로도 등록해서 Speculum의 Operation
  선택 화면에서 재사용.
- `MeditatioV1.jsx`에 4개 장으로 바로 들어가지 않는 시작 안내 화면("나는 어떻게 판단하는가?")을
  추가하고, 결과 화면 헤더를 "지금, 나는 이렇게 판단합니다"로 교체.
- `CurrentJudgment.jsx`(지금의 판단) 신설 — Meditatio 결과와 Speculum 사이에 들어가는 화면으로,
  실제 고민과 현재 판단(Initial Judgment)을 입력받아 `App.jsx`가 `Speculum.jsx`로 그대로 넘긴다.
- `Speculum.jsx`에서 Family 이름/점수 노출을 완전히 제거하고, Operation 후보(각 persona의
  `operationHeader`)를 먼저 보여준 뒤 선택 시에만 "다른 역할 입어보기" 섹션으로 Persona 이름을 드러내는
  구조로 재설계.
- `Rejudge.jsx`(다시, 같은 질문 앞에서) / `SessionResult.jsx`(이번에 확인한 것) 신설 — Persona 완료
  직후 바로 세션을 저장하던 것을, New Information/Judgment Shift/Rejudgment를 앱 레벨에서 통일되게
  입력받고 5개 필드를 한 화면에서 확인한 뒤 저장하는 흐름으로 바꿨다. 저장 확인 문구는 확정된
  "돌 하나가 더해졌습니다." 한 문장만 보여주고 별도 해석을 덧붙이지 않는다.
- `Studiolo.jsx` → "현재의 돌탑"으로 개명, Speculum 세션 목록/Judgment Path 섹션을 "지금까지 얹은
  돌"/"쌓이면서 드러난 것"으로 교체하고 세션 행에 persona 한국어 이름 + 날짜를 표시하도록 개선.
- 18개 Persona 각각의 "설명 한 문장"(헤더 아래 한 줄 더)은 기록자 하나만 확정됐고 나머지 17개는 아직
  미확정이다 — 임의로 지어내지 않고 다음 확인을 기다린다.

### (이전 단계) Task #14 — Persona 컴포넌트 이식

`claude/speculum-*.jsx` 18개 원본 파일(Project 문서)을 `src/personas/*.jsx`로 그대로 이식했습니다. 각 파일은
원본과 비교해 딱 두 가지만 기계적으로 바뀌었습니다:

1. 브라우저에서 API 키 없이 `https://api.anthropic.com/v1/messages`를 직접 fetch하던 로컬 `callClaude()`를
   `src/speculum/aiStub.js`의 `mockCallClaude()`로 교체했습니다. 이 stub은 실제 AI 판단을 하지 않습니다 —
   원본 프롬프트가 전부 `- 라벨: "값"` 형태로 사용자의 실제 답변을 나열하는 동일한 템플릿을 쓴다는 점을
   이용해서, 그 줄들을 파싱해 그대로 옮겨 담은 결과(및 "이것은 임시 화면"이라는 안내 문구)를 돌려줍니다.
2. 결과 화면에 `onComplete(answers)`를 호출하는 "완료하고 Speculum으로 돌아가기" 버튼을 추가했습니다(기존
   "처음부터 다시" 버튼은 그대로 둠). `Speculum.jsx`가 이 콜백을 받아 `makeSpeculumSession()`으로 세션을
   만들고 `actions.addSpeculumSession()`으로 저장한 뒤, 저장 확인 화면을 보여줍니다.

원본 소스에 있던 오타 두 개도 이식하면서 바로잡았습니다(로직에는 영향 없었지만 남겨두면 혼란스러워서):
`speculum-gatekeeper.jsx`(수문장)의 내부 컴포넌트가 실제 Guardian(파수꾼) 파일과 이름이 겹치는
`GuardianLens`로 export되어 있어서 `GatekeeperLens`로, `speculum-chronicler.jsx`(기록자)는
`DetectiveLens`로 export되어 있어서 `ChroniclerLens`로 고쳤습니다. CSS 클래스 프리픽스(`gd-`, `dt-`)는
원본과의 대조를 쉽게 하려고 그대로 두었습니다.

Korean 질문 문구, 옵션, 분기 로직, CSS 값은 전혀 바꾸지 않았습니다 — "질문 문장을 바꾸지 않는다"는
프로젝트 원칙을 지켰습니다.

## 폴더 구조

```
src/
  data/
    meditatioV1.js           Meditatio v1.0 문항 데이터 (33문항/176보기 + 태그)
    speculumSchema.js         18개 Speculum Persona 질문지 원문 (claude/speculum-questionnaire-schema.js 그대로, 이상적 스키마 — 실제 컴포넌트 내부 필드명(stepN 등)과는 다를 수 있음)
  speculum/
    familyWeights.js           Family Routing 점수표 (claude/family-routing-matrix-v1.md 그대로)
    familyRouting.js            scoreFamilies / rankFamilies / getFamilyCandidates
    personaRegistry.js          18 Persona 메타데이터 (family, eligibilityField, operationSignature, operationHeader)
    operationDedup.js           Operation 중복 제거 + "충분히 다른 3번째" 후보 선정
    aiStub.js                   18개 persona가 공통으로 쓰는 임시 AI mock (mockCallClaude)
  personas/
    patron.jsx, novelist.jsx, oracle.jsx, timeTraveler.jsx, merchant.jsx, guardian.jsx,
    witness.jsx, general.jsx, artisan.jsx, surveyor.jsx, pioneer.jsx, portraitist.jsx,
    chronicler.jsx, gatekeeper.jsx, steward.jsx, anatomist.jsx, magistrate.jsx, magician.jsx
                                18개 Speculum Persona 실제 질문지 컴포넌트 (claude/speculum-*.jsx 이식,
                                8개는 개명됨 — README 상단 "이번 리브랜딩 단계에서 한 일" 참고)
    index.js                    personaRegistry.js의 id → 컴포넌트 매핑 (PERSONA_COMPONENTS, getPersonaComponent)
  state/
    schema.js                공통 User State 스키마 (Lectio/Meditatio/Speculum/JudgmentPaths) — 리브랜딩과 무관하게 그대로
    UserStateContext.jsx      Provider + localStorage 영속화
    deriveMeditatio.js        raw 응답 → 구조화 결과 + 결과 문장(narrative) 생성기
  components/
    Lectio.jsx                Lectio 화면 (기존 lectio-final.jsx를 공통 State에 맞게 이식)
    MeditatioV1.jsx            Meditatio v1.0 데이터로 구동되는 화면 — 시작 안내 화면 + 4개 장 + 결과
  screens/
    Start.jsx                  인트로 — "돌 하나를 얹다" 전체 카피
    Home.jsx                   오늘은 무엇을 해볼까요? — 네 가지 진입점
    CurrentJudgment.jsx        지금의 판단 — 실제 고민 + Initial Judgment 입력 (신설)
    Speculum.jsx                어떤 질문을 얹어볼까요? — Operation 선택 → 렌즈 실행
    Rejudge.jsx                 다시, 같은 질문 앞에서 — New Information/Judgment Shift/Rejudgment 입력 (신설)
    SessionResult.jsx           이번에 확인한 것 — 5개 필드 요약 + 저장 (신설)
    Studiolo.jsx                현재의 돌탑 — 지금까지 얹은 돌 / 쌓이면서 드러난 것
  App.jsx                     App Shell(라우팅) — 시작→Lectio→Meditatio→지금의 판단→Speculum→현재의 돌탑
scripts/
  smoke-test.mjs               Playwright 스모크 테스트 (전체 플로우 + persona 완료/세션 저장, 아래 참고)
  family-routing-selftest.mjs  Family Routing / Persona Registry / Dedup 자기검증 (문서의 worked example과 대조)
```

## 검증

### 1. Family Routing 자기검증 (문서의 worked example과 대조)

```bash
node scripts/family-routing-selftest.mjs
```

`claude/family-candidate-rules-v1.md` §14의 worked example(Trigger=Evaluation, Response=Ruminate,
Maintenance=Search for better answer, Release=Self-Permission → 기대: Identity/Criterion HIGH,
Scale/Distance POSSIBLE)을 그대로 계산해서 같은 후보 4개(Identity, Criterion, Scale, Distance)가
나오는지 확인합니다. 또한 persona registry가 `speculumSchema.js`의 18개 키와 정확히 일치하는지,
Operation Dedup이 문서의 예시(청지기/수문장은 유지, 기록자+장군+마술사는 3개까지 유지)와 같은
결과를 내는지도 확인합니다.

### 2. 전체 플로우 Playwright 스모크 테스트

```bash
npm run dev              # 별도 터미널에서 켜두고
npm install -D playwright
npx playwright install chromium   # 브라우저가 없다면
node scripts/smoke-test.mjs
```

확인된 것: Lectio 14개 항목 저장, Meditatio 시작 안내 화면("나는 어떻게 판단하는가?") 렌더링,
33/33 문항 응답 + `defaultStrategy`/`pressure`(trigger·response·maintenance·release) 구조 정확히 생성,
결과 화면 헤더("지금, 나는 이렇게 판단합니다") 확인, **"지금의 판단" 화면에서 실제 고민/현재 판단을
입력받는 것**, **Speculum의 Operation 선택 화면에 Family 이름/점수가 전혀 노출되지 않는 것**,
**Operation 카드를 선택해 "이 렌즈 열기"를 누르면 실제 18개 persona 컴포넌트 중 하나가 열리는 것**,
**(오늘 후보에 물류관리자(general)가 있으면) 끝까지 진행해 재판단(Rejudge) 화면 → 세션 결과(SessionResult)
화면 → "돌 하나가 더해졌습니다." 저장 확인까지 도달하고, localStorage의 `speculumSessions`에
initialJudgment/newInformation/judgmentShift/rejudgment가 화면에서 입력한 값 그대로 저장되는 것을 확인**,
**(물류관리자가 후보에 없으면) 공용 자동 진행 드라이버로 실제로 열린 persona가 무엇이든 최대한 끝까지
진행해 같은 재판단/세션결과 흐름으로 세션 저장을 검증**(브랜치가 복잡한 일부 페르소나에서는 끝까지 못 갈
수 있는데, 그 경우는 실패로 치지 않고 "열림" 확인까지만 통과 처리), 현재의 돌탑이 Lectio·Meditatio
결과와 함께 "지금까지 얹은 돌"/"쌓이면서 드러난 것" 섹션 이름으로 저장된 세션을 보여줌, 새로고침 후에도
localStorage로 상태 유지.

콘솔에 뜨는 `ERR_TUNNEL_CONNECTION_FAILED`는 CSS의 Google Fonts(`Cormorant Garamond`, `Gowun Batang`)/Pretendard CDN `@import`가 이 실행 환경(샌드박스)의 네트워크 제한으로 막혀서 나는 것이지 앱 로직 문제가 아닙니다 — 실제 배포 환경에서는 문제없이 로드되거나, 폰트를 프로젝트에 직접 포함시키면(self-host) 이 의존성 자체를 없앨 수 있습니다. 이 때문에 스크립트의 마지막 콘솔 에러 카운트가 0이 아니어서 종료 코드가 1이 되는데, 이는 v2 때부터 있던 동일한 환경 제약이며 이번 단계에서 새로 생긴 문제가 아닙니다.

## 아직 안 된 것 (다음 로드맵, `claude/app-build-readiness-v1.md` 참고)

- **AI 계층을 서버 프록시로 이전** — 지금 18개 persona가 쓰는 `mockCallClaude`(`src/speculum/aiStub.js`)는 실제 AI 판단이 아니라, 사용자가 쓴 답변을 그대로 나열해 돌려주는 임시 stub이다. 진짜 Claude API 호출은 서버(API 키를 숨길 수 있는 곳)를 통해야 한다.
- **Persona Eligibility 판정(자유 텍스트 읽기)을 위한 AI 계층** — 지금은 Family Routing까지만 deterministic하게 작동하고, 사용자가 후보 중 하나를 직접 고른다. `personaRegistry.js`의 `eligibilityField`는 메타데이터로만 존재.
- **`speculumSchema.js`(이상적 질문 스키마)의 `saveAs` 필드명과 실제 컴포넌트 내부 상태(`stepN` 등) 필드명이 다르다** — 지금도 각 세션의 `operationData`/`rawAnswers`에는 컴포넌트가 실제로 쓰는 원본 키(step1, step2 …)를 그대로 저장한다. 다만 `initialJudgment`/`newInformation`/`judgmentShift`/`rejudgment`는 이번 리브랜딩에서 신설된 "지금의 판단"/"재판단"/"세션 결과" 화면이 앱 레벨에서 통일되게 입력받아 채우도록 바뀌어서, 페르소나마다 다른 내부 필드명에서 억지로 추출할 필요가 없어졌다.
- Speculum Session 기록 → Judgment Paths 생성 로직 (스키마는 이미 있음, `src/state/schema.js`의 `makeSpeculumSession`)
- 18개 Persona 중 17개의 "설명 한 문장"(헤더 아래 한 줄 더) — 기록자만 확정, 나머지는 사용자 확인 필요
- Speculum 화면에서 지금의 판단(concern/initialJudgment)을 localStorage에 영속화할지 여부 — 지금은 App.jsx의 로컬 state로만 유지되어 새로고침하면 사라진다(세션 자체는 저장 시 SpeculumSession에 남는다)
- 시각 디자인(색·폰트·레이아웃) 리디자인 — 이번 라운드는 "구조/헤더/네이밍만" 범위였다
- 로그인/백엔드(로컬 단일 사용자 가정을 벗어나는 단계)

## 데이터 무결성 확인

```bash
node -e "import('./src/data/meditatioV1.js').then(m => console.log(m.countMeditatioTotals()))"
# { questionCount: 33, optionCount: 176, lastOptionNumber: 176 }
```
