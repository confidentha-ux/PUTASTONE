import React from "react";

// claude/renaissance-mirror-full-copy-v1.md "## 로그인" — 브랜드명만 "돌 하나를 얹다"로 교체, 문구는 그대로.
// 실제 Google/이메일 인증은 붙어있지 않다(app-build-readiness-v1.md 로드맵 8번, 백엔드는 아직 없음) —
// 버튼을 누르면 인증 없이 바로 다음 화면으로 넘어간다.
export default function Login({ onDone }) {
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
        justifyContent: "center",
        padding: "40px 28px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontWeight: 800, letterSpacing: "-0.02em", fontSize: 26, margin: 0 }}>돌 하나를 얹다</h1>
      <p style={{ color: "#847c6b", fontWeight: 300, fontSize: 14, lineHeight: 1.8, marginTop: 14, marginBottom: 40 }}>
        중요한 선택을 더 자세히 들여다봅니다.
      </p>
      <button
        style={{
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
