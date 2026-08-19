import React from "react";
import { useUserState } from "../state/UserStateContext";

// The Studiolo — Final Analysis Architecture v1.2의 5개 출력 영역을 보여주는 화면.
// ("My Mirror"는 옛 이름, 폐기 — claude/app-build-readiness-v1.md 참고)
// Speculum이 아직 연결되지 않았으므로(로드맵 4번, 다음 단계) IV/V는 지금은 항상 비어 있는 상태로 보여준다 —
// 데이터가 없다고 화면을 숨기지 않고, "아직 쌓이지 않았다"는 것 자체를 보여주는 게 이 화면의 원칙에 맞는다.

const CSS = `
.st-root { min-height: 100%; background: #16131c; color: #ece7de; font-family: Pretendard, -apple-system, sans-serif; padding: 32px 20px 60px; box-sizing: border-box; }
.st-shell { max-width: 560px; margin: 0 auto; }
.st-title { font-family: 'Gowun Batang', serif; font-size: 26px; margin: 0 0 6px; }
.st-sub { color: #7d7489; font-size: 13px; margin: 0 0 32px; }
.st-section { margin-bottom: 28px; }
.st-section h2 { font-family: 'Gowun Batang', serif; font-size: 16px; font-weight: 400; color: #d6a756; margin: 0 0 12px; }
.st-card { background: rgba(236,231,222,0.04); border: 1px solid rgba(236,231,222,0.14); border-radius: 4px; padding: 16px 18px; font-size: 13.5px; line-height: 1.8; white-space: pre-line; }
.st-empty { color: #7d7489; font-size: 13px; font-style: italic; }
.st-tag-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.st-tag { font-size: 11px; padding: 4px 9px; border-radius: 20px; border: 1px solid rgba(236,231,222,0.14); color: #7d7489; }
.st-item { padding: 10px 0; border-bottom: 1px solid rgba(236,231,222,0.08); font-size: 13.5px; }
.st-item:last-child { border-bottom: none; }
.st-item .k { color: #d6a756; font-size: 11px; letter-spacing: 0.04em; display: block; margin-bottom: 2px; }
`;

export default function Studiolo() {
  const { state } = useUserState();
  const { lectio, meditatio, speculumSessions, judgmentPaths } = state;

  const closedItems = lectio.items.filter((it) => it.status === "closed");
  const openItems = lectio.items.filter((it) => it.status === "open");

  return (
    <div className="st-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="st-shell">
        <h1 className="st-title">The Studiolo</h1>
        <p className="st-sub">처음 판단과 지금까지 쌓인 판단 사이에서 확인된 것들.</p>

        <div className="st-section">
          <h2>I. 내가 열어둔 판단 공간 — Lectio</h2>
          {lectio.items.length === 0 ? (
            <div className="st-empty">아직 Lectio를 완료하지 않았습니다.</div>
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
          <h2>II · III. 판단이 만들어지는 방식 / 중요한 순간의 판단 — Meditatio</h2>
          {!meditatio.derived ? (
            <div className="st-empty">아직 Meditatio를 완료하지 않았습니다.</div>
          ) : (
            <div className="st-card">{meditatio.derived.narrative}</div>
          )}
        </div>

        <div className="st-section">
          <h2>IV. 판단이 움직였던 순간 — Speculum</h2>
          {speculumSessions.length === 0 ? (
            <div className="st-empty">아직 Speculum 세션이 없습니다. (Speculum 연결은 다음 단계 — 로드맵 4번)</div>
          ) : (
            speculumSessions.map((s) => (
              <div key={s.sessionId} className="st-item">
                <span className="k">{s.personaId}</span>
                {s.initialJudgment} → {s.rejudgment}
              </div>
            ))
          )}
        </div>

        <div className="st-section">
          <h2>V. 나의 Judgment Paths</h2>
          {judgmentPaths.length === 0 ? (
            <div className="st-empty">
              Judgment Path는 Speculum 세션이 쌓인 뒤에 생성됩니다(Final Analysis Architecture v1.2 — Evidence Rule).
            </div>
          ) : (
            judgmentPaths.map((p) => (
              <div key={p.pathId} className="st-card" style={{ marginBottom: 10 }}>
                {p.start?.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
