// Operation Candidate Deduplication
// 출처: claude/operation-dedup-rules-v1.md
//
// Persona 자체를 제거하지 않는다 — Eligibility를 통과한 Persona들 중에서 사용자에게
// "동시에 보여줄" Operation 후보가 서로 너무 비슷하지 않도록 정리한다.
//
// 중복 판단 기준 (§1): operationSignature의 target / move / output 중 2개 이상 같으면 중복.
// "충분히 다른 3번째" 기준 (§5): 세 번째 후보는 앞의 두 후보와 target/move/output이 모두 달라야 한다.

import { PERSONA_REGISTRY } from "./personaRegistry.js";

export function operationOverlapCount(a, b) {
  if (!a || !b) return 0;
  let n = 0;
  if (a.target === b.target) n += 1;
  if (a.move === b.move) n += 1;
  if (a.output === b.output) n += 1;
  return n;
}

export function isDuplicateOperation(a, b) {
  return operationOverlapCount(a, b) >= 2;
}

/**
 * orderedPersonaIds: 이미 우선순위대로 정렬된 persona id 목록
 * (예: Family rank가 높은 순 → registry 등록 순). 이 함수는 순서를 바꾸지 않고
 * 앞에서부터 채택/스킵만 한다 — 우선순위 결정은 호출하는 쪽 책임이다.
 *
 * 반환: 최대 max개(기본 3, §4 "기본 2개, 최대 3개")의 persona 메타데이터 배열.
 */
export function buildOperationCandidates(orderedPersonaIds, { max = 3 } = {}) {
  const cappedMax = Math.min(Math.max(max, 1), 3);
  const picked = [];

  for (const id of orderedPersonaIds) {
    const persona = PERSONA_REGISTRY[id];
    if (!persona?.operationSignature) continue;

    if (picked.length === 0) {
      picked.push(persona);
      continue;
    }

    if (picked.length === 1) {
      if (!isDuplicateOperation(picked[0].operationSignature, persona.operationSignature)) {
        picked.push(persona);
      }
      continue;
    }

    if (picked.length === 2 && cappedMax >= 3) {
      // §5: 세 번째는 앞의 두 후보 모두와 target/move/output이 하나도 겹치지 않아야 한다.
      const fullyDifferentFromBoth = picked.every(
        (p) => operationOverlapCount(p.operationSignature, persona.operationSignature) === 0
      );
      if (fullyDifferentFromBoth) {
        picked.push(persona);
        break;
      }
      continue;
    }

    break;
  }

  return picked.slice(0, cappedMax);
}

/**
 * Family 후보 순위(familyRouting.rankFamilies 결과)를 받아 그 순서대로 persona id를
 * 나열한 뒤 buildOperationCandidates에 넘기는 편의 함수.
 * 같은 Family 안에서는 registry에 등록된 순서를 그대로 쓴다(현재는 두 Persona 이하라 순서 영향 적음).
 */
export function buildOperationCandidatesFromRankedFamilies(rankedFamilies, { max = 3 } = {}) {
  const orderedFamilies = rankedFamilies.filter((f) => f.candidate).map((f) => f.family);
  const orderedPersonaIds = Object.values(PERSONA_REGISTRY)
    .filter((p) => orderedFamilies.includes(p.family))
    .sort((a, b) => orderedFamilies.indexOf(a.family) - orderedFamilies.indexOf(b.family))
    .map((p) => p.id);

  return buildOperationCandidates(orderedPersonaIds, { max });
}

/**
 * claude/operation-dedup-rules-v1.md §3에 이름이 명시된 겹침 위험 쌍/그룹.
 * operationSignature 비교만으로는 구분이 안 되는 미묘한 경우(예: 파수꾼 vs 대상인은
 * sunk-cost / trade-off 중 사용자 텍스트의 신호 강도로 갈라야 한다)를 위한 참고 노트.
 * 지금은 AI 계층이 없어 자동으로 적용하지 않는다 — Persona Reveal UI의 안내문이나,
 * 나중에 붙을 AI 계층의 프롬프트 힌트로 쓰기 위해 문서 그대로 보존해 둔다.
 */
export const KNOWN_OVERLAP_NOTES = [
  {
    pair: ["anatomist", "magician"],
    note: "같은 요소를 대상으로 한다면 둘 중 하나만: 기여도 확인에 초점 → 해부학자, 요소가 사라졌을 때 선택 변화 체험에 초점 → 마술사.",
  },
  {
    pair: ["merchant", "general"],
    note: "\"계속할 가치가 있는가\" 중심 → 대상인 우선. \"왜 내가 계속 맡고 있는가\" 중심 → 장군 우선. 같은 화면에는 기본적으로 둘 다 보여주지 않는다.",
  },
  {
    pair: ["guardian", "merchant"],
    note: "이미 쌓은 것이 아깝다(sunk-cost) → 파수꾼. 지금도 계속 비용을 쓰고 있다(trade-off) → 대상인.",
  },
  {
    pair: ["steward", "gatekeeper"],
    note: "책임 분배 문제(\"누가 해야 하지?\") → 청지기. 내가 감당할 범위 문제(\"나는 어디까지 해야 하지?\") → 수문장.",
  },
  {
    pair: ["pioneer", "portraitist"],
    note: "\"내가 이 역할을 할 자격이 있나\" → 개척자. \"나는 원래 이런 사람인가\" → 초상화가. 기본적으로 중복으로 보지 않는다.",
  },
  {
    pair: ["chronicler", "oracle"],
    note: "\"아마 ~할 것 같다\" 중심 → 기록자. \"좀 더 기다리면 알게 될 것 같다\" 중심 → 신탁자. 후보가 3개 이상이면 더 강한 쪽 하나만 남긴다.",
  },
  {
    pair: ["oracle", "timeTraveler"],
    note: "정보가 더 생길 것이라는 기대 → 신탁자. 감정/중요도의 무게가 달라질 것이라는 기대 → 시간여행자. 원칙적으로 중복 아님.",
  },
  {
    pair: ["patron", "novelist"],
    note: "생성하는 정보가 완전히 다르다 — 중복 아님.",
  },
  {
    pair: ["magistrate", "anatomist", "magician"],
    note: "\"얼마나/어느 정도면?\" → 재판관. \"이 요소가 실제로 얼마나 기여하나?\" → 해부학자. \"이 요소가 없으면 나는 뭘 선택하나?\" → 마술사. 같은 요소를 두고 해부학자·마술사를 동시에 보여주지 않는다 — 재판관은 threshold를 다루므로 둘 중 하나와는 함께 보여줄 수 있다.",
  },
];
