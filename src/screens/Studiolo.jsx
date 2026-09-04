import React, { useEffect, useState } from "react";
import { useUserState } from "../state/UserStateContext";
import { PERSONA_REGISTRY } from "../speculum/personaRegistry";
import { PaperGrain } from "../components/PaperGrain";
import { SectionMark } from "../components/SectionMark";
import { AXIS_LABEL, AXIS_MEANING } from "../components/Lectio";
import { generateStudioloPattern } from "../state/studioloSynthesis";

// "현재의 돌탑" — 3섹션(나를 받치는 돌 / 내 판단의 지형 / 새로 얹어본 돌) + 지금까지 보이는 결.
// 안내문은 적석/호석 원칙: 여기 쌓이는 돌은 완료된 기록이 아니라 그 순간의 소망이고, 예전 돌은
// 지금의 판단으로 허물지 않는다는 것 (2026-09-04 하경 님과 확정).

function formatSessionDate(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const CSS = `
.st-root { flex: 1; min-height: 0; position: relative; background: radial-gradient(120% 90% at 50% 0%, #efe6d0 0%, #e8dcc0 62%); color: #1c1a17; font-family: Pretendard, -apple-system, sans-serif; padding: 32px 20px 60px; box-sizing: border-box; }
.st-shell { max-width: 560px; margin: 0 auto; }
.st-principle { position: relative; font-size: 13px; font-weight: 300; line-height: 2; color: #6b6656; white-space: pre-line; margin: 24px 0 32px; padding-bottom: 28px; border-bottom: 1px solid rgba(49,53,45,0.12); }
.st-section { margin-bottom: 30px; }
.st-section h2 { font-family: Pretendard, sans-serif; font-size: 16px; font-weight: 700; color: #1c1a17; margin: 0 0 6px; }
.st-section-sub { font-size: 12px; color: #847c6b; margin: 0 0 14px; }
.st-card { background: rgba(49,53,45,0.04); border: 1px solid rgba(49,53,45,0.14); border-radius: 4px; padding: 16px 18px; font-size: 13.5px; line-height: 1.8; white-space: pre-line; }
.st-empty { color: #847c6b; font-size: 13px; }
.st-guide { color: #847c6b; font-size: 12.5px; line-height: 1.8; margin-top: 12px; }
.st-tag-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.st-tag { font-size: 11px; padding: 4px 9px; border-radius: 20px; border: 1px solid rgba(49,53,45,0.14); color: #847c6b; }
.st-more { display: inline-block; margin-top: 12px; padding: 9px 16px; border-radius: 2px; border: 1px solid rgba(49,53,45,0.25); background: none; color: #1c1a17; font-size: 12.5px; cursor: pointer; font-family: inherit; }
.st-session-card { background: rgba(49,53,45,0.04); border: 1px solid rgba(49,53,45,0.14); border-radius: 4px; padding: 16px 18px; margin-bottom: 12px; }
.st-session-title { font-size: 13.5px; font-weight: 500; margin-bottom: 10px; }
.st-session-meta { font-size: 11.5px; color: #847c6b; margin-bottom: 4px; }
.st-session-feedback { font-size: 12.5px; line-height: 1.7; color: #1c1a17; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(49,53,45,0.1); }
.st-session-date { font-size: 11px; color: #a89e88; margin-top: 8px; }
`;

export default function Studiolo({ onNavigate }) {
  const { state } = useUserState();
  const { lectio, meditatio, speculumSessions } = state;

  const closedItems = lectio.items.filter((it) => it.status === "closed");
  const openItems = lectio.items.filter((it) => it.status === "open");
  const recentSessions = [...speculumSessions].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));

  // "지금까지 보이는 결" — 01·02·여러 03 세션을 함께 봤을 때 반복되는 패턴. 재료가 될 데이터가
  // 최소한(닫힌 항목 2개 이상 또는 세션 2개 이상) 쌓였을 때만 시도한다.
  const [pattern, setPattern] = useState(undefined);
  const hasEnoughForPattern = closedItems.length >= 2 || speculumSessions.length >= 2;

  useEffect(() => {
    if (!hasEnoughForPattern || pattern !== undefined) return;
    setPattern(null);
    generateStudioloPattern({ lectio, meditatio, speculumSessions }).then(setPattern);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasEnoughForPattern]);

  return (
    <div className="st-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <PaperGrain seed={31} baseFrequency={0.5} octaves={2} opacity={0.13} />
      <div className="st-shell">
        <SectionMark number="05" title="현재의 돌탑" />

        <p className="st-principle">
          이곳에 얹는 돌 하나는
          완료된 판단이 아니라, 이 순간 마음을 담아 얹는 소원에 가깝습니다.
          {"\n\n"}이런 사람이 되고 싶다는 마음으로
          돌 하나를 얹어보는 것과 같습니다.
          {"\n\n"}지금까지 쌓인 돌탑은 허물지 않습니다.
          그 모양이 지금의 나를 만들었고,
          그래서 그 모양 그대로 특별합니다.
          {"\n\n"}그러나 그 모습이 조금씩 달라지기를 바라는 마음도
          똑같이 나의 마음입니다.
        </p>

        <div className="st-section">
          <h2>나를 받치는 돌</h2>
          <p className="st-section-sub">어떤 선택까지 내가 실제로 검토할 수 있는지 보여줍니다.</p>
          {lectio.items.length === 0 ? (
            <div className="st-empty">아직 나를 받치는 돌을 완료하지 않았습니다.</div>
          ) : (
            <div className="st-card">
              자연스럽게 선택하는 것 {openItems.length}개, 어렵게 느껴지는 것 {closedItems.length}개.
              {lectio.dominantDomain && (
                <>
                  {"\n"}어려움 안에서 반복해서 나타난 것: {AXIS_LABEL[lectio.dominantDomain.domain] ?? lectio.dominantDomain.domain}
                  {" — "}
                  {AXIS_MEANING[lectio.dominantDomain.domain] ?? ""}
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
          {onNavigate && (
            <button className="st-more" onClick={() => onNavigate("lectio")}>나를 받치는 돌 자세히 보기</button>
          )}
        </div>

        <div className="st-section">
          <h2>내 판단의 지형</h2>
          <p className="st-section-sub">내가 판단할 때 반복해서 사용하는 자리와 흐름을 보여줍니다.</p>
          {!meditatio.derived ? (
            <div className="st-empty">아직 내 판단의 지형을 확인하지 않았습니다.</div>
          ) : (
            <div className="st-card">{meditatio.derived.narrative}</div>
          )}
          {onNavigate && (
            <button className="st-more" onClick={() => onNavigate("meditatio")}>내 판단의 지형 자세히 보기</button>
          )}
        </div>

        <div className="st-section">
          <h2>새로 얹어본 돌</h2>
          <p className="st-section-sub">
            실제 고민에 다른 판단 방식을 사용하면서 새롭게 판단에 들어온 것과 그때 보인 판단 방식을
            남깁니다.
          </p>
          {recentSessions.length === 0 ? (
            <div className="st-empty">아직 얹어본 돌이 없습니다.</div>
          ) : (
            recentSessions.map((s) => (
              <div key={s.sessionId} className="st-session-card">
                <div className="st-session-title">{s.initialJudgment || "—"}</div>
                <div className="st-session-meta">
                  사용한 역할 — {PERSONA_REGISTRY[s.personaId]?.koreanName ?? s.personaId}
                </div>
                {s.reflection && <div className="st-session-feedback">{s.reflection}</div>}
                <div className="st-session-date">{formatSessionDate(s.timestamp)}</div>
              </div>
            ))
          )}
          {onNavigate && (
            <button className="st-more" onClick={() => onNavigate("speculum")}>다른 돌 하나 얹어보기</button>
          )}
        </div>

        <div className="st-section">
          <h2>지금까지 보이는 결</h2>
          {!hasEnoughForPattern && (
            <p className="st-guide">
              돌이 더 쌓이면 여러 선택과 고민에서 반복해서 나타나는 판단 방식이 이곳에 하나씩
              연결됩니다.
            </p>
          )}
          {hasEnoughForPattern && pattern === null && (
            <p className="st-guide">지금까지의 답을 함께 살펴보는 중입니다…</p>
          )}
          {hasEnoughForPattern && pattern && (
            <div className="st-card">
              지금까지의 답을 함께 보면,{"\n"}
              <b>당신의 판단에는 이런 결이 있습니다.</b>
              {"\n\n"}
              {pattern}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
