import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.gd-root { --ground:#eae6da; --paper:#1c1a17; --ink:#1c1a17; --muted:#847c6b; --open:#a13d2e; --line:rgba(49,53,45,.14);
  flex: 1; min-height: 0; background:radial-gradient(120% 90% at 50% 0%,#f2eee0 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.gd-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.gd-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.gd-persona { text-align:center; margin-bottom:24px; }
.gd-persona h1 { font-family:Pretendard,sans-serif;  font-size:32px; margin:0; font-weight:500; }
.gd-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.gd-tagline { font-family:Pretendard,sans-serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.gd-persona-header { font-family:Pretendard,sans-serif; font-size:15px; line-height:1.6; color:#1c1a17; text-align:center; margin:0 0 20px; font-weight:600; }
.gd-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(28,26,23,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.gd-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.gd-q { font-family:Pretendard,sans-serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.gd-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.gd-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.gd-textarea::placeholder { color:rgba(49,53,45,.28); }
.gd-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.gd-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.gd-opt:hover { background:rgba(49,53,45,.07); }
.gd-opt.sel { background:rgba(28,26,23,.13); border-color:var(--open); color:#1c1a17; }
.gd-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.gd-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.gd-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.gd-actions-row { display:flex; align-items:center; gap:14px; }
.gd-actions-row .gd-next { flex:1; }
.gd-summary-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.gd-summary-row { margin-bottom:12px; }
.gd-summary-row:last-child { margin-bottom:0; }
.gd-summary-label { font-size:10.5px; color:#6b6a5c; letter-spacing:.04em; margin-bottom:3px; }
.gd-summary-value { font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.6; }
.gd-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.gd-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:gd-pulse 1.2s infinite ease-in-out; }
.gd-loading .dot:nth-child(2) { animation-delay:.2s; }
.gd-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes gd-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.gd-result-block { margin-bottom:16px; }
.gd-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.gd-result-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.gd-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.gd-final-text { font-size:14px; line-height:1.85; color:#1c1a17; }
.gd-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.gd-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const Q1_OPTS = ["있다.", "비슷한 일이 떠오른다.", "없다."];
const Q6_OPTS = [
  "그래도 해준다.",
  "내가 정한 범위까지만 해준다.",
  "이번에는 거절한다.",
  "다른 조건을 제안한다.",
  "아직 결정하기 어렵다.",
];
const Q8_OPTS = [
  "지금까지와 비슷하게 한다.",
  "내가 정한 범위까지만 한다.",
  "조건을 정해서 한다.",
  "이전보다 덜 한다.",
  "더 이상 하지 않는다.",
  "아직 잘 모르겠다.",
  "직접 적기",
];
function q7Prompt(a) {
  switch (a.step6) {
    case "그래도 해준다.":
      return "내가 정한 범위를 넘어도 이번에는 해주려는 이유는 무엇입니까?";
    case "내가 정한 범위까지만 해준다.":
      return "어디까지 해주고, 어디서 멈추겠습니까?";
    case "이번에는 거절한다.":
      return "이번에는 거절하는 것이 맞다고 생각한 이유는 무엇입니까?";
    case "다른 조건을 제안한다.":
      return "어떤 조건이라면 해줄 수 있습니까?";
    case "아직 결정하기 어렵다.":
      return "해줄 수 있는 범위를 정해보아도 결정하기 어려운 이유는 무엇입니까?";
    default:
      return "그렇게 정한 이유는 무엇입니까?";
  }
}

function buildResultPrompt(a) {
  const rejudge = a.step8 === "직접 적기" ? a.step8b : a.step8;
  return `당신은 사용자가 내주고 있는 것과 그 경계가 실제로 어떻게 됐는지 사실 그대로
정리하는 역할입니다.
"성장했습니다", "더 단단해졌습니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
데이터:
- 내가 해주거나 양보하고 있던 것: "${a.step2}"
- 나에게 남겨두고 싶은 것: "${a.step3}"
- 여기까지는 가능: "${a.step4}"
- 여기부터는 어렵다: "${a.step5}"
- 그 상황이 실제로 왔을 때의 선택: "${a.step6}"
- 그 이유: "${a.step7}"
- 앞으로의 재판단: "${rejudge}"
작업:
1. step6(실제 선택)과 재판단이 처음 그은 경계(step4, step5)와 같은 자리에
   있는지, 옮겨졌는지 먼저 확인하세요.
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을
   지어내지 마세요.
3. 경계가 그대로인 경우도 실패가 아니라, 그 경계가 이 사람에게 얼마나 확고한지
   확인된 결과입니다. 그대로 쓰세요.
4. 경계가 옮겨진 경우: 어디로 옮겨졌는지 재판단(step8) 내용 그대로 쓰세요.
5. 제안은 행동 지시가 아니라, 다음에 비슷한 부탁을 마주칠 때 살펴볼 관찰 포인트
   하나만 제시하세요.
두 값 모두 반드시 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "내가 해주거나 양보하고 있던 것 / 나에게 남겨두고 싶은 것 / 여기까지는 가능·여기부터는 어렵다 / 실제 상황에서의 선택과 이유 / 앞으로의 재판단, 이 다섯 줄을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 관찰 포인트 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  hasScene: "",
  step2: "",
  step3: "",
  step4: "",
  step5: "",
  step6: "",
  step7: "",
  step8: "", step8b: "",
};

export default function GatekeeperLens({ onComplete } = {}) {
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

  const q8Ready = answers.step8 && (answers.step8 !== "직접 적기" || answers.step8b.trim());

  return (
    <div className="gd-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="gd-shell">
        <div className="gd-eyebrow">돌 하나를 얹다</div>
        <div className="gd-persona">
          <h1>수문장</h1>
          <div className="en">The Gatekeeper</div>
        </div>

        {step === "intro" && (
          <>
            <p className="gd-tagline">나는 어디까지 해줄 수 있고,<br />어디서 멈추고 싶을까.</p>
            <p className="gd-persona-header">내가 맡을 일의 끝이 어디인지 봅시다.</p>
            <p className="gd-hint">여덟 개의 질문을 지나갑니다.</p>
            <button className="gd-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <p className="gd-q">최근 누군가에게 맞춰주거나 양보하면서, "여기까지 해줘야 하나?"라는 생각이 들었던 일이 있었습니까?</p>
            <div className="gd-opts">
              {Q1_OPTS.map((o) => (
                <button key={o} className={`gd-opt ${answers.hasScene === o ? "sel" : ""}`} onClick={() => { set("hasScene", o); setStep("s2"); }}>{o}</button>
              ))}
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <button className="gd-back" style={{ marginBottom: 16 }} onClick={() => setStep("s0")}>← 이전</button>
            <div className="gd-step-label">STEP 2</div>
            <p className="gd-q">누구와 있었던 일입니까? 그리고 그 사람에게 무엇을 해주거나 양보하고 있었습니까?</p>
            {answers.hasScene === "없다." && (
              <p className="gd-hint">떠오르는 사례가 없다면, 앞으로 그런 상황이 온다면 어떨지 상상해서 적어주세요.</p>
            )}
            <textarea className="gd-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} placeholder="예: 동료가 프로젝트를 도와달라고 해서 시간을 내주고 있었다." />
            <div className="gd-actions-row">
              <button className="gd-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="gd-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}

        {step === "s3" && (
          <>
            <div className="gd-step-label">STEP 3</div>
            <div className="gd-subject">"{answers.step2}"</div>
            <p className="gd-q">이것을 하더라도, 나에게 꼭 남겨두고 싶은 것은 무엇입니까?</p>
            <textarea className="gd-textarea" value={answers.step3} onChange={(e) => set("step3", e.target.value)} placeholder="예: 저녁 시간은 지키고 싶다." />
            <div className="gd-actions-row">
              <button className="gd-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="gd-next" disabled={!answers.step3.trim()} onClick={() => setStep("s4")}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && (
          <>
            <div className="gd-step-label">STEP 4</div>
            <div className="gd-subject">"{answers.step2}"</div>
            <p className="gd-q">이 부탁이나 행동을 어디까지는 해줄 수 있습니까?</p>
            <textarea className="gd-textarea" value={answers.step4} onChange={(e) => set("step4", e.target.value)} placeholder="예: 정말 급할 때 한 번 정도는 도와줄 수 있다." />
            <div className="gd-actions-row">
              <button className="gd-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="gd-next" disabled={!answers.step4.trim()} onClick={() => setStep("s5")}>다음</button>
            </div>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="gd-step-label">STEP 5</div>
            <div className="gd-subject">"{answers.step2}"</div>
            <p className="gd-q">어떤 경우부터는 더 해주기 어렵다고 생각합니까?</p>
            <textarea className="gd-textarea" value={answers.step5} onChange={(e) => set("step5", e.target.value)} placeholder="예: 같은 부탁이 반복될 때." />
            {error && <p className="gd-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="gd-actions-row">
              <button className="gd-back" onClick={() => setStep("s4")}>← 이전</button>
              <button className="gd-next" disabled={!answers.step5.trim()} onClick={() => setStep("s6")}>다음</button>
            </div>
          </>
        )}

        {step === "s6" && (
          <>
            <div className="gd-step-label">경계</div>
            <div className="gd-summary-card">
              <div className="gd-summary-row">
                <div className="gd-summary-label">내가 해주거나 양보하고 있던 것</div>
                <div className="gd-summary-value">{answers.step2}</div>
              </div>
              <div className="gd-summary-row">
                <div className="gd-summary-label">나에게 남겨두고 싶은 것</div>
                <div className="gd-summary-value">{answers.step3}</div>
              </div>
              <div className="gd-summary-row">
                <div className="gd-summary-label">여기까지는 가능</div>
                <div className="gd-summary-value">{answers.step4}</div>
              </div>
              <div className="gd-summary-row">
                <div className="gd-summary-label">여기부터는 어렵다</div>
                <div className="gd-summary-value">{answers.step5}</div>
              </div>
            </div>
            <p className="gd-q">방금 말한 "{answers.step5}" 상황이 실제로 생겼다고 생각해보세요. 그때 어떻게 하시겠습니까?</p>
            <div className="gd-opts">
              {Q6_OPTS.map((o) => (
                <button key={o} className={`gd-opt ${answers.step6 === o ? "sel" : ""}`} onClick={() => set("step6", o)}>{o}</button>
              ))}
            </div>
            <div className="gd-actions-row">
              <button className="gd-back" onClick={() => setStep("s5")}>← 이전</button>
              <button className="gd-next" disabled={!answers.step6} onClick={() => setStep("s7")}>다음</button>
            </div>
          </>
        )}

        {step === "s7" && (
          <>
            <div className="gd-step-label">STEP 7</div>
            <div className="gd-subject">"{answers.step2}"</div>
            <p className="gd-q">{q7Prompt(answers)}</p>
            <textarea className="gd-textarea" value={answers.step7} onChange={(e) => set("step7", e.target.value)} />
            <div className="gd-actions-row">
              <button className="gd-back" onClick={() => setStep("s6")}>← 이전</button>
              <button className="gd-next" disabled={!answers.step7.trim()} onClick={() => setStep("s8")}>다음</button>
            </div>
          </>
        )}

        {step === "s8" && (
          <>
            <div className="gd-step-label">STEP 8</div>
            <div className="gd-subject">"{answers.step2}"</div>
            <p className="gd-q">처음에는 이것을 하고 있었습니다. 지금 다시 보면, 앞으로는 어디까지 해주는 것이 맞다고 생각합니까?</p>
            <div className="gd-opts">
              {Q8_OPTS.map((o) => (
                <button key={o} className={`gd-opt ${answers.step8 === o ? "sel" : ""}`} onClick={() => set("step8", o)}>{o}</button>
              ))}
            </div>
            {answers.step8 === "직접 적기" && (
              <textarea className="gd-textarea" value={answers.step8b} onChange={(e) => set("step8b", e.target.value)} placeholder="편하게 적어주세요." />
            )}
            {error && <p className="gd-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="gd-actions-row">
              <button className="gd-back" onClick={() => setStep("s7")}>← 이전</button>
              <button className="gd-next" disabled={!q8Ready} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="gd-loading">
            경계를 정리하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="gd-result-block">
              <div className="gd-result-label">기록된 사실</div>
              <div className="gd-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="gd-final-label">제안</div>
            <div className="gd-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="gd-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="gd-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
