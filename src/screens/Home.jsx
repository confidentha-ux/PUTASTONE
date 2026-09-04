import React from "react";
import { useUserState } from "../state/UserStateContext";
import { PaperGrain } from "../components/PaperGrain";

const EXPERIENCES = [
  { key: "lectio", number: "01", title: "나를 받치는 돌", q: "어떤 선택은 왜 나에게 더 어려울까?", doneKey: "lectio" },
  { key: "meditatio", number: "02", title: "내 판단의 지형", q: "나는 무엇을 보고 판단을 내릴까?", doneKey: "meditatio" },
  { key: "speculum", number: "03", title: "다른 역할 입어보기", q: "다른 판단 방식을 써보면 무엇이 달라질까?", doneKey: null },
];

const CSS = `
.hm-card {
  position: relative; background: #f5f2e6; overflow: hidden; text-align: left;
  border: 1px solid rgba(28,26,23,0.14); border-radius: 2px;
  box-shadow: 0 12px 22px rgba(0,0,0,0.16);
  padding: 18px; box-sizing: border-box; width: 100%; cursor: pointer;
  font-family: inherit; display: block;
  mask-image: radial-gradient(circle 3px at 12px 0px, transparent 3px, black 3.5px);
  mask-size: 24px 100%; mask-repeat: repeat-x;
  -webkit-mask-image: radial-gradient(circle 3px at 12px 0px, transparent 3px, black 3.5px);
  -webkit-mask-size: 24px 100%; -webkit-mask-repeat: repeat-x;
}
.hm-card-head { position: relative; display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.hm-card-num { font-size: 11px; font-weight: 700; color: #a13d2e; }
.hm-card-done { font-size: 10.5px; font-weight: 600; color: #847c6b; }
.hm-card-title { position: relative; font-size: 14.5px; font-weight: 800; color: #1c1a17; margin: 0 0 8px; letter-spacing: -0.01em; }
.hm-card-q { position: relative; font-size: 13px; font-weight: 500; color: #1c1a17; line-height: 1.5; margin: 0; }
`;

export default function Home({ onNavigate }) {
  const { state } = useUserState();
  const lectioDone = !!state.lectio.completedAt;
  const meditatioDone = !!state.meditatio.completedAt;
  const doneMap = { lectio: lectioDone, meditatio: meditatioDone };

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        position: "relative",
        background: "#eae6da",
        color: "#1c1a17",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        padding: "40px 20px 32px",
        boxSizing: "border-box",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <PaperGrain seed={41} baseFrequency={0.6} octaves={2} opacity={0.08} />
      <div style={{ position: "relative", maxWidth: 380, margin: "0 auto" }}>
        <p style={{ fontSize: 15, fontWeight: 700, textAlign: "center", margin: "0 0 22px" }}>
          지금까지 쌓인 것부터 살펴봅니다.
        </p>

        <p style={{ fontSize: 12.5, fontWeight: 300, lineHeight: 1.9, color: "#847c6b", textAlign: "center", margin: "0 0 30px" }}>
          먼저
          <br />
          어떤 선택은 자연스럽고, 어떤 선택은 어렵게 느껴지는지 봅니다.
          <br />
          <br />
          그다음
          <br />
          결정할 때 무엇을 먼저 보고, 무엇을 믿고, 어디에서 부담을 느끼는지 살펴봅니다.
          <br />
          <br />
          마지막에는 실제 고민 하나를 가지고
          <br />
          평소에는 쓰지 않던 판단 방식으로 생각해봅니다.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 26 }}>
          {EXPERIENCES.map((exp) => (
            <button key={exp.key} className="hm-card" onClick={() => onNavigate(exp.key)}>
              <PaperGrain seed={43} baseFrequency={0.9} octaves={2} opacity={0.07} />
              <div className="hm-card-head">
                <span className="hm-card-num">{exp.number} · {exp.title}</span>
                {exp.doneKey && doneMap[exp.doneKey] && <span className="hm-card-done">완료</span>}
              </div>
              <p className="hm-card-q">{exp.q}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => onNavigate("studiolo")}
          style={{
            width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
            borderTop: "1px solid rgba(28,26,23,0.14)", paddingTop: 16,
            background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 500, color: "#1c1a17" }}>현재의 돌탑</span>
          <span style={{ fontSize: 11.5, color: "#847c6b" }}>지금까지 쌓인 것 보기 →</span>
        </button>
      </div>
    </div>
  );
}
