/**
 * Speculum Questionnaire Schema v1.0
 *
 * 출처: 프로젝트 문서 `claude/speculum-questionnaire-schema.js` (원문 그대로 옮김 — 문항 문구를 바꾸지 않는다)
 *
 * 질문 "문장"은 바꾸지 않는다 — 실제 코드(claude/speculum-*.jsx, speculum-*.jsx)와
 * Speculum Persona Protocol v1.0(18 페르소나 질문지)에 이미 있는 문장을 그대로 옮겼다.
 * 이 파일이 하는 일은 그 문장 위에 앱이 읽을 수 있는 의미(role / saveAs / value)를
 * 얹는 것뿐이다.
 *
 * 각 질문:
 * {
 *   id, type, role, prompt, saveAs,
 *   options?: [{ id, label, value }],
 *   branch?: [{ when: { equals: value }, question: { ... } }]
 * }
 *
 * - label = 사용자가 보는 말
 * - value = 앱이 저장하는 의미
 * - role  = 이 질문이 Operation에서 하는 일
 * - saveAs = 실제 저장 필드 (operationData 또는 공통 Result 필드로 들어감)
 *
 * prompt 출처 표기:
 *   [code]  현재 배포된 jsx 컴포넌트에 실제로 있는 문장
 *   [proto] 18 페르소나 질문지(Protocol v1.0)에는 있지만 현재 코드에는
 *           같은 자리에 구현되어 있지 않은 문장 — 스키마는 프로토콜 기준으로
 *           고정하고, 코드 쪽을 나중에 맞춰야 할 항목
 *
 * 공통 Result 구조:
 * {
 *   personaId, personaVersion,
 *   initialJudgment,
 *   operationData: {},   // 페르소나마다 다름
 *   rejudgment,
 *   reflection,
 *   rawAnswers: {}
 * }
 */

const YES_SIMILAR_NO = [
  { id: "yes", label: `있다.`, value: "yes" },
  { id: "similar", label: `비슷한 일이 떠오른다.`, value: "similar" },
  { id: "no", label: `없다.`, value: "no" },
];

/* ============================================================
   1. 후원자 — Patron (Distance)
   ============================================================ */
const patron = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `최근 해보고 싶었지만 선택하지 않았거나 물러났던 기회·자리가 있었습니까?`, // [proto] — 코드는 이 게이트 없이 q2로 바로 들어감
    saveAs: "sceneExists",
    options: YES_SIMILAR_NO,
  },
  {
    id: "q2",
    type: "text",
    role: "initial_opportunity",
    prompt: `그 순간, 어떤 기회나 자리였습니까? 그리고 그때 무엇을 하지 않았습니까?`, // [code] s0
    saveAs: "opportunity",
  },
  {
    id: "q3",
    type: "text",
    role: "other_person_criterion",
    prompt: `지금과 비슷한 상황에 있는 사람을 한 명 떠올려 보세요. 그런 처지의 사람에게 당신이 후원자라면, 그 사람이 이 기회나 자리를 앞에 두고 있을 때 어떻게 후원하겠습니까?`, // [code] s1
    saveAs: "adviceToOther",
  },
  {
    id: "q4",
    type: "text",
    role: "criterion_reason",
    prompt: `왜 그 사람에게 그렇게 후원하는 것이 적절하다고 생각합니까?`, // [code] s2
    saveAs: "adviceReason",
  },
  {
    id: "q5",
    type: "single_choice",
    role: "self_criterion_comparison",
    prompt: `방금 그 사람에게 적용한 기준을 당신 자신에게도 적용할 수 있다고 생각합니까?`, // [code] s3
    saveAs: "criterionTransfer",
    options: [
      { id: "same", label: `그대로 적용할 수 있다.`, value: "same" },
      { id: "partial", label: `일부는 적용할 수 있다.`, value: "partial" },
      { id: "different", label: `나에게는 다른 기준이 필요하다.`, value: "different" },
      { id: "uncertain", label: `잘 모르겠다.`, value: "uncertain" },
    ],
    branch: [
      {
        when: { equals: "different" },
        question: {
          id: "q5b",
          type: "text",
          role: "different_self_criterion_reason",
          prompt: `왜 비슷한 상황의 다른 사람에게 적용한 기준과 당신 자신에게 필요한 기준이 다르다고 생각합니까?`, // [code] s4 (needsBranchText)
          saveAs: "differentCriterionReason",
        },
      },
      {
        when: { equals: "uncertain" },
        question: {
          id: "q5b",
          type: "text",
          role: "different_self_criterion_reason",
          prompt: `같은 기준을 자신에게 적용할 수 있는지 판단하기 어렵게 만드는 것은 무엇입니까?`, // [code] s4 (needsBranchText)
          saveAs: "differentCriterionReason",
        },
      },
    ],
  },
  {
    id: "q6",
    type: "single_choice",
    role: "rejudgment",
    prompt: `그 기준을 당신 자신에게도 적용해보면, 처음에 하지 않았던 선택은 지금 어떻게 보입니까?`, // [code] s5, rejudgeIntro 변형 중 기본형
    saveAs: "rejudgment",
    options: [
      { id: "same", label: `처음과 같은 판단이다.`, value: "same" },
      { id: "reason_changed", label: `판단의 방향은 같지만 이유가 조금 달라졌다.`, value: "reason_changed" },
      { id: "different", label: `지금은 다르게 판단한다.`, value: "different" },
      { id: "uncertain", label: `아직 판단하기 어렵다.`, value: "uncertain" },
    ], // [code] REJUDGE_OPTS — protocol 문서엔 "다시 생각해볼 수 있을 것 같다." 옵션이 하나 더 있지만(5지선다) 코드는 4지선다. 코드 기준으로 고정.
  },
  {
    id: "q7",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그렇게 판단한 이유는 무엇입니까?`, // [code] s6, Q6_PROMPT[step5]로 분기 생성
    saveAs: "reflection",
  },
];

/* ============================================================
   2. 소설가 — Novelist (Distance)
   확정 순서: 장면 → 처음 자기판단 → 밖에서 보인 나 → 안에서 경험한 나 → 재묘사 → 재판단
   ============================================================ */
const novelist = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `최근 누군가와 이야기하거나 어떤 일을 하다가, 겉으로는 그냥 지나갔지만 속으로는 생각이 많았던 순간이 있었습니까?`, // [code] s0
    saveAs: "sceneExists",
    options: YES_SIMILAR_NO,
  },
  {
    id: "q2",
    type: "text",
    role: "scene",
    prompt: `무슨 일이 있었습니까?`, // [code] s2
    saveAs: "scene",
  },
  {
    id: "q3",
    type: "text",
    role: "initial_judgment",
    prompt: `그 일이 있었을 때, 당신은 자신을 어떻게 생각했습니까?`, // [code] s3 — Initial Judgment
    saveAs: "initialJudgment",
  },
  {
    id: "q4",
    type: "text",
    role: "external_observation",
    prompt: `당신은 이제 이 장면을 쓰는 소설가입니다. 이번에는 이 사람의 마음속을 알 수 없습니다. 밖에서 보이는 행동과 상태만 쓴다면, 이 장면에서 이 사람은 무엇을 하고 있습니까?`, // [code] s4
    saveAs: "externalView",
  },
  {
    id: "q5",
    type: "text",
    role: "internal_experience",
    prompt: `이번에는 작가가 이 사람의 마음속까지 알 수 있습니다. 그 순간 이 사람은 무엇을 생각하고 있었습니까? 무엇이 가장 신경 쓰이고 있었습니까?`, // [code] s5
    saveAs: "internalView",
  },
  {
    id: "review_external_internal",
    type: "recap",
    role: "juxtaposition",
    prompt: `밖에서 보이는 모습 / 그때 내 안에서 있었던 것`, // [code] s6 병치 카드
    saveAs: null,
    items: ["externalView", "internalView"],
  },
  {
    id: "q6",
    type: "text",
    role: "integrated_description",
    prompt: `이 둘을 모두 알고 있는 소설가라면, 이 장면 속 사람을 어떻게 묘사하겠습니까?`, // [code] s6
    saveAs: "integratedDescription",
  },
  {
    id: "q7",
    type: "single_choice",
    role: "rejudgment",
    prompt: `지금까지는 소설가로 이 사람을 보았습니다. 이제 다시 당신 자신으로 돌아와보세요. 처음에는 "{initialJudgment}"라고 생각했습니다. 지금도 그렇게 생각합니까?`, // [code] s7
    saveAs: "rejudgment",
    options: [
      { id: "same", label: `처음과 같은 생각이다.`, value: "same" },
      { id: "partially_changed", label: `일부는 같지만 다르게 보이는 부분이 있다.`, value: "partially_changed" },
      { id: "changed", label: `지금은 조금 다르게 생각한다.`, value: "changed" },
      { id: "different", label: `처음과 다른 생각이 든다.`, value: "different" },
      { id: "uncertain", label: `아직 잘 모르겠다.`, value: "uncertain" },
    ],
  },
  {
    id: "q8",
    type: "text",
    role: "rejudgment_reason",
    prompt: `선택에 따른 이유를 적어주세요.`, // [code] s8, q8Prompt(step7)로 분기 생성
    saveAs: "reflection",
  },
];

/* ============================================================
   3. 신탁자 — Oracle (Time, 조건부)
   ============================================================ */
const oracle = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `이 생각이 들었던 구체적인 순간이 있었습니까?`, // [code] s0
    saveAs: "sceneExists",
    options: [
      { id: "yes", label: `있다.`, value: "yes" },
      { id: "no", label: `특별히 떠오르는 순간은 없다.`, value: "no" },
    ],
  },
  {
    id: "q2",
    type: "text",
    role: "decision_scene",
    prompt: `그 순간으로 돌아가 보겠습니다. 그때 무엇을 결정해야 했습니까?`, // [code] s1 (없다면: 무엇을 보고 이 문장이 나와 가깝다고 느꼈는지)
    saveAs: "decision",
  },
  {
    id: "q3",
    type: "text",
    role: "decision_enabling_change",
    prompt: `무엇이 달라지면, "이제는 결정할 수 있다"고 말할 것 같습니까?`, // [code] s2
    saveAs: "neededChange",
  },
  {
    id: "q4",
    type: "single_choice",
    role: "information_timing",
    prompt: `방금 말한 "{neededChange}"은 어떻게 알 수 있는 것입니까?`, // [code] s3
    saveAs: "informationTiming",
    options: [
      { id: "requires_time", label: `시간이 지나야 알 수 있다.`, value: "requires_time" },
      { id: "checkable_now", label: `지금도 확인할 수 있다.`, value: "checkable_now" },
      { id: "mixed", label: `일부는 지금 확인할 수 있고, 일부는 시간이 필요하다.`, value: "mixed" },
      { id: "uncertain", label: `어떻게 알 수 있는지 아직 잘 모르겠다.`, value: "uncertain" },
    ],
  },
  {
    id: "q5",
    type: "text",
    role: "verification_path",
    // [code] s4 — Q4에 따라 prompt 분기
    prompt: {
      requires_time: `시간이 지나면서 무엇을 보게 되면 "{neededChange}"을 알 수 있다고 생각합니까?`,
      checkable_now: `지금 확인한다면, 무엇을 확인할 수 있습니까?`,
      mixed: `지금 확인할 수 있는 것과 시간이 지나야 알 수 있는 것은 각각 무엇입니까?`,
      uncertain: `지금 기다리고 있는 것이 정확히 무엇인지 다시 말해본다면 무엇입니까?`,
    },
    promptDependsOn: "informationTiming",
    saveAs: "verificationPath",
  },
  {
    id: "review",
    type: "recap",
    role: "juxtaposition",
    prompt: `결정을 위해 기다리고 있는 것 / 그것을 알 수 있는 방식 / 실제로 확인해야 하는 것`, // [code] s5 병치 카드
    saveAs: null,
    items: ["neededChange", "informationTiming", "verificationPath"],
  },
  {
    id: "q6",
    type: "single_choice",
    role: "rejudgment",
    prompt: `이렇게 놓고 보니, 지금도 같은 방식으로 기다리시겠습니까?`, // [code] s5
    saveAs: "rejudgment",
    options: [
      { id: "keep_waiting", label: `지금처럼 기다린다.`, value: "keep_waiting" },
      { id: "wait_and_verify", label: `기다리되, 확인할 수 있는 것은 먼저 확인한다.`, value: "wait_and_verify" },
      { id: "verify_now", label: `기다리지 않고 지금 확인해본다.`, value: "verify_now" },
      { id: "uncertain", label: `아직 정하기 어렵다.`, value: "uncertain" },
    ],
  },
  {
    id: "q7",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그렇게 판단한 이유는 무엇입니까?`, // [code] s6, Q7_PROMPT[step6]로 분기 생성
    saveAs: "reflection",
  },
];

