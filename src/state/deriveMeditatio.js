// Meditatio raw answers → 구조화 결과(Meditatio Object) + 결과 문장(narrative) 생성기
//
// 문장 생성 원칙은 claude/natural-language-dictionary-v1.md 7번 "사용자 설명의 공식 문법"을 따른다:
//   1. 당신의 응답에서 무엇이 나타났는가
//   2. 그것이 무엇을 의미하는가
//   3. 판단은 어떻게 이어졌는가
//   4. 무엇이 다시 움직이게 하는가
//   5. 전체 흐름을 연결한다
//
// 주의: data-state-flow-v1.md 3번 표에 따르면 이 자연어 설명은 원래 "AI가 만드는 값"이다.
// 여기 구현은 서버 AI 계층이 붙기 전까지 쓸 수 있는 **규칙 기반 초안(deterministic draft)**이고,
// 나중에 AI 계층(로드맵 7번)이 붙으면 이 함수의 결과를 프롬프트 입력으로 쓰거나 대체할 수 있다.

import { MEDITATIO_SECTIONS, flattenMeditatioQuestions } from "../data/meditatioV1";

const DEFAULT_STRATEGY_LABEL = {
  understanding: "충분히 이해되어야 움직이는",
  action: "먼저 움직이며 확인하는",
  connection: "사람과의 관계를 먼저 보는",
  stability: "안정적인 선택을 먼저 찾는",
  intuition: "자신의 감각을 먼저 믿는",
};

// natural-language-dictionary-v1.md 2번, Domain 6개 공식 설명에서 그대로 옮김.
export const DOMAIN_COPY = {
  uncertainty: {
    label: "불확실성",
    caught: "당신의 판단이 불확실성에서 붙잡혔다면, 아직 확인하지 못한 것이 판단을 계속 열어두게 한 것입니다.",
    release: "필요한 것이 충분히 확인되었을 때 다시 움직일 수 있다는 의미입니다.",
  },
  loss: {
    label: "손실",
    caught: "당신의 판단이 손실에서 붙잡혔다면, 선택의 이익보다 잘못되었을 때 감당하게 될 결과가 먼저 중요해진 것입니다.",
    release: "좋지 않은 결과가 생겨도 감당할 수 있다고 느끼는 것이 다시 움직일 수 있는 조건입니다.",
  },
  responsibility: {
    label: "책임",
    caught: "당신의 판단이 책임에서 붙잡혔다면, 결정 이후 내가 맡게 될 몫이 판단의 중요한 조건으로 들어온 것입니다.",
    release: "그 결과를 맡을 준비가 되었다고 느끼는 것이 다시 움직일 수 있는 조건입니다.",
  },
  self_permission: {
    label: "자기허용",
    caught: "당신의 판단이 자기허용에서 붙잡혔다면, 선택의 가능성보다 먼저 '내가 정말 이것을 선택해도 되는가'가 판단에 들어온 것입니다.",
    release: "내가 이 선택을 해도 괜찮다고 느끼는 것이 다시 움직일 수 있는 조건입니다.",
  },
  relationship: {
    label: "관계",
    caught: "당신의 판단이 관계에서 붙잡혔다면, 선택 자체와 함께 그 선택이 사람 사이에 만들 변화가 중요하게 고려된 것입니다.",
    release: "관계가 달라질 가능성까지 받아들일 수 있을 때 다시 움직일 수 있다는 의미입니다.",
  },
  evaluation: {
    label: "평가",
    caught: "당신의 판단이 평가에서 붙잡혔다면, 선택의 결과와 함께 그 선택이 나에 대한 인식에 어떤 영향을 줄지가 중요하게 들어온 것입니다.",
    release: "다른 사람의 평가가 달라질 가능성을 받아들일 수 있을 때 다시 움직일 수 있다는 의미입니다.",
  },
};

const RESPONSE_COPY = {
  response_delay: "결정을 계속 미루게 됩니다",
  response_recheck: "같은 내용을 계속 확인하게 됩니다",
  response_ruminate: "혼자 계속 생각하게 됩니다",
  response_seek_input: "다른 사람의 의견을 계속 구하게 됩니다",
  response_act_adjust: "일단 선택하고 나중에 수정하려 합니다",
  response_distance: "잠시 거리를 두고 생각을 멈춥니다",
};

const MAINTENANCE_COPY = {
  maintenance_wait_for_clarity: "조금 더 기다리면 답이 더 분명해질 것 같다는 생각이 그 상태를 붙잡아 둡니다",
  maintenance_search_for_better_answer: "계속 생각하다 보면 더 나은 답을 찾을 수 있을 것 같다는 생각이 이어집니다",
  maintenance_safety_of_delay: "지금 결정하지 않는 편이 더 안전하게 느껴집니다",
  maintenance_reversibility_concern: "한번 결정하면 되돌리기 어려울 것 같다는 생각이 남습니다",
  maintenance_no_urgency: "아직 지금 결정해야 할 필요는 없다고 느낍니다",
  maintenance_thinking_as_relief: "결정을 내리지 않고 계속 생각하는 편이 오히려 마음이 놓입니다",
};

function findQuestion(id) {
  return flattenMeditatioQuestions().find((q) => q.id === id);
}

