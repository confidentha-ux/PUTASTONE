import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.an-root { --ground:#eae6da; --paper:#1c1a17; --ink:#1c1a17; --muted:#847c6b; --open:#a13d2e; --line:rgba(49,53,45,.14);
  flex: 1; min-height: 0; background:radial-gradient(120% 90% at 50% 0%,#f2eee0 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.an-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.an-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.an-persona { text-align:center; margin-bottom:24px; }
.an-persona h1 { font-family:Pretendard,sans-serif;  font-size:32px; margin:0; font-weight:500; }
.an-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.an-tagline { font-family:Pretendard,sans-serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.an-persona-header { font-family:Pretendard,sans-serif; font-size:15px; line-height:1.6; color:#1c1a17; text-align:center; margin:0 0 20px; font-weight:600; }
.an-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(28,26,23,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.an-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.an-q { font-family:Pretendard,sans-serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.an-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.an-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.an-textarea::placeholder { color:rgba(49,53,45,.28); }
.an-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.an-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.an-opt:hover { background:rgba(49,53,45,.07); }
.an-opt.sel { background:rgba(28,26,23,.13); border-color:var(--open); color:#1c1a17; }
.an-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.an-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.an-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.an-actions-row { display:flex; align-items:center; gap:14px; }
.an-actions-row .an-next { flex:1; }
.an-summary-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.an-summary-row { margin-bottom:12px; }
.an-summary-row:last-child { margin-bottom:0; }
.an-summary-label { font-size:10.5px; color:#6b6a5c; letter-spacing:.04em; margin-bottom:3px; }
.an-summary-value { font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.6; }
.an-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.an-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:an-pulse 1.2s infinite ease-in-out; }
.an-loading .dot:nth-child(2) { animation-delay:.2s; }
.an-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes an-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.an-result-block { margin-bottom:16px; }
.an-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.an-result-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); }
.an-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.an-final-text { font-size:14px; line-height:1.85; color:#1c1a17; }
.an-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.an-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const STATUS_DONE = "이미 선택했다.";
const STATUS_PENDING = "아직 선택하지 않았다.";

const Q5_OPTS = {
  [STATUS_DONE]: ["그래도 같은 선택을 했을 것이다.", "다른 선택을 했을 것이다.", "어느 쪽인지 판단하기 어렵다."],
  [STATUS_PENDING]: ["그래도 같은 쪽으로 마음이 기울었을 것이다.", "다른 쪽으로 마음이 기울었을 것이다.", "어느 쪽인지 판단하기 어렵다."],
};
const Q7_OPTS = {
  [STATUS_DONE]: ["처음과 같은 판단이다.", "선택은 같지만 그 이유가 다르게 보인다.", "지금은 다르게 판단한다.", "아직 잘 모르겠다."],
  [STATUS_PENDING]: ["처음과 같은 판단이다.", "방향은 같지만 그 이유가 다르게 보인다.", "지금은 다르게 판단한다.", "아직 잘 모르겠다."],
};

function buildResultPrompt(a) {
  return `당신은 사용자의 판단에 실제로 무엇이 영향을 주고 있었는지 사실 그대로
정리하는 역할입니다.
"성장했습니다", "분명해졌습니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
데이터:
- 장면: "${a.step0}"
- 현재 상태: "${a.status}"
- 판단(또는 지금 기울어 있는 쪽): "${a.step2}"
- 판단에 작용한 영향: "${a.step3}"
- 그 영향이 없었다면: "${a.step4}"
- 그렇게 생각한 이유: "${a.step5}"
- 재판단: "${a.step7}"
- 처음엔 안 보였지만 지금 보이는 것: "${a.step8}"
작업:
1. step7(재판단)이 다음 네 가지 중 무엇인지 먼저 확정하세요: "처음과 같은 판단이다" / "선택(또는 방향)은 같지만 그 이유가 다르게 보인다" / "지금은 다르게 판단한다" / "아직 잘 모르겠다".
2. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을 지어내지 마세요.
3. "처음과 같은 판단"인 경우: 영향을 뜯어보고도 판단이 그대로 유지됐다는 사실 그대로 쓰세요. 이건 실패가 아니라 그 자체로 하나의 결과입니다.
4. "이유가 다르게 보인다"인 경우: 결론은 같지만 무엇이 새롭게 보이는지 step8 내용 그대로 쓰세요.
5. "다르게 판단한다"인 경우: 무엇이 다르게 보이면서 판단이 달라졌는지 step8 내용 그대로 쓰세요.
6. "아직 잘 모르겠다"인 경우: 그것도 실패가 아니라 지금 시점의 정직한 결과입니다. step8에 있는 내용을 그대로 반영하세요.
7. 제안은 행동 지시가 아니라, 이 영향이 다음에 비슷한 선택 앞에서 다시 나타나는지 지켜볼 관찰 포인트 하나만 제시하세요.
두 경우 모두 반드시 summary와 suggestion을 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "판단 / 판단에 작용한 영향 / 그 영향이 없었다면 / 그 이유 / 재판단과 새롭게 보인 것, 이 다섯 줄을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 제안 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  step0: "",
  status: "",
  step2: "",
  step3: "",
  step4: "",
  step5: "",
  step7: "",
  step8: "",
};

export default function AnatomistLens({ onComplete } = {}) {
  const [step, setStep] = useState("intro");
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [error, setError] = useState(null);
  const set = (k, v) => setAnswers((p) => ({ ...p, [k]: v }));
  const isDone = answers.status === STATUS_DONE;

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
    <div className="an-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="an-shell">
        <div className="an-eyebrow">돌 하나를 얹다</div>
        <div className="an-persona">
          <h1>해부학자</h1>
          <div className="en">The Anatomist</div>
        </div>

        {step === "intro" && (
          <>
            <p className="an-tagline">마음에 걸리는 한 가지가 없다면,<br />그래도 같은 선택을 할까.</p>
            <p className="an-persona-header">이 판단에 들어간 것들을 하나씩 떼어봅시다.</p>
            <p className="an-hint">여덟 개의 질문을 지나갑니다.</p>
            <button className="an-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <p className="an-q">이런 생각을 했던 때를 하나 떠올려보세요. 그때 무슨 일이 있었습니까?</p>
            <textarea className="an-textarea" value={answers.step0} onChange={(e) => set("step0", e.target.value)} />
            <button className="an-next" disabled={!answers.step0.trim()} onClick={() => setStep("s1")}>다음</button>
          </>
        )}

        {step === "s1" && (
          <>
            <button className="an-back" style={{ marginBottom: 16 }} onClick={() => setStep("s0")}>← 이전</button>
            <div className="an-step-label">STEP 1</div>
            <p className="an-q">그 일은 지금 어떤 상태입니까?</p>
            <div className="an-opts">
              <button className={`an-opt ${answers.status === STATUS_DONE ? "sel" : ""}`} onClick={() => { set("status", STATUS_DONE); setStep("s2"); }}>{STATUS_DONE}</button>
              <button className={`an-opt ${answers.status === STATUS_PENDING ? "sel" : ""}`} onClick={() => { set("status", STATUS_PENDING); setStep("s2"); }}>{STATUS_PENDING}</button>
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <button className="an-back" style={{ marginBottom: 16 }} onClick={() => setStep("s1")}>← 이전</button>
            <div className="an-step-label">STEP 2</div>
            <p className="an-q">{isDone ? "그때 결국 어떻게 했습니까?" : "지금은 어느 쪽으로 마음이 더 기울어 있습니까?"}</p>
            <textarea className="an-textarea" value={answers.step2} onChange={(e) => set("step2", e.target.value)} />
            <button className="an-next" disabled={!answers.step2.trim()} onClick={() => setStep("s3")}>다음</button>
          </>
        )}

        {step === "s3" && (
          <>
            <div className="an-step-label">STEP 3</div>
            <div className="an-subject">"{answers.step2}"</div>
            <p className="an-q">{isDone ? "무엇을 고려하느라 그런 선택을 내렸습니까?" : "지금 무엇을 고려하느라 그쪽으로 마음이 기울고 있습니까?"}</p>
            <textarea className="an-textarea" value={answers.step3} onChange={(e) => set("step3", e.target.value)} />
            <div className="an-actions-row">
              <button className="an-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="an-next" disabled={!answers.step3.trim()} onClick={() => setStep("s4")}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && (
          <>
            <div className="an-step-label">STEP 4</div>
            <div className="an-subject">"{answers.step2}"</div>
            <p className="an-q">"{answers.step3}"이 아니었다면, {isDone ? "같은 선택을 했을까요?" : "지금도 같은 쪽으로 마음이 기울었을까요?"}</p>
            <div className="an-opts">
              {(isDone ? Q5_OPTS[STATUS_DONE] : Q5_OPTS[STATUS_PENDING]).map((o) => (
                <button key={o} className={`an-opt ${answers.step4 === o ? "sel" : ""}`} onClick={() => set("step4", o)}>{o}</button>
              ))}
            </div>
            <div className="an-actions-row">
              <button className="an-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="an-next" disabled={!answers.step4} onClick={() => setStep("s5")}>다음</button>
            </div>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="an-step-label">STEP 5</div>
            <div className="an-subject">"{answers.step2}"</div>
            <p className="an-q">왜 그렇게 생각합니까?</p>
            <textarea className="an-textarea" value={answers.step5} onChange={(e) => set("step5", e.target.value)} />
            {error && <p className="an-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="an-actions-row">
              <button className="an-back" onClick={() => setStep("s4")}>← 이전</button>
              <button className="an-next" disabled={!answers.step5.trim()} onClick={() => setStep("s6")}>다음</button>
            </div>
          </>
        )}

        {step === "s6" && (
          <>
            <div className="an-step-label">병치</div>
            <div className="an-summary-card">
              <div className="an-summary-row">
                <div className="an-summary-label">처음 판단</div>
                <div className="an-summary-value">{answers.step2}</div>
              </div>
              <div className="an-summary-row">
                <div className="an-summary-label">판단에 작용한 영향</div>
                <div className="an-summary-value">{answers.step3}</div>
              </div>
              <div className="an-summary-row">
                <div className="an-summary-label">그 영향이 없었다면</div>
                <div className="an-summary-value">{answers.step4}</div>
              </div>
              <div className="an-summary-row">
                <div className="an-summary-label">그렇게 생각한 이유</div>
                <div className="an-summary-value">{answers.step5}</div>
              </div>
            </div>
            <p className="an-q">{isDone ? "이 내용을 함께 놓고 보면, 지금 그때의 선택은 어떻게 보입니까?" : "이 내용을 함께 놓고 보면, 처음의 판단은 지금 어떻게 보입니까?"}</p>
            <div className="an-opts">
              {(isDone ? Q7_OPTS[STATUS_DONE] : Q7_OPTS[STATUS_PENDING]).map((o) => (
                <button key={o} className={`an-opt ${answers.step7 === o ? "sel" : ""}`} onClick={() => set("step7", o)}>{o}</button>
              ))}
            </div>
            {error && <p className="an-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="an-actions-row">
              <button className="an-back" onClick={() => setStep("s5")}>← 이전</button>
              <button className="an-next" disabled={!answers.step7} onClick={() => setStep("s7")}>다음</button>
            </div>
          </>
        )}

        {step === "s7" && (
          <>
            <div className="an-step-label">STEP 6</div>
            <div className="an-subject">"{answers.step2}"</div>
            <p className="an-q">처음에는 잘 보이지 않았지만, 지금 보이는 것이 있습니까?</p>
            <textarea className="an-textarea" value={answers.step8} onChange={(e) => set("step8", e.target.value)} />
            <div className="an-actions-row">
              <button className="an-back" onClick={() => setStep("s6")}>← 이전</button>
              <button className="an-next" disabled={!answers.step8.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="an-loading">
            해부학자가 영향을 가려내고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="an-result-block">
              <div className="an-result-label">기록된 사실</div>
              <div className="an-result-card" style={{ whiteSpace: "pre-line" }}>
                {answers.summary}
              </div>
            </div>
            <div className="an-final-label">제안</div>
            <div className="an-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="an-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="an-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
