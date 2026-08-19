import React from "react";
import { useUserState } from "../state/UserStateContext";

const NAV_ITEMS = [
  { key: "lectio", title: "Lectio", desc: "내가 가능하다고 보는 것" },
  { key: "meditatio", title: "Meditatio", desc: "내 판단을 읽어보기" },
  { key: "speculum", title: "Speculum", desc: "같은 판단을 다른 렌즈로 다시 보기" },
  { key: "studiolo", title: "The Studiolo", desc: "지금까지 발견한 나의 판단" },
];

// 구조 문서 7번 "HOME" — Speculum은 Family Routing까지 연결되어 있다(18개 persona 질문지 실행은 아직).
export default function Home({ onNavigate }) {
  const { state } = useUserState();
  const lectioDone = !!state.lectio.completedAt;
  const meditatioDone = !!state.meditatio.completedAt;

  return (
    <div
      style={{
        minHeight: "100%",
        background: "#16131c",
        color: "#ece7de",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Gowun Batang', serif", fontWeight: 400, fontSize: 22, marginBottom: 6 }}>
          오늘은 무엇을 해볼까요?
        </h1>
        <p style={{ color: "#7d7489", fontSize: 13, marginBottom: 28 }}>
          Lectio {lectioDone ? "완료" : "미완료"} · Meditatio {meditatioDone ? "완료" : "미완료"}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              style={{
                textAlign: "left",
                padding: "18px 18px",
                borderRadius: 3,
                background: "rgba(236,231,222,0.035)",
                border: "1px solid rgba(236,231,222,0.14)",
                color: "#ece7de",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <div style={{ fontFamily: "'Gowun Batang', serif", fontSize: 16 }}>{item.title}</div>
              <div style={{ fontSize: 12.5, color: "#7d7489", marginTop: 4 }}>{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
