import React from "react";
import { useUserState } from "../state/UserStateContext";

const NAV_ITEMS = [
  { key: "lectio", title: "나를 받치는 돌", desc: "나는 나에게 무엇을 허락하고 있는가" },
  { key: "meditatio", title: "판단이 만들어지는 과정", desc: "내가 판단하는 방식을 살펴봅니다" },
  { key: "speculum", title: "다른 역할 입어보기", desc: "지금의 판단에 다른 질문을 얹어봅니다" },
  { key: "studiolo", title: "현재의 돌탑", desc: "지금까지 얹은 돌과, 쌓이면서 드러난 것" },
];

// claude/돌하나를-얹다-app-spec-v1.md 기준 — "돌 하나를 얹다" 홈 화면.
export default function Home({ onNavigate }) {
  const { state } = useUserState();
  const lectioDone = !!state.lectio.completedAt;
  const meditatioDone = !!state.meditatio.completedAt;

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        background: "#eae6da",
        color: "#1c1a17",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 400, fontSize: 22, marginBottom: 6 }}>
          오늘은 무엇을 해볼까요?
        </h1>
        <p style={{ color: "#847c6b", fontSize: 13, marginBottom: 28 }}>
          나를 받치는 돌 {lectioDone ? "완료" : "미완료"} · 판단이 만들어지는 과정 {meditatioDone ? "완료" : "미완료"}
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
                background: "rgba(49,53,45,0.035)",
                border: "1px solid rgba(49,53,45,0.14)",
                color: "#1c1a17",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: 16 }}>{item.title}</div>
              <div style={{ fontSize: 12.5, color: "#847c6b", marginTop: 4 }}>{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
