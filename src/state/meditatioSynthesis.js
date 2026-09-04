import { MEDITATIO_SECTIONS } from "../data/meditatioV1";
import { callClaude } from "../speculum/aiStub";

// "1. 현재의 돌탑 · 2" 확정본의 "오래 남는 것"(Part 2) / "판단을 내릴 때 보는 것"(Part 3) —
// computeAffect/computeJudgmentProcess는 내부 태그 코드만 돌려줘서(예: "evaluation_related")
// 그 자체로는 사람이 읽을 문장이 아니다. 실제 선택한 답변 텍스트를 모아 Claude로 종합한다
// (2026-09-03, Speculum 세션 종합과 같은 방식).

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

function buildPartPrompt({ label, lines }) {
  return `아래는 어떤 사람이 "${label}"를 확인하는 설문에서 실제로 고른 답입니다.

${lines.join("\n")}

이 답들을 보고, 이 사람의 실제 경향을 2문장으로 요약해 주세요. 문항을 그대로 나열하지 말고, 답들
사이에서 실제로 반복되는 패턴을 찾아 자연스러운 문장으로 쓰세요. 데이터에 없는 내용은 지어내지
마세요. "당신"이라고 부르지 말고 1인칭 관찰형("~합니다")으로 쓰세요.

출력은 JSON만: {"description": "..."}`;
}

// 실패하면(네트워크 오류, 응답이 충분하지 않은 등) null을 돌려주고, 그 Part 자리는 비운 채로
// 나머지 결과 화면은 그대로 보여준다.
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