/* ============================================================
   4. 시간여행자 — Time Traveler (Time)
   ============================================================ */
const timeTraveler = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `이 생각이 들었던 구체적인 순간이 있었습니까?`, // [code] s0
    saveAs: "sceneExists",
    options: [
      { id: "yes", label: `있다.`, value: "yes" },
      { id: "no", label: `특별히 떠오르는 순간은 없다.`, value: "no" },
    ],
  },
  {
    id: "q2",
    type: "text",
    role: "scene",
    prompt: `그 순간으로 돌아가 보겠습니다. 그때 어떤 상황이었습니까?`, // [code] s1
    saveAs: "scene",
  },
  {
    id: "q3",
    type: "text",
    role: "current_dominant_factor",
    prompt: `지금 이 판단에서 가장 크게 신경 쓰이는 것은 무엇입니까?`, // [code] s2
    saveAs: "currentFactor",
  },
  {
    id: "q4",
    type: "single_choice",
    role: "future_weight",
    prompt: `3년 뒤의 당신이 지금을 돌아본다면, "{currentFactor}"은 지금과 비교해 어느 정도 중요하게 보일 것 같습니까?`, // [code] s3
    saveAs: "futureWeight",
    options: [
      { id: "more", label: `지금보다 더 중요하게 보일 것 같다.`, value: "more" },
      { id: "same", label: `지금과 비슷하게 중요할 것 같다.`, value: "same" },
      { id: "less", label: `지금보다 덜 중요하게 보일 것 같다.`, value: "less" },
      { id: "minimal", label: `거의 중요하지 않게 보일 것 같다.`, value: "minimal" },
      { id: "uncertain", label: `잘 모르겠다.`, value: "uncertain" },
    ],
  },
  {
    id: "q5",
    type: "single_choice",
    role: "future_salient_factor",
    prompt: `반대로, 지금은 상대적으로 덜 보고 있지만 3년 뒤에는 더 중요하게 보일 것이 있습니까?`, // [code] s4
    saveAs: "futureFactorExists",
    options: [
      { id: "yes", label: `있다.`, value: "yes" },
      { id: "uncertain", label: `잘 모르겠다.`, value: "uncertain" },
      { id: "no", label: `딱히 없다.`, value: "no" },
    ],
    branch: [
      {
        when: { equals: "yes" },
        question: {
          id: "q5b",
          type: "text",
          role: "future_factor",
          prompt: `무엇입니까?`, // [code] s4
          saveAs: "futureFactor",
        },
      },
    ],
  },
  {
    id: "review",
    type: "recap",
    role: "juxtaposition",
    prompt: `지금 크게 보이는 것 / 3년 뒤에서 본 중요도 / 시간이 지나면 더 중요해질 수 있는 것`, // [code] s5 "시간 병치"
    saveAs: null,
    items: ["currentFactor", "futureWeight", "futureFactor"],
  },
  {
    id: "q6",
    type: "single_choice",
    role: "rejudgment",
    prompt: `3년의 거리를 두고 이것들을 함께 보니, 처음 판단은 지금 어떻게 보입니까?`, // [code] s5
    saveAs: "rejudgment",
    options: [
      { id: "same", label: `처음과 같은 판단이다.`, value: "same" },
      { id: "weight_changed", label: `판단의 방향은 같지만 중요하게 보는 것이 달라졌다.`, value: "weight_changed" },
      { id: "different", label: `처음과는 다르게 판단하게 된다.`, value: "different" },
      { id: "uncertain", label: `아직 판단하기 어렵다.`, value: "uncertain" },
    ],
  },
  {
    id: "q7",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그렇게 판단한 이유는 무엇입니까?`, // [code] s6, Q7_PROMPT[step6]로 분기 생성
    saveAs: "reflection",
  },
];

/* ============================================================
   5. 대상인 — Merchant (Inversion)
   ============================================================ */
const merchant = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `이 생각이 들었던 구체적인 순간이 있었습니까?`, // [code] s1
    saveAs: "sceneExists",
    options: [
      { id: "yes", label: `있다.`, value: "yes" },
      { id: "no", label: `특별히 떠오르는 순간은 없다.`, value: "no" },
    ],
  },
  {
    id: "q2",
    type: "text",
    role: "continued_choice",
    prompt: `그때, 계속하고 있던 일은 무엇이었습니까?`, // [code] s2 (있다) / 없다일 때는 "요즘 '조금 더 계속하면 나아질지도 모른다'고 생각하며 계속하고 있는 일이 있습니까?"
    saveAs: "continuedChoice",
  },
  {
    id: "q3",
    type: "text",
    role: "current_cost",
    prompt: `{continuedChoice}을(를) 계속하기 위해, 지금 가장 많이 내놓고 있는 것은 무엇입니까?`, // [code] s3
    saveAs: "currentCost",
  },
  {
    id: "q4",
    type: "text",
    role: "expected_return",
    prompt: `그것을 계속 내놓으면서, 무엇을 얻기를 기대하고 있습니까?`, // [code] s4
    saveAs: "expectedReturn",
  },
  {
    id: "q5",
    type: "single_choice",
    role: "displaced_opportunity_check",
    prompt: `{continuedChoice}을(를) 계속하느라, 실제로 미루거나 하지 못하고 있는 것이 있습니까?`, // [code] s5
    saveAs: "hasDisplacedOpportunity",
    options: [
      { id: "yes", label: `있다.`, value: "yes" },
      { id: "no", label: `없다.`, value: "no" },
      { id: "uncertain", label: `잘 모르겠다.`, value: "uncertain" },
    ],
    branch: [
      {
        when: { equals: "yes" },
        question: {
          id: "q5b",
          type: "text",
          role: "displaced_opportunity",
          prompt: `무엇입니까?`,
          saveAs: "displacedOpportunity",
        },
      },
      {
        when: { equals: "uncertain" },
        question: {
          id: "q5b",
          type: "text",
          role: "displaced_opportunity",
          prompt: `그 일에 지금 쓰고 있는 {currentCost}을(를) 다른 데 쓸 수 있다면, 가장 먼저 떠오르는 것은 무엇입니까?`,
          saveAs: "displacedOpportunity",
        },
      },
    ],
  },
  {
    id: "trade_screen",
    type: "recap",
    role: "juxtaposition",
    prompt: `계속하고 있는 것 / 계속 내놓고 있는 것 / 얻기를 기대하는 것 / 그동안 뒤로 밀린 것`, // [code] s6 "거래 화면"
    saveAs: null,
    items: ["continuedChoice", "currentCost", "expectedReturn", "displacedOpportunity"],
  },
  {
    id: "q6",
    type: "single_choice",
    role: "rejudgment",
    prompt: `이 거래를 함께 놓고 보니, 지금도 같은 방식으로 계속하시겠습니까?`, // [code] s6
    saveAs: "rejudgment",
    options: [
      { id: "continue_same", label: `지금처럼 계속한다.`, value: "continue_same" },
      { id: "continue_adjust_cost", label: `계속하되, 내놓는 정도를 바꾸고 싶다.`, value: "continue_adjust_cost" },
      { id: "consider_alternative", label: `다른 선택을 하고 싶다.`, value: "consider_alternative" },
      { id: "uncertain", label: `아직 정하기 어렵다.`, value: "uncertain" },
    ],
  },
  {
    id: "q7",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그렇게 판단한 이유는 무엇입니까?`, // [code] s7, Q7_PROMPT[step6]로 분기 생성 / s8: "처음에는 잘 보이지 않았지만 지금 보이는 것이 있습니까?"
    saveAs: "reflection",
  },
];

