import React from "react";
import { useUserState } from "../state/UserStateContext";
import { PERSONA_REGISTRY } from "../speculum/personaRegistry";
import { PaperGrain } from "../components/PaperGrain";
import { SectionMark } from "../components/SectionMark";

// claude/돌하나를-얹다-app-spec-v1.md "11. CURRENT HOME / FINAL ANALYSIS" — 이름: 현재의 돌탑.
// 인트로의 돌탑(삶 속에서 형성되어 온 판단 전체의 비유)과는 의미가 다르다 — 여기서는 앱 안에서 실제로
// 거친 질문·판단 경험만 기록한다. Final Analysis Architecture v1.2의 5개 출력 영역 구조는 그대로 두고
// (I~V), 이 중 스펙 11번이 명시적으로 다시 확정한 IV/V만 "지금까지 얹은 돌" / "쌓이면서 드러난 것"으로
// 이름을 바꿨다. ("My Mirror"는 옛 이름, 폐기 — claude/app-build-readiness-v1.md 참고)
// Speculum이 아직 연결되지 않았으므로(로드맵 4번, 다음 단계) IV/V는 지금은 항상 비어 있는 상태로 보여준다 —
// 데이터가 없다고 화면을 숨기지 않고, "아직 쌓이지 않았다"는 것 자체를 보여주는 게 이 화면의 원칙에 맞는다.

function formatSessionDate(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const CSS = `
.st-root { flex: 1; min-height: 0; position: relative; background: radial-gradient(120% 90% at 50% 0%, #efe6d0 0%, #e8dcc0 62%); color: #1c1a17; font-family: Pretendard, -apple-system, sans-serif; padding: 32px 20px 60px; box-sizing: border-box; }
.st-shell { max-width: 560px; margin: 0 auto; }
.st-title { font-family: Pretendard, sans-serif; font-size: 26px; margin: 0 0 6px; }
.st-sub { color: #847c6b; font-size: 13px; margin: 0 0 32px; }
.st-section { margin-bottom: 28px; }
.st-section h2 { font-family: Pretendard, sans-serif; font-size: 16px; font-weight: 400; color: #1c1a17; margin: 0 0 12px; }
.st-card { background: rgba(49,53,45,0.04); border: 1px solid rgba(49,53,45,0.14); border-radius: 4px; padding: 16px 18px; font-size: 13.5px; line-height: 1.8; white-space: pre-line; }
.st-empty { color: #847c6b; font-size: 13px;  }
.st-guide { color: #847c6b; font-size: 12.5px; line-height: 1.8; margin-top: 16px; }
.st-tag-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.st-tag { font-size: 11px; padding: 4px 9px; border-radius: 20px; border: 1px solid rgba(49,53,45,0.14); color: #847c6b; }
.st-item { padding: 10px 0; border-bottom: 1px solid rgba(49,53,45,0.08); font-size: 13.5px; }
.st-item:last-child { border-bottom: none; }
.st-item .k { color: #847c6b; font-size: 11px; letter-spacing: 0.04em; display: block; margin-top: 4px; }
`;

export default function Studiolo() {
  const { state } = useUserState();
  const { lectio, meditatio, speculumSessions, judgmentPaths } = state;

  const closedItems = lectio.items.filter((it) => it.status === "closed");
  const openItems = lectio.items.filter((it) => it.status === "open");

  return (
    <div className="st-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <PaperGrain seed={31} baseFrequency={0.5} octaves={2} opacity={0.13} />
      <div className="st-shell">
        <SectionMark number="05" title="현재의 돌탑" />
        <p className="st-sub">처음 판단과 지금까지 쌓인 판단 사이에서 확인된 것들.</p>

        <div className="st-section">
          <h2>I. 내가 열어둔 판단 공간</h2>
          {lectio.items.length === 0 ? (
            <div className="st-empty">아직 나를 받치는 돌을 완료하지 않았습니다.</div>
          ) : (
            <div className="st-card">
              자연스럽게 가능한 행동 {openItems.length}개, 조건이 붙는 행동 {closedItems.length}개.
              {lectio.dominantDomain && (
                <>
                  {"\n"}반복해서 나타난 것: {lectio.dominantDomain.domain} ({lectio.dominantDomain.n}회)
                </>
              )}
              {closedItems.length > 0 && (
                <div className="st-tag-row">
                  {closedItems.map((it) => (
                    <span key={it.itemId} className="st-tag">{it.label.replace("\n", " ")}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="st-section">
          <h2>II · III. 판단이 만들어지는 방식 / 중요한 순간의 판단</h2>
          {!meditatio.derived ? (
            <div className="st-empty">아직 판단이 만들어지는 과정을 완료하지 않았습니다.</div>
          ) : (
            <div className="st-card">{meditatio.derived.narrative}</div>
          )}
        </div>

        <div className="st-section">
          <h2>지금까지 얹은 돌</h2>
          {speculumSessions.length === 0 ? (
            <div className="st-empty">아직 얹은 돌이 없습니다.</div>
          ) : (
            speculumSessions.map((s) => (
              <div key={s.sessionId} className="st-item">
                {s.initialJudgment}
                <span className="k">
                  {PERSONA_REGISTRY[s.personaId]?.koreanName ?? s.personaId}
                  {s.timestamp ? ` · ${formatSessionDate(s.timestamp)}` : ""}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="st-section">
          <h2>쌓이면서 드러난 것</h2>
          {judgmentPaths.length === 0 ? (
            <div className="st-empty">
              여러 번의 판단 경험이 쌓인 뒤에, 반복해서 나타나는 흐름이 여기 보입니다.
            </div>
          ) : (
            judgmentPaths.map((p) => (
              <div key={p.pathId} className="st-card" style={{ marginBottom: 10 }}>
                {p.start?.text}
              </div>
            ))
          )}
          <p className="st-guide">
            하나의 돌만으로는 탑의 모양을 알기 어렵습니다. 여러 판단이 쌓이면, 현재의 돌탑이 어떤
            모양을 이루고 있는지 조금씩 보이기 시작합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