function findOptionTag(question, value) {
  if (!question) return null;
  const opt = question.options.find((o) => o.n === value);
  return opt ?? null;
}

// Section 1 응답 5개 → 가장 많이 선택된 Default 값 (동률이면 먼저 나온 것을 채택하되 tally 전체를 함께 반환)
function computeDefaultStrategy(raw) {
  const tally = {};
  for (const q of MEDITATIO_SECTIONS[0].questions) {
    const value = raw[q.id];
    if (value == null) continue;
    const opt = findOptionTag(q, value);
    const tag = opt?.tag?.default;
    if (tag) tally[tag] = (tally[tag] ?? 0) + 1;
  }
  let top = null;
  for (const [k, v] of Object.entries(tally)) {
    if (!top || v > top.n) top = { value: k, n: v };
  }
  return { value: top?.value ?? null, tally };
}

// Section 2 응답 → signals 배열 (중복 허용, 빈도 계산은 화면에서)
function computeAffect(raw) {
  const signals = [];
  for (const card of MEDITATIO_SECTIONS[1].cards) {
    for (const q of card.questions) {
      const value = raw[q.id];
      if (value == null) continue;
      const values = Array.isArray(value) ? value : [value];
      for (const v of values) {
        const opt = q.options.find((o) => o.n === v);
        if (opt?.signals) signals.push(...opt.signals);
      }
    }
  }
  return signals.filter((s) => s && s !== "none");
}

// Section 3 응답 → judgmentProcess { attention, evidence, primaryQuestion, confidence, stopping, update }
function computeJudgmentProcess(raw) {
  const result = {};
  for (const q of MEDITATIO_SECTIONS[2].questions) {
    const value = raw[q.id];
    const opt = findOptionTag(q, value);
    result[q.field] = opt?.tag?.object ?? null;
  }
  return result;
}

// Section 4 응답 → pressure { trigger:{object,domain}, response:{object}, maintenance:{object}, release:{object,domain} }
function computePressure(raw) {
  const result = {};
  for (const q of MEDITATIO_SECTIONS[3].questions) {
    const value = raw[q.id];
    const opt = findOptionTag(q, value);
    result[q.field] = opt ? { object: opt.tag.object, domain: opt.tag.domain ?? null } : { object: null, domain: null };
  }
  return result;
}

function buildNarrative({ defaultStrategy, judgmentProcess, pressure }) {
  const paragraphs = [];

  // 1) 평소 출발점
  const dsLabel = DEFAULT_STRATEGY_LABEL[defaultStrategy.value];
  if (dsLabel) {
    paragraphs.push(`평소 중요한 판단을 시작할 때는 ${dsLabel} 편입니다.`);
  }

  const trigger = pressure.trigger;
  const release = pressure.release;
  const triggerCopy = trigger?.domain ? DOMAIN_COPY[trigger.domain] : null;
  const releaseCopy = release?.domain ? DOMAIN_COPY[release.domain] : null;

  // 2) 무엇이 판단을 처음 붙잡았는가 + 의미
  if (triggerCopy) {
    paragraphs.push(
      `중요한 결정을 앞두면 먼저 **${triggerCopy.label}**이(가) 판단을 붙잡았습니다. ${triggerCopy.caught}`
    );
  }

  // 3) 판단은 어떻게 이어졌는가 (Response + Maintenance)
  const responseCopy = pressure.response?.object ? RESPONSE_COPY[pressure.response.object] : null;
  const maintenanceCopy = pressure.maintenance?.object ? MAINTENANCE_COPY[pressure.maintenance.object] : null;
  if (responseCopy || maintenanceCopy) {
    const bits = [responseCopy, maintenanceCopy].filter(Boolean).join(". 그 상태에서는 ");
    paragraphs.push(`그 상태가 이어지면 ${bits}.`);
  }

  // 4) 무엇이 다시 움직이게 하는가
  if (releaseCopy) {
    paragraphs.push(`다시 움직일 수 있는 조건으로는 **${releaseCopy.label}**을(를) 선택했습니다. ${releaseCopy.release}`);
  }

  // 5) 전체 흐름 연결 + Trigger/Release가 다른 경우의 발견
  if (triggerCopy && releaseCopy) {
    if (trigger.domain === release.domain) {
      paragraphs.push(
        `따라서 판단을 붙잡는 지점과 다시 움직이게 하는 지점이 같은 **${triggerCopy.label}**으로 나타났습니다.`
      );
    } else {
      paragraphs.push(
        `당신의 경우, 판단을 붙잡는 지점(${triggerCopy.label})과 판단을 다시 움직이게 하는 지점(${releaseCopy.label})이 서로 다르게 나타났습니다.`
      );
    }
  }

  return paragraphs.join("\n\n");
}

export function deriveMeditatioResult(raw) {
  const defaultStrategy = computeDefaultStrategy(raw);
  const affect = computeAffect(raw);
  const judgmentProcess = computeJudgmentProcess(raw);
  const pressure = computePressure(raw);
  const narrative = buildNarrative({ defaultStrategy, judgmentProcess, pressure });

  return {
    defaultStrategy: defaultStrategy.value,
    defaultStrategyTally: defaultStrategy.tally,
    affect,
    judgmentProcess,
    pressure,
    narrative,
    generatedAt: Date.now(),
  };
}
