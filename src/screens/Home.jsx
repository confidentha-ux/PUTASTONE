import React from "react";
import { useUserState } from "../state/UserStateContext";
import { PaperGrain } from "../components/PaperGrain";

const EXPERIENCES = [
  {
    key: "lectio",
    number: "01",
    title: "나를 받치는 돌",
    q: "나는 나에게 무엇을 허락하고 있는가?",
    desc: "지금 나에게 가능한 선택과 어려운 선택을 살펴봅니다.",
  },
  {
    key: "meditatio",
    number: "02",
    title: "판단이 만들어지는 과정",
    q: "나는 어떻게 하나의 결정을 내릴까?",
    desc: "무엇을 먼저 보고, 무엇을 근거로 삼고, 언제 결론을 내리는지 살펴봅니다.",
  },
  {
    key: "speculum",
    number: "03",
    title: "다른 역할 입어보기",
    q: "같은 고민을 다른 자리에서 보면 무엇이 달라질까?",
    desc: "처음 가져온 고민에 다른 질문을 적용해 새로운 조건과 선택을 살펴봅니다.",
  },
];

const ORDINAL = ["첫", "두", "세"];

const CSS = `
.hm-card {
  position: relative; background: #f5f2e6; overflow: hidden;
  border: 1px solid rgba(28,26,23,0.14); border-radius: 2px;
  box-shadow: 0 16px 30px rgba(0,0,0,0.22);
  padding: 22px 20px; box-sizing: border-box;
  mask-image: radial-gradient(circle 3px at 12px 0px, transparent 3px, black 3.5px);
  mask-size: 24px 100%; mask-repeat: repeat-x;
  -webkit-mask-image: radial-gradient(circle 3px at 12px 0px, transparent 3px, black 3.5px);
  -webkit-mask-size: 24px 100%; -webkit-mask-repeat: repeat-x;
}
.hm-card-num { position: relative; font-size: 11px; font-weight: 700; color: #a13d2e; margin: 0 0 8px; }
.hm-card-title { position: relative; font-size: 15px; font-weight: 800; color: #1c1a17; margin: 0 0 10px; letter-spacing: -0.01em; }
.hm-card-q { position: relative; font-size: 13px; font-weight: 500; color: #1c1a17; line-height: 1.5; margin: 0 0 8px; }
.hm-card-desc { position: relative; font-size: 12px; font-weight: 300; color: #847c6b; line-height: 1.7; margin: 0; }
.hm-ghost { position: absolute; left: 6%; right: 6%; top: 0; bottom: 0; border-radius: 2px; border: 1px solid rgba(28,26,23,0.08); }
`;

export default function Home({ onNavigate }) {
  const { state } = useUserState();
  const lectioDone = !!state.lectio.completedAt;
  const meditatioDone = !!state.meditatio.completedAt;

  const frontIdx = !lectioDone ? 0 : !meditatioDone ? 1 : 2;
  const front = EXPERIENCES[frontIdx];

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
        <p style={{ fontSize: 17, fontWeight: 700, textAlign: "center", margin: "0 0 12px", lineHeight: 1.4 }}>
          하나의 고민을 세 번 다르게 바라봅니다.
        </p>
        <p style={{ fontSize: 12.5, fontWeight: 300, lineHeight: 1.9, color: "#847c6b", textAlign: "center", margin: "0 0 32px" }}>
          나에게 가능한 선택을 먼저 살펴보고,
          <br />
          내가 판단하는 과정을 확인한 뒤,
          <br />
          처음 가져온 고민을 다른 자리에서 다시 바라봅니다.
        </p>

        <div style={{ position: "relative", height: 190, marginBottom: 22 }}>
          {frontIdx < 2 && (
            <div className="hm-ghost" style={{ background: "#ece7d6", transform: "rotate(3deg) translateY(4px)" }} />
          )}
          {frontIdx < 1 && (
            <div className="hm-ghost" style={{ background: "#f0ecdd", transform: "rotate(-2deg) translateY(2px)" }} />
          )}
          <div className="hm-card" style={{ position: "absolute", inset: 0 }}>
            <PaperGrain seed={43} baseFrequency={0.9} octaves={2} opacity={0.08} />
            <p className="hm-card-num">{front.number}</p>
            <p className="hm-card-title">{front.title}</p>
            <p className="hm-card-q">{front.q}</p>
            <p className="hm-card-desc">{front.desc}</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate(front.key)}
          style={{
            width: "100%", padding: 15, borderRadius: 2, marginBottom: 26,
            background: "rgba(28,26,23,0.92)", border: "none", color: "#eae6da",
            fontWeight: 600, fontSize: 14, fontFamily: "inherit", cursor: "pointer",
          }}
        >
          {ORDINAL[frontIdx]} 번째 돌 놓기
        </button>

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
