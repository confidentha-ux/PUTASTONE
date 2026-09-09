import { MEDITATIO_SECTIONS } from "../data/meditatioV1";
import { callClaude } from "../speculum/aiStub";

// "1. 현재의 돌탑 · 2" 확정본 — Part 2("오래 남는 것") / Part 3("판단을 내릴 때 보는 것")를
// 실제 답변으로 생성하고, 네 Part를 연결해서 A(상세 결과)/B(함께 놓아보면)/C(서로 다른 방향이
// 나타난 곳)/D(지금 이 지형에서 눈에 띄는 것) 네 층을 만든다.
//
// 2026-09-09 세 번째 재작성 — 두 번의 시행착오를 거쳤다:
//   1차: Part 2·3가 "성찰적인 태도를 보입니다" 같은, 답보다 큰 해석으로 확장되는 문제.
//   2차: 그걸 고친다고 1문장으로 줄였더니, 33문항을 받고도 "네 개의 소결과를 붙여놓은 것"에
//        그치는 문제(연결 분석이 없음) + 남은 문장도 "논리적 확실성보다 '더 잘 설명되는가'에
//        있어서" 같은 내부 분석어 번역투 문제.
// 그래서 이번엔 (a) Part 2·3는 다시 충분히 구체적으로 쓰되 "행동 변환표"로 번역투를 막고,
// (b) 네 Part를 실제로 연결한 층(B/C/D)을 별도로 만든다 — 단, 근거 없으면 지어내지 않는다.

function collectAnswerLines(raw, sectionIndex) {
  const section = MEDITATIO_SECTIONS[sectionIndex];
  const questions = section.cards ? section.cards.flatMap((c) => c.questions) : section.questions;
  const lines = [];
  for (const q of questions) {
    const value = raw[q.id];
    if (value == null) continue;
    const values = Array.isArray(value) ? value : [value];
    const texts = values.map((v) => q.options.find((o) => o.n === v)?.text).filter(Boolean);
    if (texts.length) lines.push(`- ${q.text}: "${texts.join(", ")}"`);
  }
  return lines;
}

// 내부 분석어를 실제 행동 질문으로 바꾸는 변환표 — 프롬프트에 그대로 박아 넣어서 Claude가
// "starting direction", "confidence source" 같은 개념어를 그대로 번역하지 않게 한다.
const BEHAVIOR_FRAME = `내부 분석 용어를 그대로 번역하지 말고, 아래처럼 실제 행동 질문에 답하듯 쓰세요:
- (무엇부터 보는지) 예상과 다른 일이 생겼을 때 가장 먼저 눈에 들어오는 것은?
- (무엇이 확인돼야 확신하는지) 무엇이 맞아떨어져야 "이제 판단해도 되겠다"고 느끼는지?
- (언제 결정을 내리는지) 어느 정도가 되어야 "이 정도면 충분하다"고 느끼는지?
- (무엇이 생기면 생각을 바꾸는지) 이미 내린 판단이 흔들리는 건 어떤 때인지?`;

const GOOD_EXAMPLE = {
  "나는 무엇을 오래 기억하는가":
    "잘 해냈다는 기억보다 실수했거나 기대에 못 미쳤던 경험이 더 오래 남습니다. 일이 끝난 뒤에도 그때의 감정이 한동안 이어지는 편이고, 혼자 정리를 끝낸 뒤에야 다른 사람에게 이야기하는 편입니다.",
  "나는 어떻게 판단을 내리는가":
    "예상과 다른 일이 생기면 먼저 실제로 무엇이 달라졌는지부터 확인합니다. 여러 정보가 있을 때는 하나하나가 완벽하게 확실해질 때까지 기다리기보다, 지금까지 확인한 사실을 가장 잘 설명하는 쪽으로 판단합니다. 다만 새로운 사실이 나오면 그 판단을 다시 봅니다.",
};

function buildPartPrompt({ label, lines }) {
  const behaviorNote = label === "나는 어떻게 판단을 내리는가" ? `\n${BEHAVIOR_FRAME}\n` : "";
  return `아래는 어떤 사람이 "${label}"를 확인하는 설문에서 실제로 고른 답입니다.

${lines.join("\n")}

이 답들에서 실제로 반복되는 것을 2~3문장으로 쓰세요. 문항을 나열하지 말고, 답들 사이에서
반복되는 패턴을 찾아 자연스러운 문장으로 쓰세요.
${behaviorNote}
문체 규칙 (반드시 지키세요):
- 답한 내용 그대로만 쓰세요. 답에 없는 평가나 해석을 덧붙이지 마세요 — "성찰적인 태도",
  "~한 사람입니다" 같은, 답변보다 큰 결론으로 확장하지 마세요.
- **번역투 금지.** "논리적 확실성보다 설명력에 있어서" 같은 개념어 직역 문장을 쓰지 마세요.
  실제 사람이 말하듯, 구체적인 상황과 행동으로 풀어 쓰세요.
- "당신"이라고 부르지 말고 1인칭 관찰형("~합니다")으로 쓰세요.
- 행동을 유형으로 명명하지 마세요("~하는 방식을 보입니다" 금지). "~하면 ~합니다"처럼 트리거와
  행동을 순서대로 쓰세요.
- 좋은 예시: "${GOOD_EXAMPLE[label] ?? ""}"

출력은 JSON만: {"description": "..."}`;
}

