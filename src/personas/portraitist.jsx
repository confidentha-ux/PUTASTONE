import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.pr-root { --ground:#e4e2db; --paper:#31352d; --ink:#31352d; --muted:#5f6354; --open:#5c7a5e; --line:rgba(49,53,45,.14);
  flex: 1; min-height: 0; background:radial-gradient(120% 90% at 50% 0%,#f2f0ea 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.pr-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.pr-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.pr-persona { text-align:center; margin-bottom:24px; }
.pr-persona h1 { font-family:'Source Serif 4',serif;  font-size:32px; margin:0; font-weight:500; }
.pr-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.pr-tagline { font-family:'Gowun Batang',serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.pr-persona-header { font-family:'Gowun Batang',serif; font-size:15px; line-height:1.6; color:#2f4530; text-align:center; margin:0 0 20px; font-weight:600; }
.pr-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(92,122,94,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.pr-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.pr-q { font-family:'Gowun Batang',serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.pr-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.pr-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.pr-textarea::placeholder { color:rgba(49,53,45,.28); }
.pr-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.pr-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.pr-opt:hover { background:rgba(49,53,45,.07); }
.pr-opt.sel { background:rgba(92,122,94,.13); border-color:var(--open); color:#2f4530; }
.pr-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#f2f4ef; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.pr-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.pr-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.pr-actions-row { display:flex; align-items:center; gap:14px; }
.pr-actions-row .pr-next { flex:1; }
.pr-summary-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.pr-summary-row { margin-bottom:12px; }
.pr-summary-row:last-child { margin-bottom:0; }
.pr-summary-label { font-size:10.5px; color:#6b6a5c; letter-spacing:.04em; margin-bottom:3px; }
.pr-summary-value { font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.6; }
.pr-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.pr-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:pr-pulse 1.2s infinite ease-in-out; }
.pr-loading .dot:nth-child(2) { animation-delay:.2s; }
.pr-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes pr-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.pr-result-block { margin-bottom:16px; }
.pr-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.pr-result-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.pr-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.pr-final-text { font-size:14px; line-height:1.85; color:#31352d; }
.pr-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.pr-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#f2f4ef; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const Q1_OPTS = ["있다.", "비슷한 일이 떠오른다.", "없다."];
const Q4_OPTS = [
  "내가 한 행동",
  "하지 못한 것",
  "결과나 성과",
  "다른 사람의 반응이나 평가",
  "다른 사람과의 비교",
  "예전부터 가지고 있던 생각",
  "직접 적기",
  "잘 모르겠다",
];
const Q5_OPTS = ["있다.", "바로 떠오르지 않는다.", "없다."];
const Q9_OPTS = [
  "처음과 같은 판단이다.",
  "일부는 같지만 다르게 보이는 부분이 있다.",
  "지금은 자신을 더 넓게 설명하고 싶다.",
  "처음과 다르게 판단한다.",
  "아직 잘 모르겠다.",
];
function q10Prompt(a) {
  switch (a.step9) {
    case "처음과 같은 판단이다.":
      return "지금까지 함께 보아도 처음 판단이 그대로 남는 이유는 무엇입니까?";
    case "일부는 같지만 다르게 보이는 부분이 있다.":
      return "어떤 부분은 그대로이고, 어떤 부분은 다르게 보입니까?";
    case "지금은 자신을 더 넓게 설명하고 싶다.":
      return "지금은 자신을 어떻게 설명하는 것이 더 맞다고 생각합니까?";
    case "처음과 다르게 판단한다.":
      return "무엇을 함께 보면서 자신에 대한 판단이 달라졌습니까?";
    case "아직 잘 모르겠다.":
      return "지금도 자신을 설명하기 어렵게 만드는 것은 무엇입니까?";
    default:
      return "그렇게 정한 이유는 무엇입니까?";
  }
}

function buildResultPrompt(a) {
  const basis = a.step4 === "직접 적기" ? a.step4b : a.step4;
  const hasSecond = a.step5 === "있다.";
  return `당신은 사용자가 한 장면에서 만든 자기규정이 여러 장면과 실제 행동을 함께
놓고 본 뒤 어떻게 됐는지 사실 그대로 정리하는 역할입니다.
"성장했습니다", "더 넓어졌습니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
데이터:
- 처음 경험: "${a.step2}"
- 그 경험에서 만든 자기규정: "${a.step3}"
- 그 자기규정을 만든 근거: "${basis}"
- 두 번째 경험 존재 여부: "${hasSecond ? "있음" : "없음"}"
${hasSecond ? `- 두 번째 경험: "${a.step6}"\n- 처음 경험에서 실제로 한 것: "${a.step7a}"\n- 두 번째 경험에서 실제로 한 것: "${a.step7b}"` : `- 그 경험에서 실제로 한 것: "${a.step7a}"`}
- 여러 모습을 함께 담아 다시 묘사한 자신: "${a.step8}"
- 처음 자기판단에 대한 재검토: "${a.step9}"
- 그 이유: "${a.step10}"
작업:
1. 처음 자기규정(step3)과, 실제 행동과 다른 경험까지 함께 놓고 다시 묘사한 것(step8)을
   나란히 비교할 수 있게 쓰세요.
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을
   지어내지 마세요.
3. "처음과 같은 판단"으로 확인된 경우도 실패가 아니라, 실제 행동까지 함께 본 뒤에도
   같은 자기규정이 맞다고 확인된 결과입니다. 그대로 쓰세요.
4. 제안은 행동 지시가 아니라, 다음에 비슷한 순간에 자신을 판단하게 될 때 살펴볼
   관찰 포인트 하나만 제시하세요.
두 값 모두 반드시 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "처음 경험과 자기규정 / 자기규정을 만든 근거 / (두 번째 경험이 있다면) 두 번째 경험과 각 경험에서 실제로 한 것 / 여러 모습을 함께 담아 다시 묘사한 자신 / 처음 자기판단에 대한 재검토와 이유, 이 내용을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 관찰 포인트 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  hasScene: "",
  step2: "",
  step3: "",
  step4: "", step4b: "",
  step5: "",
  step6: "",
  step7a: "",
  step7b: "",
  step8: "",
  step9: "",
  step10: "",
};

export default function PortraitistLens({ onComplete } = {}) {
  const [step, setStep] = useState("intro");
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [error, setError] = useState(null);
  const set = (k, v) => setAnswers((p) => ({ ...p, [k]: v }));

  async function goToResult() {
    setStep("loading-result");
    setError(null);
    try {
      const raw = await mockCallClaude(buildResultPrompt(answers));
      const parsed = JSON.parse(raw);
      set("summary", parsed.summary);
      set("suggestion", parsed.suggestion);
      setStep("result");
    } catch (e) {
      console.error("goToResult failed:", e);
      setError("결과를 정리하는 중 문제가 생겼습니다. 다시 시도해주세요.");
      setStep("s10");
    }
  }
  function restart() {
    setAnswers(INITIAL_ANSWERS);
    setStep("intro");
  }

  const q4Ready = answers.step4 && (answers.step4 !== "직접 적기" || answers.step4b.trim());
  const hasSecond = answers.step5 === "있다.";
  const basisDisplay = answers.step4 === "직접 적기" ? answers.step4b : answers.step4;

  return (
    <div className="pr-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pr-shell">
        <div className="pr-eyebrow">돌 하나를 얹다</div>
        <div className="pr-persona">
          <h1>초상화가</h1>
          <div className="en">The Portraitist</div>
        </div>

        {step === "intro" && (
          <>
            <p className="pr-tagline">한 번의 일로 나를 정했다면,<br />다른 때의 나는 어땠을까.</p>
            <p className="pr-persona-header">이 경험이 그린 나의 모습을 봅시다.</p>
            <p className="pr-hint">열 개의 질문을 지나갑니다.</p>
            <button className="pr-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <p className="pr-q">최근 어떤 일을 겪고 나서 "나는 원래 이런 사람인가 보다"라고 자신을 판단했던 일이 있었습니까?</p>
            <div className="pr-opts">
              {Q1_OPTS.map((o) => (
                <button key={o} className={`pr-opt ${answers.hasScene === o ? "sel" : ""}`} onClick={() => {
                  set("hasScene", o);
                  setStep(o === "없다." ? "exit" : "s2");
                }}>{o}</button>
              ))}
            </div>
          </>
        )}

        {step === "exit" && (
          <>
            <p className="pr-q">초상화가는 실제로 자신을 판단했던 순간이 있을 때 가장 잘 작동합니다.</p>
            <p className="pr-hint">그런 순간이 떠오르면 다시 시작해주세요. 지금은 다른 렌즈를 먼저 시도해보는 것도 좋습니다.</p>
            <button className="pr-restart" onClick={restart}>처음으로</button>
          </>
        )}

        {step === "s2" && (
          <>
            <button className="pr-back" style={{ marginBottom: 16 }} onClick={() => setStep("s0")}>← 이전</button>
            <div className="pr-step-label">STEP 2</div>
            <p className="pr-q">무슨 일이 있었습니까?</p>
            <textarea className="pr-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} placeholder="예: 회의에서 준비한 말을 제대로 하지 못했다." />
            <div className="pr-actions-row">
              <button className="pr-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="pr-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}

        {step === "s3" && (
          <>
            <div className="pr-step-label">STEP 3</div>
            <div className="pr-subject">"{answers.step2}"</div>
            <p className="pr-q">그 일을 겪고 나서, 자신을 어떤 사람이라고 생각했습니까?</p>
            <textarea className="pr-textarea" value={answers.step3} onChange={(e) => set("step3", e.target.value)} placeholder="예: 나는 중요한 순간에 말을 잘 못하는 사람이다." />
            <div className="pr-actions-row">
              <button className="pr-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="pr-next" disabled={!answers.step3.trim()} onClick={() => setStep("s4")}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && (
          <>
            <div className="pr-step-label">STEP 4</div>
            <div className="pr-subject">"{answers.step3}"</div>
            <p className="pr-q">이 경험에서 무엇을 보고 이렇게 생각했습니까?</p>
            <div className="pr-opts">
              {Q4_OPTS.map((o) => (
                <button key={o} className={`pr-opt ${answers.step4 === o ? "sel" : ""}`} onClick={() => set("step4", o)}>{o}</button>
              ))}
            </div>
            {answers.step4 === "직접 적기" && (
              <textarea className="pr-textarea" value={answers.step4b} onChange={(e) => set("step4b", e.target.value)} placeholder="편하게 적어주세요." />
            )}
            <div className="pr-actions-row">
              <button className="pr-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="pr-next" disabled={!q4Ready} onClick={() => setStep("s5")}>다음</button>
            </div>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="pr-step-label">STEP 5</div>
            <div className="pr-subject">"{answers.step3}"</div>
            <p className="pr-q">이 경험 말고, 자신에 대해 떠오르는 다른 경험이 있습니까?</p>
            <div className="pr-opts">
              {Q5_OPTS.map((o) => (
                <button key={o} className={`pr-opt ${answers.step5 === o ? "sel" : ""}`} onClick={() => {
                  set("step5", o);
                  setStep(o === "있다." ? "s6" : "s7a");
                }}>{o}</button>
              ))}
            </div>
            <div className="pr-actions-row">
              <button className="pr-back" onClick={() => setStep("s4")}>← 이전</button>
            </div>
          </>
        )}

        {step === "s6" && (
          <>
            <div className="pr-step-label">STEP 6</div>
            <div className="pr-subject">"{answers.step3}"</div>
            <p className="pr-q">어떤 일이었습니까?</p>
            <textarea className="pr-textarea" value={answers.step6} onChange={(e) => set("step6", e.target.value)} />
            <div className="pr-actions-row">
              <button className="pr-back" onClick={() => setStep("s5")}>← 이전</button>
              <button className="pr-next" disabled={!answers.step6.trim()} onClick={() => setStep("s7a")}>다음</button>
            </div>
          </>
        )}

        {step === "s7a" && (
          <>
            <div className="pr-step-label">STEP 7</div>
            <div className="pr-subject">"{answers.step2}"</div>
            <p className="pr-q">이 장면에서 당신은 실제로 무엇을 했습니까?</p>
            <textarea className="pr-textarea" value={answers.step7a} onChange={(e) => set("step7a", e.target.value)} />
            <div className="pr-actions-row">
              <button className="pr-back" onClick={() => setStep(hasSecond ? "s6" : "s5")}>← 이전</button>
              <button className="pr-next" disabled={!answers.step7a.trim()} onClick={() => setStep(hasSecond ? "s7b" : "s8")}>다음</button>
            </div>
          </>
        )}

        {hasSecond && step === "s7b" && (
          <>
            <div className="pr-step-label">STEP 7</div>
            <div className="pr-subject">"{answers.step6}"</div>
            <p className="pr-q">이 장면에서는 실제로 무엇을 했습니까?</p>
            <textarea className="pr-textarea" value={answers.step7b} onChange={(e) => set("step7b", e.target.value)} />
            {error && <p className="pr-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="pr-actions-row">
              <button className="pr-back" onClick={() => setStep("s7a")}>← 이전</button>
              <button className="pr-next" disabled={!answers.step7b.trim()} onClick={() => setStep("s8")}>다음</button>
            </div>
          </>
        )}

        {step === "s8" && (
          <>
            <div className="pr-step-label">초상화</div>
            <div className="pr-summary-card">
              {hasSecond ? (
                <>
                  <div className="pr-summary-row">
                    <div className="pr-summary-label">처음 경험</div>
                    <div className="pr-summary-value">{answers.step2}</div>
                  </div>
                  <div className="pr-summary-row">
                    <div className="pr-summary-label">그때 실제로 한 것</div>
                    <div className="pr-summary-value">{answers.step7a}</div>
                  </div>
                  <div className="pr-summary-row">
                    <div className="pr-summary-label">다른 경험</div>
                    <div className="pr-summary-value">{answers.step6}</div>
                  </div>
                  <div className="pr-summary-row">
                    <div className="pr-summary-label">그때 실제로 한 것</div>
                    <div className="pr-summary-value">{answers.step7b}</div>
                  </div>
                  <div className="pr-summary-row">
                    <div className="pr-summary-label">처음 나에게 붙였던 말</div>
                    <div className="pr-summary-value">{answers.step3}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="pr-summary-row">
                    <div className="pr-summary-label">경험</div>
                    <div className="pr-summary-value">{answers.step2}</div>
                  </div>
                  <div className="pr-summary-row">
                    <div className="pr-summary-label">실제로 한 것</div>
                    <div className="pr-summary-value">{answers.step7a}</div>
                  </div>
                  <div className="pr-summary-row">
                    <div className="pr-summary-label">그 경험에서 나에게 붙였던 말</div>
                    <div className="pr-summary-value">{answers.step3}</div>
                  </div>
                </>
              )}
            </div>
            <p className="pr-q">{hasSecond
              ? "이 두 경험에서 보인 모습을 함께 담아 지금의 당신을 묘사한다면, 어떤 사람이라고 하겠습니까?"
              : "그때 실제로 한 것까지 함께 놓고 자신을 다시 묘사한다면, 어떤 사람이라고 하겠습니까?"}</p>
            <textarea className="pr-textarea" value={answers.step8} onChange={(e) => set("step8", e.target.value)} />
            <div className="pr-actions-row">
              <button className="pr-back" onClick={() => setStep(hasSecond ? "s7b" : "s7a")}>← 이전</button>
              <button className="pr-next" disabled={!answers.step8.trim()} onClick={() => setStep("s9")}>다음</button>
            </div>
          </>
        )}

        {step === "s9" && (
          <>
            <div className="pr-step-label">STEP 9</div>
            <div className="pr-subject">"{answers.step3}"</div>
            <p className="pr-q">처음에는 "{answers.step3}"라고 생각했습니다. 지금도 그렇게 생각합니까?</p>
            <div className="pr-opts">
              {Q9_OPTS.map((o) => (
                <button key={o} className={`pr-opt ${answers.step9 === o ? "sel" : ""}`} onClick={() => set("step9", o)}>{o}</button>
              ))}
            </div>
            <div className="pr-actions-row">
              <button className="pr-back" onClick={() => setStep("s8")}>← 이전</button>
              <button className="pr-next" disabled={!answers.step9} onClick={() => setStep("s10")}>다음</button>
            </div>
          </>
        )}

        {step === "s10" && (
          <>
            <div className="pr-step-label">STEP 10</div>
            <div className="pr-subject">"{answers.step3}"</div>
            <p className="pr-q">{q10Prompt(answers)}</p>
            <textarea className="pr-textarea" value={answers.step10} onChange={(e) => set("step10", e.target.value)} />
            {error && <p className="pr-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="pr-actions-row">
              <button className="pr-back" onClick={() => setStep("s9")}>← 이전</button>
              <button className="pr-next" disabled={!answers.step10.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="pr-loading">
            초상화가가 화폭을 정리하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="pr-result-block">
              <div className="pr-result-label">기록된 사실</div>
              <div className="pr-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="pr-final-label">제안</div>
            <div className="pr-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="pr-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="pr-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
