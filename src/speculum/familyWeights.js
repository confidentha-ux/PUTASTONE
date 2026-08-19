// Family Routing Matrix v1 — 점수표를 코드로 옮긴 것.
// 출처: 프로젝트 문서 `claude/family-routing-matrix-v1.md` (표의 숫자를 임의로 바꾸지 않는다)
//
// 8개 Family 순서를 이 배열로 고정한다. 모든 가중치 행은 이 순서를 따른다.
export const FAMILY_KEYS = [
  "probability",
  "distance",
  "time",
  "inversion",
  "scale",
  "identity",
  "boundary",
  "criterion",
];

// [probability, distance, time, inversion, scale, identity, boundary, criterion]

// ---------------------------------------------------------------------------
// 1. Section 3 — Judgment Object → Family
// ---------------------------------------------------------------------------
export const ATTENTION_WEIGHTS = {
  attention_fact: [2, 0, 0, 0, 0, 0, 0, 1],
  attention_people: [0, 2, 0, 0, 0, 1, 1, 0],
  attention_self_action: [0, 1, 0, 1, 0, 1, 1, 0],
  attention_change: [1, 0, 1, 0, 1, 0, 0, 2],
  attention_outcome: [2, 0, 1, 1, 0, 0, 0, 0],
  attention_possibility: [1, 1, 1, 0, 2, 0, 0, 1],
};

export const EVIDENCE_WEIGHTS = {
  evidence_direct_fact: [2, 0, 0, 0, 0, 0, 0, 1],
  evidence_convergence: [1, 0, 0, 0, 1, 0, 0, 2],
  evidence_pattern: [2, 0, 1, 0, 0, 1, 0, 0],
  evidence_trusted_person: [0, 2, 0, 0, 0, 1, 0, 1],
  evidence_experience: [2, 0, 1, 1, 0, 0, 0, 0],
  evidence_intuition: [0, 0, 0, 0, 0, 1, 0, 1],
};

export const PRIMARY_QUESTION_WEIGHTS = {
  question_cause: [1, 0, 0, 0, 1, 0, 0, 2],
  question_change: [1, 0, 1, 1, 1, 0, 0, 2],
  question_prediction: [2, 0, 2, 1, 0, 0, 0, 0],
  question_unknown: [2, 0, 1, 0, 1, 0, 0, 1],
  question_perspective: [0, 2, 0, 0, 0, 1, 1, 0],
  question_criterion: [0, 0, 0, 0, 0, 0, 0, 2],
};

export const CONFIDENCE_WEIGHTS = {
  confidence_fact: [2, 0, 0, 0, 0, 0, 0, 1],
  confidence_coherence: [1, 0, 0, 0, 1, 0, 0, 2],
  confidence_experience: [2, 0, 1, 1, 0, 0, 0, 0],
  confidence_social_confirmation: [0, 2, 0, 0, 0, 1, 0, 1],
  confidence_criterion: [0, 0, 0, 0, 0, 0, 0, 2],
  confidence_intuition: [0, 0, 0, 0, 0, 1, 0, 1],
};

export const STOPPING_WEIGHTS = {
  stop_explainable: [0, 0, 0, 0, 0, 0, 0, 2],
  stop_evidence_sufficient: [2, 0, 0, 0, 0, 0, 0, 1],
  stop_best_explanation: [1, 0, 0, 0, 1, 0, 0, 2],
  stop_criterion_met: [0, 0, 0, 0, 0, 0, 0, 2],
  stop_action_clear: [0, 0, 0, 1, 1, 0, 1, 0],
  stop_stability: [1, 0, 2, 0, 1, 0, 0, 1],
};

export const UPDATE_WEIGHTS = {
  update_new_fact: [2, 0, 0, 0, 0, 0, 0, 1],
  update_outcome_mismatch: [2, 0, 1, 1, 0, 0, 0, 0],
  update_better_explanation: [1, 0, 0, 0, 1, 0, 0, 2],
  update_perspective: [0, 2, 0, 0, 0, 1, 1, 0],
  update_criterion: [0, 0, 0, 0, 0, 1, 0, 2],
  update_resistance: [0, 1, 1, 1, 1, 1, 0, 1],
};

