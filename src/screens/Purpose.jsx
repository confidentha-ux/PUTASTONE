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
        <p style={{ fontWeight: 500, fontSize: 15, lineHeight: 1.9, color: "#1c1a17" }}>
          돌 하나를 얹다는 내가 나 자신에게 무엇을 허락하고, 어떤 기준과 과정을 거쳐 판단하는지
          살펴보는 앱입니다.
        </p>
        <p style={{ fontWeight: 300, fontSize: 14, lineHeight: 2, letterSpacing: "0.01em", color: "#847c6b", marginTop: 22 }}>
          실제 선택과 고민을 통해 무엇이 내 판단에 중요하게 작용하는지, 그리고 어떤 조건과 새로운
          관점에서 다른 판단이 가능해지는지 직접 확인합니다.
        </p>
        <p style={{ fontWeight: 300, fontSize: 14, lineHeight: 2, letterSpacing: "0.01em", color: "#847c6b", marginTop: 22 }}>
          이 경험이 쌓이면 내가 판단하는 방식과 그 판단이 달라지는 지점을 더 구체적으로 볼 수
          있습니다.
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
