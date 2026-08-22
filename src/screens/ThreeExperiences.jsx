import React from "react";
import { PaperGrain } from "../components/PaperGrain";

// claude/renaissance-mirror-full-copy-v1.md "## 세 가지 경험" — 라틴어 이름(Lectio/Meditatio/Speculum)만
// 확정된 한국어 섹션명(선택/판단/다른 역할)으로 교체, 설명 문장은 그대로.
const EXPERIENCES = [
  { name: "나를 받치는 돌", q: "나는 나에게 무엇을 허락하고 있는가?", desc: "14개의 구체적인 선택을 통해 지금의 나를 받치고 있는 가장 아래의 돌부터 살펴봅니다." },
  { name: "판단이 만들어지는 과정", q: "나는 어떻게 하나의 결정을 내릴까?", desc: "무엇을 먼저 고려하고, 무엇을 근거로 삼고, 언제 결론을 내리는지 확인합니다." },
  { name: "다른 역할 입어보기", q: "이 고민에서 내가 놓치고 있는 것은 무엇일까?", desc: "하나의 실제 고민에 서로 다른 질문을 적용합니다." },
];

export default function ThreeExperiences({ onDone }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(120% 90% at 50% 0%, #f2eee0 0%, #eae6da 62%)",
        color: "#1c1a17",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "48px 28px 40px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <PaperGrain seed={9} baseFrequency={0.6} octaves={3} opacity={0.14} />
      <div style={{ position: "relative", maxWidth: 380, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30 }}>
        <p style={{ fontWeight: 300, fontSize: 14, color: "#847c6b", margin: 0 }}>
          돌 하나를 얹다에는 세 가지 경험이 있습니다.
        </p>
        {EXPERIENCES.map((exp) => (
          <div key={exp.name} style={{ borderTop: "1px solid rgba(28,26,23,0.14)", paddingTop: 18 }}>
            <p style={{ fontWeight: 800, fontSize: 15, margin: "0 0 8px" }}>{exp.name}</p>
            <p style={{ fontWeight: 500, fontSize: 15, lineHeight: 1.6, margin: "0 0 8px" }}>{exp.q}</p>
            <p style={{ fontWeight: 300, fontSize: 13, lineHeight: 1.8, color: "#847c6b", margin: 0 }}>{exp.desc}</p>
          </div>
        ))}
      </div>
      <button
        style={{
          position: "relative",
          width: "100%", maxWidth: 320, padding: 16, borderRadius: 2, marginTop: 30,
          background: "rgba(28,26,23,0.92)", border: "none", color: "#eae6da",
          fontWeight: 600, fontSize: 15, fontFamily: "inherit", cursor: "pointer",
        }}
        onClick={onDone}
      >
        시작하기
      </button>
    </div>
  );
}
