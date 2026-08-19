// Meditatio v1.0 — FINAL 문항 데이터
// 출처: 프로젝트 문서 "메디테티오" (MEDITATIO v1.0 — FINAL)
// 4개 Section, 33개 질문, 총 176개 선택지(마지막 선택지 번호 176).
// 각 옵션은 원문의 태그([Default: ...] / [Object: ...] / [Affect Signal: ...] / [Domain: ...])를 그대로 옮긴 것.
// 이 파일은 "설계"가 아니라 이미 확정된 문서를 코드로 옮긴 것 — 문항 문구/태그를 임의로 바꾸지 않는다.

export const MEDITATIO_VERSION = "meditatio-v1.0";

// ---------------------------------------------------------------------------
// SECTION 1 — 판단은 어디서 시작되는가 (측정 레이어: Default Strategy)
// ---------------------------------------------------------------------------
const section1 = {
  id: "section1",
  index: 1,
  title: "판단은 어디서 시작되는가",
  layer: "Default Strategy",
  type: "single",
  questions: [
    {
      id: "s1q1",
      n: 1,
      text: "새로운 프로젝트가 생겼습니다. 일주일 안에 방향을 정해야 합니다. 가장 먼저 확인하게 되는 것은 무엇인가요?",
      field: "defaultStrategy",
      options: [
        { n: 1, text: "충분히 이해할 수 있는 정보가 있는지", tag: { default: "understanding" } },
        { n: 2, text: "직접 해보며 확인할 수 있는지", tag: { default: "action" } },
        { n: 3, text: "믿을 만한 사람의 의견이 무엇인지", tag: { default: "connection" } },
        { n: 4, text: "위험을 줄일 수 있는 방법이 있는지", tag: { default: "stability" } },
        { n: 5, text: "내 마음이 가장 끌리는 방향이 무엇인지", tag: { default: "intuition" } },
      ],
    },
    {
      id: "s1q2",
      n: 2,
      text: "중요한 결정을 앞두고 있는데 정보가 부족합니다. 가장 가까운 반응은 무엇인가요?",
      field: "defaultStrategy",
      options: [
        { n: 6, text: "더 알아볼 수 있는 만큼 확인한다.", tag: { default: "understanding" } },
        { n: 7, text: "먼저 움직여 보면서 판단한다.", tag: { default: "action" } },
        { n: 8, text: "믿는 사람과 이야기해 본다.", tag: { default: "connection" } },
        { n: 9, text: "가장 안전한 선택부터 찾는다.", tag: { default: "stability" } },
        { n: 10, text: "지금 가장 맞다고 느껴지는 방향을 따른다.", tag: { default: "intuition" } },
      ],
    },
    {
      id: "s1q3",
      n: 3,
      text: "새로운 분야를 배워야 합니다. 가장 자연스러운 시작은 무엇인가요?",
      field: "defaultStrategy",
      options: [
        { n: 11, text: "먼저 원리와 개념을 이해한다.", tag: { default: "understanding" } },
        { n: 12, text: "직접 해보면서 익힌다.", tag: { default: "action" } },
        { n: 13, text: "경험 있는 사람에게 배운다.", tag: { default: "connection" } },
        { n: 14, text: "검증된 방법이나 순서부터 따라가 본다.", tag: { default: "stability" } },
        { n: 15, text: "가장 흥미가 생기는 부분부터 시작한다.", tag: { default: "intuition" } },
      ],
    },
    {
      id: "s1q4",
      n: 4,
      text: "둘 다 중요한 두 가지 중 하나를 선택해야 합니다. 마지막 선택을 이끄는 것은 무엇인가요?",
      field: "defaultStrategy",
      options: [
        { n: 16, text: "더 타당한 근거가 있는 쪽", tag: { default: "understanding" } },
        { n: 17, text: "지금 실제로 움직일 수 있는 쪽", tag: { default: "action" } },
        { n: 18, text: "관계를 더 지킬 수 있는 쪽", tag: { default: "connection" } },
        { n: 19, text: "더 안정적으로 유지할 수 있는 쪽", tag: { default: "stability" } },
        { n: 20, text: "마음이 더 강하게 향하는 쪽", tag: { default: "intuition" } },
      ],
    },
    {
      id: "s1q5",
      n: 5,
      text: "예상과 전혀 다른 결과가 나왔습니다. 가장 먼저 무엇을 기준으로 다음 판단을 시작하나요?",
      field: "defaultStrategy",
      options: [
        { n: 21, text: "내가 무엇을 잘못 이해했는지 다시 본다.", tag: { default: "understanding" } },
        { n: 22, text: "다른 방법을 직접 시도해 본다.", tag: { default: "action" } },
        { n: 23, text: "다른 사람은 이 상황을 어떻게 보는지 확인한다.", tag: { default: "connection" } },
        { n: 24, text: "더 커질 수 있는 위험부터 줄인다.", tag: { default: "stability" } },
        { n: 25, text: "처음에 놓친 다른 가능성을 따라가 본다.", tag: { default: "intuition" } },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// SECTION 2 — 무엇이 내 안에 남는가 (측정 레이어: Affect / Emotional Pattern)
// Domain 점수로 직접 합산하지 않는다 — Affect Signal은 보조 단서로만 사용한다.
// ---------------------------------------------------------------------------
const section2 = {
  id: "section2",
  index: 2,
  title: "무엇이 내 안에 남는가",
  layer: "Affect / Emotional Pattern",
  type: "single", // card별 개별 question.type으로 override 가능 (Q17만 multi)
  cards: [
    {
      id: "card1",
      title: "좋은 감정",
      questions: [
        {
          id: "s2q1", n: 1,
          text: "최근 스스로 조용히 뿌듯했던 순간이 있었나요?",
          object: "positive_affect_entry",
          options: [
            { n: 26, text: "있었다." },
            { n: 27, text: "잘 모르겠다." },
            { n: 28, text: "딱히 없었다." },
          ],
        },
        {
          id: "s2q2", n: 2,
          text: "그때 가장 크게 느껴졌던 것은 무엇인가요?",
          object: "positive_source",
          options: [
            { n: 29, text: "내 힘으로 해냈다는 느낌", signals: ["agency"] },
            { n: 30, text: "누군가가 나를 알아봐 준 느낌", signals: ["evaluation_related"] },
            { n: 31, text: "예전보다 달라진 나를 본 느낌", signals: ["growth"] },
            { n: 32, text: "내가 원해서 선택한 결과라는 느낌", signals: ["autonomous_choice"] },
            { n: 33, text: "누군가에게 도움이 되었다는 느낌", signals: ["contribution"] },
            { n: 34, text: "있는 그대로 받아들여졌다는 느낌", signals: ["relationship_related"] },
          ],
        },
        {
          id: "s2q3", n: 3,
          text: "그 좋은 감정은 얼마나 남아 있었나요?",
          object: "positive_affect_duration",
          options: [
            { n: 35, text: "그 순간만 좋았다." },
            { n: 36, text: "하루 이틀 정도 남았다." },
            { n: 37, text: "꽤 오래 남아 있었다." },
            { n: 38, text: "지금도 떠올리면 좋다." },
          ],
        },
        {
          id: "s2q4", n: 4,
          text: "좋은 감정이 금방 사라지는 경우, 가장 가까운 것은 무엇인가요?",
          object: "positive_affect_decay",
          options: [
            { n: 39, text: "다른 일에 관심이 옮겨간다." },
            { n: 40, text: "별일 아니라고 스스로 넘긴다." },
            { n: 41, text: "더 잘해야 한다는 생각이 든다." },
            { n: 42, text: "함께 나눌 사람이 없어서 금방 지나간다." },
            { n: 43, text: "잘 모르겠다." },
          ],
        },
        {
          id: "s2q5", n: 5,
          text: "무언가를 원할 때, 가장 먼저 마음에 걸리는 것은 무엇인가요?",
          object: "desire_check",
          options: [
            { n: 44, text: "지금 이걸 원해도 되는 상황일까.", signals: ["self_permission_related"] },
            { n: 45, text: "다른 사람에게 먼저 필요한 것은 아닐까.", signals: ["relationship_related"] },
            { n: 46, text: "내가 이걸 가져도 괜찮을까.", signals: ["self_permission_related"] },
            { n: 47, text: "나중에 후회하지 않을까.", signals: ["loss_related"] },
            { n: 48, text: "원하는 대로 해도 괜찮다.", signals: ["open_desire"] },
            { n: 49, text: "딱 맞는 생각이 없다.", signals: ["none"] },
          ],
        },
      ],
    },
    {
      id: "card2",
      title: "힘든 감정",
      questions: [
        {
          id: "s2q6", n: 6,
          text: "최근 스스로 작아지거나 힘들었던 순간이 있었나요?",
          object: "negative_affect_entry",
          options: [
            { n: 50, text: "있었다." },
            { n: 51, text: "잘 모르겠다." },
            { n: 52, text: "딱히 없었다." },
          ],
        },
        {
          id: "s2q7", n: 7,
          text: "그 감정은 어디에서 시작된 것 같나요?",
          object: "affect_source",
          options: [
            { n: 53, text: "내 안의 생각이나 기대에서" },
            { n: 54, text: "다른 사람의 말이나 행동에서" },
            { n: 55, text: "상황 자체에서" },
            { n: 56, text: "잘 모르겠다." },
          ],
        },
        {
          id: "s2q8", n: 8,
          text: "그 감정에 가장 가까웠던 것은 무엇인가요?",
          object: "negative_affect",
          options: [
            { n: 57, text: "무시당한 느낌", signals: ["evaluation_related"] },
            { n: 58, text: "거절당한 느낌", signals: ["relationship_related"] },
            { n: 59, text: "오해받은 느낌", signals: ["evaluation_related"] },
            { n: 60, text: "혼자인 느낌", signals: ["relationship_related"] },
            { n: 61, text: "부족한 사람처럼 느껴진 느낌", signals: ["evaluation_related"] },
            { n: 62, text: "어떤 모습이 드러날까 두려운 느낌", signals: ["evaluation_related"] },
            { n: 63, text: "잘 모르겠다.", signals: ["unclear"] },
          ],
        },
        {
          id: "s2q9", n: 9,
          text: "그 감정은 얼마나 오래 남아 있었나요?",
          object: "negative_affect_duration",
          options: [
            { n: 64, text: "그 순간만" },
            { n: 65, text: "하루 이틀" },
            { n: 66, text: "한동안 계속" },
            { n: 67, text: "지금도 남아 있는 것 같다." },
          ],
        },
      ],
    },
    {
      id: "card3",
      title: "감정이 켜지는 자리",
      questions: [
        {
          id: "s2q10", n: 10,
          text: "감정이 가장 크게 움직이는 때는 언제인가요?",
          object: "affect_context",
          options: [
            { n: 68, text: "혼자 있을 때" },
            { n: 69, text: "누군가와 함께 있을 때" },
            { n: 70, text: "일이나 할 일을 하고 있을 때" },
            { n: 71, text: "아무 일도 없을 때" },
          ],
        },
        {
          id: "s2q11", n: 11,
          text: "사람들과 함께 있을 때 가장 자주 드는 느낌은 무엇인가요?",
          object: "relational_affect",
          options: [
            { n: 72, text: "함께 있는 것이 편안하다.", signals: [] },
            { n: 73, text: "함께 있어도 혼자인 것 같다.", signals: ["relationship_related"] },
            { n: 74, text: "나를 맞춰야 할 것 같다.", signals: ["evaluation_related", "relationship_related"] },
            { n: 75, text: "관계가 자주 힘들어진다.", signals: ["relationship_related"] },
            { n: 76, text: "기대고 싶지만 그러면 안 될 것 같다.", signals: ["relationship_related", "self_permission_related"] },
          ],
        },
        {
          id: "s2q12", n: 12,
          text: "부러움을 느낄 때 가장 가까운 것은 무엇인가요?",
          object: "envy_target",
          options: [
            { n: 77, text: "그 사람이 가진 것" },
            { n: 78, text: "그 사람 자체" },
            { n: 79, text: "그 사람이 받는 관심이나 인정" },
            { n: 80, text: "그 사람이 할 수 있는 것" },
            { n: 81, text: "그 사람의 편안함" },
          ],
        },
      ],
    },
    {
      id: "card4",
      title: "혼자 하기 어려울 때",
      questions: [
        {
          id: "s2q13", n: 13,
          text: "일이 혼자 감당하기 어렵다고 느껴질 때 가장 가까운 반응은 무엇인가요?",
          object: "help_response",
          options: [
            { n: 82, text: "내가 먼저 끝까지 해본다." },
            { n: 83, text: "필요한 부분을 정리한 뒤 도움을 청한다." },
            { n: 84, text: "누군가에게 상황을 이야기하며 함께 정리한다." },
            { n: 85, text: "어떻게든 빨리 처리해본다." },
            { n: 86, text: "일단 피하거나 미뤄둔다." },
            { n: 87, text: "딱 맞는 것이 없다." },
          ],
        },
        {
          id: "s2q14", n: 14,
          text: "중요한 문제를 혼자 결정하기 어려울 때, 다른 사람에게 무엇을 기대하나요?",
          object: "support_expectation",
          options: [
            { n: 88, text: "내가 놓친 정보를 알려주는 것" },
            { n: 89, text: "무엇부터 할지 함께 정하는 것" },
            { n: 90, text: "내 생각이 괜찮은지 확인해주는 것" },
            { n: 91, text: "결정을 대신 내려주는 것" },
            { n: 92, text: "특별히 기대하지 않고 혼자 정하는 것" },
            { n: 93, text: "다른 사람에게 말하지 않는 것" },
          ],
        },
        {
          id: "s2q15", n: 15,
          text: "마음이 힘든 일이 생겼을 때 다른 사람과 어떻게 하나요?",
          object: "emotional_support_use",
          options: [
            { n: 94, text: "바로 이야기한다." },
            { n: 95, text: "어느 정도 정리된 뒤 이야기한다." },
            { n: 96, text: "상대가 먼저 물어볼 때만 이야기한다." },
            { n: 97, text: "이야기해도 달라질 것 같지 않아 혼자 둔다." },
            { n: 98, text: "말하는 대신 혼자 해결할 방법을 찾는다." },
            { n: 99, text: "딱 맞는 것이 없다." },
          ],
        },
      ],
    },
    {
      id: "card5",
      title: "반복되는 나",
      questions: [
        {
          id: "s2q16", n: 16,
          text: "스스로에게 가장 놀랐던 순간은 언제인가요?",
          object: "self_surprise",
          options: [
            { n: 100, text: "예상보다 강하게 반응했을 때" },
            { n: 101, text: "예상보다 덤덤했을 때" },
            { n: 102, text: "하기 싫었던 것을 해냈을 때" },
            { n: 103, text: "할 수 있다고 생각한 것을 못했을 때" },
            { n: 104, text: "몰랐던 감정이 올라왔을 때" },
          ],
        },
        {
          id: "s2q17", n: 17,
          text: "“아, 또 이러네.” 싶을 때 무엇이 반복되나요? (다중 선택)",
          object: "recurring_pattern",
          type: "multi",
          options: [
            { n: 105, text: "비슷한 상황에서 같은 감정을 느낀다." },
            { n: 106, text: "비슷한 사람에게 상처받는다." },
            { n: 107, text: "안 하겠다고 하고 다시 반복한다." },
            { n: 108, text: "관계가 비슷하게 흘러간다." },
            { n: 109, text: "비슷한 순간에 나를 닫는다." },
            { n: 110, text: "비슷한 지점에서 포기한다." },
          ],
        },
        {
          id: "s2q18", n: 18,
          text: "그 패턴을 알아챌 때 가장 먼저 드는 마음은 무엇인가요?",
          object: "pattern_response",
          options: [
            { n: 111, text: "나는 왜 이럴까." },
            { n: 112, text: "어쩔 수 없나 보다." },
            { n: 113, text: "바뀌었으면 좋겠다." },
            { n: 114, text: "왜 그런지 알고 싶다." },
            { n: 115, text: "못 본 척하고 싶다." },
            { n: 116, text: "잘 모르겠다." },
          ],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// SECTION 3 — 판단은 어떻게 만들어지는가 (측정 레이어: Judgment Object)
// 각 질문은 판단 과정의 한 Object만 직접 측정한다. Domain/Operation은 확정하지 않는다.
// ---------------------------------------------------------------------------
const section3 = {
  id: "section3",
  index: 3,
  title: "판단은 어떻게 만들어지는가",
  layer: "Judgment Object",
  type: "single",
  questions: [
    {
      id: "s3q1", n: 1, field: "attention",
      text: "예상과 다른 일이 생겼습니다. 가장 먼저 눈에 들어오는 것은 무엇인가요?",
      options: [
        { n: 117, text: "실제로 일어난 사실", tag: { object: "attention_fact" } },
        { n: 118, text: "사람들의 반응", tag: { object: "attention_people" } },
        { n: 119, text: "내가 한 행동", tag: { object: "attention_self_action" } },
        { n: 120, text: "무엇이 달라졌는지", tag: { object: "attention_change" } },
        { n: 121, text: "앞으로 생길 수 있는 결과", tag: { object: "attention_outcome" } },
        { n: 122, text: "아직 보지 못한 다른 가능성", tag: { object: "attention_possibility" } },
      ],
    },
    {
      id: "s3q2", n: 2, field: "evidence",
      text: "판단을 시작할 때 가장 먼저 믿게 되는 것은 무엇인가요?",
      options: [
        { n: 123, text: "내가 직접 확인한 사실", tag: { object: "evidence_direct_fact" } },
        { n: 124, text: "여러 정보가 하나로 맞아떨어지는 것", tag: { object: "evidence_convergence" } },
        { n: 125, text: "이전에도 반복해서 경험한 것", tag: { object: "evidence_pattern" } },
        { n: 126, text: "믿을 만한 사람의 판단", tag: { object: "evidence_trusted_person" } },
        { n: 127, text: "직접 해본 결과", tag: { object: "evidence_experience" } },
        { n: 128, text: "설명하기는 어렵지만 분명하게 느껴지는 방향", tag: { object: "evidence_intuition" } },
      ],
    },
    {
      id: "s3q3", n: 3, field: "primaryQuestion",
      text: "무슨 일이 있었는지 이해하려 할 때, 가장 먼저 떠오르는 질문은 무엇인가요?",
      options: [
        { n: 129, text: "왜 이런 일이 생긴 걸까?", tag: { object: "question_cause" } },
        { n: 130, text: "무엇이 이 상황을 바꾼 걸까?", tag: { object: "question_change" } },
        { n: 131, text: "앞으로 어떻게 될까?", tag: { object: "question_prediction" } },
        { n: 132, text: "내가 아직 모르는 것은 무엇일까?", tag: { object: "question_unknown" } },
        { n: 133, text: "다른 사람은 이것을 어떻게 보고 있을까?", tag: { object: "question_perspective" } },
        { n: 134, text: "무엇을 기준으로 판단해야 할까?", tag: { object: "question_criterion" } },
      ],
    },
    {
      id: "s3q4", n: 4, field: "confidence",
      text: "“이제 판단해도 되겠다”는 확신은 언제 생기나요?",
      options: [
        { n: 135, text: "필요한 사실을 직접 확인했을 때", tag: { object: "confidence_fact" } },
        { n: 136, text: "여러 정보가 하나의 설명으로 이어졌을 때", tag: { object: "confidence_coherence" } },
        { n: 137, text: "직접 해본 결과가 예상과 맞았을 때", tag: { object: "confidence_experience" } },
        { n: 138, text: "믿는 사람의 의견까지 확인했을 때", tag: { object: "confidence_social_confirmation" } },
        { n: 139, text: "내가 중요하게 생각하는 기준이 분명해졌을 때", tag: { object: "confidence_criterion" } },
        { n: 140, text: "이유를 설명하기는 어렵지만 방향이 분명하게 느껴질 때", tag: { object: "confidence_intuition" } },
      ],
    },
    {
      id: "s3q5", n: 5, field: "stopping",
      text: "언제 “이 정도면 충분하다”고 느끼나요?",
      options: [
        { n: 141, text: "이유를 설명할 수 있을 때", tag: { object: "stop_explainable" } },
        { n: 142, text: "필요한 사실이 충분히 확인되었을 때", tag: { object: "stop_evidence_sufficient" } },
        { n: 143, text: "가장 가능성이 높은 설명이 남았을 때", tag: { object: "stop_best_explanation" } },
        { n: 144, text: "내가 중요하게 생각하는 기준에 맞았을 때", tag: { object: "stop_criterion_met" } },
        { n: 145, text: "무엇을 해야 할지가 분명해졌을 때", tag: { object: "stop_action_clear" } },
        { n: 146, text: "더 생각해도 판단이 크게 달라지지 않을 것 같을 때", tag: { object: "stop_stability" } },
      ],
    },
    {
      id: "s3q6", n: 6, field: "update",
      text: "이미 내린 판단이 바뀌는 경우를 떠올려보세요. 가장 크게 영향을 주는 것은 무엇인가요?",
      options: [
        { n: 147, text: "처음 알지 못했던 새로운 사실을 확인했을 때", tag: { object: "update_new_fact" } },
        { n: 148, text: "예상했던 것과 실제 결과가 달랐을 때", tag: { object: "update_outcome_mismatch" } },
        { n: 149, text: "기존보다 상황을 더 잘 설명하는 해석을 발견했을 때", tag: { object: "update_better_explanation" } },
        { n: 150, text: "다른 사람의 관점에서 보니 다르게 이해되었을 때", tag: { object: "update_perspective" } },
        { n: 151, text: "내가 중요하게 생각하는 기준 자체가 달라졌을 때", tag: { object: "update_criterion" } },
        // update_resistance는 태깅 실패가 아니라 정상적인 Update Rule 결과 — 원문 주석 그대로 유지
        { n: 152, text: "웬만한 변화로는 처음 내린 판단을 바꾸지 않는 편이다.", tag: { object: "update_resistance" } },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// SECTION 4 — 판단을 멈추게 하는 것 (측정 레이어: Pressure Structure)
// 핵심 구조: Trigger Domain → Response → Maintenance Mechanism → Release Domain
// Domain: uncertainty / loss / responsibility / self_permission / relationship / evaluation
// ---------------------------------------------------------------------------
const section4 = {
  id: "section4",
  index: 4,
  title: "판단을 멈추게 하는 것",
  layer: "Pressure Structure",
  type: "single",
  questions: [
    {
      id: "s4q1", n: 1, field: "trigger",
      text: "중요한 결정을 앞두고 있습니다. 가장 먼저 반복해서 떠오르는 생각은 무엇인가요?",
      options: [
        { n: 153, text: "아직 내가 모르는 것이 있는 것 같다.", tag: { object: "trigger", domain: "uncertainty" } },
        { n: 154, text: "한 번 잘못 선택하면 오래 후회할 것 같다.", tag: { object: "trigger", domain: "loss" } },
        { n: 155, text: "결국 이 결정은 내가 책임져야 한다.", tag: { object: "trigger", domain: "responsibility" } },
        { n: 156, text: "내가 이걸 선택해도 괜찮을지 모르겠다.", tag: { object: "trigger", domain: "self_permission" } },
        { n: 157, text: "이 선택 때문에 관계가 달라질까 걱정된다.", tag: { object: "trigger", domain: "relationship" } },
        { n: 158, text: "사람들이 나를 다르게 볼까 걱정된다.", tag: { object: "trigger", domain: "evaluation" } },
      ],
    },
    {
      id: "s4q2", n: 2, field: "response",
      text: "그 상태가 계속될 때 가장 자주 하게 되는 것은 무엇인가요?",
      // Domain Tag: null — Response는 Domain을 확정하지 않는다
      options: [
        { n: 159, text: "결정을 계속 미루게 된다.", tag: { object: "response_delay", domain: null } },
        { n: 160, text: "같은 내용을 계속 확인하게 된다.", tag: { object: "response_recheck", domain: null } },
        { n: 161, text: "혼자 계속 생각하게 된다.", tag: { object: "response_ruminate", domain: null } },
        { n: 162, text: "다른 사람의 의견을 계속 구하게 된다.", tag: { object: "response_seek_input", domain: null } },
        { n: 163, text: "일단 선택하고 나중에 수정하려 한다.", tag: { object: "response_act_adjust", domain: null } },
        { n: 164, text: "잠시 거리를 두고 생각을 멈춘다.", tag: { object: "response_distance", domain: null } },
      ],
    },
    {
      id: "s4q3", n: 3, field: "maintenance",
      text: "결정을 아직 내리지 않은 채 계속 생각하고 있습니다. 무엇이 생각을 계속 붙잡아 두나요?",
      // Domain Tag: null — Maintenance Mechanism도 Domain을 확정하지 않는다
      options: [
        { n: 165, text: "조금 더 기다리면 답이 더 분명해질 것 같다.", tag: { object: "maintenance_wait_for_clarity", domain: null } },
        { n: 166, text: "계속 생각하다 보면 더 나은 답을 찾을 수 있을 것 같다.", tag: { object: "maintenance_search_for_better_answer", domain: null } },
        { n: 167, text: "지금 결정하지 않는 편이 더 안전하게 느껴진다.", tag: { object: "maintenance_safety_of_delay", domain: null } },
        { n: 168, text: "한번 결정하면 되돌리기 어려울 것 같다.", tag: { object: "maintenance_reversibility_concern", domain: null } },
        { n: 169, text: "아직 지금 결정해야 할 필요는 없다고 생각한다.", tag: { object: "maintenance_no_urgency", domain: null } },
        { n: 170, text: "결정을 내리지 않고 계속 생각하는 편이 오히려 마음이 놓인다.", tag: { object: "maintenance_thinking_as_relief", domain: null } },
      ],
    },
    {
      id: "s4q4", n: 4, field: "release",
      text: "무엇이 달라지면 결정을 내릴 수 있을 것 같나요?",
      options: [
        { n: 171, text: "필요한 것을 충분히 확인하게 되면.", tag: { object: "release_information", domain: "uncertainty" } },
        { n: 172, text: "좋지 않은 결과가 생겨도 감당할 수 있을 것 같으면.", tag: { object: "release_loss_acceptance", domain: "loss" } },
        { n: 173, text: "그 결과를 내가 책임질 준비가 되었다고 느껴지면.", tag: { object: "release_responsibility", domain: "responsibility" } },
        { n: 174, text: "내가 이 선택을 해도 괜찮다고 느껴지면.", tag: { object: "release_permission", domain: "self_permission" } },
        { n: 175, text: "관계가 달라지더라도 감당할 수 있을 것 같으면.", tag: { object: "release_relationship", domain: "relationship" } },
        { n: 176, text: "다른 사람이 어떻게 생각하든 괜찮아지면.", tag: { object: "release_evaluation", domain: "evaluation" } },
      ],
    },
  ],
};

export const MEDITATIO_SECTIONS = [section1, section2, section3, section4];

// 총 질문/선택지 수 자기검증 (개발 중 콘솔에서 확인용)
export function countMeditatioTotals() {
  let questionCount = 0;
  let optionCount = 0;
  let lastOptionNumber = 0;
  for (const section of MEDITATIO_SECTIONS) {
    const questions = section.questions || section.cards.flatMap((c) => c.questions);
    for (const q of questions) {
      questionCount += 1;
      for (const opt of q.options) {
        optionCount += 1;
        lastOptionNumber = Math.max(lastOptionNumber, opt.n);
      }
    }
  }
  return { questionCount, optionCount, lastOptionNumber };
}

// 순서대로 순회하기 위한 평탄화된 질문 목록 (section/card 정보 포함)
export function flattenMeditatioQuestions() {
  const flat = [];
  for (const section of MEDITATIO_SECTIONS) {
    if (section.questions) {
      for (const q of section.questions) {
        flat.push({ ...q, sectionId: section.id, sectionIndex: section.index, cardId: null });
      }
    } else if (section.cards) {
      for (const card of section.cards) {
        for (const q of card.questions) {
          flat.push({ ...q, sectionId: section.id, sectionIndex: section.index, cardId: card.id, cardTitle: card.title });
        }
      }
    }
  }
  return flat;
}
