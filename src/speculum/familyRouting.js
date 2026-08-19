// Family Routing 엔진 (deterministic)
// 출처: claude/family-routing-matrix-v1.md §6~7, claude/family-candidate-rules-v1.md §11~13
//
// Meditatio 구조화 결과(src/state/deriveMeditatio.js의 deriveMeditatioResult 출력)를 받아
// 8개 Family에 점수를 매기고, 후보(candidate) Family를 뽑는다.
//
// 여기서 하는 일은 "Family 후보를 여는 것"까지다 — Persona를 확정하지 않는다.
// (그다음 단계는 src/speculum/personaRegistry.js의 Eligibility, src/speculum/operationDedup.js)

import {
  FAMILY_KEYS,
  ATTENTION_WEIGHTS,
  EVIDENCE_WEIGHTS,
  PRIMARY_QUESTION_WEIGHTS,
  CONFIDENCE_WEIGHTS,
  STOPPING_WEIGHTS,
  UPDATE_WEIGHTS,
  TRIGGER_DOMAIN_WEIGHTS,
  RESPONSE_WEIGHTS,
  MAINTENANCE_WEIGHTS,
  RELEASE_DOMAIN_WEIGHTS,
  DEFAULT_STRATEGY_BOOST_MAP,
  AFFECT_BOOST_MAP,
} from "./familyWeights.js";

function zeroScores() {
  const s = {};
  for (const key of FAMILY_KEYS) s[key] = 0;
  return s;
}

function addRow(scores, row) {
  if (!row) return;
  FAMILY_KEYS.forEach((key, i) => {
    scores[key] += row[i] ?? 0;
  });
}

/**
 * Meditatio 구조화 결과 → 8개 Family 점수.
 * familyScore = section3Score + triggerScore + responseScore + maintenanceScore + releaseScore
 * (claude/family-routing-matrix-v1.md §6 공식 그대로)
 *
 * Default Strategy / Affect는 이 점수에 더하지 않는다 — candidate-rules v1.0 §11~12가
 * "보강만 하고 단독으로 점수를 만들지 않는다"고 명시하고 있고, 정확한 가중치 수치는
 * matrix 문서에 없기 때문이다. 대신 rankFamilies()가 반환하는 각 candidate에
 * boostedBy로 태그만 붙인다.
 */
export function scoreFamilies(meditatioResult) {
  const scores = zeroScores();
  const jp = meditatioResult?.judgmentProcess ?? {};
  const pressure = meditatioResult?.pressure ?? {};

  addRow(scores, ATTENTION_WEIGHTS[jp.attention]);
  addRow(scores, EVIDENCE_WEIGHTS[jp.evidence]);
  addRow(scores, PRIMARY_QUESTION_WEIGHTS[jp.primaryQuestion]);
  addRow(scores, CONFIDENCE_WEIGHTS[jp.confidence]);
  addRow(scores, STOPPING_WEIGHTS[jp.stopping]);
  addRow(scores, UPDATE_WEIGHTS[jp.update]);

  addRow(scores, TRIGGER_DOMAIN_WEIGHTS[pressure.trigger?.domain]);
  addRow(scores, RESPONSE_WEIGHTS[pressure.response?.object]);
  addRow(scores, MAINTENANCE_WEIGHTS[pressure.maintenance?.object]);
  addRow(scores, RELEASE_DOMAIN_WEIGHTS[pressure.release?.domain]);

  return scores;
}

function boostedByFor(family, meditatioResult) {
  const defaultStrategy = meditatioResult?.defaultStrategy ?? null;
  const affect = Array.isArray(meditatioResult?.affect) ? meditatioResult.affect : [];

  const defaultStrategyBoost =
    defaultStrategy && (DEFAULT_STRATEGY_BOOST_MAP[defaultStrategy] ?? []).includes(family);

  const affectBoosts = affect.filter((signal) => (AFFECT_BOOST_MAP[signal] ?? []).includes(family));

  return {
    defaultStrategy: defaultStrategyBoost ? defaultStrategy : null,
    affectSignals: [...new Set(affectBoosts)],
  };
}

/**
 * 점수 → 후보 Family 순위.
 *
 * claude/family-routing-matrix-v1.md §7 후보 선정 규칙:
 *   1위 Family  → 기본 후보
 *   2위 Family  → 1위와 점수 차이가 2 이하이면 후보 유지
 *   3위 Family  → 2위와 점수 차이가 1 이하일 때만 유지
 *
 * 원문 규칙은 동점(tie)을 상정하지 않는다. 여기서는 같은 점수를 받은 Family를 하나의
 * "순위 그룹"으로 묶어서 규칙을 적용한다 — family-candidate-rules-v1.md §14의 worked
 * example(Identity/Criterion 동점 HIGH, Scale/Distance 동점 POSSIBLE)이 실제로 동점을
 * 포함하고 있고, 이 그룹 방식으로 계산했을 때 그 예시와 같은 결과가 나오는 것으로
 * 확인했다 (scripts/family-routing-selftest.mjs 참고).
 */
export function rankFamilies(scores, meditatioResult = null) {
  const sorted = FAMILY_KEYS.map((key) => ({ family: key, score: scores[key] })).sort(
    (a, b) => b.score - a.score
  );

  // 점수별로 그룹화 (동점 = 같은 순위 그룹)
  const groups = [];
  for (const entry of sorted) {
    const last = groups[groups.length - 1];
    if (last && last.score === entry.score) {
      last.families.push(entry.family);
    } else {
      groups.push({ score: entry.score, families: [entry.family] });
    }
  }

  const keptGroups = [];
  if (groups[0]) keptGroups.push(groups[0]);
  if (groups[1] && groups[0].score - groups[1].score <= 2) {
    keptGroups.push(groups[1]);
    if (groups[2] && groups[1].score - groups[2].score <= 1) {
      keptGroups.push(groups[2]);
    }
  }

  const candidateFamilies = new Set(keptGroups.flatMap((g) => g.families));

  return sorted.map((entry, index) => ({
    family: entry.family,
    score: entry.score,
    rank: index + 1,
    candidate: candidateFamilies.has(entry.family),
    boostedBy: meditatioResult ? boostedByFor(entry.family, meditatioResult) : { defaultStrategy: null, affectSignals: [] },
  }));
}

/**
 * 편의 함수: Meditatio 결과 → 후보 Family 목록만 뽑기.
 */
export function getFamilyCandidates(meditatioResult) {
  const scores = scoreFamilies(meditatioResult);
  const ranked = rankFamilies(scores, meditatioResult);
  return ranked.filter((r) => r.candidate);
}
