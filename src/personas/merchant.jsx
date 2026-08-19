import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.mc-root { --ground:#16131c; --paper:#ece7de; --ink:#221d2b; --muted:#7d7489; --open:#d6a756; --line:rgba(236,231,222,.14);
  min-height:100%; background:radial-gradient(120% 90% at 50% 0%,#241d2f 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.mc-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.mc-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.mc-persona { text-align:center; margin-bottom:24px; }
.mc-persona h1 { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:32px; margin:0; font-weight:500; }
.mc-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.mc-tagline { font-family:'Gowun Batang',serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.mc-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(214,167,86,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.mc-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.mc-q { font-family:'Gowun Batang',serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.mc-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.mc-textarea { width:100%; min-height:80px; background:rgba(236,231,222,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.mc-textarea::placeholder { color:rgba(236,231,222,.28); }
.mc-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.mc-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(236,231,222,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.mc-opt:hover { background:rgba(236,231,222,.07); }
.mc-opt.sel { background:rgba(214,167,86,.13); border-color:var(--open); color:#f6ecda; }
.mc-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#1b1509; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.mc-next:disabled { background:rgba(236,231,222,.07); color:var(--muted); cursor:default; }
.mc-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.mc-actions-row { display:flex; align-items:center; gap:14px; }
.mc-actions-row .mc-next { flex:1; }
.mc-summary-card { background:linear-gradient(160deg,#f2eee6,#e4ded3); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.mc-summary-row { margin-bottom:12px; }
.mc-summary-row:last-child { margin-bottom:0; }
.mc-summary-label { font-size:10.5px; color:#8a8070; letter-spacing:.04em; margin-bottom:3px; }
.mc-summary-value { font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.6; }
.mc-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.mc-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:mc-pulse 1.2s infinite ease-in-out; }
.mc-loading .dot:nth-child(2) { animation-delay:.2s; }
.mc-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes mc-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.mc-result-block { margin-bottom:16px; }
.mc-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.mc-result-card { background:linear-gradient(160deg,#f2eee6,#e4ded3); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.mc-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.mc-final-text { font-size:14px; line-height:1.85; color:#e8e2d6; }
.mc-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.mc-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#1b1509; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;
/* 데모용 — 실제로는 Lectio에서 가져옴 */
const SAMPLE_JUDGMENT = "계속하면 괜찮아질지도 몰라.";

const Q5_OPTS = ["있다.", "없다.", "잘 모르겠다."];
const Q6_OPTS = [
  "지금처럼 계속한다.",
  "계속하되, 내놓는 정도를 바꾸고 싶다.",
  "다른 선택을 하고 싶다.",
  "아직 정하기 어렵다.",
];
const Q7_PROMPT = {
  "지금처럼 계속한다.": "이 거래를 함께 보아도 지금처럼 계속하는 것이 맞다고 생각하는 이유는 무엇입니까?",
  "계속하되, 내놓는 정도를 바꾸고 싶다.": "무엇을 지금보다 덜 내놓거나 다르게 내놓고 싶습니까?",
  "다른 선택을 하고 싶다.": "무엇을 함께 보았을 때 판단이 달라졌습니까?",
  "아직 정하기 어렵다.": "이 거래를 함께 보아도 아직 결정하기 어렵게 만드는 것은 무엇입니까?",
};

function buildResultPrompt(a) {
  const displaced = a.step5 === "없다." ? "특별히 뒤로 밀리고 있다고 느끼는 것은 없음" : a.step5b;
  return `당신은 사용자가 계속 내놓고 있는 것과 얻으려는 것, 그리고 그동안 뒤로 밀린
것을 사실 그대로 정리하는 역할입니다.
"성장했습니다", "현명한 선택입니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
"내놓다"라는 동사로 일관되게 쓰세요. "쓰다", "치르다", "잃다" 등으로
바꿔 쓰지 마세요.
데이터:
- 처음 판단: "${a.judgment}"
- 계속하고 있는 일: "${a.step2}"
- 계속 내놓고 있는 것: "${a.step3}"
- 얻기를 기대하는 것: "${a.step4}"
- 그동안 뒤로 밀린 것: "${displaced}"
- 거래를 함께 본 뒤의 재판단: "${a.step6}"
- 그 이유: "${a.step7}"
- 처음에는 보이지 않았지만 지금 보이는 것: "${a.step8}"
작업:
1. step6(재판단)을 근거로 어떤 선택을 했는지 먼저 확정하세요.
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을
   지어내지 마세요.
3. 뒤로 밀린 것이 "없음"으로 확인된 경우도 실패가 아니라 그 자체로 하나의 결과이니,
   그대로 쓰세요.
4. 제안은 행동 지시가 아니라, 다음에 이 거래를 다시 마주칠 때 살펴볼 관찰
   포인트 하나만 제시하세요.
두 값 모두 반드시 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "계속하고 있는 일 / 계속 내놓고 있는 것 / 얻기를 기대하는 것 / 그동안 뒤로 밀린 것 / 거래를 함께 본 뒤의 재판단과 이유, 이 다섯 줄을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 관찰 포인트 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  judgment: SAMPLE_JUDGMENT,
  hasScene: null,
  step2: "",
  step3: "",
  step4: "",
  step5: "", step5b: "",
  step6: "",
  step7: "",
  step8: "",
};

export default function MerchantLens({ onComplete } = {}) {
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
      setStep("s8");
    }
  }
  function restart() {
    setAnswers(INITIAL_ANSWERS);
    setStep("intro");
  }

  const q5Ready = answers.step5 === "없다." || (answers.step5 && answers.step5b.trim());

  return (
    <div className="mc-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mc-shell">
        <div className="mc-eyebrow">르네상스의 그 거울 · III</div>
        <div className="mc-persona">
          <h1>대상인</h1>
          <div className="en">The Merchant</div>
        </div>

        {step === "intro" && (
          <>
            <p className="mc-tagline">이걸 계속하려고 나는 뭘 쓰고 있고,<br />그 대신 뭘 놓치고 있을까.</p>
            <div className="mc-subject">"{answers.judgment}"</div>
            <p className="mc-hint">여덟 개의 질문을 지나갑니다.</p>
            <button className="mc-next" onClick={() => setStep("s1")}>시작하기</button>
          </>
        )}

        {step === "s1" && (
          <>
            <button className="mc-back" style={{ marginBottom: 16 }} onClick={() => setStep("intro")}>← 이전</button>
            <div className="mc-subject">"{answers.judgment}"</div>
            <p className="mc-q">이 생각이 들었던 구체적인 순간이 있었습니까?</p>
            <div className="mc-opts">
              <button className="mc-opt" onClick={() => { set("hasScene", true); setStep("s2"); }}>있다.</button>
              <button className="mc-opt" onClick={() => { set("hasScene", false); setStep("s2"); }}>특별히 떠오르는 순간은 없다.</button>
            </div>
          </>
        )}

        {step === "s2" && answers.hasScene === true && (
          <>
            <div className="mc-step-label">STEP 2</div>
            <div className="mc-subject">"{answers.judgment}"</div>
            <p className="mc-q">그때, 계속하고 있던 일은 무엇이었습니까?</p>
            <p className="mc-hint">무슨 일이 있었는지 적어주세요.</p>
            <textarea className="mc-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} placeholder="예: 오래 준비한 자격시험에서 계속 떨어졌다." />
            <div className="mc-actions-row">
              <button className="mc-back" onClick={() => setStep("s1")}>← 이전</button>
              <button className="mc-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}
        {step === "s2" && answers.hasScene === false && (
          <>
            <div className="mc-step-label">STEP 2</div>
            <div className="mc-subject">"{answers.judgment}"</div>
            <p className="mc-q">요즘 '조금 더 계속하면 나아질지도 모른다'고 생각하며 계속하고 있는 일이 있습니까?</p>
            <p className="mc-hint">있다면 무엇인지 적어주세요.</p>
            <textarea className="mc-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} placeholder="예: 조금만 더 하면 나아지겠지 하고 스스로 다독이며 계속하는 일." />
            <div className="mc-actions-row">
              <button className="mc-back" onClick={() => setStep("s1")}>← 이전</button>
              <button className="mc-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}

        {step === "s3" && (
          <>
            <div className="mc-step-label">STEP 3</div>
            <div className="mc-subject">"{answers.judgment}"</div>
            <p className="mc-q">{answers.step2}을(를) 계속하기 위해, 지금 가장 많이 내놓고 있는 것은 무엇입니까?</p>
            <p className="mc-hint">시간, 돈, 체력처럼 떠오르는 것을 구체적으로 적어주세요.</p>
            <textarea className="mc-textarea" value={answers.step3} onChange={(e) => set("step3", e.target.value)} />
            <div className="mc-actions-row">
              <button className="mc-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="mc-next" disabled={!answers.step3.trim()} onClick={() => setStep("s4")}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && (
          <>
            <div className="mc-step-label">STEP 4</div>
            <div className="mc-subject">"{answers.judgment}"</div>
            <p className="mc-q">그것을 계속 내놓으면서, 무엇을 얻기를 기대하고 있습니까?</p>
            <p className="mc-hint">잘 모르겠다면, 이 일을 계속하지 않았을 때 무엇이 가장 아쉬울지 생각해보세요.</p>
            <textarea className="mc-textarea" value={answers.step4} onChange={(e) => set("step4", e.target.value)} />
            <div className="mc-actions-row">
              <button className="mc-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="mc-next" disabled={!answers.step4.trim()} onClick={() => setStep("s5")}>다음</button>
            </div>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="mc-step-label">STEP 5</div>
            <div className="mc-subject">"{answers.judgment}"</div>
            <p className="mc-q">{answers.step2}을(를) 계속하느라, 실제로 미루거나 하지 못하고 있는 것이 있습니까?</p>
            <div className="mc-opts">
              {Q5_OPTS.map((o) => (
                <button key={o} className={`mc-opt ${answers.step5 === o ? "sel" : ""}`} onClick={() => set("step5", o)}>{o}</button>
              ))}
            </div>
            {answers.step5 === "있다." && (
              <textarea className="mc-textarea" value={answers.step5b} onChange={(e) => set("step5b", e.target.value)} placeholder="무엇입니까?" />
            )}
            {answers.step5 === "잘 모르겠다." && (
              <textarea className="mc-textarea" value={answers.step5b} onChange={(e) => set("step5b", e.target.value)} placeholder={`그 일에 지금 쓰고 있는 ${answers.step3}을(를) 다른 데 쓸 수 있다면, 가장 먼저 떠오르는 것은 무엇입니까?`} />
            )}
            {error && <p className="mc-hint" style={{ color: "#e08a8a" }}>{error}</p>}
            <div className="mc-actions-row">
              <button className="mc-back" onClick={() => setStep("s4")}>← 이전</button>
              <button className="mc-next" disabled={!q5Ready} onClick={() => setStep("s6")}>다음</button>
            </div>
          </>
        )}

        {step === "s6" && (
          <>
            <div className="mc-step-label">거래 화면</div>
            <div className="mc-summary-card">
              <div className="mc-summary-row">
                <div className="mc-summary-label">계속하고 있는 것</div>
                <div className="mc-summary-value">{answers.step2}</div>
              </div>
              <div className="mc-summary-row">
                <div className="mc-summary-label">계속 내놓고 있는 것</div>
                <div className="mc-summary-value">{answers.step3}</div>
              </div>
              <div className="mc-summary-row">
                <div className="mc-summary-label">얻기를 기대하는 것</div>
                <div className="mc-summary-value">{answers.step4}</div>
              </div>
              <div className="mc-summary-row">
                <div className="mc-summary-label">그동안 뒤로 밀린 것</div>
                <div className="mc-summary-value">{answers.step5 === "없다." ? "특별히 뒤로 밀리고 있다고 느끼는 것은 없음" : answers.step5b}</div>
              </div>
            </div>
            <p className="mc-q">이 거래를 함께 놓고 보니, 지금도 같은 방식으로 계속하시겠습니까?</p>
            <div className="mc-opts">
              {Q6_OPTS.map((o) => (
                <button key={o} className={`mc-opt ${answers.step6 === o ? "sel" : ""}`} onClick={() => set("step6", o)}>{o}</button>
              ))}
            </div>
            <div className="mc-actions-row">
              <button className="mc-back" onClick={() => setStep("s5")}>← 이전</button>
              <button className="mc-next" disabled={!answers.step6} onClick={() => setStep("s7")}>다음</button>
            </div>
          </>
        )}

        {step === "s7" && (
          <>
            <div className="mc-step-label">STEP 7</div>
            <div className="mc-subject">"{answers.judgment}"</div>
            <p className="mc-q">{Q7_PROMPT[answers.step6] || "그렇게 판단한 이유는 무엇입니까?"}</p>
            <textarea className="mc-textarea" value={answers.step7} onChange={(e) => set("step7", e.target.value)} />
            <div className="mc-actions-row">
              <button className="mc-back" onClick={() => setStep("s6")}>← 이전</button>
              <button className="mc-next" disabled={!answers.step7.trim()} onClick={() => setStep("s8")}>다음</button>
            </div>
          </>
        )}

        {step === "s8" && (
          <>
            <div className="mc-step-label">STEP 8</div>
            <div className="mc-subject">"{answers.judgment}"</div>
            <p className="mc-q">이 거래를 다시 돌아보니, 처음에는 잘 보이지 않았지만 지금 보이는 것이 있습니까?</p>
            <textarea className="mc-textarea" value={answers.step8} onChange={(e) => set("step8", e.target.value)} />
            {error && <p className="mc-hint" style={{ color: "#e08a8a" }}>{error}</p>}
            <div className="mc-actions-row">
              <button className="mc-back" onClick={() => setStep("s7")}>← 이전</button>
              <button className="mc-next" disabled={!answers.step8.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="mc-loading">
            거래를 정리하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="mc-result-block">
              <div className="mc-result-label">기록된 사실</div>
              <div className="mc-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="mc-final-label">제안</div>
            <div className="mc-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="mc-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="mc-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
