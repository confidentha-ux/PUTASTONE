import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.gu-root { --ground:#e4e2db; --paper:#31352d; --ink:#31352d; --muted:#5f6354; --open:#5c7a5e; --line:rgba(49,53,45,.14);
  flex: 1; min-height: 0; background:radial-gradient(120% 90% at 50% 0%,#f2f0ea 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.gu-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.gu-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.gu-persona { text-align:center; margin-bottom:24px; }
.gu-persona h1 { font-family:'Source Serif 4',serif;  font-size:32px; margin:0; font-weight:500; }
.gu-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.gu-tagline { font-family:'Gowun Batang',serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.gu-persona-header { font-family:'Gowun Batang',serif; font-size:15px; line-height:1.6; color:#2f4530; text-align:center; margin:0 0 20px; font-weight:600; }
.gu-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(92,122,94,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.gu-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.gu-q { font-family:'Gowun Batang',serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.gu-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.gu-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.gu-textarea::placeholder { color:rgba(49,53,45,.28); }
.gu-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.gu-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.gu-opt:hover { background:rgba(49,53,45,.07); }
.gu-opt.sel { background:rgba(92,122,94,.13); border-color:var(--open); color:#2f4530; }
.gu-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#f2f4ef; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.gu-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.gu-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.gu-actions-row { display:flex; align-items:center; gap:14px; }
.gu-actions-row .gu-next { flex:1; }
.gu-summary-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.gu-summary-row { margin-bottom:12px; }
.gu-summary-row:last-child { margin-bottom:0; }
.gu-summary-label { font-size:10.5px; color:#6b6a5c; letter-spacing:.04em; margin-bottom:3px; }
.gu-summary-value { font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.6; }
.gu-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.gu-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:gu-pulse 1.2s infinite ease-in-out; }
.gu-loading .dot:nth-child(2) { animation-delay:.2s; }
.gu-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes gu-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.gu-result-block { margin-bottom:16px; }
.gu-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.gu-result-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.gu-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.gu-final-text { font-size:14px; line-height:1.85; color:#31352d; }
.gu-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.gu-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#f2f4ef; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const Q1_OPTS = ["있다.", "잘 모르겠다.", "없다."];
const SPENT_OPTS = ["시간", "노력", "돈", "체력", "마음과 신경", "사람들과 쌓아온 것", "다른 것을 포기하며 만든 기회", "직접 적기", "잘 모르겠다"];
const FUTURE_OPTS = ["시간", "노력", "돈", "체력", "마음과 신경", "다른 일을 할 기회", "사람들과 보낼 시간", "직접 적기", "잘 모르겠다"];
const Q6_OPTS = [
  "지금처럼 계속한다.",
  "계속하되 쓰는 시간이나 노력을 줄이고 싶다.",
  "계속하되 방식이나 범위를 바꾸고 싶다.",
  "이제는 그만두는 쪽을 생각한다.",
  "아직 정하기 어렵다.",
];
function q7Prompt(a) {
  switch (a.step6) {
    case "지금처럼 계속한다.":
      return `앞으로 더 들어갈 것을 보아도 ${a.step2}을(를) 계속하는 것이 중요하다고 생각하는 이유는 무엇입니까?`;
    case "계속하되 쓰는 시간이나 노력을 줄이고 싶다.":
      return `앞으로 ${a.step2}에 무엇을 덜 쓰고 싶습니까?`;
    case "계속하되 방식이나 범위를 바꾸고 싶다.":
      return "어떻게 바꾸어 계속하고 싶습니까?";
    case "이제는 그만두는 쪽을 생각한다.":
      return "무엇을 따로 놓고 보니 그만두는 선택도 가능해졌습니까?";
    case "아직 정하기 어렵다.":
      return "지금까지 들어간 것과 앞으로 더 들어갈 것을 나누어 보아도 결정하기 어려운 이유는 무엇입니까?";
    default:
      return "그렇게 정한 이유는 무엇입니까?";
  }
}

function buildResultPrompt(a) {
  const spent = a.step3 === "직접 적기" ? a.step3b : a.step3;
  const future = a.step5 === "직접 적기" ? a.step5b : a.step5;
  return `당신은 사용자가 어떤 일에 이미 들인 것과 앞으로 더 들일 것을 나누어 놓고,
그 판단이 실제로 어떻게 됐는지 사실 그대로 정리하는 역할입니다.
"성장했습니다", "현명한 선택입니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
"이미 들인 것"(과거, 이미 끝난 것)과 "앞으로 들어갈 것"(미래, 조절 가능한 것)을
구분해서 쓰세요. 두 개념을 섞어 쓰지 마세요.
데이터:
- 그만두거나 내려놓기 어려운 일: "${a.step2}"
- 지금까지 이미 들인 것: "${spent}"
- 오늘 그만두면 가장 놓기 어려운 것: "${a.step4}"
- 앞으로도 계속하면 더 들어갈 것: "${future}"
- 세 가지를 함께 본 뒤의 재판단: "${a.step6}"
- 그 이유: "${a.step7}"
- 처음에는 놓기 어렵다고 느꼈지만 지금 돌아보니 가장 놓기 어려웠던 것: "${a.step8}"
작업:
1. step6(재판단)을 근거로 어떤 선택을 했는지 먼저 확정하세요.
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을
   지어내지 마세요.
3. "지금처럼 계속한다"로 확인된 경우도 실패가 아니라, 이미 들인 것과 앞으로 들어갈
   것을 모두 알고 내린 판단이라는 점에서 이전과 다릅니다. 그대로 쓰세요.
4. 제안은 행동 지시가 아니라, 다음에 이 일을 다시 마주칠 때 살펴볼 관찰 포인트
   하나만 제시하세요.
두 값 모두 반드시 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "그만두거나 내려놓기 어려운 일 / 지금까지 이미 들인 것 / 오늘 그만두면 가장 놓기 어려운 것 / 앞으로 더 들어갈 것 / 세 가지를 함께 본 뒤의 재판단과 이유, 이 다섯 줄을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 관찰 포인트 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  hasTarget: "",
  step2: "",
  step3: "", step3b: "",
  step4: "",
  step5: "", step5b: "",
  step6: "",
  step7: "",
  step8: "",
};

export default function GuardianLens({ onComplete } = {}) {
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

  const q3Ready = answers.step3 && (answers.step3 !== "직접 적기" || answers.step3b.trim());
  const q5Ready = answers.step5 && (answers.step5 !== "직접 적기" || answers.step5b.trim());
  const spentDisplay = answers.step3 === "직접 적기" ? answers.step3b : answers.step3;
  const futureDisplay = answers.step5 === "직접 적기" ? answers.step5b : answers.step5;

  return (
    <div className="gu-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="gu-shell">
        <div className="gu-eyebrow">돌 하나를 얹다</div>
        <div className="gu-persona">
          <h1>골키퍼</h1>
          <div className="en">The Guardian</div>
        </div>

        {step === "intro" && (
          <>
            <p className="gu-tagline">이미 들인 것과 앞으로 더 들어갈 것을<br />따로 보면 어떨까.</p>
            <p className="gu-persona-header">내가 무엇을 지키고 있는지 봅시다.</p>
            <p className="gu-hint">여덟 개의 질문을 지나갑니다.</p>
            <button className="gu-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <p className="gu-q">요즘 그만두거나 내려놓는 것을 생각해본 적이 있지만, 아직 계속하고 있는 일이 있습니까?</p>
            <div className="gu-opts">
              {Q1_OPTS.map((o) => (
                <button key={o} className={`gu-opt ${answers.hasTarget === o ? "sel" : ""}`} onClick={() => { set("hasTarget", o); setStep("s2"); }}>{o}</button>
              ))}
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <button className="gu-back" style={{ marginBottom: 16 }} onClick={() => setStep("s0")}>← 이전</button>
            <div className="gu-step-label">STEP 2</div>
            <p className="gu-q">지금 그만두거나 내려놓기 어려운 일은 무엇입니까?</p>
            <p className="gu-hint">예: 오래 준비한 시험, 계속해온 프로젝트, 맡아온 역할, 이어온 관계</p>
            <textarea className="gu-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} />
            <div className="gu-actions-row">
              <button className="gu-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="gu-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}

        {step === "s3" && (
          <>
            <div className="gu-step-label">STEP 3</div>
            <div className="gu-subject">"{answers.step2}"</div>
            <p className="gu-q">지금까지 {answers.step2}에 가장 많이 들인 것은 무엇입니까?</p>
            <div className="gu-opts">
              {SPENT_OPTS.map((o) => (
                <button key={o} className={`gu-opt ${answers.step3 === o ? "sel" : ""}`} onClick={() => set("step3", o)}>{o}</button>
              ))}
            </div>
            {answers.step3 === "직접 적기" && (
              <textarea className="gu-textarea" value={answers.step3b} onChange={(e) => set("step3b", e.target.value)} placeholder="편하게 적어주세요." />
            )}
            <div className="gu-actions-row">
              <button className="gu-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="gu-next" disabled={!q3Ready} onClick={() => setStep("s4")}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && (
          <>
            <div className="gu-step-label">STEP 4</div>
            <div className="gu-subject">"{answers.step2}"</div>
            <p className="gu-q">오늘 {answers.step2}을(를) 그만둔다고 생각하면, 무엇이 가장 아깝거나 놓기 어렵습니까?</p>
            <textarea className="gu-textarea" value={answers.step4} onChange={(e) => set("step4", e.target.value)} />
            <div className="gu-actions-row">
              <button className="gu-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="gu-next" disabled={!answers.step4.trim()} onClick={() => setStep("s5")}>다음</button>
            </div>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="gu-step-label">STEP 5</div>
            <div className="gu-subject">"{answers.step2}"</div>
            <p className="gu-q">앞으로도 {answers.step2}을(를) 계속한다면, 가장 많이 더 써야 하는 것은 무엇입니까?</p>
            <div className="gu-opts">
              {FUTURE_OPTS.map((o) => (
                <button key={o} className={`gu-opt ${answers.step5 === o ? "sel" : ""}`} onClick={() => set("step5", o)}>{o}</button>
              ))}
            </div>
            {answers.step5 === "직접 적기" && (
              <textarea className="gu-textarea" value={answers.step5b} onChange={(e) => set("step5b", e.target.value)} placeholder="편하게 적어주세요." />
            )}
            {error && <p className="gu-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="gu-actions-row">
              <button className="gu-back" onClick={() => setStep("s4")}>← 이전</button>
              <button className="gu-next" disabled={!q5Ready} onClick={() => setStep("s6")}>다음</button>
            </div>
          </>
        )}

        {step === "s6" && (
          <>
            <div className="gu-step-label">비교</div>
            <div className="gu-summary-card">
              <div className="gu-summary-row">
                <div className="gu-summary-label">지금까지 들어간 것</div>
                <div className="gu-summary-value">{spentDisplay}</div>
              </div>
              <div className="gu-summary-row">
                <div className="gu-summary-label">오늘 그만두면 가장 놓기 어려운 것</div>
                <div className="gu-summary-value">{answers.step4}</div>
              </div>
              <div className="gu-summary-row">
                <div className="gu-summary-label">계속하면 앞으로 더 들어갈 것</div>
                <div className="gu-summary-value">{futureDisplay}</div>
              </div>
            </div>
            <p className="gu-q">지금까지 들어간 것과 앞으로 더 들어갈 것을 따로 놓고 보니, {answers.step2}을(를) 지금 어떻게 하고 싶습니까?</p>
            <div className="gu-opts">
              {Q6_OPTS.map((o) => (
                <button key={o} className={`gu-opt ${answers.step6 === o ? "sel" : ""}`} onClick={() => set("step6", o)}>{o}</button>
              ))}
            </div>
            <div className="gu-actions-row">
              <button className="gu-back" onClick={() => setStep("s5")}>← 이전</button>
              <button className="gu-next" disabled={!answers.step6} onClick={() => setStep("s7")}>다음</button>
            </div>
          </>
        )}

        {step === "s7" && (
          <>
            <div className="gu-step-label">STEP 7</div>
            <div className="gu-subject">"{answers.step2}"</div>
            <p className="gu-q">{q7Prompt(answers)}</p>
            <textarea className="gu-textarea" value={answers.step7} onChange={(e) => set("step7", e.target.value)} />
            <div className="gu-actions-row">
              <button className="gu-back" onClick={() => setStep("s6")}>← 이전</button>
              <button className="gu-next" disabled={!answers.step7.trim()} onClick={() => setStep("s8")}>다음</button>
            </div>
          </>
        )}

        {step === "s8" && (
          <>
            <div className="gu-step-label">STEP 8</div>
            <div className="gu-subject">"{answers.step2}"</div>
            <p className="gu-q">처음에는 {answers.step2}을(를) 놓기 어렵다고 생각했습니다. 지금 돌아보면, 가장 놓기 어려웠던 것은 무엇입니까?</p>
            <textarea className="gu-textarea" value={answers.step8} onChange={(e) => set("step8", e.target.value)} />
            {error && <p className="gu-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="gu-actions-row">
              <button className="gu-back" onClick={() => setStep("s7")}>← 이전</button>
              <button className="gu-next" disabled={!answers.step8.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="gu-loading">
            지키고 있는 것을 정리하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="gu-result-block">
              <div className="gu-result-label">기록된 사실</div>
              <div className="gu-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="gu-final-label">제안</div>
            <div className="gu-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="gu-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="gu-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
