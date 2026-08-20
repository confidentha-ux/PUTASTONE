import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.or-root { --ground:#e4e2db; --paper:#31352d; --ink:#31352d; --muted:#5f6354; --open:#5c7a5e; --line:rgba(49,53,45,.14);
  flex: 1; min-height: 0; background:radial-gradient(120% 90% at 50% 0%,#f2f0ea 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.or-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.or-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.or-persona { text-align:center; margin-bottom:24px; }
.or-persona h1 { font-family:'Source Serif 4',serif;  font-size:32px; margin:0; font-weight:500; }
.or-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.or-tagline { font-family:'Gowun Batang',serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.or-persona-header { font-family:'Gowun Batang',serif; font-size:15px; line-height:1.6; color:#2f4530; text-align:center; margin:0 0 20px; font-weight:600; }
.or-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(92,122,94,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.or-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.or-q { font-family:'Gowun Batang',serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.or-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.or-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.or-textarea::placeholder { color:rgba(49,53,45,.28); }
.or-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.or-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.or-opt:hover { background:rgba(49,53,45,.07); }
.or-opt.sel { background:rgba(92,122,94,.13); border-color:var(--open); color:#2f4530; }
.or-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#f2f4ef; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.or-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.or-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.or-actions-row { display:flex; align-items:center; gap:14px; }
.or-actions-row .or-next { flex:1; }
.or-summary-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.or-summary-row { margin-bottom:12px; }
.or-summary-row:last-child { margin-bottom:0; }
.or-summary-label { font-size:10.5px; color:#6b6a5c; letter-spacing:.04em; margin-bottom:3px; }
.or-summary-value { font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.6; }
.or-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.or-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:or-pulse 1.2s infinite ease-in-out; }
.or-loading .dot:nth-child(2) { animation-delay:.2s; }
.or-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes or-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.or-result-block { margin-bottom:16px; }
.or-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.or-result-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.or-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.or-final-text { font-size:14px; line-height:1.85; color:#31352d; }
.or-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.or-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#f2f4ef; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const SAMPLE_JUDGMENT = "지금 결정하기엔 아직 이른 것 같아.";

const Q4_OPTS = [
  "시간이 지나야 알 수 있다.",
  "지금도 확인할 수 있다.",
  "일부는 지금 확인할 수 있고, 일부는 시간이 필요하다.",
  "어떻게 알 수 있는지 아직 잘 모르겠다.",
];
const Q5_PROMPT = {
  "시간이 지나야 알 수 있다.": (cond) => `시간이 지나면서 무엇을 보게 되면 "${cond}"을 알 수 있다고 생각합니까?`,
  "지금도 확인할 수 있다.": () => "지금 확인한다면, 무엇을 확인할 수 있습니까?",
  "일부는 지금 확인할 수 있고, 일부는 시간이 필요하다.": () => "지금 확인할 수 있는 것과 시간이 지나야 알 수 있는 것은 각각 무엇입니까?",
  "어떻게 알 수 있는지 아직 잘 모르겠다.": () => "지금 기다리고 있는 것이 정확히 무엇인지 다시 말해본다면 무엇입니까?",
};
const Q6_OPTS = [
  "지금처럼 기다린다.",
  "기다리되, 확인할 수 있는 것은 먼저 확인한다.",
  "기다리지 않고 지금 확인해본다.",
  "아직 정하기 어렵다.",
];
const Q7_PROMPT = {
  "지금처럼 기다린다.": "이렇게 확인해본 뒤에도 기다리는 것이 필요하다고 생각하는 이유는 무엇입니까?",
  "기다리되, 확인할 수 있는 것은 먼저 확인한다.": "무엇은 지금 확인하고, 무엇은 기다리는 것이 맞다고 생각합니까?",
  "기다리지 않고 지금 확인해본다.": "무엇을 보면서 기다리기보다 지금 확인하는 쪽으로 판단이 달라졌습니까?",
  "아직 정하기 어렵다.": "시간이 필요한 것과 지금 확인할 수 있는 것을 살펴본 뒤에도 무엇이 판단을 어렵게 만듭니까?",
};

function buildResultPrompt(a) {
  return `당신은 사용자가 기다림을 어떻게 다루기로 했는지 사실 그대로
정리하는 역할입니다.
"현명한 선택입니다", "용기 있는 결정입니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
데이터:
- 처음 판단: "${a.judgment}"
- 결정을 위해 기다리고 있는 것: "${a.step2}"
- 그것을 알 수 있는 방식: "${a.step3}"
- 실제로 확인해야 하는 것: "${a.step4}"
- 재판단: "${a.step6}"
- 그 이유: "${a.step7}"
작업:
1. step6(재판단)이 다음 네 가지 중 무엇인지 먼저 확정하세요: "지금처럼 기다린다" / "기다리되, 확인할 수 있는 것은 먼저 확인한다" / "기다리지 않고 지금 확인해본다" / "아직 정하기 어렵다".
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을 지어내지 마세요.
3. "지금처럼 기다린다"인 경우: 확인 가능한 것을 뜯어보고도 기다리기로 했다는 사실 그대로 쓰세요. 이건 실패가 아니라 그 자체로 하나의 결과입니다.
4. "확인할 수 있는 것은 먼저 확인한다"인 경우: 무엇을 지금 확인하고 무엇을 기다리기로 나눴는지 step7 내용 그대로 쓰세요.
5. "지금 확인해본다"인 경우: 무엇을 보면서 지금 확인하는 쪽으로 판단이 달라졌는지 step7 내용 그대로 쓰세요.
6. "아직 정하기 어렵다"인 경우: 무엇이 여전히 판단을 어렵게 만드는지 step7 내용 그대로 쓰세요. 이것도 실패가 아니라 지금 시점의 정직한 결과입니다.
7. 제안은 행동 지시가 아니라, 다음에 이 기다림을 다시 마주칠 때 살펴볼 관찰 포인트 하나만 제시하세요.
두 경우 모두 반드시 summary와 suggestion을 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "처음 판단 / 기다리고 있는 것 / 그것을 알 수 있는 방식 / 실제로 확인해야 하는 것 / 재판단과 그 이유, 이 다섯 줄을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 제안 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  judgment: SAMPLE_JUDGMENT,
  hasScene: null,
  step1: "",
  step2: "",
  step3: "",
  step4: "",
  step6: "",
  step7: "",
};

export default function OracleLens({ onComplete } = {}) {
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
      setStep("s6");
    }
  }
  function restart() {
    setAnswers(INITIAL_ANSWERS);
    setStep("intro");
  }

  return (
    <div className="or-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="or-shell">
        <div className="or-eyebrow">돌 하나를 얹다</div>
        <div className="or-persona">
          <h1>웨이팅 리스트</h1>
          <div className="en">The Oracle</div>
        </div>

        {step === "intro" && (
          <>
            <p className="or-tagline">기다리면 정말 알게 되는 게 있을까.</p>
            <p className="or-persona-header">기다리면 실제로 무엇이 달라지는지 봅시다.</p>
            <div className="or-subject">"{answers.judgment}"</div>
            <p className="or-hint">일곱 개의 질문을 지나갑니다.</p>
            <button className="or-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <button className="or-back" style={{ marginBottom: 16 }} onClick={() => setStep("intro")}>← 이전</button>
            <div className="or-subject">"{answers.judgment}"</div>
            <p className="or-q">이 생각이 들었던 구체적인 순간이 있었습니까?</p>
            <div className="or-opts">
              <button className="or-opt" onClick={() => { set("hasScene", true); setStep("s1"); }}>있다.</button>
              <button className="or-opt" onClick={() => { set("hasScene", false); setStep("s1"); }}>특별히 떠오르는 순간은 없다.</button>
            </div>
          </>
        )}

        {step === "s1" && answers.hasScene === true && (
          <>
            <div className="or-step-label">STEP 1</div>
            <div className="or-subject">"{answers.judgment}"</div>
            <p className="or-q">그 순간으로 돌아가 보겠습니다. 그때 무엇을 결정해야 했습니까?</p>
            <p className="or-hint">어떤 상황이었는지 적어주세요.</p>
            <textarea className="or-textarea" value={answers.step1} onChange={(e) => set("step1", e.target.value)} placeholder="여기에 적어주세요." />
            <div className="or-actions-row">
              <button className="or-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="or-next" disabled={!answers.step1.trim()} onClick={() => setStep("s2")}>다음</button>
            </div>
          </>
        )}
        {step === "s1" && answers.hasScene === false && (
          <>
            <div className="or-step-label">STEP 1</div>
            <div className="or-subject">"{answers.judgment}"</div>
            <p className="or-hint" style={{ marginBottom: 6 }}>이 문장을 고르셨습니다.</p>
            <p className="or-q">무엇을 보고 이 문장이 나와 가깝다고 느끼셨습니까?</p>
            <p className="or-hint">떠오르는 게 없다면, 앞으로 그런 순간이 온다면 어떨지 상상해서 적어도 됩니다.</p>
            <textarea className="or-textarea" value={answers.step1} onChange={(e) => set("step1", e.target.value)} placeholder="여기에 적어주세요." />
            <div className="or-actions-row">
              <button className="or-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="or-next" disabled={!answers.step1.trim()} onClick={() => setStep("s2")}>다음</button>
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <div className="or-step-label">STEP 2</div>
            <div className="or-subject">"{answers.judgment}"</div>
            <p className="or-q">무엇이 달라지면, "이제는 결정할 수 있다"고 말할 것 같습니까?</p>
            <textarea className="or-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} />
            <div className="or-actions-row">
              <button className="or-back" onClick={() => setStep("s1")}>← 이전</button>
              <button className="or-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}

        {step === "s3" && (
          <>
            <div className="or-step-label">STEP 3</div>
            <div className="or-subject">"{answers.judgment}"</div>
            <p className="or-q">방금 말한 "{answers.step2}"은 어떻게 알 수 있는 것입니까?</p>
            <div className="or-opts">
              {Q4_OPTS.map((o) => (
                <button key={o} className={`or-opt ${answers.step3 === o ? "sel" : ""}`} onClick={() => set("step3", o)}>{o}</button>
              ))}
            </div>
            <div className="or-actions-row">
              <button className="or-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="or-next" disabled={!answers.step3} onClick={() => setStep("s4")}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && (
          <>
            <div className="or-step-label">STEP 4</div>
            <div className="or-subject">"{answers.judgment}"</div>
            <p className="or-q">{(Q5_PROMPT[answers.step3] || (() => "실제로 무엇을 확인할 수 있습니까?"))(answers.step2)}</p>
            <textarea className="or-textarea" value={answers.step4} onChange={(e) => set("step4", e.target.value)} />
            {error && <p className="or-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="or-actions-row">
              <button className="or-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="or-next" disabled={!answers.step4.trim()} onClick={() => setStep("s5")}>다음</button>
            </div>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="or-step-label">병치</div>
            <div className="or-summary-card">
              <div className="or-summary-row">
                <div className="or-summary-label">결정을 위해 기다리고 있는 것</div>
                <div className="or-summary-value">{answers.step2}</div>
              </div>
              <div className="or-summary-row">
                <div className="or-summary-label">그것을 알 수 있는 방식</div>
                <div className="or-summary-value">{answers.step3}</div>
              </div>
              <div className="or-summary-row">
                <div className="or-summary-label">실제로 확인해야 하는 것</div>
                <div className="or-summary-value">{answers.step4}</div>
              </div>
            </div>
            <p className="or-q">이렇게 놓고 보니, 지금도 같은 방식으로 기다리시겠습니까?</p>
            <div className="or-opts">
              {Q6_OPTS.map((o) => (
                <button key={o} className={`or-opt ${answers.step6 === o ? "sel" : ""}`} onClick={() => set("step6", o)}>{o}</button>
              ))}
            </div>
            <div className="or-actions-row">
              <button className="or-back" onClick={() => setStep("s4")}>← 이전</button>
              <button className="or-next" disabled={!answers.step6} onClick={() => setStep("s6")}>다음</button>
            </div>
          </>
        )}

        {step === "s6" && (
          <>
            <div className="or-step-label">STEP 5</div>
            <div className="or-subject">"{answers.judgment}"</div>
            <p className="or-q">{Q7_PROMPT[answers.step6] || "그렇게 판단한 이유는 무엇입니까?"}</p>
            <textarea className="or-textarea" value={answers.step7} onChange={(e) => set("step7", e.target.value)} />
            {error && <p className="or-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="or-actions-row">
              <button className="or-back" onClick={() => setStep("s5")}>← 이전</button>
              <button className="or-next" disabled={!answers.step7.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="or-loading">
            시간을 정리하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="or-result-block">
              <div className="or-result-label">기록된 사실</div>
              <div className="or-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="or-final-label">제안</div>
            <div className="or-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="or-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="or-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