async function generatePartSynthesis(raw, sectionIndex, label) {
  const lines = collectAnswerLines(raw, sectionIndex);
  if (lines.length === 0) return null;
  try {
    const result = await callClaude(buildPartPrompt({ label, lines }));
    const parsed = JSON.parse(result);
    return parsed.description ?? null;
  } catch (e) {
    console.warn(`[meditatioSynthesis] ${label} 생성 실패`, e);
    return null;
  }
}

export async function generateMeditatioPartDescriptions(raw) {
  const [part2, part3] = await Promise.all([
    generatePartSynthesis(raw, 1, "나는 무엇을 오래 기억하는가"),
    generatePartSynthesis(raw, 2, "나는 어떻게 판단을 내리는가"),
  ]);
  return { part2, part3 };
}

// B(함께 놓아보면) / C(서로 다른 방향이 나타난 곳) / D(지금 이 지형에서 눈에 띄는 것) —
// 네 Part를 같이 보는 작업이라 한 번의 호출로 묶는다. 셋 다 "근거가 있을 때만" 채우고,
// 없으면 각각 null — 화면에서 그 섹션이 통째로 빠진다.
function buildConnectionsPrompt(parts) {
  const lines = Object.entries(parts)
    .filter(([, v]) => v)
    .map(([label, v]) => `- ${label}: "${v}"`)
    .join("\n");

  return `아래는 한 사람의 판단에 대해 네 영역에서 확인된 것입니다.

${lines}

이 네 가지를 보고 아래 세 가지를 각각 확인해 주세요. 셋 다 실제 근거가 있을 때만 채우고,
억지로 만들지 마세요 — 근거가 부족하면 그 항목은 null로 두세요.

1. **flow (함께 놓아보면)**: 이 네 가지가 실제로 하나의 판단 흐름(무엇으로 시작해서, 무엇을
   거쳐, 무엇으로 끝나는지)으로 이어진다면 1~2문장으로 쓰세요. 예: "처음에는 직감이 빠른
   편이지만, 결정할 때는 그 직감이 맞는지 확인하는 과정을 거칩니다. 예상과 다른 사실이 나오면
   처음 생각을 고집하기보다 다시 판단하는 편입니다." 번역투 금지, 구체적인 행동으로 쓰세요.

2. **tension (서로 다른 방향이 나타난 곳)**: 네 영역 사이에 긴장이나 뜻밖의 조합이 있다면
   1~2문장으로 쓰세요. 예: "방향을 처음 잡을 때와 그 방향을 확정할 때 쓰는 기준이 다릅니다.
   새로운 상황에서는 끌리는 방향을 먼저 보지만, 판단을 확정할 때는 확인된 사실과 설명의
   일관성을 요구합니다." 모순처럼 보이는 조합도 억지로 하나로 합치지 말고 둘 다 있는 그대로
   보여주세요.

3. **insight (지금 이 지형에서 눈에 띄는 것)**: 위 두 가지를 근거로, 가장 눈에 띄는 핵심 하나를
   1문장으로 쓰세요. 이 사람이 "아, 그래서 내가 이럴 때 이렇게 되는구나" 싶을 만한 것.

문체 규칙 (셋 다 적용): "당신"이라고 부르지 마세요. 번역투·개념어 금지, 실제 행동과 상황으로
쓰세요. 데이터에 없는 내용은 지어내지 마세요.

출력은 JSON만: {"flow": "..." 또는 null, "tension": "..." 또는 null, "insight": "..." 또는 null}`;
}

export async function generateMeditatioConnections({ part1, part2, part3, part4 }) {
  const parts = {
    "먼저 확인하는 것": part1,
    "오래 남는 것": part2,
    "판단을 내릴 때 보는 것": part3,
    "중요한 결정에서 마음에 걸리는 것": part4,
  };
  const available = Object.values(parts).filter(Boolean).length;
  if (available < 2) return { flow: null, tension: null, insight: null };
  try {
    const raw = await callClaude(buildConnectionsPrompt(parts));
    const parsed = JSON.parse(raw);
    return { flow: parsed.flow ?? null, tension: parsed.tension ?? null, insight: parsed.insight ?? null };
  } catch (e) {
    console.warn("[meditatioSynthesis] 연결 분석 생성 실패", e);
    return { flow: null, tension: null, insight: null };
  }
}
