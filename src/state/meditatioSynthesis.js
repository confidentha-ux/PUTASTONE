import { MEDITATIO_SECTIONS } from "../data/meditatioV1";
import { callClaude } from "../speculum/aiStub";

// "1. 현재의 돌탑 · 2" — 33문항 전체 결과를 실제 해석으로 보여주는 부분.
//
// 2026-09-09 네 번째 재작성. 세 번의 시행착오:
//   1차: Part 2·3이 답보다 큰 해석으로 확대("성찰적인 태도").
//   2차: 그걸 1문장으로 줄였더니 "네 개의 소결과를 붙여놓은 것"에 그침(연결 없음).
//   3차: Part 2·3을 다시 늘리고 연결(B/C/D)을 별도 호출로 추가했지만, 근본 문제가 남음 —
//        (a) Part별로 따로 호출해서 모델이 33문항 전체를 동시에 보지 못했고,
//        (b) 프롬프트가 "반복되는 패턴을 찾아 요약"이라는 얕은 지시였다. 이건 객관식 답을
//        문장으로 바꿔치기하라는 것과 다르지 않아서, "내가 고른 답을 다시 보여주는" 것처럼
//        느껴졌다. 그리고 "이 단어 쓰지 마라"류 형식 규칙이 쌓이면서 모델이 해석에 쓸 여력을
//        형식 지키는 데 다 썼다.
// 이번엔: 33문항 전체를 한 번에 넣고, "요약해달라"가 아니라 "이 사람이 직접 말하지 않았지만
// 이 답들의 조합에서 드러나는 건 뭔가"라고 묻는다. 형식 규칙은 최소로 줄인다(1인칭 관찰형
// 정도만 남김) — 나머지는 모델의 해석 능력에 맡긴다.

function collectAllAnswerLines(raw) {
  const lines = [];
  for (const section of MEDITATIO_SECTIONS) {
    const questions = section.cards ? section.cards.flatMap((c) => c.questions) : section.questions;
    for (const q of questions) {
      const value = raw[q.id];
      if (value == null) continue;
      const values = Array.isArray(value) ? value : [value];
      const texts = values.map((v) => q.options.find((o) => o.n === v)?.text).filter(Boolean);
      if (texts.length) lines.push(`- ${q.text}: "${texts.join(", ")}"`);
    }
  }
  return lines;
}

function buildInsightPrompt(lines) {
  return `아래는 어떤 사람이 자신의 판단 방식을 확인하는 33개 질문에 실제로 답한 것입니다.

${lines.join("\n")}

이 사람은 이미 각 질문에 답하면서 자기가 뭘 골랐는지는 알고 있습니다. 그러니 답을 다른 말로
바꿔서 다시 보여주는 건 의미가 없습니다. 이 사람이 **직접 말하지 않았지만, 여러 답을 함께
놓고 봐야만 드러나는 것**을 찾아서 써주세요.

예를 들어 이런 것들을 찾아보세요:
- 서로 다른 질문에 대한 답이 겹쳐서 만드는, 어느 한 답에서도 안 보이는 패턴
- 답들 사이의 모순이나 긴장 (예: 시작할 때는 이렇게 하는데, 정작 끝낼 때는 다르게 한다)
- 이 사람이 스스로는 모를 수도 있는 사각지대나 습관
- 특정 상황에서만 반복되는, 이 사람도 미처 연결 못 했을 조합

가짜로 만들지 말고, 실제 답 두 개 이상을 근거로 삼아서 쓰세요. 어떤 답을 근거로 삼았는지
자연스럽게 녹여서 보여주세요("~라고 답했는데 동시에 ~라고도 답했습니다" 같은 식으로, 답을
그대로 인용하듯이).

분량과 형식은 자유롭게 정하세요 — 짧아도 되고 길어도 됩니다. 문단을 나눠도 되고 안 나눠도
됩니다. 이 사람이 "아, 이건 나도 몰랐던 건데"라고 느낄 만한 진짜 통찰이 나오는 게 중요합니다.
그 외에는 당신 판단에 맡깁니다.

유일한 규칙: "당신"이라고 부르지 말고 1인칭 관찰형("~합니다")으로 쓰세요.

출력은 JSON만: {"insight": "..."}`;
}

export async function generateMeditatioInsight(raw) {
  const lines = collectAllAnswerLines(raw);
  if (lines.length < 5) return null; // 답이 너무 적으면 조합에서 나올 통찰도 없다.
  try {
    const result = await callClaude(buildInsightPrompt(lines));
    const parsed = JSON.parse(result);
    return parsed.insight ?? null;
  } catch (e) {
    console.warn("[meditatioSynthesis] 통찰 생성 실패", e);
    return null;
  }
}
