import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.pt-root { --ground:#16131c; --paper:#ece7de; --ink:#221d2b; --muted:#7d7489; --open:#d6a756; --line:rgba(236,231,222,.14);
  min-height:100%; background:radial-gradient(120% 90% at 50% 0%,#241d2f 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.pt-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.pt-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.pt-persona { text-align:center; margin-bottom:24px; }
.pt-persona h1 { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:32px; margin:0; font-weight:500; }
.pt-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.pt-tagline { font-family:'Gowun Batang',serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.pt-persona-header { font-family:'Gowun Batang',serif; font-size:15px; line-height:1.6; color:#f6ecda; text-align:center; margin:0 0 20px; font-weight:600; }
.pt-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(214,167,86,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.pt-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.pt-q { font-family:'Gowun Batang',serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.pt-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.pt-textarea { width:100%; min-height:80px; background:rgba(236,231,222,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.pt-textarea::placeholder { color:rgba(236,231,222,.28); }
.pt-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.pt-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(236,231,222,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.pt-opt:hover { background:rgba(236,231,222,.07); }
.pt-opt.sel { background:rgba(214,167,86,.13); border-color:var(--open); color:#f6ecda; }
.pt-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#1b1509; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.pt-next:disabled { background:rgba(236,231,222,.07); color:var(--muted); cursor:default; }
.pt-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.pt-actions-row { display:flex; align-items:center; gap:14px; }
.pt-actions-row .pt-next { flex:1; }
.pt-summary-card { background:linear-gradient(160deg,#f2eee6,#e4ded3); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.pt-summary-row { margin-bottom:12px; }
.pt-summary-row:last-child { margin-bottom:0; }
.pt-summary-label { font-size:10.5px; color:#8a8070; letter-spacing:.04em; margin-bottom:3px; }
.pt-summary-value { font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.6; }
.pt-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.pt-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:pt-pulse 1.2s infinite ease-in-out; }
.pt-loading .dot:nth-child(2) { animation-delay:.2s; }
.pt-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes pt-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.pt-result-block { margin-bottom:16px; }
.pt-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.pt-result-card { background:linear-gradient(160deg,#f2eee6,#e4ded3); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.pt-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.pt-final-text { font-size:14px; line-height:1.85; color:#e8e2d6; }
.pt-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.pt-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#1b1509; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const APPLY_SAME = "그대로 적용할 수 있다.";
const APPLY_PARTIAL = "일부는 적용할 수 있다.";
const APPLY_DIFFERENT = "나에게는 다른 기준이 필요하다.";
const APPLY_UNSURE = "잘 모르겠다.";
const Q4_OPTS = [APPLY_SAME, APPLY_PARTIAL, APPLY_DIFFERENT, APPLY_UNSURE];

const REJUDGE_SAME = "처음과 같은 판단이다.";
const REJUDGE_REASON_SHIFT = "판단의 방향은 같지만 이유가 조금 달라졌다.";
const REJUDGE_DIFFERENT = "지금은 다르게 판단한다.";
const REJUDGE_UNSURE = "아직 판단하기 어렵다.";
const REJUDGE_OPTS = [REJUDGE_SAME, REJUDGE_REASON_SHIFT, REJUDGE_DIFFERENT, REJUDGE_UNSURE];

const Q6_PROMPT = {
  [REJUDGE_SAME]: "같은 처지의 사람에게 적용한 기준을 자신에게도 놓아보았는데, 처음 판단이 그대로 남는 이유는 무엇입니까?",
  [REJUDGE_REASON_SHIFT]: "무엇을 새롭게 보면서 판단의 이유가 달라졌습니까?",
  [REJUDGE_DIFFERENT]: "어떤 기준을 자신에게 다시 적용했을 때 판단이 달라졌습니까?",
  [REJUDGE_UNSURE]: "두 기준을 함께 보아도 여전히 판단하기 어렵게 만드는 것은 무엇입니까?",
};

function buildResultPrompt(a) {
  return `당신은 사용자가 다른 사람에게 적용한 후원의 기준을 자신에게도 적용해봤을 때
실제로 어떻게 됐는지 사실 그대로 정리하는 역할입니다.
"성장했습니다", "너그러워졌습니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
데이터:
- 그때 하지 않았던 것: "${a.step1}"
- 같은 처지의 사람에게 해주고 싶은 후원: "${a.step2}"
- 그렇게 후원하는 이유: "${a.step3}"
- 그 기준을 자신에게 적용할 수 있다고 보는지: "${a.step4}"
- 그에 대한 추가 설명(있는 경우): "${a.step4b}"
- 재판단: "${a.step5}"
- 그 이유: "${a.step6}"
작업:
1. step5(재판단)가 다음 네 가지 중 무엇인지 먼저 확정하세요: "처음과 같은 판단이다" / "판단의 방향은 같지만 이유가 조금 달라졌다" / "지금은 다르게 판단한다" / "아직 판단하기 어렵다".
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을 지어내지 마세요.
3. "처음과 같은 판단"인 경우: 다른 사람에게 적용한 기준을 자신에게 놓아보고도 판단이 그대로 유지됐다는 사실 그대로 쓰세요. 이건 실패가 아니라 그 자체로 하나의 결과입니다.
4. "이유가 조금 달라졌다"인 경우: 결론은 같지만 무엇이 새롭게 보이는지 step6 내용 그대로 쓰세요.
5. "다르게 판단한다"인 경우: 어떤 기준을 자신에게 다시 적용했을 때 판단이 달라졌는지 step6 내용 그대로 쓰세요.
6. "아직 판단하기 어렵다"인 경우: 무엇이 여전히 판단을 어렵게 만드는지 step6 내용 그대로 쓰세요. 이것도 실패가 아니라 지금 시점의 정직한 결과입니다.
7. 제안은 행동 지시가 아니라, 다른 사람에게 쓰는 기준과 자신에게 쓰는 기준의 차이를 다음에 비슷한 상황에서 지켜볼 관찰 포인트 하나만 제시하세요.
두 경우 모두 반드시 summary와 suggestion을 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "하지 않았던 것 / 같은 처지의 사람에게 해주고 싶은 후원과 그 이유 / 그 기준을 자신에게 적용할 수 있다고 보는지 / 재판단과 그 이유, 이 네 줄을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 제안 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  step1: "",
  step2: "",
  step3: "",
  step4: "", step4b: "",
  step5: "",
  step6: "",
};

export default function PatronLens({ onComplete } = {}) {
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

  const needsBranchText = answers.step4 === APPLY_DIFFERENT || answers.step4 === APPLY_UNSURE;
  const branchLabel = answers.step4 === APPLY_DIFFERENT
    ? "왜 비슷한 상황의 다른 사람에게 적용한 기준과 당신 자신에게 필요한 기준이 다르다고 생각합니까?"
    : "같은 기준을 자신에게 적용할 수 있는지 판단하기 어렵게 만드는 것은 무엇입니까?";
  const rejudgeIntro = answers.step4 === APPLY_DIFFERENT
    ? "그 차이를 함께 놓고 보면, 처음에 하지 않았던 선택은 지금 어떻게 보입니까?"
    : answers.step4 === APPLY_UNSURE
    ? "이렇게 놓고 보니, 처음에 하지 않았던 선택은 지금 어떻게 보입니까?"
    : "그 기준을 당신 자신에게도 적용해보면, 처음에 하지 않았던 선택은 지금 어떻게 보입니까?";

  return (
    <div className="pt-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pt-shell">
        <div className="pt-eyebrow">돌 하나를 얹다</div>
        <div className="pt-persona">
          <h1>후원자</h1>
          <div className="en">The Patron</div>
        </div>

        {step === "intro" && (
          <>
            <p className="pt-tagline">친한 사람이 같은 고민을 한다면,<br />나는 뭐라고 말해줄까.</p>
            <p className="pt-persona-header">다른 사람에게도 같은 기준을 적용할지 봅시다.</p>
            <p className="pt-hint">여섯 개의 질문을 지나갑니다.</p>
            <button className="pt-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <p className="pt-q">그 순간, 어떤 기회나 자리였습니까? 그리고 그때 무엇을 하지 않았습니까?</p>
            <textarea className="pt-textarea" value={answers.step1} onChange={(e) => set("step1", e.target.value)} />
            <button className="pt-next" disabled={!answers.step1.trim()} onClick={() => setStep("s1")}>다음</button>
          </>
        )}

        {step === "s1" && (
          <>
            <button className="pt-back" style={{ marginBottom: 16 }} onClick={() => setStep("s0")}>← 이전</button>
            <div className="pt-step-label">STEP 1</div>
            <div className="pt-subject">"{answers.step1}"</div>
            <p className="pt-q">지금과 비슷한 상황에 있는 사람을 한 명 떠올려 보세요.</p>
            <p className="pt-hint">그런 처지의 사람에게 당신이 후원자라면, 그 사람이 이 기회나 자리를 앞에 두고 있을 때 어떻게 후원하겠습니까?</p>
            <textarea className="pt-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} />
            <div className="pt-actions-row">
              <button className="pt-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="pt-next" disabled={!answers.step2.trim()} onClick={() => setStep("s2")}>다음</button>
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <div className="pt-step-label">STEP 2</div>
            <div className="pt-subject">"{answers.step1}"</div>
            <p className="pt-q">왜 그 사람에게 그렇게 후원하는 것이 적절하다고 생각합니까?</p>
            <textarea className="pt-textarea" value={answers.step3} onChange={(e) => set("step3", e.target.value)} />
            <div className="pt-actions-row">
              <button className="pt-back" onClick={() => setStep("s1")}>← 이전</button>
              <button className="pt-next" disabled={!answers.step3.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}

        {step === "s3" && (
          <>
            <div className="pt-step-label">기준 병치</div>
            <div className="pt-summary-card">
              <div className="pt-summary-row">
                <div className="pt-summary-label">당신이 하지 않았던 것</div>
                <div className="pt-summary-value">{answers.step1}</div>
              </div>
              <div className="pt-summary-row">
                <div className="pt-summary-label">같은 처지의 사람에게 해주고 싶은 후원</div>
                <div className="pt-summary-value">{answers.step2}</div>
              </div>
              <div className="pt-summary-row">
                <div className="pt-summary-label">그렇게 후원하는 이유</div>
                <div className="pt-summary-value">{answers.step3}</div>
              </div>
            </div>
            <p className="pt-q">방금 그 사람에게 적용한 기준을 당신 자신에게도 적용할 수 있다고 생각합니까?</p>
            <div className="pt-opts">
              {Q4_OPTS.map((o) => (
                <button key={o} className={`pt-opt ${answers.step4 === o ? "sel" : ""}`} onClick={() => set("step4", o)}>{o}</button>
              ))}
            </div>
            <div className="pt-actions-row">
              <button className="pt-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="pt-next" disabled={!answers.step4} onClick={() => setStep(needsBranchText ? "s4" : "s5")}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && (
          <>
            <div className="pt-step-label">STEP 3</div>
            <p className="pt-q">{branchLabel}</p>
            <textarea className="pt-textarea" value={answers.step4b} onChange={(e) => set("step4b", e.target.value)} />
            {error && <p className="pt-hint" style={{ color: "#e08a8a" }}>{error}</p>}
            <div className="pt-actions-row">
              <button className="pt-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="pt-next" disabled={!answers.step4b.trim()} onClick={() => setStep("s5")}>다음</button>
            </div>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="pt-step-label">STEP 4</div>
            <p className="pt-q">{rejudgeIntro}</p>
            <div className="pt-opts">
              {REJUDGE_OPTS.map((o) => (
                <button key={o} className={`pt-opt ${answers.step5 === o ? "sel" : ""}`} onClick={() => set("step5", o)}>{o}</button>
              ))}
            </div>
            <div className="pt-actions-row">
              <button className="pt-back" onClick={() => setStep(needsBranchText ? "s4" : "s3")}>← 이전</button>
              <button className="pt-next" disabled={!answers.step5} onClick={() => setStep("s6")}>다음</button>
            </div>
          </>
        )}

        {step === "s6" && (
          <>
            <div className="pt-step-label">STEP 5</div>
            <p className="pt-q">{Q6_PROMPT[answers.step5] || "그렇게 판단한 이유는 무엇입니까?"}</p>
            <textarea className="pt-textarea" value={answers.step6} onChange={(e) => set("step6", e.target.value)} />
            {error && <p className="pt-hint" style={{ color: "#e08a8a" }}>{error}</p>}
            <div className="pt-actions-row">
              <button className="pt-back" onClick={() => setStep("s5")}>← 이전</button>
              <button className="pt-next" disabled={!answers.step6.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="pt-loading">
            후원자가 두 기준을 나란히 놓고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="pt-result-block">
              <div className="pt-result-label">기록된 사실</div>
              <div className="pt-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="pt-final-label">제안</div>
            <div className="pt-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="pt-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="pt-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
