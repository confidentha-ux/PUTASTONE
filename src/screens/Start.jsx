import React from "react";

// claude/돌하나를-얹다-app-spec-v1.md "0. INTRO" 카피 그대로.
// 팔레트(이끼와 화강암)·로고(7개 돌)·레이아웃(제안 A: 여백 재분배) — 2026-08-19 확정 반영.
function StoneMark() {
  return (
    <svg width="60" height="64" viewBox="30 25 180 195" aria-hidden="true">
      <g stroke="#1c1a17" strokeOpacity="0.3" strokeWidth="1" strokeLinejoin="round">
        <path d="M42,196 Q111,181 198,196 Q132,211 42,196 Z" fill="#2b2823" />
        <path d="M49,177 Q123,163 177,177 Q105,191 49,177 Z" fill="#3d3a34" />
        <path d="M75,160 Q121,147 179,160 Q135,173 75,160 Z" fill="#524e46" />
        <path d="M70,121 Q106,109 160,121 Q124,133 70,121 Z" fill="#696459" />
        <path d="M91,99 Q132,88 159,99 Q117,110 91,99 Z" fill="#827c6d" />
        <path d="M94,79 Q110,69 142,79 Q126,89 94,79 Z" fill="#9c9584" />
        <path d="M105,60 Q124,47 135,60 Q116,73 105,60 Z" fill="#b8b09c" />
      </g>
    </svg>
  );
}

export default function Start({ onStart }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
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
      <StoneMark />
      <div style={{ maxWidth: 380, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: 30, margin: 0 }}>
          돌 하나를 얹다
        </h1>
        <p style={{ color: "#847c6b", fontWeight: 300, fontSize: 14, lineHeight: 2, letterSpacing: "0.01em", marginTop: 22, whiteSpace: "pre-line" }}>
          {`산길을 걷다 보면
누가 처음 만들었는지 알 수 없는 돌탑을 만납니다.

한 사람이 돌 하나를 올리고,
지나가던 누군가가 또 하나를 얹었을 것입니다.

우리의 판단도 그렇게 만들어집니다.
누군가 내게 해준 말,
나를 바라보던 반응,
어떤 날의 성공과 실패,
반복해서 들었던 기준,
그리고 그때마다 내가 내린 선택.

그것들이 하나씩 남아
지금 내가 판단하는 모양을 만들었습니다.

여기서는 먼저 지금까지 쌓여온 것을 살펴봅니다.
그리고 지금의 판단에
새로운 질문 하나를 얹어봅니다.

돌 하나가 더해지면
지금까지의 돌탑이 다른 탑이 될지도 모릅니다.`}
        </p>
      </div>
      <button
        onClick={onStart}
        style={{
          padding: "15px 34px",
          borderRadius: 2,
          background: "#1c1a17",
          border: "none",
          color: "#eae6da",
          fontWeight: 600,
          fontSize: 14.5,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        내 돌탑 들여다보기
      </button>
    </div>
  );
}