/* ============================================================
   6. 파수꾼 — Guardian (Inversion)
   ============================================================ */
const guardian = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `요즘 그만두거나 내려놓는 것을 생각해본 적이 있지만, 아직 계속하고 있는 일이 있습니까?`, // [code] s0
    saveAs: "sceneExists",
    options: [
      { id: "yes", label: `있다.`, value: "yes" },
      { id: "uncertain", label: `잘 모르겠다.`, value: "uncertain" },
      { id: "no", label: `없다.`, value: "no" },
    ],
  },
  {
    id: "q2",
    type: "text",
    role: "continued_commitment",
    prompt: `지금 그만두거나 내려놓기 어려운 일은 무엇입니까?`, // [code] s2
    saveAs: "continuedCommitment",
  },
  {
    id: "q3",
    type: "single_choice",
    role: "past_investment",
    prompt: `지금까지 {continuedCommitment}에 가장 많이 들인 것은 무엇입니까?`, // [code] s3
    saveAs: "pastInvestment",
    options: [
      { id: "time", label: `시간`, value: "time" },
      { id: "effort", label: `노력`, value: "effort" },
      { id: "money", label: `돈`, value: "money" },
      { id: "physical", label: `체력`, value: "physical" },
      { id: "mental", label: `마음과 신경`, value: "mental" },
      { id: "relationships", label: `사람들과 쌓아온 것`, value: "relationships" },
      { id: "foregone_opportunity", label: `다른 것을 포기하며 만든 기회`, value: "foregone_opportunity" },
      { id: "other", label: `직접 적기`, value: "other" },
      { id: "uncertain", label: `잘 모르겠다`, value: "uncertain" },
    ],
  },
  {
    id: "q4",
    type: "text",
    role: "hardest_to_release",
    prompt: `오늘 {continuedCommitment}을(를) 그만둔다고 생각하면, 무엇이 가장 아깝거나 놓기 어렵습니까?`, // [code] s4
    saveAs: "hardestToRelease",
  },
  {
    id: "q5",
    type: "single_choice",
    role: "future_investment",
    prompt: `앞으로도 {continuedCommitment}을(를) 계속한다면, 가장 많이 더 써야 하는 것은 무엇입니까?`, // [code] s5
    saveAs: "futureInvestment",
    options: [
      { id: "time", label: `시간`, value: "time" },
      { id: "effort", label: `노력`, value: "effort" },
      { id: "money", label: `돈`, value: "money" },
      { id: "physical", label: `체력`, value: "physical" },
      { id: "mental", label: `마음과 신경`, value: "mental" },
      { id: "opportunity", label: `다른 일을 할 기회`, value: "opportunity" },
      { id: "people_time", label: `사람들과 보낼 시간`, value: "people_time" },
      { id: "other", label: `직접 적기`, value: "other" },
      { id: "uncertain", label: `잘 모르겠다`, value: "uncertain" },
    ],
  },
  {
    id: "compare_screen",
    type: "recap",
    role: "juxtaposition",
    prompt: `지금까지 들어간 것 / 오늘 그만두면 가장 놓기 어려운 것 / 계속하면 앞으로 더 들어갈 것`, // [code] s6 "비교"
    saveAs: null,
    items: ["pastInvestment", "hardestToRelease", "futureInvestment"],
  },
  {
    id: "q6",
    type: "single_choice",
    role: "rejudgment",
    prompt: `지금까지 들어간 것과 앞으로 더 들어갈 것을 따로 놓고 보니, {continuedCommitment}을(를) 지금 어떻게 하고 싶습니까?`, // [code] s6
    saveAs: "rejudgment",
    options: [
      { id: "continue_same", label: `지금처럼 계속한다.`, value: "continue_same" },
      { id: "continue_less_input", label: `계속하되 쓰는 시간이나 노력을 줄이고 싶다.`, value: "continue_less_input" },
      { id: "continue_change_scope", label: `계속하되 방식이나 범위를 바꾸고 싶다.`, value: "continue_change_scope" },
      { id: "consider_stopping", label: `이제는 그만두는 쪽을 생각한다.`, value: "consider_stopping" },
      { id: "uncertain", label: `아직 정하기 어렵다.`, value: "uncertain" },
    ],
  },
  {
    id: "q7",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그렇게 정한 이유는 무엇입니까?`, // [code] s7, q7Prompt(step6)로 분기 생성
    saveAs: "reflection",
  },
  {
    id: "q8",
    type: "text",
    role: "core_attachment",
    prompt: `처음에는 {continuedCommitment}을(를) 놓기 어렵다고 생각했습니다. 지금 돌아보면, 가장 놓기 어려웠던 것은 무엇입니까?`, // [code] s8
    saveAs: "coreAttachment",
  },
];

/* ============================================================
   7. 증언자 — Witness (Inversion)
   ============================================================ */
const witness = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `지금 누군가에게 아직 하지 못하고 있는 말이 있습니까?`, // [code] s0
    saveAs: "unspokenExists",
    options: [
      { id: "yes", label: `있다.`, value: "yes" },
      { id: "uncertain", label: `잘 모르겠다.`, value: "uncertain" },
      { id: "no", label: `없다.`, value: "no" },
    ],
  },
  {
    id: "q2",
    type: "text",
    role: "recipient",
    prompt: `누구에게 아직 하지 못하고 있는 말입니까?`, // [code] s1
    saveAs: "recipient",
  },
  {
    id: "q3",
    type: "text",
    role: "unspoken_message",
    prompt: `{recipient}에게 아직 하지 못하고 있는 말은 무엇입니까?`, // [code] s2
    saveAs: "unspokenMessage",
  },
  {
    id: "q4",
    type: "single_choice",
    role: "continued_silence_outcome",
    prompt: `이 말을 계속 하지 않은 채 시간이 지난다면, 가장 크게 남을 것 같은 것은 무엇입니까?`, // [code] s3
    saveAs: "whatRemains",
    options: [
      { id: "unknown_thought", label: `상대가 내 생각을 모르는 상태`, value: "unknown_thought" },
      { id: "different_understanding", label: `서로 다르게 이해하고 있는 상태`, value: "different_understanding" },
      { id: "unresolved_issue", label: `아직 풀리지 않은 문제`, value: "unresolved_issue" },
      { id: "distance", label: `지금보다 생기는 관계의 거리`, value: "distance" },
      { id: "personal_burden", label: `내가 계속 안고 있어야 하는 부담`, value: "personal_burden" },
      { id: "status_quo", label: `지금의 관계나 상황이 그대로 이어지는 것`, value: "status_quo" },
      { id: "uncertain", label: `잘 모르겠다`, value: "uncertain" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q5",
    type: "text",
    role: "outcome_reason",
    prompt: `그것이 남는다고 생각하는 이유는 무엇입니까?`, // [code] s4
    saveAs: "whatRemainsReason",
  },
  {
    id: "together_screen",
    type: "recap",
    role: "juxtaposition",
    prompt: `하지 못한 말 / 계속 말하지 않을 때 남을 것 / 그렇게 생각한 이유`, // [code] s5 "병치"
    saveAs: null,
    items: ["unspokenMessage", "whatRemains", "whatRemainsReason"],
  },
  {
    id: "q6",
    type: "single_choice",
    role: "rejudgment",
    prompt: `이 둘을 함께 놓고 보니, 처음에 이 말을 하지 않고 있던 판단은 지금 어떻게 보입니까?`, // [code] s5
    saveAs: "rejudgment",
    options: [
      { id: "same", label: `처음과 같은 판단이다.`, value: "same" },
      { id: "reason_changed", label: `판단의 방향은 같지만 이유가 조금 달라졌다.`, value: "reason_changed" },
      { id: "different", label: `처음과는 다르게 판단하게 된다.`, value: "different" },
      { id: "uncertain", label: `아직 판단하기 어렵다.`, value: "uncertain" },
    ],
  },
  {
    id: "q7",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그렇게 판단한 이유는 무엇입니까?`, // [code] s6, Q7_PROMPT[step6]로 분기 생성
    saveAs: "reflection",
  },
];

