import React from "react";
import { PaperGrain } from "../components/PaperGrain";

// claude/온보딩 "3. 사용목적" — 브랜드명만 "돌 하나를 얹다"로 교체, 문구는 그대로.
export default function Purpose({ onDone }) {
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
      <PaperGrain seed={5} baseFrequency={0.75} octaves={2} opacity={0.14} />
      <div style={{ position: "relative", maxWidth: 380, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ fontWeight: 300, fontSize: 14, lineHeight: 2, letterSpacing: "0.01em", color: "#847c6b", whiteSpace: "pre-line" }}>
          {`우리는 매일 크고 작은 판단을 내립니다.

어떤 것은 쉽게 결정하고, 어떤 것은 오래 고민합니다.
같은 상황에서도 무엇을 먼저 보고, 무엇을 중요하게 여기느냐에 따라 판단은 달라집니다.`}
        </p>
        <p style={{ fontWeight: 500, fontSize: 15, lineHeight: 1.9, color: "#1c1a17", marginTop: 22 }}>
          돌 하나를 얹다는 당신이 어떤 판단을 내리고, 그 판단이 어떤 기준과 과정을 거쳐 만들어지는지
          들여다볼 수 있도록 돕습니다.
        </p>
        <p style={{ fontWeight: 300, fontSize: 14, lineHeight: 2, letterSpacing: "0.01em", color: "#847c6b", marginTop: 22 }}>
          여러 장면과 실제 고민을 지나며, 당신의 판단이 어디에서 시작되고 무엇에 의해 움직이는지
          발견하게 됩니다.
        </p>
      </div>
      <button
        style={{
          position: "relative",
          width: "100%", maxWidth: 320, padding: 16, borderRadius: 2,
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
