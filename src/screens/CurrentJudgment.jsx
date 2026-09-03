import React, { useState } from "react";
import { PaperGrain } from "../components/PaperGrain";
import { SectionMark } from "../components/SectionMark";

// "4. CurrentJudgment" 확정본 — 입력 화면과 확인 화면을 분리했다.
// 화면 1(요즘 마음에 있는 일)에서 입력 받고, 화면 2(내가 이야기한 것)에서 그대로 보여준 뒤에만
// onComplete가 불린다 — 사용자가 자기가 쓴 걸 한 번 더 보고 다음으로 넘어가는 구조.
export default function CurrentJudgment({ onComplete }) {
  const [step, setStep] = useState("input"); // "input" | "confirm"
  const [concern, setConcern] = useState("");
  const [judgment, setJudgment] = useState("");

  const canProceed = concern.trim().length > 0 && judgment.trim().length > 0;

  if (step === "confirm") {
    return (
      <Shell>
        <SectionMark number="03" title="지금의 판단" />
        <p style={titleStyle}>내가 이야기한 것</p>

        <Row label="마음에 있는 일" value={concern} />
        <Row label="지금은 이렇게 생각하고 있습니다" value={judgment} />

        <p style={{ ...bodyStyle, marginTop: 4 }}>
          이 생각을 시작점으로 남겨둡니다. 가면을 벗은 뒤 같은 고민에 다시 답합니다.
        </p>

        <button
          style={{ ...primaryButtonStyle, width: "100%", marginTop: 8 }}
          onClick={() => onComplete({ concern: concern.trim(), initialJudgment: judgment.trim() })}
        >
          다음
        </button>
      </Shell>
    );
  }

  return (
    <Shell>
      <SectionMark number="03" title="지금의 판단" />
      <p style={titleStyle}>요즘 마음에 있는 일</p>
      <p style={bodyStyle}>계속 생각하게 되는 일이 있다면 여기에서 먼저 이야기해 주세요.</p>

      <label style={labelStyle}>어떤 일인가요?</label>
      <textarea
        style={textareaStyle}
        value={concern}
        onChange={(e) => setConcern(e.target.value)}
        placeholder="예: 새로운 일을 맡을지 계속 고민하고 있다."
        rows={3}
      />

      <label style={labelStyle}>이 일에 대해 지금은 어떻게 생각하고 있나요?</label>
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
        onClick={() => setStep("confirm")}
      >
        다음
      </button>
    </Shell>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={labelStyle}>{label}</div>
      <div style={quoteBoxStyle}>{value}</div>
    </div>
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

const titleStyle = { fontFamily: "Pretendard, sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 14 };
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
const quoteBoxStyle = {
  padding: "12px 14px",
  borderRadius: 3,
  background: "rgba(49,53,45,0.035)",
  border: "1px solid rgba(49,53,45,0.14)",
  fontSize: 13.5,
  lineHeight: 1.6,
  whiteSpace: "pre-line",
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
