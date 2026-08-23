import React from "react";
import { PaperGrain } from "../components/PaperGrain";

function StoneMark() {
  return (
    <svg width="52" height="56" viewBox="30 25 180 195" aria-hidden="true">
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

// claude/renaissance-mirror-full-copy-v1.md "## 로그인" — 브랜드명만 "돌 하나를 얹다"로 교체, 문구는 그대로.
// 실제 Google/이메일 인증은 붙어있지 않다(app-build-readiness-v1.md 로드맵 8번, 백엔드는 아직 없음) —
// 버튼을 누르면 인증 없이 바로 다음 화면으로 넘어간다.
export default function Login({ onDone }) {
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
        justifyContent: "center",
        padding: "40px 28px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <PaperGrain seed={2} baseFrequency={0.85} octaves={2} opacity={0.14} />
      <div style={{ position: "relative", marginBottom: 18 }}>
        <StoneMark />
      </div>
      <h1 style={{ position: "relative", fontWeight: 800, letterSpacing: "-0.02em", fontSize: 26, margin: 0 }}>돌 하나를 얹다</h1>
      <p style={{ position: "relative", color: "#847c6b", fontWeight: 300, fontSize: 14, lineHeight: 1.9, marginTop: 18, marginBottom: 40, whiteSpace: "pre-line" }}>
        {`생각을 오래 했는데도
비슷한 선택을 반복하고 있나요?

내가 어떤 기준으로 판단하는지 살펴보고,
평소에는 떠올리지 않았던 방식으로도 생각해봅니다.

그렇게 경험한 판단 방법은
필요한 순간에 다시 꺼내 쓸 수 있게 쌓입니다.`}
      </p>
      <button
        style={{
          position: "relative",
          width: "100%", maxWidth: 320, padding: 15, borderRadius: 2, marginBottom: 10,
          background: "rgba(28,26,23,0.92)", border: "none", color: "#eae6da",
          fontWeight: 600, fontSize: 14.5, fontFamily: "inherit", cursor: "pointer",
        }}
        onClick={onDone}
      >
        Google로 계속하기
      </button>
      <button
        style={{
          position: "relative",
          width: "100%", maxWidth: 320, padding: 15, borderRadius: 2,
          background: "transparent", border: "1px solid rgba(49,53,45,0.3)", color: "#1c1a17",
          fontWeight: 600, fontSize: 14.5, fontFamily: "inherit", cursor: "pointer",
        }}
        onClick={onDone}
      >
        이메일로 계속하기
      </button>
    </div>
  );
}
