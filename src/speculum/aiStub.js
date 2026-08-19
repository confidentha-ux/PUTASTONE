// aiStub.js — 18개 Speculum persona 컴포넌트가 공통으로 기대하던 callClaude(prompt)의 자리를
// 채우는 임시 mock이다.
//
// 배경: 원본 18개 persona jsx(claude/speculum-*.jsx)는 전부 브라우저에서 API 키 없이
// https://api.anthropic.com/v1/messages 를 직접 fetch하는 코드를 갖고 있었다 — 그대로 쓰면
// 브라우저에서 100% 실패한다(README "아직 안 된 것" 항목 참고, 서버 프록시는 아직 로드맵의
// 다음 단계). 이 stub은 그 자리를 대신해서, 서버 프록시가 붙기 전까지 18개 페르소나가
// 실제로 끝까지 작동하도록 한다.
//
// 동작 원리: 18개 파일의 buildResultPrompt/buildQuestionPrompt/buildConditionPrompt는 전부
// 사용자의 실제 답변을 `- 라벨: "값"` 형태의 줄로 나열한 뒤, JSON 출력을 요청하는 동일한
// 템플릿을 쓴다(패턴은 /tmp/aistub-test.mjs로 patron/magistrate 두 파일에 대해 검증 완료).
// 이 stub은
//   1) 그 줄들을 정규식으로 파싱해서
//   2) 프롬프트가 요청하는 JSON 모양(question / question+targetLine / condition+conditionType
//      / summary+suggestion)을 프롬프트 안의 출력 템플릿을 보고 판별한 뒤
//   3) AI처럼 새로 판단하거나 평가하지 않고, 사용자가 실제로 쓴 답을 그대로 옮겨 담은 결과를
//      돌려준다.
//
// 주의: 이것은 진짜 AI 판단이 아니다 — summary/suggestion 결과에는 항상 "이것은 임시 화면"이라는
// 문구를 포함시켜, 사용자가 이 결과를 완결된 분석으로 오해하지 않게 한다.
// 서버 프록시가 붙으면 이 파일의 mockCallClaude를 실제 API 호출로 교체하고, 18개 페르소나
// 파일들의 `import { mockCallClaude } from "../speculum/aiStub"` 한 줄씩만 바꾸면 된다.

function parseLabeledLines(prompt) {
  const lines = [];
  const re = /^- (.+?): "([\s\S]*?)"$/gm;
  let m;
  while ((m = re.exec(prompt))) {
    const label = m[1].trim();
    const value = m[2].trim();
    if (value) lines.push({ label, value });
  }
  return lines;
}

// 프롬프트 맨 끝의 "출력은 JSON만: {...}" 템플릿에 해당 필드명이 있는지로 어떤 모양의
// JSON을 요청하는 프롬프트인지 판별한다. 본문은 전부 한국어라 영문 필드명은 이 템플릿에만 나온다.
function wantsField(prompt, field) {
  const re = new RegExp(`"${field}"\\s*:`);
  return re.test(prompt);
}

const DISCLAIMER =
  "지금 이 내용은 실제 AI 판단이 아니라, 방금 남긴 답변을 그대로 옮겨 적은 임시 결과입니다(AI 서버 연결 전 단계). 다음에 비슷한 상황을 마주치면, 오늘 남긴 답을 다시 읽어보는 것부터 시작해보세요.";

export async function mockCallClaude(prompt) {
  // loading 화면이 실제로 잠깐 보이도록 약간의 지연을 흉내낸다.
  await new Promise((resolve) => setTimeout(resolve, 350));

  const lines = parseLabeledLines(prompt);
  const last = lines[lines.length - 1];

  if (wantsField(prompt, "condition")) {
    // buildConditionPrompt (chronicler) — {"condition", "conditionType"}
    const condition = last
      ? `"${last.value}"라고 답했던 것과 다르게 흘러간 구체적인 사례를 하나 떠올려 봅니다.`
      : "지금까지의 생각과 다르게 흘러간 구체적인 사례를 하나 떠올려 봅니다.";
    return JSON.stringify({ condition, conditionType: "불명확" });
  }

  if (wantsField(prompt, "question")) {
    // buildQuestionPrompt (magistrate / pioneer) — {"question"} 또는 {"question","targetLine"}
    const question = last
      ? `"${last.value}"라고 하셨는데, 지금 실제 상황은 그것과 비교해 어떻습니까?`
      : "지금 실제 상황은 어떻습니까?";
    const out = { question };
    if (wantsField(prompt, "targetLine")) out.targetLine = last ? last.label : "";
    return JSON.stringify(out);
  }

  // 기본: buildResultPrompt — {"summary", "suggestion"}
  const summary = lines.length
    ? lines.map((l) => `${l.label}: ${l.value}`).join("\n")
    : "이번 세션에서 남긴 답변을 정리하지 못했습니다.";
  return JSON.stringify({ summary, suggestion: DISCLAIMER });
}
