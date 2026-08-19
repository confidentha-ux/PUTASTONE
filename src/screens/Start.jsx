import React from "react";

// claude/renaissance-mirror-full-copy-v1.md "## 시작" 카피 그대로.
export default function Start({ onStart }) {
  return (
    <div
      style={{
        minHeight: "100%",
        background: "radial-gradient(120% 90% at 50% 0%, #241d2f 0%, #16131c 62%)",
        color: "#ece7de",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
        boxSizing: "border-box",
        gap: 26,
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 380 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', 'Gowun Batang', serif", fontStyle: "italic", fontSize: 34, margin: 0 }}>
          르네상스의 그 거울
        </h1>
        <p style={{ color: "#7d7489", fontSize: 14, lineHeight: 1.9, marginTop: 22 }}>
          우리는 매일 선택하고 결정합니다.
          <br />
          어떤 선택은 자연스럽고, 어떤 선택에는 조건이 필요합니다.
          <br />
          <br />
          중요한 일을 결정할 때는 무엇을 먼저 고려하고, 무엇을 확인하며,
          어디에서 오래 생각하는지도 사람마다 다릅니다.
          <br />
          <br />
          르네상스의 그 거울에서는 내가 어떤 선택을 하고 있는지 보고,
          중요한 결정을 어떻게 내리는지 확인하고,
          실제 고민에 다른 질문을 적용해 내 판단의 사각지대를 찾아봅니다.
        </p>
      </div>
      <button
        onClick={onStart}
        style={{
          padding: "15px 34px",
          borderRadius: 2,
          background: "#d6a756",
          border: "none",
          color: "#1b1509",
          fontWeight: 600,
          fontSize: 14.5,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        시작하기
      </button>
    </div>
  );
}
