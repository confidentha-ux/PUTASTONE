import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.ws-root { --ground:#16131c; --paper:#ece7de; --ink:#221d2b; --muted:#7d7489; --open:#d6a756; --line:rgba(236,231,222,.14);
  min-height:100%; background:radial-gradient(120% 90% at 50% 0%,#241d2f 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.ws-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.ws-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.ws-persona { text-align:center; margin-bottom:24px; }
.ws-persona h1 { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:32px; margin:0; font-weight:500; }
.ws-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.ws-tagline { font-family:'Gowun Batang',serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.ws-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(214,167,86,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.ws-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.ws-q { font-family:'Gowun Batang',serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.ws-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.ws-textarea { width:100%; min-height:80px; background:rgba(236,231,222,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.ws-textarea::placeholder { color:rgba(236,231,222,.28); }
.ws-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.ws-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(236,231,222,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.ws-opt:hover { background:rgba(236,231,222,.07); }
.ws-opt.sel { background:rgba(214,167,86,.13); border-color:var(--open); color:#f6ecda; }
.ws-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#1b1509; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.ws-next:disabled { background:rgba(236,231,222,.07); color:var(--muted); cursor:default; }
.ws-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.ws-actions-row { display:flex; align-items:center; gap:14px; }
.ws-actions-row .ws-next { flex:1; }
.ws-summary-card { background:linear-gradient(160deg,#f2eee6,#e4ded3); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.ws-summary-row { margin-bottom:12px; }
.ws-summary-row:last-child { margin-bottom:0; }
.ws-summary-label { font-size:10.5px; color:#8a8070; letter-spacing:.04em; margin-bottom:3px; }
.ws-summary-value { font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.6; }
.ws-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.ws-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:ws-pulse 1.2s infinite ease-in-out; }
.ws-loading .dot:nth-child(2) { animation-delay:.2s; }
.ws-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes ws-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.ws-result-block { margin-bottom:16px; }
.ws-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.ws-result-card { background:linear-gradient(160deg,#f2eee6,#e4ded3); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.ws-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.ws-final-text { font-size:14px; line-height:1.85; color:#e8e2d6; }
.ws-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.ws-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#1b1509; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const Q1_OPTS = ["있다.", "잘 모르겠다.", "없다."];
const Q4_OPTS = [
  "상대가 내 생각을 모르는 상태",
  "서로 다르게 이해하고 있는 상태",
  "아직 풀리지 않은 문제",
  "지금보다 생기는 관계의 거리",
  "내가 계속 안고 있어야 하는 부담",
  "지금의 관계나 상황이 그대로 이어지는 것",
  "잘 모르겠다",
  "직접 적기",
];
const Q6_OPTS = [
  "처음과 같은 판단이다.",
  "판단의 방향은 같지만 이유가 조금 달라졌다.",
  "처음과는 다르게 판단하게 된다.",
  "아직 판단하기 어렵다.",
];
const Q7_PROMPT = {
  "처음과 같은 판단이다.": "둘을 함께 본 뒤에도 같은 판단을 하는 이유는 무엇입니까?",
  "판단의 방향은 같지만 이유가 조금 달라졌다.": "무엇을 새롭게 보면서 판단의 이유가 달라졌습니까?",
  "처음과는 다르게 판단하게 된다.": "무엇을 함께 보았을 때 처음과 다르게 판단하게 되었습니까?",
  "아직 판단하기 어렵다.": "지금도 판단하기 어렵게 만드는 것은 무엇입니까?",
};

function buildResultPrompt(a) {
  const staying = a.step4 === "직접 적기" ? a.step4b : a.step4;
  return `당신은 사용자가 하지 않고 있는 말과 그 판단이 실제로 어떻게 됐는지
사실 그대로 정리하는 역할입니다.
"용기를 냈습니다", "성장했습니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
데이터:
- 상대: "${a.step1}"
- 아직 하지 못하고 있는 말: "${a.step2}"
- 계속 말하지 않을 때 남을 것: "${staying}"
- 그것이 남는다고 생각하는 이유: "${a.step5}"
- 재판단: "${a.step6}"
- 그 이유: "${a.step7}"
작업:
1. step6(재판단)이 다음 네 가지 중 무엇인지 먼저 확정하세요: "처음과 같은 판단이다" / "판단의 방향은 같지만 이유가 조금 달라졌다" / "처음과는 다르게 판단하게 된다" / "아직 판단하기 어렵다".
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을 지어내지 마세요.
3. "처음과 같은 판단"인 경우: 함께 놓고 봐도 같은 판단을 유지했다는 사실 그대로 쓰세요. 이건 실패가 아니라 그 자체로 하나의 결과입니다.
4. "이유가 조금 달라졌다"인 경우: 결론은 같지만 무엇을 새롭게 보면서 이유가 달라졌는지 step7 내용 그대로 쓰세요.
5. "다르게 판단하게 된다"인 경우: 무엇을 함께 보면서 판단이 달라졌는지 step7 내용 그대로 쓰세요.
6. "아직 판단하기 어렵다"인 경우: 무엇이 여전히 판단을 어렵게 만드는지 step7 내용 그대로 쓰세요. 이것도 실패가 아니라 지금 시점의 정직한 결과입니다.
7. 제안은 행동 지시가 아니라, 이 말을 계속 하지 않을 때와 지금 관계 사이에서 다음에 무엇을 지켜볼지 관찰 포인트 하나만 제시하세요.
두 경우 모두 반드시 summary와 suggestion을 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "상대 / 아직 하지 못한 말 / 계속 말하지 않을 때 남을 것과 그 이유 / 재판단과 근거, 이 네 줄을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 제안 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  hasTarget: "",
  step1: "",
  step2: "",
  step4: "", step4b: "",
  step5: "",
  step6: "",
  step7: "",
};

export default function WitnessLens({ onComplete } = {}) {
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

  const q4Ready = answers.step4 && (answers.step4 !== "직접 적기" || answers.step4b.trim());

  return (
    <div className="ws-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ws-shell">
        <div className="ws-eyebrow">르네상스의 그 거울 · III</div>
        <div className="ws-persona">
          <h1>증언자</h1>
          <div className="en">The Witness</div>
        </div>

        {step === "intro" && (
          <>
            <p className="ws-tagline">이 말을 계속 하지 않으면,<br />무엇이 남을까.</p>
            <p className="ws-hint">일곱 개의 질문을 지나갑니다.</p>
            <button className="ws-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <p className="ws-q">지금 누군가에게 아직 하지 못하고 있는 말이 있습니까?</p>
            <div className="ws-opts">
              {Q1_OPTS.map((o) => (
                <button key={o} className={`ws-opt ${answers.hasTarget === o ? "sel" : ""}`} onClick={() => { set("hasTarget", o); setStep("s1"); }}>{o}</button>
              ))}
            </div>
          </>
        )}

        {step === "s1" && (
          <>
            <button className="ws-back" style={{ marginBottom: 16 }} onClick={() => setStep("s0")}>← 이전</button>
            <div className="ws-step-label">STEP 1</div>
            <p className="ws-q">누구에게 아직 하지 못하고 있는 말입니까?</p>
            {answers.hasTarget !== "있다." && (
              <p className="ws-hint">지금 바로 떠오르지 않는다면, 앞으로 그런 상황이 온다면 누구에게일지 상상해서 적어주세요.</p>
            )}
            <textarea className="ws-textarea" value={answers.step1} onChange={(e) => set("step1", e.target.value)} placeholder="예: 오래 함께 일한 동료" />
            <div className="ws-actions-row">
              <button className="ws-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="ws-next" disabled={!answers.step1.trim()} onClick={() => setStep("s2")}>다음</button>
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <div className="ws-step-label">STEP 2</div>
            <p className="ws-q">{answers.step1}에게 아직 하지 못하고 있는 말은 무엇입니까?</p>
            <textarea className="ws-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} />
            <div className="ws-actions-row">
              <button className="ws-back" onClick={() => setStep("s1")}>← 이전</button>
              <button className="ws-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
            </div>
          </>
        )}

        {step === "s3" && (
          <>
            <div className="ws-step-label">STEP 3</div>
            <div className="ws-subject">"{answers.step2}"</div>
            <p className="ws-q">이 말을 계속 하지 않은 채 시간이 지난다면, 가장 크게 남을 것 같은 것은 무엇입니까?</p>
            <div className="ws-opts">
              {Q4_OPTS.map((o) => (
                <button key={o} className={`ws-opt ${answers.step4 === o ? "sel" : ""}`} onClick={() => set("step4", o)}>{o}</button>
              ))}
            </div>
            {answers.step4 === "직접 적기" && (
              <textarea className="ws-textarea" value={answers.step4b} onChange={(e) => set("step4b", e.target.value)} placeholder="편하게 적어주세요." />
            )}
            <div className="ws-actions-row">
              <button className="ws-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="ws-next" disabled={!q4Ready} onClick={() => setStep("s4")}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && (
          <>
            <div className="ws-step-label">STEP 4</div>
            <div className="ws-subject">"{answers.step2}"</div>
            <p className="ws-q">그것이 남는다고 생각하는 이유는 무엇입니까?</p>
            <textarea className="ws-textarea" value={answers.step5} onChange={(e) => set("step5", e.target.value)} />
            {error && <p className="ws-hint" style={{ color: "#e08a8a" }}>{error}</p>}
            <div className="ws-actions-row">
              <button className="ws-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="ws-next" disabled={!answers.step5.trim()} onClick={() => setStep("s5")}>다음</button>
            </div>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="ws-step-label">병치</div>
            <div className="ws-summary-card">
              <div className="ws-summary-row">
                <div className="ws-summary-label">하지 않고 있는 말</div>
                <div className="ws-summary-value">{answers.step2}</div>
              </div>
              <div className="ws-summary-row">
                <div className="ws-summary-label">계속 말하지 않을 때 남을 것</div>
                <div className="ws-summary-value">{answers.step4 === "직접 적기" ? answers.step4b : answers.step4}</div>
              </div>
              <div className="ws-summary-row">
                <div className="ws-summary-label">그렇게 생각한 이유</div>
                <div className="ws-summary-value">{answers.step5}</div>
              </div>
            </div>
            <p className="ws-q">이 둘을 함께 놓고 보니, 처음에 이 말을 하지 않고 있던 판단은 지금 어떻게 보입니까?</p>
            <div className="ws-opts">
              {Q6_OPTS.map((o) => (
                <button key={o} className={`ws-opt ${answers.step6 === o ? "sel" : ""}`} onClick={() => set("step6", o)}>{o}</button>
              ))}
            </div>
            <div className="ws-actions-row">
              <button className="ws-back" onClick={() => setStep("s4")}>← 이전</button>
              <button className="ws-next" disabled={!answers.step6} onClick={() => setStep("s6")}>다음</button>
            </div>
          </>
        )}

        {step === "s6" && (
          <>
            <div className="ws-step-label">STEP 5</div>
            <div className="ws-subject">"{answers.step2}"</div>
            <p className="ws-q">{Q7_PROMPT[answers.step6] || "그렇게 판단한 이유는 무엇입니까?"}</p>
            <textarea className="ws-textarea" value={answers.step7} onChange={(e) => set("step7", e.target.value)} />
            {error && <p className="ws-hint" style={{ color: "#e08a8a" }}>{error}</p>}
            <div className="ws-actions-row">
              <button className="ws-back" onClick={() => setStep("s5")}>← 이전</button>
              <button className="ws-next" disabled={!answers.step7.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="ws-loading">
            증언자가 남은 것을 정리하고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="ws-result-block">
              <div className="ws-result-label">기록된 사실</div>
              <div className="ws-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="ws-final-label">제안</div>
            <div className="ws-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="ws-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="ws-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
