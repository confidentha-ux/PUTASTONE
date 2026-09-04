import { callClaude } from "./aiStub";

// "2. 현재의 돌탑 · 3" 확정본의 "달라진 것과 그대로 남은 것" / "이번 답에서 보인 것" —
// 텍스트 두 개를 실제로 비교·종합해야 해서 템플릿으로는 못 만든다(2026-09-03 세션에서 확인).
// /api/claude-proxy가 붙은 뒤에는 페르소나와 같은 방식(callClaude)으로 실제 생성한다.
function buildSynthesisPrompt({ initialJudgment, rejudgment, personaName, summary, suggestion }) {
  return `지금 어떤 사람이 판단 연습 앱에서 "다른 역할 입어보기"를 한 번 마쳤습니다. 아래는 그 사람의 실제 데이터입니다.

- 처음 판단: "${initialJudgment}"
- 사용한 역할: ${personaName}
- 그 역할을 통해 나온 요약: "${summary ?? ""}"
- 그 역할을 통해 나온 제안: "${suggestion ?? ""}"
- 지금(재판단): "${rejudgment}"

이 데이터를 보고 아래 두 가지를 만들어 주세요. 지어내지 말고 위 데이터에 실제로 있는 내용만 근거로 삼으세요.

1. "달라진 것과 그대로 남은 것" — 처음 판단과 지금 판단을 비교해서, 결론이 바뀌었는지 아닌지, 바뀌었다면
무엇이 바뀌었는지, 안 바뀌었다면 무엇이 그대로 남았는지 1~2문장으로 씁니다. 아래 세 형식 중 데이터에
맞는 것 하나를 따르세요(예시 그대로 베끼지 말고 이 사람의 실제 내용으로):
   - "처음에는 X가 이유였습니다. 지금도 Y에 가깝지만, Z를 따로 보고 있습니다." (결론은 비슷하지만
     이유가 더 구체화된 경우)
   - "처음과 지금의 결론은 같습니다. 다른 방식으로 생각해본 뒤에도 X는 여전히 가장 중요한 이유로
     남았습니다." (결론과 핵심 이유 모두 유지된 경우)
   - "처음에는 A였지만, 지금은 B라고 생각하고 있습니다." (결론 자체가 바뀐 경우)

2. "이번 답에서 보인 것" — 이번 세션 전체에서 드러난 이 사람의 판단 방식 하나를 1문장으로 씁니다.
"~하는 모습이 보입니다"체로 끝내세요.

문체 규칙: "당신"이라고 부르지 마세요(1인칭 관찰형으로, "~습니다"). 데이터에 없는 내용을 지어내지
마세요. "자기허용", "인지훈련" 같은 개념어 쓰지 말고 구체적으로 쓰세요.

출력은 JSON만: {"comparison": "...", "insight": "..."}`;
}

// 실패해도(네트워크 오류, API 키 미설정 등) 화면 자체는 계속 보여줘야 하므로, 실패 시 null을
// 돌려주고 호출부는 그 두 자리를 그냥 비워둔 채로 렌더링한다.
export async function generateSessionSynthesis(payload) {
  try {
    const raw = await callClaude(buildSynthesisPrompt(payload));
    const parsed = JSON.parse(raw);
    return {
      comparison: parsed.comparison ?? null,
      insight: parsed.insight ?? null,
    };
  } catch (e) {
    console.warn("[sessionSynthesis] 생성 실패, 해당 자리는 비웁니다.", e);
    return null;
  }
}
