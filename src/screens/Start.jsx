import React from "react";

// claude/돌하나를-얹다-app-spec-v1.md "0. INTRO" 카피 그대로.
// "르네상스의 그 거울" 컨셉을 대체하는 새 이름/인트로 — 2026-08-19 확정.
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
        <h1 style={{ fontFamily: "'Cormorant Garamond', 'Gowun Batang', serif", fontStyle: "italic", fontSize: 30, margin: 0 }}>
          돌 하나를 얹다
        </h1>
        <p style={{ color: "#7d7489", fontSize: 14, lineHeight: 1.9, marginTop: 22, whiteSpace: "pre-line" }}>
          {`산길을 걷다 보면
누가 처음 만들었는지 알 수 없는 돌탑을 만납니다.
누군가 돌 하나를 올리고,
지나가던 누군가가 또 하나를 얹었을 것입니다.

우리의 판단도 그렇게 만들어집니다.
누군가 내게 해준 말,
나에게 보인 반응,
오래 남은 경험,
반복해서 들었던 기준,
그리고 그때마다 내가 내린 선택.

하나씩 쌓인 것들이
지금의 판단을 만들었습니다.

돌 하나를 더 얹어,
지금까지와는 다른 돌탑을 만들어보면 어떤가요?`}
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
