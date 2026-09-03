import React from "react";
import { PaperGrain } from "../components/PaperGrain";

// "5. 마무리" 확정본. 어디서 이 화면으로 들어오는지는 문서에 명시되어 있지 않아서(현재의 돌탑
// 화면의 버튼 목록엔 "새로운 고민 이야기하기"만 있음), 일단 컴포넌트만 만들어두고 실제 진입
// 지점은 다음에 확인받고 연결한다. onDone은 "현재의 돌탑 보기" 버튼에 연결한다.
export default function Ending({ onDone }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        position: "relative",
        background: "#eae6da",
        color: "#1c1a17",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        padding: "48px 24px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <PaperGrain seed={61} baseFrequency={0.55} octaves={2} opacity={0.09} />
      <div style={{ position: "relative", maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: "-0.01em", marginBottom: 26 }}>
          여러 판단 방식을 가질수록
        </p>

        <p style={bodyStyle}>
          여러 가면을 경험하면 같은 문제를 여러 판단 방식으로 생각해볼 수 있습니다.
        </p>
        <p style={bodyStyle}>필요한 순간에는 그중 한 가지를 다시 꺼내 쓸 수 있습니다.</p>
        <p style={leadStyle}>
          상황에 맞는 판단 방식을 스스로 고를 수 있는 것. 우리는 그것을 성숙한 판단방식을 만들어가는
          과정이라고 생각합니다.
        </p>
        <p style={bodyStyle}>
          그것이 이 앱이 당신에게 해주고 싶은 일이고, 아마 당신이 지금까지 이 앱을 사용해온 이유이기도
          할 것입니다.
        </p>
        <p style={bodyStyle}>
          필요할 때는 같은 고민에 다른 가면을 써보거나, 전에 쓴 가면을 다시 꺼내볼 수 있습니다.
        </p>

        <button
          style={{
            marginTop: 20,
            padding: "13px 28px",
            borderRadius: 2,
            border: "none",
            background: "rgba(28,26,23,0.92)",
            color: "#eae6da",
            fontSize: 13.5,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          onClick={onDone}
        >
          현재의 돌탑 보기
        </button>
      </div>
    </div>
  );
}

const bodyStyle = { fontSize: 13, fontWeight: 300, lineHeight: 1.9, color: "#847c6b", marginBottom: 16 };
const leadStyle = { fontSize: 14, fontWeight: 500, lineHeight: 1.8, color: "#1c1a17", marginBottom: 16 };
