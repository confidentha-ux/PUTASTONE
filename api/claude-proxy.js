// Vercel 서버리스 함수 — /api 디렉토리에 있으면 Vercel이 자동으로 이 파일을
// https://putastone.vercel.app/api/claude-proxy 엔드포인트로 배포한다(프레임워크 무관, Vite도 동일).
//
// 존재 이유: ANTHROPIC_API_KEY는 절대 브라우저 번들에 들어가면 안 된다(들어가면 누구나
// 개발자 도구로 훔쳐서 하경 님 계정으로 과금시킬 수 있다). 그래서 브라우저는 이 서버 함수만
// 호출하고, 이 함수만 실제 API 키를 쥔 채로 api.anthropic.com에 요청한다.
//
// 18개 persona 파일의 buildResultPrompt/buildQuestionPrompt/buildConditionPrompt가 만드는
// prompt를 그대로 받아서, "출력은 JSON만"이라는 그 프롬프트 안의 지시를 시스템 프롬프트로
// 한 번 더 강제한 뒤 그대로 전달한다.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST만 허용됩니다." });
    return;
  }

  const { prompt } = req.body ?? {};
  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "prompt가 필요합니다." });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "서버에 ANTHROPIC_API_KEY가 설정되어 있지 않습니다." });
    return;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 500,
        system:
          "요청받은 형식의 유효한 JSON만 응답하라. 마크다운 코드펜스(```)도, 설명도, 다른 텍스트도 앞뒤에 붙이지 마라 — 순수 JSON 객체 하나만.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(response.status).json({ error: `Anthropic API 오류: ${errText}` });
      return;
    }

    const data = await response.json();
    const textBlock = (data.content ?? []).find((b) => b.type === "text");
    res.status(200).json({ text: textBlock?.text ?? "" });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
