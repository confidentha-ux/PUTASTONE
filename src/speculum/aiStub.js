// aiStub.js — 18개 Speculum persona 컴포넌트가 공통으로 기대하는 callClaude(prompt)의 자리.
//
// 2026-09-03부터: /api/claude-proxy 서버리스 함수를 통해 실제 Claude API를 호출한다.
// 18개 persona jsx가 전부 `import { mockCallClaude } from "../speculum/aiStub"`로 쓰고 있어서,
// 이름은 그대로 두고(mockCallClaude) 내부 구현만 진짜 호출로 바꿨다 — 18개 파일을 하나도
// 안 건드려도 된다. 새로 쓰는 코드는 더 정확한 이름인 callClaude를 쓰면 된다, 같은 함수다.

// Claude가 지시를 어기고 ```json 코드펜스나 앞뒤 설명을 붙여 보내는 경우를 대비해,
// 첫 '{'부터 마지막 '}'까지만 잘라낸다. 18개 persona 파일은 이 결과를 바로 JSON.parse한다.
function extractJson(text) {
  const trimmed = (text ?? "").trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const candidate = fenceMatch ? fenceMatch[1] : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) return candidate;
  return candidate.slice(start, end + 1);
}

export async function callClaude(prompt) {
  const response = await fetch("/api/claude-proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `AI 프록시 호출 실패 (${response.status})`);
  }

  const data = await response.json();
  return extractJson(data.text);
}

export const mockCallClaude = callClaude;
