# PebbleTrail (르네상스의 그 거울) — App Shell v2

실행 가능한 React 앱입니다. v1(App Shell + 공통 User State + Meditatio v1.0)에 이어, 이번 단계에서
**Family Routing 엔진 + 18 Persona Registry + Operation Dedup + Speculum 라우팅 화면**을 추가했습니다.

1. **App Shell** — Start → Lectio → Meditatio → Speculum(라우팅) → The Studiolo → Home으로 이어지는 상위 라우팅 (`src/App.jsx`)
2. **공통 User State** — Lectio / Meditatio / Speculum Sessions / Judgment Paths를 담는 단일 스키마 + localStorage 영속화 (`src/state/`)
3. **Meditatio v1.0 데이터 구조** — "메디테티오"(MEDITATIO v1.0 — FINAL) 문서의 4개 Section·33문항·176개 선택지를 태그(Object/Affect Signal/Domain/Default)까지 그대로 코드로 옮긴 것 (`src/data/meditatioV1.js`)
4. **Family Routing 엔진** — `claude/family-routing-matrix-v1.md`의 점수표를 그대로 코드화 (`src/speculum/familyWeights.js`, `familyRouting.js`)
5. **18 Persona Registry** — `claude/18-persona-eligibility-spec-v1.md`의 Family/Eligibility 조건 + `claude/speculum-questionnaire-schema.js`(질문지 원문)를 그대로 옮긴 메타데이터 (`src/speculum/personaRegistry.js`, `src/data/speculumSchema.js`)
6. **Operation Dedup** — `claude/operation-dedup-rules-v1.md`의 2-of-3 중복 판정 + "충분히 다른 3번째" 규칙을 코드화 (`src/speculum/operationDedup.js`)
7. **Speculum 화면** — Meditatio 결과 → Family 후보 → 렌즈(Operation) 후보 2~3개까지 보여주는 라우팅 화면 (`src/screens/Speculum.jsx`)

## 실행

```bash
npm install
npm run dev
```

`http://localhost:5173` 접속. 순서: 시작 → Lectio(14장) → Meditatio(4개 장, 33문항) → Speculum(렌즈 후보 확인) → The Studiolo.
완료할 때마다 "계속하기" 버튼을 직접 눌러야 다음 화면으로 넘어갑니다(자동 이동시키면 방금 만든 결과 화면을 볼 새도 없이 넘어가 버리는 문제가 있어서 의도적으로 그렇게 만들었습니다).

## 폴더 구조

```
src/
  data/
    meditatioV1.js           Meditatio v1.0 문항 데이터 (33문항/176보기 + 태그)
    speculumSchema.js         18개 Speculum Persona 질문지 원문 (claude/speculum-questionnaire-schema.js 그대로)
  speculum/
    familyWeights.js           Family Routing 점수표 (claude/family-routing-matrix-v1.md 그대로)
    familyRouting.js            scoreFamilies / rankFamilies / getFamilyCandidates
    personaRegistry.js          18 Persona 메타데이터 (family, eligibilityField, operationSignature)
    operationDedup.js           Operation 중복 제거 + "충분히 다른 3번째" 후보 선정
  state/
    schema.js                공통 User State 스키마 (Lectio/Meditatio/Speculum/JudgmentPaths)
    UserStateContext.jsx      Provider + localStorage 영속화
    deriveMeditatio.js        raw 응답 → 구조화 결과 + 결과 문장(narrative) 생성기
  components/
    Lectio.jsx                Lectio 화면 (기존 lectio-final.jsx를 공통 State에 맞게 이식)
    MeditatioV1.jsx            Meditatio v1.0 데이터로 구동되는 새 화면
  screens/
    Start.jsx, Home.jsx, Studiolo.jsx, Speculum.jsx
  App.jsx                     App Shell(라우팅)
scripts/
  smoke-test.mjs               Playwright 스모크 테스트 (전체 플로우, 아래 참고)
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

확인된 것: Lectio 14개 항목 저장, Meditatio 33/33 문항 응답 + `defaultStrategy`/`pressure`(trigger·response·maintenance·release) 구조 정확히 생성, 결과 문장(narrative) 생성, **Speculum 화면이 Family 후보와 렌즈(Operation) 후보를 보여주고 페르소나 카드를 선택하면 안내 문구가 뜨는 것**, The Studiolo가 Lectio·Meditatio 결과를 함께 보여줌, 새로고침 후에도 localStorage로 상태 유지.

콘솔에 뜨는 `ERR_TUNNEL_CONNECTION_FAILED`는 CSS의 Google Fonts(`Cormorant Garamond`, `Gowun Batang`)/Pretendard CDN `@import`가 이 실행 환경(샌드박스)의 네트워크 제한으로 막혀서 나는 것이지 앱 로직 문제가 아닙니다 — 실제 배포 환경에서는 문제없이 로드되거나, 폰트를 프로젝트에 직접 포함시키면(self-host) 이 의존성 자체를 없앨 수 있습니다.

## Speculum 화면이 아직 하지 않는 것

지금 Speculum 화면(`src/screens/Speculum.jsx`)은 **Family Routing까지만** 한다 — 어떤 렌즈(Persona)가
왜 열렸는지 보여주고, 사용자가 그중 하나를 선택하면 "아직 이 페르소나의 실제 질문지는 연결되지 않았다"는
안내만 보여준다. Persona Eligibility(자유 텍스트를 읽고 실제 작동 가능 여부를 판정하는 것)는 AI 계층이
있어야 하는데 아직 없어서, `personaRegistry.js`의 `eligibilityField`는 메타데이터로만 존재하고 실제
판정 로직은 없다. 18개 persona jsx 컴포넌트를 이 화면에 연결하는 것(로드맵 아래 항목)이 다음 단계다.

## 아직 안 된 것 (다음 로드맵, `claude/app-build-readiness-v1.md` 참고)

- 18개 Speculum Persona 컴포넌트를 이 registry/dedup 결과에 실제로 연결 + Operation 선택 → Persona reveal(실제 질문지 실행) 흐름
- Persona Eligibility 판정(자유 텍스트 읽기)을 위한 AI 계층 — 지금은 Family Routing까지만 deterministic하게 작동
- Speculum Session 기록 → Judgment Paths 생성 로직 (스키마는 이미 있음, `src/state/schema.js`의 `makeSpeculumSession`)
- AI 계층을 서버 프록시로 이전 (지금 각 Persona 컴포넌트의 `callClaude()`는 브라우저에서 API 키 없이 직접 fetch하는 방식이라 그대로 쓰면 안 됨)
- 로그인/백엔드(로컬 단일 사용자 가정을 벗어나는 단계)

## 데이터 무결성 확인

```bash
node -e "import('./src/data/meditatioV1.js').then(m => console.log(m.countMeditatioTotals()))"
# { questionCount: 33, optionCount: 176, lastOptionNumber: 176 }
```
