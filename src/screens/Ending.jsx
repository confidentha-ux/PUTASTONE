import React from "react";
import { PaperGrain } from "../components/PaperGrain";

// "첫 여정을 마치며" — 01·02·03을 처음 한 바퀴 돈 뒤, 현재의 돌탑에 처음 들어가기 전에만 보여준다
// (App.jsx가 이 조건을 판별한다). 필러 문장 없이: 질문 세 개(입력 없이 읽고 넘어감) → 왜 이걸
// 했는지(원칙) → 이제부터 뭘 하면 되는지(순서 없이 자유롭게 시작 가능하다는, 실제로 몰랐을 정보).
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
        <p style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: "-0.01em", marginBottom: 30 }}>
          첫 여정을 마치며
        </p>

        <p style={questionStyle}>나에 대해 새롭게 알게 된 것이 있었는가?</p>
        <p style={questionStyle}>내가 이런 기준으로 판단하고 있다는 것을, 알고 있었는가?</p>
        <p style={{ ...questionStyle, marginBottom: 32 }}>
          이런 질문들을 지나오면서, 나는 어떤 마음이 들었는가?
        </p>

        <div style={{ height: 1, background: "rgba(28,26,23,0.14)", margin: "0 0 28px" }} />

        <p style={bodyStyle}>
          나를 받치는 돌, 내 판단의 지형, 다른 돌을 얹어보기 — 이 세 가지를 거치며 본 것은 전부 나
          자신이었습니다.
        </p>
        <p style={leadStyle}>
          다른 사람의 기준이 아니라, 나 자신을 기준으로 판단을 다시 보는 것. 이것이 돌 하나를
          얹다가 하고 싶었던 일입니다.
        </p>
        <p style={bodyStyle}>
          이제부터는 순서대로 하지 않아도 됩니다. 마음에 걸리는 일이 생기면, 언제든 다른 돌을
          얹어보기부터 시작해도 됩니다.
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

const questionStyle = { fontSize: 15, fontWeight: 500, lineHeight: 1.8, color: "#1c1a17", marginBottom: 14 };
const bodyStyle = { fontSize: 13, fontWeight: 300, lineHeight: 1.9, color: "#847c6b", marginBottom: 16 };
const leadStyle = { fontSize: 14, fontWeight: 500, lineHeight: 1.8, color: "#1c1a17", marginBottom: 16 };
