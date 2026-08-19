// 18 Persona Registry
// 출처:
//   - Family / Eligibility 조건: claude/18-persona-eligibility-spec-v1.md
//   - operationData 필드 목록: src/data/speculumSchema.js (= claude/speculum-questionnaire-schema.js)
//   - operationSignature: claude/operation-dedup-rules-v1.md §6에 4개(anatomist/magician/steward/gatekeeper)만
//     명시적으로 나와 있다. 나머지 14개는 각 페르소나의 질문 흐름(role/saveAs)과 Eligibility 설명을 근거로
//     이 파일에서 만들어 붙인 것이다 — 문서에 없는 값이므로 documented: false로 표시했다.
//
// eligibilityField는 "이 필드가 true(또는 조건 충족)여야 이 Persona가 작동 가능하다"는 뜻이며,
// 실제 판정(자유 텍스트를 읽고 true/false를 매기는 일)은 아직 AI 계층이 없어 이 registry에서 하지 않는다.
// 지금은 메타데이터만 제공한다 — Task #14(persona jsx 연결) 이후 AI 계층이 붙으면 이 필드를 채운다.

export const PERSONA_REGISTRY = {
  // ---------------------------------------------------------------- Distance
  patron: {
    id: "patron",
    koreanName: "후원자",
    englishName: "Patron",
    family: "distance",
    eligibilityField: "other_person_criterion_comparable",
    eligibilityDescription: "타인에게 적용할 기준과 자기 기준을 비교할 수 있음",
    operationSignature: { target: "self_vs_other_criterion", move: "compare", output: "criterion_transfer", documented: false },
  },
  novelist: {
    id: "novelist",
    koreanName: "소설가",
    englishName: "Novelist",
    family: "distance",
    eligibilityField: "external_and_internal_self_available",
    eligibilityDescription: "한 장면의 외부 행동과 내부 생각을 함께 볼 수 있음",
    operationSignature: { target: "self_scene", move: "juxtapose_external_internal", output: "integrated_description", documented: false },
  },

  // -------------------------------------------------------------------- Time
  oracle: {
    id: "oracle",
    koreanName: "신탁자",
    englishName: "Oracle",
    family: "time",
    eligibilityField: "waiting_for_information",
    eligibilityDescription: "기다리면 정보나 답이 달라질 것이라는 기대가 있음",
    operationSignature: { target: "awaited_information", move: "classify_timing", output: "verification_path", documented: false },
  },
  timeTraveler: {
    id: "timeTraveler",
    koreanName: "시간여행자",
    englishName: "Time Traveler",
    family: "time",
    eligibilityField: "current_factor_has_temporal_weight",
    eligibilityDescription: "현재 크게 작용하는 요소의 미래 무게를 비교할 수 있음",
    operationSignature: { target: "dominant_factor_weight", move: "project_future", output: "temporal_weight_comparison", documented: false },
  },

  // --------------------------------------------------------------- Inversion
  merchant: {
    id: "merchant",
    koreanName: "대상인",
    englishName: "Merchant",
    family: "inversion",
    eligibilityField: "continuation_has_cost",
    eligibilityDescription: "계속하는 선택에 실제 대가가 있음",
    operationSignature: { target: "continuation_cost", move: "trade_analysis", output: "cost_benefit_tradeoff", documented: false },
  },
  guardian: {
    id: "guardian",
    koreanName: "파수꾼",
    englishName: "Guardian",
    family: "inversion",
    eligibilityField: "difficulty_releasing_existing_investment",
    eligibilityDescription: "이미 들인 것이나 잃을 것 때문에 놓기 어려움",
    operationSignature: { target: "existing_investment", move: "compare_past_future", output: "release_difficulty", documented: false },
  },
  witness: {
    id: "witness",
    koreanName: "증언자",
    englishName: "Witness",
    family: "inversion",
    eligibilityField: "unspoken_content_exists",
    eligibilityDescription: "말하지 않고 있는 내용이 있음",
    operationSignature: { target: "unspoken_message", move: "project_silence_outcome", output: "silence_cost", documented: false },
  },
  general: {
    id: "general",
    koreanName: "장군",
    englishName: "General",
    family: "inversion",
    eligibilityField: "ongoing_duty_has_resource_tradeoff",
    eligibilityDescription: "계속 맡는 일에 자원이 들고 다른 것이 밀려남",
    operationSignature: { target: "ongoing_duty", move: "resource_tradeoff", output: "duty_maintenance_cost", documented: false },
  },

  // ------------------------------------------------------------------- Scale
  artisan: {
    id: "artisan",
    koreanName: "세공사",
    englishName: "Artisan",
    family: "scale",
    eligibilityField: "judgment_elements_count_gte_2",
    eligibilityDescription: "판단 요소가 둘 이상으로 나뉨",
    operationSignature: { target: "judgment_elements", move: "decompose", output: "element_judgments", documented: false },
  },
  surveyor: {
    id: "surveyor",
    koreanName: "측량사",
    englishName: "Surveyor",
    family: "scale",
    eligibilityField: "attached_issues_exist",
    eligibilityDescription: "현재 결정에 다른 문제들이 함께 끌려 들어옴",
    operationSignature: { target: "attached_issues", move: "scope_partition", output: "redefined_scope", documented: false },
  },

  // ---------------------------------------------------------------- Identity
  pioneer: {
    id: "pioneer",
    koreanName: "개척자",
    englishName: "Pioneer",
    family: "identity",
    eligibilityField: "self_qualification_is_part_of_judgment",
    eligibilityDescription: "자신의 자격·적합성이 판단에 들어 있음",
    operationSignature: { target: "self_qualification", move: "gap_question", output: "qualification_gap", documented: false },
  },
  portraitist: {
    id: "portraitist",
    koreanName: "초상화가",
    englishName: "Portraitist",
    family: "identity",
    eligibilityField: "self_definition_from_experience_exists",
    eligibilityDescription: "한 경험에서 자기 정의가 만들어짐",
    operationSignature: { target: "self_definition", move: "expand_with_second_experience", output: "expanded_self_description", documented: false },
  },

  // ------------------------------------------------------------- Probability
  chronicler: {
    id: "chronicler",
    koreanName: "기록자",
    englishName: "Chronicler",
    family: "probability",
    eligibilityField: "unverified_prediction_affects_judgment",
    eligibilityDescription: "확인되지 않은 예상이 판단에 작용함",
    operationSignature: { target: "prediction", move: "verify", output: "prediction_confidence", documented: false },
  },

  // ---------------------------------------------------------------- Boundary
  gatekeeper: {
    id: "gatekeeper",
    koreanName: "수문장",
    englishName: "Gatekeeper",
    family: "boundary",
    eligibilityField: "giving_boundary_can_be_defined",
    eligibilityDescription: "해주거나 양보할 범위를 정할 수 있음",
    // claude/operation-dedup-rules-v1.md §6에 명시된 값 그대로.
    operationSignature: { target: "giving", move: "set_limit", output: "acceptable_range", documented: true },
  },
  steward: {
    id: "steward",
    koreanName: "청지기",
    englishName: "Steward",
    family: "boundary",
    eligibilityField: "responsibility_can_be_partitioned",
    eligibilityDescription: "내 몫·상대 몫·공동 몫을 나눌 수 있음",
    // claude/operation-dedup-rules-v1.md §6에 명시된 값 그대로.
    operationSignature: { target: "responsibility", move: "partition", output: "ownership", documented: true },
  },

  // --------------------------------------------------------------- Criterion
  anatomist: {
    id: "anatomist",
    koreanName: "해부학자",
    englishName: "Anatomist",
    family: "criterion",
    eligibilityField: "isolatable_factor_exists",
    eligibilityDescription: "특정 판단 요소를 분리해 제거할 수 있음",
    // claude/operation-dedup-rules-v1.md §6에 명시된 값 그대로.
    operationSignature: { target: "judgment_factor", move: "remove", output: "factor_contribution", documented: true },
  },
  magistrate: {
    id: "magistrate",
    koreanName: "재판관",
    englishName: "Magistrate",
    family: "criterion",
    eligibilityField: "decision_threshold_can_be_defined",
    eligibilityDescription: "판단이 바뀌는 기준점을 만들 수 있음",
    operationSignature: { target: "decision_threshold", move: "compare_to_reality", output: "threshold_match", documented: false },
  },
  magician: {
    id: "magician",
    koreanName: "마술사",
    englishName: "Magician",
    family: "criterion",
    eligibilityField: "removable_dominant_factor_exists",
    eligibilityDescription: "크게 작용하는 요소를 잠시 제거해볼 수 있음",
    // claude/operation-dedup-rules-v1.md §6에 명시된 값 그대로.
    operationSignature: { target: "dominant_factor", move: "remove", output: "choice_shift", documented: true },
  },
};

export const PERSONA_IDS = Object.keys(PERSONA_REGISTRY);

export function getPersonasByFamily(family) {
  return PERSONA_IDS.map((id) => PERSONA_REGISTRY[id]).filter((p) => p.family === family);
}

// Family 후보 목록(familyRouting.getFamilyCandidates 결과) → 후보 Persona 메타데이터 목록.
// 아직 Eligibility(자유 텍스트 판정)는 하지 않는다 — Family가 열려 있는 Persona를 모두 반환한다.
export function getCandidatePersonas(familyCandidates) {
  const families = new Set(familyCandidates.map((f) => (typeof f === "string" ? f : f.family)));
  return PERSONA_IDS.map((id) => PERSONA_REGISTRY[id]).filter((p) => families.has(p.family));
}