/* ============================================================
   8. 장군 — General (Inversion)
   ============================================================ */
const general = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `요즘 "내가 계속 해야 한다"고 생각하며 하고 있는 일이 있습니까?`, // [code] s1
    saveAs: "ongoingDutyExists",
    options: [
      { id: "yes", label: `있다.`, value: "yes" },
      { id: "uncertain", label: `잘 모르겠다.`, value: "uncertain" },
    ], // [code] s1 — 다른 페르소나와 달리 2지선다(있다/잘 모르겠다)뿐, "없다"·"비슷한 일" 옵션 없음
  },
  {
    id: "q2",
    type: "text",
    role: "ongoing_duty",
    prompt: `무엇입니까?`, // [code] s1a
    saveAs: "ongoingDuty",
  },
  {
    id: "q3",
    type: "single_choice",
    role: "resource_input",
    prompt: `{ongoingDuty}을(를) 계속하면서 가장 많이 쓰고 있는 것은 무엇입니까?`, // [code] s2
    saveAs: "resourceInput",
    options: [
      { id: "time", label: `시간`, value: "time" },
      { id: "physical", label: `체력`, value: "physical" },
      { id: "mental", label: `신경`, value: "mental" },
      { id: "money", label: `돈`, value: "money" },
      { id: "opportunity", label: `다른 일을 할 기회`, value: "opportunity" },
      { id: "uncertain", label: `잘 모르겠다`, value: "uncertain" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q4",
    type: "single_choice",
    role: "displaced_area",
    prompt: `{ongoingDuty}을(를) 계속하느라 요즘 못 하고 있거나 미루고 있는 것이 있습니까?`, // [code] s3
    saveAs: "displacedArea",
    options: [
      { id: "own_work", label: `내 일`, value: "own_work" },
      { id: "other_people", label: `다른 사람과의 일`, value: "other_people" },
      { id: "rest", label: `쉬는 것`, value: "rest" },
      { id: "new_activity", label: `새로 해보고 싶은 것`, value: "new_activity" },
      { id: "other_duty", label: `챙겨야 할 다른 일`, value: "other_duty" },
      { id: "none", label: `없다`, value: "none" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q5",
    type: "single_choice",
    role: "rejudgment",
    prompt: `둘을 같이 보니, 지금처럼 계속하는 것이 맞다고 생각합니까?`, // [code] s4
    saveAs: "rejudgment",
    options: [
      { id: "continue_same", label: `그렇다.`, value: "continue_same" },
      { id: "continue_adjust", label: `계속하되 조금 바꾸고 싶다.`, value: "continue_adjust" },
      { id: "stop_current_form", label: `더는 지금처럼 계속하고 싶지 않다.`, value: "stop_current_form" },
      { id: "uncertain", label: `잘 모르겠다.`, value: "uncertain" },
    ],
  },
  {
    id: "q6",
    type: "text",
    role: "rejudgment_reason",
    // [code] s5 — reasonQuestion(rejudgment)로 분기 생성
    prompt: {
      continue_same: `그래도 계속하는 것이 중요하다고 생각하는 이유는 무엇입니까?`,
      continue_adjust: `무엇을 바꾸고 싶습니까?`,
      stop_current_form: `무엇을 보고 생각이 달라졌습니까?`,
      uncertain: `지금 결정하기 어렵게 만드는 것은 무엇입니까?`,
    },
    promptDependsOn: "rejudgment",
    saveAs: "reflection",
  },
];

/* ============================================================
   9. 세공사 — Artisan (Scale)
   ============================================================ */
const artisan = [
  {
    id: "q1",
    type: "text",
    role: "decision_scene",
    prompt: `최근 어떤 일을 두고 어떻게 할지 고민했던 순간이 있었습니까? 무슨 일이었습니까?`, // [code] s0
    saveAs: "scene",
  },
  {
    id: "q2",
    type: "single_choice",
    role: "initial_judgment",
    prompt: `그때는 어떻게 하는 쪽으로 생각하고 있었습니까?`, // [code] s1
    saveAs: "initialJudgment",
    options: [
      { id: "do", label: `하려고 했다.`, value: "do" },
      { id: "not_do", label: `하지 않으려고 했다.`, value: "not_do" },
      { id: "alternative", label: `다른 선택을 생각하고 있었다.`, value: "alternative" },
      { id: "undecided", label: `아직 어느 쪽도 정하지 못했다.`, value: "undecided" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q3",
    type: "list_input",
    role: "judgment_elements",
    prompt: `그 일을 판단하면서 함께 생각하고 있던 것들을 하나씩 적어보세요.`, // [code] s2
    saveAs: "judgmentElements",
    minItems: 2,
  },
  {
    id: "q4",
    type: "dynamic_single_choice",
    source: "judgmentElements",
    role: "element_judgment",
    prompt: `먼저 "{element}"만 생각해보겠습니다. 이것 하나만 놓고 보면, 어떻게 하는 게 좋겠습니까?`, // [code] s2a, 항목별 반복
    saveAs: "elementJudgments",
    options: [
      { id: "do", label: `하겠다.`, value: "do" },
      { id: "not_do", label: `하지 않겠다.`, value: "not_do" },
      { id: "alternative", label: `다른 선택을 하겠다.`, value: "alternative" },
      { id: "insufficient", label: `이것만으로는 결정하기 어렵다.`, value: "insufficient" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "craft_screen",
    type: "recap",
    role: "juxtaposition",
    prompt: `처음 판단 / 하나씩 따로 보았을 때`, // [code] s3 "세공"
    saveAs: null,
    items: ["initialJudgment", "elementJudgments"],
  },
  {
    id: "q5",
    type: "single_choice",
    role: "rejudgment",
    prompt: `이제 이것들을 다시 함께 놓고 보면, 어떻게 하는 게 좋겠습니까?`, // [code] s3
    saveAs: "rejudgment",
    options: [
      { id: "do", label: `하겠다.`, value: "do" },
      { id: "not_do", label: `하지 않겠다.`, value: "not_do" },
      { id: "alternative", label: `다른 선택을 하겠다.`, value: "alternative" },
      { id: "undecided", label: `아직 결정하기 어렵다.`, value: "undecided" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q6",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그렇게 판단한 이유는 무엇입니까?`, // [code] s4, followupQuestion(direction)로 분기 생성
    saveAs: "reflection",
  },
];

/* ============================================================
   10. 측량사 — Surveyor (Scale)
   ============================================================ */
const surveyor = [
  {
    id: "q1",
    type: "text",
    role: "decision_scene",
    prompt: `최근 어떤 결정을 두고 생각이 복잡해졌던 일이 있었습니까? 무슨 일이었습니까?`, // [code] s0
    saveAs: "scene",
  },
  {
    id: "q2",
    type: "text",
    role: "decision_scope_anchor",
    prompt: `그 상황에서 지금 결정해야 했던 것은 무엇입니까?`, // [code] s1
    saveAs: "decision",
  },
  {
    id: "q3",
    type: "single_choice",
    role: "initial_judgment",
    prompt: `그때는 어느 쪽으로 생각하고 있었습니까?`, // [code] s2
    saveAs: "initialJudgment",
    options: [
      { id: "do", label: `하려고 했다.`, value: "do" },
      { id: "not_do", label: `하지 않으려고 했다.`, value: "not_do" },
      { id: "undecided", label: `어느 쪽도 정하지 못했다.`, value: "undecided" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q4",
    type: "list_input",
    role: "attached_issues",
    prompt: `{decision}을(를) 생각할 때, 같이 해결해야 할 것처럼 따라 들어온 다른 문제나 걱정은 무엇이었습니까?`, // [code] s3
    saveAs: "attachedIssues",
    minItems: 1,
  },
  {
    id: "q5",
    type: "dynamic_single_choice",
    source: "attachedIssues",
    role: "scope_classification",
    prompt: `"{issue}"도 지금 "{decision}"를 결정할 때 함께 결정해야 하는 문제입니까?`, // [code] s4, 항목별 반복
    saveAs: "scopeClassification",
    options: [
      { id: "include_now", label: `지금 함께 생각해야 한다.`, value: "include_now" },
      { id: "separate_later", label: `나중에 따로 생각해도 된다.`, value: "separate_later" },
      { id: "partial_now", label: `일부만 지금 생각하면 된다.`, value: "partial_now" },
      { id: "uncertain", label: `잘 모르겠다.`, value: "uncertain" },
    ],
  },
  {
    id: "survey_screen",
    type: "recap",
    role: "juxtaposition",
    prompt: `지금 함께 생각할 것 / 나중에 따로 생각할 수 있는 것 / 일부만 지금 생각할 것 / 아직 정하기 어려운 것`, // [code] s5 "측량"
    saveAs: null,
    items: ["scopeClassification"],
  },
  {
    id: "q6",
    type: "text",
    role: "redefined_scope",
    prompt: `이렇게 나누어 보면, 지금 이 결정에서 꼭 함께 생각해야 하는 것은 무엇입니까?`, // [code] s5
    saveAs: "redefinedScope",
  },
  {
    id: "q7",
    type: "single_choice",
    role: "rejudgment",
    prompt: `지금 결정해야 할 것만 놓고 보면, 어떻게 하시겠습니까?`, // [code] s6
    saveAs: "rejudgment",
    options: [
      { id: "do", label: `하겠다.`, value: "do" },
      { id: "not_do", label: `하지 않겠다.`, value: "not_do" },
      { id: "alternative", label: `다른 선택을 하겠다.`, value: "alternative" },
      { id: "undecided", label: `아직 정하기 어렵다.`, value: "undecided" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q8",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그렇게 판단한 이유는 무엇입니까?`, // [code] s7, followupQuestion(direction)로 분기 생성
    saveAs: "reflection",
  },
];

/* ============================================================
   11. 개척자 — Pioneer (Identity)
   ============================================================ */
const pioneer = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `이 생각이 들었던 구체적인 순간이 있었습니까?`, // [code] s0
    saveAs: "roleOpportunityExists",
    options: [
      { id: "yes", label: `있다.`, value: "yes" },
      { id: "no", label: `특별히 떠오르는 순간은 없다.`, value: "no" },
    ],
    // [주의] protocol 문서는 이 자리에 있다/비슷한 일이 떠오른다/없다 3지선다를 쓰지만,
    // 코드는 있다/특별히 떠오르는 순간은 없다 2지선다다. 코드 기준으로 고정.
  },
  {
    id: "q2",
    type: "text",
    role: "scene_description",
    prompt: `그 순간으로 돌아가 보겠습니다. 그때 어떤 자리, 어떤 역할 앞에서 이런 생각이 들었습니까? 어떤 상황이었는지 적어주세요.`, // [code] s1, hasScene === true
    saveAs: "step1",
    branch: [
      {
        when: { equals: "no" }, // q1 답이 "no"일 때 s1은 다른 문장을 보여준다
        question: {
          id: "q2b",
          type: "text",
          role: "scene_description_alt",
          prompt: `아직 어울리지 않는다고 느끼는 이유는 무엇 때문입니까?`, // [code] s1, hasScene === false
          saveAs: "step1",
        },
      },
    ],
  },
  {
    id: "q3",
    type: "text",
    role: "required_qualifications",
    prompt: `그 자리, 어떤 자격이면 어울린다고 느끼겠습니까?`, // [code] s2 — 자유 서술 한 단락. list_input(항목별 입력)이 아니다.
    saveAs: "step2",
  },
  {
    id: "q4",
    type: "text",
    role: "qualification_self_assessment",
    prompt: `방금 말한 그 자격 중, 지금 당신에게 이미 있는 건 무엇입니까?`, // [code] s3 — 이 역시 자유 서술 한 단락. 항목별 선택 UI 없음.
    saveAs: "step3",
  },
  {
    id: "ai1",
    type: "generated_question",
    role: "criterion_gap_question_generation",
    prompt: null, // AI 호출 — 아래 note 참고
    saveAs: "question",
    inputs: ["initialJudgment", "step1", "step2", "step3"],
    note: `[code] buildQuestionPrompt — step2(전체 기준 서술)와 step3(이미 가진 것 서술)을 비교해 언급되지 않은 지점을 열어 묻는 질문 하나를 생성한다. 유도 질문 금지, 대사 대신 질문만.`,
  },
  {
    id: "q5",
    type: "decisive_qualification_display",
    role: "decisive_qualification",
    prompt: `개척자가 묻습니다 — {question}`, // [code] s4 조건 카드
    saveAs: "question",
  },
  {
    id: "q5b",
    type: "text",
    role: "decisive_qualification_answer",
    prompt: `이 질문에 답한다면, 뭐라고 하시겠습니까?`, // [code] s4
    saveAs: "step5",
  },
  {
    id: "q6",
    type: "text",
    role: "rejudgment",
    prompt: `이 질문에 답하고도, 처음 판단이 그대로입니까?`, // [code] s5 — 자유 서술. protocol 문서엔 이 자리가 5지선다(처음과 같다/…/아직 어렵다)로 되어 있지만 코드는 자유입력이다.
    saveAs: "step6",
  },
  {
    id: "q7",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그 판단이 그대로인 이유, 혹은 달라진 이유는 무엇입니까?`, // [code] s6
    saveAs: "step6b",
  },
  {
    id: "q8",
    type: "text",
    role: "newly_visible",
    prompt: `오늘 이 과정을 돌아보면, 무엇이 새롭게 보입니까?`, // [code] s7
    saveAs: "step7",
  },
];

/* ============================================================
   12. 초상화가 — Portraitist (Identity)
   ============================================================ */
const portraitist = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `최근 어떤 일을 겪고 나서 "나는 원래 이런 사람인가 보다"라고 자신을 판단했던 일이 있었습니까?`, // [code] s0
    saveAs: "sceneExists",
    options: YES_SIMILAR_NO,
  },
  {
    id: "q2",
    type: "text",
    role: "first_experience",
    prompt: `무슨 일이 있었습니까?`, // [code] s2
    saveAs: "firstExperience",
  },
  {
    id: "q3",
    type: "text",
    role: "initial_self_definition",
    prompt: `그 일을 겪고 나서, 자신을 어떤 사람이라고 생각했습니까?`, // [code] s3
    saveAs: "initialJudgment",
  },
  {
    id: "q4",
    type: "single_choice",
    role: "self_definition_basis",
    prompt: `이 경험에서 무엇을 보고 이렇게 생각했습니까?`, // [code] s4
    saveAs: "selfDefinitionBasis",
    options: [
      { id: "action", label: `내가 한 행동`, value: "action" },
      { id: "inaction", label: `하지 못한 것`, value: "inaction" },
      { id: "outcome", label: `결과나 성과`, value: "outcome" },
      { id: "others_reaction", label: `다른 사람의 반응이나 평가`, value: "others_reaction" },
      { id: "comparison", label: `다른 사람과의 비교`, value: "comparison" },
      { id: "old_belief", label: `예전부터 가지고 있던 생각`, value: "old_belief" },
      { id: "other", label: `직접 적기`, value: "other" },
      { id: "uncertain", label: `잘 모르겠다`, value: "uncertain" },
    ],
  },
  {
    id: "q5",
    type: "single_choice",
    role: "additional_experience_check",
    prompt: `이 경험 말고, 자신에 대해 떠오르는 다른 경험이 있습니까?`, // [code] s5
    saveAs: "additionalExperienceExists",
    options: [
      { id: "yes", label: `있다.`, value: "yes" },
      { id: "not_immediate", label: `바로 떠오르지 않는다.`, value: "not_immediate" },
      { id: "no", label: `없다.`, value: "no" },
    ],
  },
  {
    id: "q6",
    type: "text",
    role: "second_experience",
    prompt: `어떤 일이었습니까?`, // [code] s6, additionalExperienceExists === yes일 때만
    saveAs: "secondExperience",
  },
  {
    id: "q7",
    type: "text",
    role: "actual_behavior",
    prompt: `이 장면에서 당신은 실제로 무엇을 했습니까?`, // [code] s7a(+s7b, 두 경험이면 2회 반복)
    saveAs: "actualBehaviors",
    repeatsPer: ["firstExperience", "secondExperience"],
  },
  {
    id: "q8",
    type: "text",
    role: "expanded_self_description",
    // [code] s8 — hasSecond 여부로 prompt 분기
    prompt: {
      hasSecond: `이 두 경험에서 보인 모습을 함께 담아 지금의 당신을 묘사한다면, 어떤 사람이라고 하겠습니까?`,
      singleExperience: `그때 실제로 한 것까지 함께 놓고 자신을 다시 묘사한다면, 어떤 사람이라고 하겠습니까?`,
    },
    promptDependsOn: "additionalExperienceExists",
    saveAs: "expandedSelfDescription",
  },
  {
    id: "q9",
    type: "single_choice",
    role: "rejudgment",
    prompt: `처음에는 "{initialJudgment}"라고 생각했습니다. 지금도 그렇게 생각합니까?`, // [code] s9
    saveAs: "rejudgment",
    options: [
      { id: "same", label: `처음과 같은 판단이다.`, value: "same" },
      { id: "partially_changed", label: `일부는 같지만 다르게 보이는 부분이 있다.`, value: "partially_changed" },
      { id: "broader_description", label: `지금은 자신을 더 넓게 설명하고 싶다.`, value: "broader_description" },
      { id: "different", label: `처음과 다르게 판단한다.`, value: "different" },
      { id: "uncertain", label: `아직 잘 모르겠다.`, value: "uncertain" },
    ],
  },
  {
    id: "q10",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그렇게 정한 이유는 무엇입니까?`, // [code] s10, q10Prompt(step9)로 분기 생성
    saveAs: "reflection",
  },
];

/* ============================================================
   13. 기록자 — Chronicler (Probability)
   ============================================================ */
const chronicler = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `이 생각이 들었던 구체적인 순간이 있었습니까?`, // [code] s0
    saveAs: "predictionSceneExists",
    options: [
      { id: "yes", label: `있다.`, value: "yes" },
      { id: "no", label: `특별히 떠오르는 순간은 없다.`, value: "no" },
    ],
  },
  {
    id: "q2",
    type: "text",
    role: "scene",
    prompt: `그 순간으로 돌아가 보겠습니다. 어떤 일이 있었습니까?`, // [code] s1
    saveAs: "scene",
  },
  {
    id: "q3",
    type: "text",
    role: "prediction",
    prompt: `그때 무엇이 걱정되었거나, 어떤 생각 때문에 그렇게 판단했습니까?`, // [code] s2
    saveAs: "prediction",
  },
  {
    id: "q4",
    type: "single_choice",
    role: "prediction_source",
    prompt: `그렇게 생각하게 된 데 가장 가까운 것은 무엇입니까?`, // [code] s3
    saveAs: "predictionSource",
    options: [
      { id: "direct_signal", label: `상대에게서 직접 그런 말이나 반응을 받은 적이 있다.`, value: "direct_signal" },
      { id: "observed_cases", label: `비슷한 상황에서 그런 일이 일어나는 것을 본 적이 있다.`, value: "observed_cases" },
      { id: "personal_experience", label: `내가 이전에 비슷한 일을 겪은 적이 있다.`, value: "personal_experience" },
      { id: "longheld_belief", label: `특별한 경험은 없지만 원래 그렇게 생각해왔다.`, value: "longheld_belief" },
      { id: "felt_likelihood", label: `이유를 설명하기 어렵지만 그렇게 될 것 같았다.`, value: "felt_likelihood" },
      { id: "uncertain", label: `잘 모르겠다.`, value: "uncertain" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q5",
    type: "single_choice",
    role: "verification_level",
    prompt: `그 생각이 지금 이 상황에서도 맞는지는 어느 정도 확인되어 있습니까?`, // [code] s4
    saveAs: "verificationLevel",
    options: [
      { id: "directly_verified", label: `이번 상황에서도 직접 확인한 사실이 있다.`, value: "directly_verified" },
      { id: "indirect_evidence", label: `그렇게 생각할 만한 근거는 있지만 아직 직접 확인하지는 않았다.`, value: "indirect_evidence" },
      { id: "prior_cases", label: `이전 경험이나 사례를 바탕으로 그렇게 생각하고 있다.`, value: "prior_cases" },
      { id: "prediction_only", label: `아직 예상이나 생각에 가깝다.`, value: "prediction_only" },
      { id: "uncertain", label: `잘 모르겠다.`, value: "uncertain" },
    ],
  },
  {
    id: "judgment_card",
    type: "recap",
    role: "juxtaposition",
    prompt: `그때의 생각 / 그 생각의 근거 / 현재 확인된 정도`, // [code] s5 "판단 카드"
    saveAs: null,
    items: ["prediction", "predictionSource", "verificationLevel"],
  },
  {
    id: "ai1",
    type: "generated_question",
    role: "counterexample_condition_generation",
    prompt: null,
    saveAs: "condition",
    inputs: ["scene", "prediction", "predictionSource", "verificationLevel"],
    note: `[code] buildConditionPrompt — 근거 성격(직접반응형/목격형/경험형/신념형/불명확)에 따라 다른 실제 반례 조건 문장 하나를 생성한다.`,
  },
  {
    id: "condition_card",
    type: "generated_display",
    role: "new_condition_display",
    prompt: `새로운 조건 — {condition}`, // [code] s6
    saveAs: "condition",
  },
  {
    id: "q6",
    type: "single_choice",
    role: "rejudgment",
    prompt: `이 사실을 알게 된 지금, 같은 상황이라면 처음과 같은 판단을 하시겠습니까?`, // [code] s6
    saveAs: "rejudgment",
    options: [
      { id: "same", label: `같은 판단을 한다.`, value: "same" },
      { id: "confidence_changed", label: `판단의 방향은 같지만 확신의 정도가 달라진다.`, value: "confidence_changed" },
      { id: "different", label: `다른 판단을 한다.`, value: "different" },
      { id: "uncertain", label: `아직 판단하기 어렵다.`, value: "uncertain" },
    ],
  },
  {
    id: "q7",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그렇게 판단한 이유는 무엇입니까?`, // [code] s7, Q7_PROMPT[step6]로 분기 생성
    saveAs: "reflection",
  },
];

/* ============================================================
   14. 수문장 — Gatekeeper (Boundary)
   ============================================================ */
const gatekeeper = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `최근 누군가에게 맞춰주거나 양보하면서, "여기까지 해줘야 하나?"라는 생각이 들었던 일이 있었습니까?`, // [code] s0
    saveAs: "boundarySceneExists",
    options: YES_SIMILAR_NO,
  },
  {
    id: "q2",
    type: "text",
    role: "giving_context",
    prompt: `누구와 있었던 일입니까? 그리고 그 사람에게 무엇을 해주거나 양보하고 있었습니까?`, // [code] s2
    saveAs: "givingContext",
  },
  {
    id: "q3",
    type: "text",
    role: "protected_self_resource",
    prompt: `이것을 하더라도, 나에게 꼭 남겨두고 싶은 것은 무엇입니까?`, // [code] s3
    saveAs: "mustRemain",
  },
  {
    id: "q4",
    type: "text",
    role: "acceptable_range",
    prompt: `이 부탁이나 행동을 어디까지는 해줄 수 있습니까?`, // [code] s4
    saveAs: "acceptableRange",
  },
  {
    id: "q5",
    type: "text",
    role: "boundary_point",
    prompt: `어떤 경우부터는 더 해주기 어렵다고 생각합니까?`, // [code] s5
    saveAs: "boundaryPoint",
  },
  {
    id: "boundary_card",
    type: "recap",
    role: "juxtaposition",
    prompt: `내가 해주거나 양보하고 있던 것 / 나에게 남겨두고 싶은 것 / 여기까지는 가능 / 여기부터는 어렵다`, // [code] s6 "경계"
    saveAs: null,
    items: ["givingContext", "mustRemain", "acceptableRange", "boundaryPoint"],
  },
  {
    id: "q6",
    type: "single_choice",
    role: "boundary_test",
    prompt: `당신이 방금 말한 "{boundaryPoint}" 상황이 실제로 생겼다고 생각해보세요. 그때 어떻게 하시겠습니까?`, // [code] s6
    saveAs: "boundaryResponse",
    options: [
      { id: "still_give", label: `그래도 해준다.`, value: "still_give" },
      { id: "limit_to_boundary", label: `내가 정한 범위까지만 해준다.`, value: "limit_to_boundary" },
      { id: "refuse", label: `이번에는 거절한다.`, value: "refuse" },
      { id: "set_condition", label: `다른 조건을 제안한다.`, value: "set_condition" },
      { id: "uncertain", label: `아직 결정하기 어렵다.`, value: "uncertain" },
    ],
  },
  {
    id: "q7",
    type: "text",
    role: "boundary_response_reason",
    prompt: `그렇게 정한 이유는 무엇입니까?`, // [code] s7, q7Prompt(step6)로 분기 생성
    saveAs: "boundaryReason",
  },
  {
    id: "q8",
    type: "single_choice",
    role: "rejudgment",
    prompt: `처음에는 이것을 하고 있었습니다. 지금 다시 보면, 앞으로는 어디까지 해주는 것이 맞다고 생각합니까?`, // [code] s8
    saveAs: "rejudgment",
    options: [
      { id: "similar", label: `지금까지와 비슷하게 한다.`, value: "similar" },
      { id: "within_range", label: `내가 정한 범위까지만 한다.`, value: "within_range" },
      { id: "conditional", label: `조건을 정해서 한다.`, value: "conditional" },
      { id: "less", label: `이전보다 덜 한다.`, value: "less" },
      { id: "stop", label: `더 이상 하지 않는다.`, value: "stop" },
      { id: "uncertain", label: `아직 잘 모르겠다.`, value: "uncertain" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
];

/* ============================================================
   15. 청지기 — Steward (Boundary)
   ============================================================ */
const steward = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `최근 여러 사람이 함께해야 하는 일에서, "결국 내가 해야 한다"고 생각하며 맡고 있던 일이 있었습니까?`, // [code] s0
    saveAs: "sharedWorkExists",
    options: YES_SIMILAR_NO,
  },
  {
    id: "q2",
    type: "text",
    role: "shared_work_scene",
    prompt: `무슨 일이 있었습니까?`, // [code] s2
    saveAs: "sharedWork",
  },
  {
    id: "q3",
    type: "text",
    role: "initial_responsibility",
    prompt: `그때 "내가 해야 한다"고 생각한 것은 무엇이었습니까?`, // [code] s3
    saveAs: "initialResponsibility",
  },
  {
    id: "q4",
    type: "list_input",
    role: "required_tasks",
    prompt: `이 일이 이루어지려면 실제로 어떤 일들이 필요합니까?`, // [code] s4
    saveAs: "requiredTasks",
    minItems: 2,
  },
  {
    id: "q5",
    type: "dynamic_single_choice",
    source: "requiredTasks",
    role: "task_ownership",
    prompt: `이 일은 누가 맡는 것이 맞다고 생각합니까?`, // [code] s5, 항목별 반복
    saveAs: "taskOwnership",
    options: [
      { id: "mine", label: `내가 맡을 일`, value: "mine" },
      { id: "theirs", label: `상대가 맡을 일`, value: "theirs" },
      { id: "shared", label: `함께 맡을 일`, value: "shared" },
      { id: "uncertain", label: `잘 모르겠다`, value: "uncertain" },
    ],
  },
  {
    id: "share_screen",
    type: "recap",
    role: "juxtaposition",
    prompt: `내가 맡을 일 / 상대가 맡을 일 / 함께 맡을 일 / 아직 정하기 어려운 일`, // [code] s6 "몫 화면"
    saveAs: null,
    items: ["taskOwnership"],
  },
  {
    id: "q6",
    type: "text",
    role: "actual_responsibility",
    prompt: `이렇게 나누어 놓고 보니, 이 일에서 당신이 실제로 맡을 부분은 무엇입니까?`, // [code] s6
    saveAs: "actualResponsibility",
  },
  {
    id: "q7",
    type: "text",
    role: "outside_responsibility",
    prompt: `당신이 맡을 범위를 넘어서는 일은 누구의 몫입니까?`, // [code] s7
    saveAs: "outsideResponsibility",
  },
  {
    id: "q8",
    type: "single_choice",
    role: "rejudgment",
    prompt: `처음에는 "{initialResponsibility}"라고 생각했습니다. 지금도 같은 판단입니까?`, // [code] s8
    saveAs: "rejudgment",
    options: [
      { id: "same", label: `처음과 같다.`, value: "same" },
      { id: "scope_changed", label: `내가 맡을 범위가 달라졌다.`, value: "scope_changed" },
      { id: "shared_visible", label: `함께 맡아야 할 부분이 새롭게 보인다.`, value: "shared_visible" },
      { id: "others_visible", label: `다른 사람에게 맡길 부분이 새롭게 보인다.`, value: "others_visible" },
      { id: "uncertain", label: `아직 잘 모르겠다.`, value: "uncertain" },
    ],
  },
  {
    id: "q9",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그렇게 정한 이유는 무엇입니까?`, // [code] s9, q9Prompt(step8)로 분기 생성
    saveAs: "reflection",
  },
];

/* ============================================================
   16. 해부학자 — Anatomist (Criterion)
   ============================================================ */
const anatomist = [
  {
    id: "q1",
    type: "text",
    role: "scene_eligibility",
    prompt: `이런 생각을 했던 때를 하나 떠올려보세요. 그때 무슨 일이 있었습니까?`, // [code] s0 — 게이트 없이 바로 장면 서술
    saveAs: "sceneExists",
  },
  {
    id: "q2",
    type: "text",
    role: "decision",
    // [code] s1 status 게이트: "이미 선택했다." / "아직 선택하지 않았다."
    prompt: `그 일은 지금 어떤 상태입니까?`,
    saveAs: "decision",
  },
  {
    id: "q3",
    type: "single_choice",
    role: "initial_judgment",
    // [code] s2 — status에 따라 prompt 분기
    prompt: {
      done: `그때 결국 어떻게 했습니까?`,
      pending: `지금은 어느 쪽으로 마음이 더 기울어 있습니까?`,
    },
    promptDependsOn: "status",
    saveAs: "initialJudgment",
    options: [
      { id: "do", label: `하려고 했다.`, value: "do" },
      { id: "not_do", label: `하지 않으려고 했다.`, value: "not_do" },
      { id: "undecided", label: `아직 정하지 못했다.`, value: "undecided" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q4",
    type: "text",
    role: "isolated_factor",
    // [code] s3 — status에 따라 prompt 분기
    prompt: {
      done: `무엇을 고려하느라 그런 선택을 내렸습니까?`,
      pending: `지금 무엇을 고려하느라 그쪽으로 마음이 기울고 있습니까?`,
    },
    promptDependsOn: "status",
    saveAs: "isolatedFactor",
  },
  {
    id: "q5",
    type: "single_choice",
    role: "counterfactual_judgment",
    prompt: `"{isolatedFactor}"이 아니었다면, 같은 선택을 했을까요?`, // [code] s4
    saveAs: "judgmentWithoutFactor",
    options: [
      { id: "same", label: `그래도 같은 선택을 했을 것이다.`, value: "same" },
      { id: "different", label: `다른 선택을 했을 것이다.`, value: "different" },
      { id: "uncertain", label: `어느 쪽인지 판단하기 어렵다.`, value: "uncertain" },
    ],
  },
  {
    id: "q6",
    type: "text",
    role: "counterfactual_reason",
    prompt: `왜 그렇게 생각합니까?`, // [code] s5
    saveAs: "counterfactualReason",
  },
  {
    id: "juxtaposition",
    type: "recap",
    role: "juxtaposition",
    prompt: `처음 판단 / 판단에 작용한 영향 / 그 영향이 없었다면 / 그렇게 생각한 이유`, // [code] s6 "병치"
    saveAs: null,
    items: ["initialJudgment", "isolatedFactor", "judgmentWithoutFactor", "counterfactualReason"],
  },
  {
    id: "q7",
    type: "single_choice",
    role: "rejudgment",
    prompt: `이 내용을 함께 놓고 보면, 지금 그때의 선택은 어떻게 보입니까?`, // [code] s6
    saveAs: "rejudgment",
    options: [
      { id: "same", label: `처음과 같다.`, value: "same" },
      { id: "reason_changed", label: `선택은 같지만 그 이유가 다르게 보인다.`, value: "reason_changed" },
      { id: "different", label: `지금은 다르게 판단한다.`, value: "different" },
      { id: "uncertain", label: `아직 잘 모르겠다.`, value: "uncertain" },
    ],
  },
  {
    id: "q8",
    type: "text",
    role: "newly_visible",
    prompt: `처음에는 잘 보이지 않았지만, 지금 보이는 것이 있습니까?`, // [code] s7
    saveAs: "newInformation",
  },
];

/* ============================================================
   17. 재판관 — Magistrate (Criterion)
   ============================================================ */
const magistrate = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `최근 어떤 일을 두고 결정하기 어려웠던 순간이 있었습니까?`, // [code] s0
    saveAs: "sceneExists",
    options: YES_SIMILAR_NO,
  },
  {
    id: "q2",
    type: "text",
    role: "decision",
    prompt: `그때 무엇을 결정해야 했습니까?`, // [code] s2
    saveAs: "decision",
  },
  {
    id: "q3",
    type: "single_choice",
    role: "initial_judgment",
    prompt: `그때는 어느 쪽으로 생각하고 있었습니까?`, // [code] s3
    saveAs: "initialJudgment",
    options: [
      { id: "do", label: `하려고 했다.`, value: "do" },
      { id: "not_do", label: `하지 않으려고 했다.`, value: "not_do" },
      { id: "undecided", label: `어느 쪽도 정하지 못했다.`, value: "undecided" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q4",
    type: "text",
    role: "blocking_factor",
    prompt: `이 결정에서 가장 마음에 걸렸던 것은 무엇입니까?`, // [code] s4
    saveAs: "blockingFactor",
  },
  {
    id: "q5",
    type: "text",
    role: "threshold_condition",
    prompt: `{blockingFactor}이(가) 어떻게 달라지면 지금과 다른 선택을 할 수 있을 것 같습니까?`, // [code] s5
    saveAs: "thresholdCondition",
    hint: `금액, 요일, 횟수, 비율처럼 실제로 확인할 수 있는 기준으로 적어주세요.`,
  },
  {
    id: "ai1",
    type: "generated_question",
    role: "current_reality_question_generation",
    prompt: null,
    saveAs: "currentRealityQuestion",
    inputs: ["decision", "initialJudgment", "blockingFactor", "thresholdCondition"],
    note: `[code] buildQuestionPrompt — thresholdCondition을 현재 실제 상황과 비교할 수 있는 구체 질문 하나를 생성한다. 명사·단위 유지, 새 기준 추가 금지, 유도 금지, 한 번에 한 사실만.`,
  },
  {
    id: "q6",
    type: "generated_question",
    role: "current_reality",
    prompt: `{currentRealityQuestion}`, // [code] s6 — AI가 생성한 질문을 그대로 표시
    saveAs: "currentReality",
  },
  {
    id: "verdict_screen",
    type: "recap",
    role: "juxtaposition",
    prompt: `내 판단이 달라지는 선 / 현재 실제 상황`, // [code] s7 "판결 화면"
    saveAs: null,
    items: ["thresholdCondition", "currentReality"],
  },
  {
    id: "q7",
    type: "single_choice",
    role: "rejudgment",
    prompt: `이 둘을 함께 놓고 보면, 지금은 어떻게 판단합니까?`, // [code] s7
    saveAs: "rejudgment",
    options: [
      { id: "same", label: `처음과 같은 판단이다.`, value: "same" },
      { id: "condition_adjusted", label: `같은 방향이지만 조건을 조정하고 싶다.`, value: "condition_adjusted" },
      { id: "different", label: `다른 선택을 한다.`, value: "different" },
      { id: "uncertain", label: `아직 결정하기 어렵다.`, value: "uncertain" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q8",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그렇게 판단한 이유는 무엇입니까?`, // [code] s8, q8Prompt(step7)로 분기 생성
    saveAs: "reflection",
  },
];

/* ============================================================
   18. 마술사 — Magician (Criterion)
   ============================================================ */
const magician = [
  {
    id: "q1",
    type: "single_choice",
    role: "scene_eligibility",
    prompt: `최근 어떤 선택을 하면서, 한 가지가 유난히 크게 마음에 걸렸던 일이 있었습니까?`, // [code] s0
    saveAs: "sceneExists",
    options: YES_SIMILAR_NO,
  },
  {
    id: "q2",
    type: "text",
    role: "decision",
    prompt: `그때 무엇을 결정하거나 선택해야 했습니까?`, // [code] s2
    saveAs: "decision",
  },
  {
    id: "q3",
    type: "single_choice",
    role: "initial_judgment",
    prompt: `그때는 어느 쪽으로 생각하고 있었습니까?`, // [code] s3
    saveAs: "initialJudgment",
    options: [
      { id: "do", label: `하려고 했다.`, value: "do" },
      { id: "not_do", label: `하지 않으려고 했다.`, value: "not_do" },
      { id: "undecided", label: `어느 쪽도 정하지 못했다.`, value: "undecided" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q4",
    type: "text",
    role: "focus_factor",
    prompt: `지금 이 선택에서 가장 크게 작용하고 있는 한 가지는 무엇입니까?`, // [code] s4
    saveAs: "focusFactor",
    hint: `예: 상대가 실망할 것 같다는 생각, 이미 들인 시간이 아깝다는 생각, 돈을 잃을 수도 있다는 걱정`,
  },
  {
    id: "cloak1",
    type: "narrative",
    role: "counterfactual_removal",
    prompt: `투명망토 — 잠시 "{focusFactor}"에 투명망토를 씌워보겠습니다. 지금 이 판단을 하는 동안에는 "{focusFactor}"가 보이지 않고 판단에도 들어오지 않는다고 생각해보세요.`, // [code] cloak1
    saveAs: null,
  },
  {
    id: "q5",
    type: "single_choice",
    role: "counterfactual_judgment",
    prompt: `"{focusFactor}"가 판단에 들어오지 않는다면, 지금도 같은 선택을 하시겠습니까?`, // [code] s5
    saveAs: "judgmentWithoutFactor",
    options: [
      { id: "same", label: `처음과 같은 선택을 한다.`, value: "same" },
      { id: "different", label: `다른 선택을 한다.`, value: "different" },
      { id: "uncertain", label: `아직 결정하기 어렵다.`, value: "uncertain" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q6",
    type: "text",
    role: "remaining_judgment_basis",
    prompt: `그렇게 판단한 이유는 무엇입니까?`, // [code] s6, q6Prompt(step5)로 분기 생성
    saveAs: "remainingBasis",
  },
  {
    id: "cloak2",
    type: "narrative",
    role: "counterfactual_restore",
    prompt: `투명망토 벗기기 — 이제 "{focusFactor}"를 다시 판단 안으로 가져오겠습니다.`, // [code] cloak2
    saveAs: null,
  },
  {
    id: "q7",
    type: "single_choice",
    role: "factor_role",
    prompt: `이 요소를 다시 놓고 보면, 처음 판단에서 어떤 역할을 하고 있었습니까?`, // [code] s7
    saveAs: "factorRole",
    options: [
      { id: "decisive", label: `이 요소가 판단을 거의 결정하고 있었다.`, value: "decisive" },
      { id: "important", label: `중요한 이유 중 하나였다.`, value: "important" },
      { id: "non_decisive", label: `영향을 주고 있었지만 결정적인 이유는 아니었다.`, value: "non_decisive" },
      { id: "smaller_than_expected", label: `생각했던 것보다 영향이 작았다.`, value: "smaller_than_expected" },
      { id: "uncertain", label: `아직 잘 모르겠다.`, value: "uncertain" },
    ],
  },
  {
    id: "q8",
    type: "single_choice",
    role: "rejudgment",
    prompt: `"{focusFactor}"가 있을 때와 없을 때를 모두 보았습니다. 지금은 어떻게 판단합니까?`, // [code] s8
    saveAs: "rejudgment",
    options: [
      { id: "same", label: `처음과 같은 판단이다.`, value: "same" },
      { id: "reason_changed", label: `같은 선택이지만 이유가 다르게 보인다.`, value: "reason_changed" },
      { id: "different", label: `다른 선택을 한다.`, value: "different" },
      { id: "uncertain", label: `아직 결정하기 어렵다.`, value: "uncertain" },
      { id: "other", label: `직접 적기`, value: "other" },
    ],
  },
  {
    id: "q9",
    type: "text",
    role: "rejudgment_reason",
    prompt: `그렇게 판단한 이유는 무엇입니까?`, // [code] s9, q9Prompt(step8)로 분기 생성
    saveAs: "reflection",
  },
];

/* ============================================================
   공통 Result 구조 + operationData 매핑 예시
   ============================================================ */
const RESULT_SHAPE = {
  personaId: null,
  personaVersion: "1.0",
  initialJudgment: null,
  operationData: {},
  rejudgment: null,
  reflection: null,
  rawAnswers: {},
};

const OPERATION_DATA_FIELDS = {
  patron: ["opportunity", "adviceToOther", "adviceReason", "criterionTransfer", "differentCriterionReason"],
  novelist: ["scene", "externalView", "internalView", "integratedDescription"],
  oracle: ["decision", "neededChange", "informationTiming", "verificationPath"],
  timeTraveler: ["scene", "currentFactor", "futureWeight", "futureFactorExists", "futureFactor"],
  merchant: ["continuedChoice", "currentCost", "expectedReturn", "hasDisplacedOpportunity", "displacedOpportunity"],
  guardian: ["continuedCommitment", "pastInvestment", "hardestToRelease", "futureInvestment", "coreAttachment"],
  witness: ["recipient", "unspokenMessage", "whatRemains", "whatRemainsReason"],
  general: ["ongoingDuty", "resourceInput", "displacedArea"],
  artisan: ["scene", "judgmentElements", "elementJudgments"],
  surveyor: ["scene", "decision", "attachedIssues", "scopeClassification", "redefinedScope"],
  pioneer: ["step1", "step2", "step3", "question", "step5", "step6", "step6b", "step7"],
  portraitist: ["firstExperience", "selfDefinitionBasis", "additionalExperienceExists", "secondExperience", "actualBehaviors", "expandedSelfDescription"],
  chronicler: ["scene", "prediction", "predictionSource", "verificationLevel", "condition"],
  gatekeeper: ["givingContext", "mustRemain", "acceptableRange", "boundaryPoint", "boundaryResponse", "boundaryReason"],
  steward: ["sharedWork", "initialResponsibility", "requiredTasks", "taskOwnership", "actualResponsibility", "outsideResponsibility"],
  anatomist: ["decision", "isolatedFactor", "judgmentWithoutFactor", "counterfactualReason", "newInformation"],
  magistrate: ["decision", "blockingFactor", "thresholdCondition", "currentReality"],
  magician: ["decision", "focusFactor", "judgmentWithoutFactor", "remainingBasis", "factorRole"],
};

/* ============================================================
   export
   ============================================================ */
export const SPECULUM_SCHEMA = {
  patron,
  novelist,
  oracle,
  timeTraveler,
  merchant,
  guardian,
  witness,
  general,
  artisan,
  surveyor,
  pioneer,
  portraitist,
  chronicler,
  gatekeeper,
  steward,
  anatomist,
  magistrate,
  magician,
};

export const SPECULUM_RESULT_SHAPE = RESULT_SHAPE;
export const SPECULUM_OPERATION_DATA_FIELDS = OPERATION_DATA_FIELDS;
