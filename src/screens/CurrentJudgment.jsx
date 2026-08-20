import React, { useState } from "react";
import { PaperGrain } from "../components/PaperGrain";
import { SectionMark } from "../components/SectionMark";

// claude/돌하나를-얹다-app-spec-v1.md "4. 실제 고민을 가져오는 구간" — 기존 App Shell에는 없던 신설 화면.
// Meditatio 결과와 Speculum(Operation 선택) 사이에 위치한다. 여기서부터 사용자는 "지금까지의 나"에 대한
// 자료가 아니라 지금 실제로 고민 중인 문제 하나를 가져온다. 두 번째 입력(현재 판단)이 이후 Speculum
// Session의 Initial Judgment가 된다(App.jsx가 이 값을 Speculum.jsx로 그대로 넘겨준다).
export default function CurrentJudgment({ onComplete }) {
  const [concern, setConcern] = useState("");
  const [judgment, setJudgment] = useState("");

  const canProceed = concern.trim().length > 0 && judgment.trim().length > 0;

  return (
    <Shell>
      <SectionMark number="03" title="지금의 판단" />
      <p style={bodyStyle}>
        여기까지는 지금까지의 나에 대한 자료를 만드는 과정이었습니다. 여기서부터는 지금 실제로 고민 중인
        문제 하나를 가져옵니다.
      </p>

      <label style={labelStyle}>실제 고민을 적어주세요.</label>
      <textarea
        style={textareaStyle}
        value={concern}
        onChange={(e) => setConcern(e.target.value)}
        placeholder="예: 새로운 일을 맡을지 계속 고민하고 있다."
        rows={3}
      />

      <label style={labelStyle}>그 문제에 대한 현재 판단을 적어주세요.</label>
      <textarea
        style={textareaStyle}
        value={judgment}
        onChange={(e) => setJudgment(e.target.value)}
        placeholder="예: 지금은 맡지 않는 편이 낫다고 생각한다."
        rows={3}
      />

      <button
        style={{ ...primaryButtonStyle, width: "100%", marginTop: 8, opacity: canProceed ? 1 : 0.5 }}
        disabled={!canProceed}
        onClick={() => onComplete({ concern: concern.trim(), initialJudgment: judgment.trim() })}
      >
        다음
      </button>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        position: "relative",
        background: "radial-gradient(120% 90% at 50% 0%, #dde2e2 0%, #d3dade 62%)",
        color: "#1c1a17",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <PaperGrain seed={17} baseFrequency={0.7} octaves={2} opacity={0.13} />
      <div style={{ maxWidth: 460, margin: "0 auto", position: "relative" }}>{children}</div>
    </div>
  );
}

const bodyStyle = { fontSize: 13.5, lineHeight: 1.8, fontWeight: 300, marginBottom: 24, color: "#847c6b" };
const labelStyle = { display: "block", fontSize: 12.5, color: "#847c6b", marginBottom: 8 };
const textareaStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 3,
  background: "rgba(49,53,45,0.035)",
  border: "1px solid rgba(49,53,45,0.14)",
  color: "#1c1a17",
  fontSize: 13.5,
  lineHeight: 1.6,
  fontFamily: "inherit",
  marginBottom: 20,
  boxSizing: "border-box",
  resize: "vertical",
};
const primaryButtonStyle = {
  padding: "12px 20px",
  borderRadius: 3,
  border: "none",
  background: "#1c1a17",
  color: "#eae6da",
  fontSize: 13.5,
  cursor: "pointer",
  fontFamily: "inherit",
};