// ---------------------------------------------------------------------------
// 2. Section 4 — Trigger Domain → Family (가중치만, 자동 전송 아님)
// ---------------------------------------------------------------------------
export const TRIGGER_DOMAIN_WEIGHTS = {
  uncertainty: [2, 0, 1, 0, 1, 0, 0, 1],
  loss: [1, 0, 1, 2, 1, 0, 0, 1],
  responsibility: [0, 0, 0, 1, 1, 0, 2, 1],
  self_permission: [0, 1, 0, 0, 0, 2, 0, 1],
  relationship: [1, 2, 0, 1, 0, 1, 2, 1],
  evaluation: [1, 2, 0, 0, 0, 2, 0, 1],
};

// ---------------------------------------------------------------------------
// 3. Response → Family (response_distance는 -1 감점 포함)
// ---------------------------------------------------------------------------
export const RESPONSE_WEIGHTS = {
  response_delay: [0, 0, 2, 1, 0, 0, 0, 0],
  response_recheck: [2, 0, 1, 0, 0, 0, 0, 2],
  response_ruminate: [0, 1, 1, 0, 2, 0, 0, 1],
  response_seek_input: [0, 2, 0, 0, 0, 1, 1, 0],
  response_act_adjust: [1, 0, 0, 1, 1, 0, 0, 0],
  response_distance: [0, -1, 0, 0, 1, 0, 0, 0],
};

// ---------------------------------------------------------------------------
// 4. Maintenance → Family (메커니즘 기준, Domain 아님)
// meditatioV1.js의 tag.object 값(maintenance_ 접두)을 그대로 키로 쓴다.
// ---------------------------------------------------------------------------
export const MAINTENANCE_WEIGHTS = {
  maintenance_wait_for_clarity: [1, 0, 2, 0, 0, 0, 0, 1],
  maintenance_search_for_better_answer: [0, 0, 1, 0, 2, 0, 0, 2],
  maintenance_safety_of_delay: [0, 0, 1, 2, 1, 0, 0, 0],
  maintenance_reversibility_concern: [1, 0, 1, 2, 2, 0, 0, 0],
  maintenance_no_urgency: [0, 0, 2, 0, 1, 0, 0, 0],
  maintenance_thinking_as_relief: [0, 2, 1, 0, 1, 0, 0, 0],
};

// ---------------------------------------------------------------------------
// 5. Release Domain → Family (Trigger보다 강하게, 최대 +3)
// ---------------------------------------------------------------------------
export const RELEASE_DOMAIN_WEIGHTS = {
  uncertainty: [3, 0, 1, 0, 1, 0, 0, 2],
  loss: [1, 0, 1, 3, 1, 0, 0, 1],
  responsibility: [0, 0, 0, 1, 1, 0, 3, 1],
  self_permission: [0, 1, 0, 0, 0, 3, 0, 1],
  relationship: [1, 2, 0, 1, 0, 1, 2, 1],
  evaluation: [1, 2, 0, 0, 0, 2, 0, 1],
};

// ---------------------------------------------------------------------------
// Default Strategy → Family 보강 방향 (claude/family-candidate-rules-v1.md §11)
// 점수에 더하지 않는다 — "보강만" 한다는 원칙에 따라 후보에 태그만 붙인다.
// ---------------------------------------------------------------------------
export const DEFAULT_STRATEGY_BOOST_MAP = {
  understanding: ["probability", "scale", "criterion"],
  action: ["inversion", "scale"],
  connection: ["distance", "boundary"],
  stability: ["time", "inversion", "criterion"],
  intuition: ["identity"],
};

// ---------------------------------------------------------------------------
// Affect Signal → Family 보강 방향 (claude/family-candidate-rules-v1.md §4/6/8/9에서
// 명시적으로 언급된 조합만 포함 — 문서에 없는 signal은 보강하지 않는다)
// ---------------------------------------------------------------------------
export const AFFECT_BOOST_MAP = {
  evaluation_related: ["distance", "identity"],
  relationship_related: ["distance", "boundary"],
  self_permission_related: ["identity"],
  loss_related: ["inversion"],
  contribution: ["inversion", "boundary"],
  growth: ["identity"],
  autonomous_choice: ["identity"],
};
