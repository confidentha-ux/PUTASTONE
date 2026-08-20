import React, { useState } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.gn-root { --ground:#eae6da; --paper:#1c1a17; --ink:#1c1a17; --muted:#847c6b; --open:#1c1a17; --line:rgba(49,53,45,.14);
  flex: 1; min-height: 0; background:radial-gradient(120% 90% at 50% 0%,#f2eee0 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.gn-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.gn-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.gn-persona { text-align:center; margin-bottom:24px; }
.gn-persona h1 { font-family:Pretendard,sans-serif;  font-size:32px; margin:0; font-weight:500; }
.gn-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.gn-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(28,26,23,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.gn-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.gn-q { font-family:Pretendard,sans-serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.gn-persona-header { font-family:Pretendard,sans-serif; font-size:15px; line-height:1.6; color:#1c1a17; text-align:center; margin:0 0 20px; font-weight:600; }
.gn-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.gn-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.gn-textarea::placeholder { color:rgba(49,53,45,.28); }
.gn-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.gn-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.gn-opt:hover { background:rgba(49,53,45,.07); }
.gn-opt.sel { background:rgba(28,26,23,.13); border-color:var(--open); color:#1c1a17; }
.gn-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.gn-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.gn-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.gn-actions-row { display:flex; align-items:center; gap:14px; }
.gn-actions-row .gn-next { flex:1; }
.gn-condition-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:20px;
  font-family:Pretendard,sans-serif; font-size:15.5px; line-height:1.75; margin-bottom:20px; box-shadow:0 10px 26px rgba(0,0,0,.3); }
.gn-condition-label { font-size:11px; color:#6b6a5c; font-family:Pretendard,sans-serif; margin-bottom:8px; letter-spacing:.04em; }
.gn-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.gn-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const INPUT_OPTIONS = ["시간", "체력", "신경", "돈", "다른 일을 할 기회", "잘 모르겠다", "직접 적기"];
const DISPLACED_OPTIONS = ["내 일", "다른 사람과의 일", "쉬는 것", "새로 해보고 싶은 것", "챙겨야 할 다른 일", "없다", "직접 적기"];
const REJUDGE_OPTIONS = ["그렇다.", "계속하되 조금 바꾸고 싶다.", "더는 지금처럼 계속하고 싶지 않다.", "잘 모르겠다."];

function reasonQuestion(rejudgment) {
  switch (rejudgment) {
    case "그렇다.":
      return "그래도 계속하는 것이 중요하다고 생각하는 이유는 무엇입니까?";
    case "계속하되 조금 바꾸고 싶다.":
      return "무엇을 바꾸고 싶습니까?";
    case "더는 지금처럼 계속하고 싶지 않다.":
      return "무엇을 보고 생각이 달라졌습니까?";
    default:
      return "지금 결정하기 어렵게 만드는 것은 무엇입니까?";
  }
}

export default function GeneralLens({ onComplete } = {}) {
  const [step, setStep] = useState("intro");
  const [answers, setAnswers] = useState({
    hasTask: null,
    continuing: "",
    input: "",
    displaced: "",
    rejudgment: "",
    reason: "",
  });
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [useCustomDisplaced, setUseCustomDisplaced] = useState(false);
  const [customDisplaced, setCustomDisplaced] = useState("");

  const set = (k, v) => setAnswers((p) => ({ ...p, [k]: v }));

  function restart() {
    setAnswers({
      hasTask: null,
      continuing: "",
      input: "",
      displaced: "",
      rejudgment: "",
      reason: "",
    });
    setUseCustomInput(false);
    setCustomInput("");
    setUseCustomDisplaced(false);
    setCustomDisplaced("");
    setStep("intro");
  }

  return (
    <div className="gn-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="gn-shell">
        <div className="gn-eyebrow">돌 하나를 얹다</div>
        <div className="gn-persona">
          <h1>물류관리자</h1>
          <div className="en">The General</div>
        </div>

        {step === "intro" && (
          <>
            <p className="gn-persona-header">계속하는 동안 무엇이 자리를 차지하는지 봅시다.</p>
            <p className="gn-q">지금 하고 있는 선택을 바꾸지 않는다고 가정해봅시다.</p>
            <p className="gn-hint">그대로 계속했을 때 무엇이 함께 따라오는지 보겠습니다.</p>
            <button className="gn-next" onClick={() => setStep("s1")}>시작하기</button>
          </>
        )}

        {step === "s1" && (
          <>
            <div className="gn-step-label">STEP 1</div>
            <p className="gn-q">요즘 "내가 계속 해야 한다"고 생각하며 하고 있는 일이 있습니까?</p>
            <div className="gn-opts">
              <button className="gn-opt" onClick={() => { set("hasTask", true); setStep("s1a"); }}>있다.</button>
              <button className="gn-opt" onClick={() => { set("hasTask", false); setStep("s1a"); }}>잘 모르겠다.</button>
            </div>
          </>
        )}

        {step === "s1a" && (
          <>
            <div className="gn-step-label">STEP 1</div>
            {answers.hasTask === false && (
              <p className="gn-hint">지금 당장 뚜렷하지 않다면, 요즘 자꾸 반복하고 있는 일을 하나 떠올려도 됩니다.</p>
            )}
            <p className="gn-q">무엇입니까?</p>
            <textarea className="gn-textarea" value={answers.continuing} onChange={(e) => set("continuing", e.target.value)} placeholder="예: 부모님의 일을 내가 계속 챙긴다" />
            <div className="gn-actions-row">
              <button className="gn-back" onClick={() => setStep("s1")}>← 이전</button>
              <button className="gn-next" disabled={!answers.continuing.trim()} onClick={() => setStep("s2")}>다음</button>
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <div className="gn-step-label">STEP 2</div>
            <div className="gn-condition-card" style={{ fontSize: 14, padding: "14px 16px", marginBottom: 20 }}>
              <div className="gn-condition-label">계속하고 있는 것입니다</div>
              {answers.continuing}
            </div>
            <p className="gn-q">그 일을 계속하면서 가장 많이 쓰고 있는 것은 무엇입니까?</p>
            {!useCustomInput && (
              <div className="gn-opts">
                {INPUT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={`gn-opt${answers.input === opt ? " sel" : ""}`}
                    onClick={() => {
                      if (opt === "직접 적기") {
                        setUseCustomInput(true);
                      } else {
                        set("input", opt);
                        setStep("s3");
                      }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {useCustomInput && (
              <>
                <textarea className="gn-textarea" value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="직접 적어보세요" />
                <div className="gn-actions-row">
                  <button className="gn-back" onClick={() => setUseCustomInput(false)}>← 보기에서 고를게요</button>
                  <button className="gn-next" disabled={!customInput.trim()} onClick={() => { set("input", customInput); setStep("s3"); }}>다음</button>
                </div>
              </>
            )}
          </>
        )}

        {step === "s3" && (
          <>
            <div className="gn-step-label">STEP 3</div>
            <div className="gn-condition-card" style={{ fontSize: 14, padding: "14px 16px", marginBottom: 20 }}>
              <div className="gn-condition-label">가장 많이 쓰고 있는 것입니다</div>
              {answers.input}
            </div>
            <p className="gn-q">그 일을 계속하느라 요즘 못 하고 있거나 미루고 있는 것이 있습니까?</p>
            {!useCustomDisplaced && (
              <div className="gn-opts">
                {DISPLACED_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={`gn-opt${answers.displaced === opt ? " sel" : ""}`}
                    onClick={() => {
                      if (opt === "직접 적기") {
                        setUseCustomDisplaced(true);
                      } else {
                        set("displaced", opt);
                        setStep("s4");
                      }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {useCustomDisplaced && (
              <>
                <textarea className="gn-textarea" value={customDisplaced} onChange={(e) => setCustomDisplaced(e.target.value)} placeholder="직접 적어보세요" />
                <div className="gn-actions-row">
                  <button className="gn-back" onClick={() => setUseCustomDisplaced(false)}>← 보기에서 고를게요</button>
                  <button className="gn-next" disabled={!customDisplaced.trim()} onClick={() => { set("displaced", customDisplaced); setStep("s4"); }}>다음</button>
                </div>
              </>
            )}
          </>
        )}

        {step === "s4" && (
          <>
            <div className="gn-step-label">STEP 4</div>
            <div className="gn-condition-card">
              <div className="gn-condition-label">계속하고 있는 것</div>
              {answers.continuing}
              <br /><br />
              <div className="gn-condition-label">그 때문에 미루고 있는 것</div>
              {answers.displaced}
            </div>
            <p className="gn-q">둘을 같이 보니, 지금처럼 계속하는 것이 맞다고 생각합니까?</p>
            <div className="gn-opts">
              {REJUDGE_OPTIONS.map((opt) => (
                <button key={opt} className={`gn-opt${answers.rejudgment === opt ? " sel" : ""}`} onClick={() => { set("rejudgment", opt); setStep("s5"); }}>{opt}</button>
              ))}
            </div>
            <div className="gn-actions-row">
              <button className="gn-back" onClick={() => setStep("s3")}>← 이전</button>
            </div>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="gn-step-label">STEP 5</div>
            <div className="gn-condition-card" style={{ fontSize: 14, padding: "14px 16px", marginBottom: 20 }}>
              <div className="gn-condition-label">방금 답하신 내용입니다</div>
              {answers.rejudgment}
            </div>
            <p className="gn-q">{reasonQuestion(answers.rejudgment)}</p>
            <textarea className="gn-textarea" value={answers.reason} onChange={(e) => set("reason", e.target.value)} />
            <div className="gn-actions-row">
              <button className="gn-back" onClick={() => setStep("s4")}>← 이전</button>
              <button className="gn-next" disabled={!answers.reason.trim()} onClick={() => setStep("result")}>결과 보기</button>
            </div>
          </>
        )}

        {step === "result" && (
          <>
            <div className="gn-condition-card">
              <div className="gn-condition-label">계속하고 있는 것</div>
              {answers.continuing}
              <br /><br />
              <div className="gn-condition-label">가장 많이 쓰고 있는 것</div>
              {answers.input}
              <br /><br />
              <div className="gn-condition-label">그 때문에 미루고 있는 것</div>
              {answers.displaced}
              <br /><br />
              <div className="gn-condition-label">다시 내린 판단</div>
              {answers.rejudgment}
              <br />
              {answers.reason}
            </div>
            {onComplete && (
              <button className="gn-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="gn-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
