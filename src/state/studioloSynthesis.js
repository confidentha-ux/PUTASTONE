import { callClaude } from "../speculum/aiStub";

// "지금까지 보이는 결" — 01(나를 받치는 돌)·02(내 판단의 지형)·여러 03 세션을 함께 봤을 때
// 반복해서 나타나는 판단 방식. 서로 다른 자리에서 나온 데이터를 실제로 비교해야 해서(단순
// 태그 하나가 아니라 "여러 자리에서 공통되는가"를 판단해야 함) 템플릿이 아니라 생성으로 만든다.
function buildPatternPrompt({ lectio, meditatio, speculumSessions }) {
  const lines = [];

  if (lectio.dominantDomain) {
    lines.push(`- 나를 받치는 돌: 어려운 선택에서 "${lectio.dominantDomain.domain}" 관련 생각이 ${lectio.dominantDomain.n}번 반복됨`);
  }
  if (meditatio.derived?.narrative) {
    lines.push(`- 내 판단의 지형: "${meditatio.derived.narrative}"`);
  }
  speculumSessions.forEach((s, i) => {
    if (s.reflection) lines.push(`- 다른 돌을 얹어보기 세션 ${i + 1}: "${s.reflection}"`);
  });

  return `아래는 어떤 사람이 판단 연습 앱의 서로 다른 세 자리(나를 받치는 돌 / 내 판단의 지형 / 다른
돌을 얹어보기)에서 실제로 확인된 내용입니다.

${lines.join("\n")}

이 중에서, 서로 다른 자리에서 공통으로 반복되는 판단 방식이 실제로 있는지 확인해 주세요.

- 정말로 반복되는 것이 있다면: 그 패턴을 1~2문장으로 구체적으로 쓰세요. 데이터에 없는 내용은
지어내지 마세요.
- 반복되는 것이 뚜렷하지 않다면: 억지로 만들지 말고 "아직 뚜렷한 결이 없다"고 답하세요.

문체 규칙: "당신"이라고 부르지 마세요(1인칭 관찰형, "~합니다"). 개념어를 쓰지 말고 구체적으로
쓰세요.

출력은 JSON만: {"pattern": "..." 또는 null}`;
}

// 실패하거나 반복 패턴이 뚜렷하지 않으면 null — 화면은 "아직 결이 없다" 상태로 자연스럽게 보인다.
export async function generateStudioloPattern({ lectio, meditatio, speculumSessions }) {
  try {
    const raw = await callClaude(buildPatternPrompt({ lectio, meditatio, speculumSessions }));
    const parsed = JSON.parse(raw);
    return parsed.pattern ?? null;
  } catch (e) {
    console.warn("[studioloSynthesis] 결 생성 실패", e);
    return null;
  }
}
