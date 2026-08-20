import React from "react";

// claude/돌하나를-얹다-app-spec-v1.md "0. INTRO" 카피 그대로.
// 팔레트(이끼와 화강암)·로고(7개 돌)·레이아웃(제안 A: 여백 재분배) — 2026-08-19 확정 반영.
function StoneMark() {
  return (
    <svg width="60" height="64" viewBox="30 25 180 195" aria-hidden="true">
      <g stroke="#8c8672" strokeOpacity="0.35" strokeWidth="1" strokeLinejoin="round">
        <path d="M42,196 Q111,181 198,196 Q132,211 42,196 Z" fill="#a5a293" />
        <path d="M49,177 Q123,163 177,177 Q105,191 49,177 Z" fill="#b0ac9c" />
        <path d="M75,160 Q121,147 179,160 Q135,173 75,160 Z" fill="#bdb9a9" />
        <path d="M70,121 Q106,109 160,121 Q124,133 70,121 Z" fill="#cac6b4" />
        <path d="M91,99 Q132,88 159,99 Q117,110 91,99 Z" fill="#d8d3bf" />
        <path d="M94,79 Q110,69 142,79 Q126,89 94,79 Z" fill="#e4dfc9" />
        <path d="M105,60 Q124,47 135,60 Q116,73 105,60 Z" fill="#efeadb" />
      </g>
      <ellipse cx="60" cy="200" rx="14" ry="8" fill="#5c7a5e" opacity="0.88" transform="rotate(-15 60 200)" />
      <ellipse cx="85" cy="148" rx="9" ry="5" fill="#5c7a5e" opacity="0.8" transform="rotate(-10 85 148)" />
    </svg>
  );
}

export default function Start({ onStart }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        background: "radial-gradient(120% 90% at 50% 0%, #f2f0ea 0%, #e4e2db 62%)",
        color: "#31352d",
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
        <h1 style={{ fontFamily: "'Source Serif 4', 'Gowun Batang', serif", fontSize: 30, margin: 0 }}>
          돌 하나를 얹다
        </h1>
        <p style={{ color: "#5f6354", fontSize: 14, lineHeight: 1.9, marginTop: 22, whiteSpace: "pre-line" }}>
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
          background: "#5c7a5e",
          border: "none",
          color: "#f2f4ef",
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
