import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.sv-root { --ground:#e4e2db; --paper:#31352d; --ink:#31352d; --muted:#5f6354; --open:#5c7a5e; --line:rgba(49,53,45,.14);
  min-height:100%; background:radial-gradient(120% 90% at 50% 0%,#f2f0ea 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.sv-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.sv-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.sv-persona { text-align:center; margin-bottom:24px; }
.sv-persona h1 { font-family:'Source Serif 4',serif;  font-size:32px; margin:0; font-weight:500; }
.sv-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.sv-tagline { font-family:'Gowun Batang',serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.sv-persona-header { font-family:'Gowun Batang',serif; font-size:15px; line-height:1.6; color:#2f4530; text-align:center; margin:0 0 20px; font-weight:600; }
.sv-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(92,122,94,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.sv-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.sv-q { font-family:'Gowun Batang',serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.sv-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.sv-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.sv-textarea::placeholder { color:rgba(49,53,45,.28); }
.sv-input { width:100%; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:12px 14px; box-sizing:border-box; margin-bottom:10px; }
.sv-input::placeholder { color:rgba(49,53,45,.28); }
.sv-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.sv-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.sv-opt:hover { background:rgba(49,53,45,.07); }
.sv-opt.sel { background:rgba(92,122,94,.13); border-color:var(--open); color:#2f4530; }
.sv-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#f2f4ef; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.sv-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.sv-add { padding:10px 16px; border-radius:2px; background:rgba(92,122,94,.15); border:1px solid var(--open); color:#2f4530; font-size:13px; cursor:pointer; font-family:inherit; margin-bottom:16px; }
.sv-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.sv-actions-row { display:flex; align-items:center; gap:14px; }
.sv-actions-row .sv-next { flex:1; }
.sv-item-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.sv-item-text { flex:1; font-size:14px; padding:10px 12px; background:rgba(49,53,45,.05); border-radius:2px; }
.sv-item-remove { background:none; border:none; color:var(--muted); cursor:pointer; font-size:16px; padding:0 6px; }
.sv-summary-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.sv-summary-row { margin-bottom:12px; }
.sv-summary-row:last-child { margin-bottom:0; }
.sv-summary-label { font-size:10.5px; color:#6b6a5c; letter-spacing:.04em; margin-bottom:3px; }
.sv-summary-value { font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.6; white-space:pre-line; }
.sv-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.sv-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:sv-pulse 1.2s infinite ease-in-out; }
.sv-loading .dot:nth-child(2) { animation-delay:.2s; }
.sv-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes sv-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.sv-result-block { margin-bottom:16px; }
.sv-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.sv-result-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:'Gowun Batang',serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); white-space:pre-line; }
.sv-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.sv-final-text { font-size:14px; line-height:1.85; color:#31352d; }
.sv-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.sv-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#f2f4ef; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const LEAN_OPTIONS = ["하려고 했다.", "하지 않으려고 했다.", "어느 쪽도 정하지 못했다.", "직접 적기"];
const SCOPE_OPTIONS = ["지금 함께 생각해야 한다.", "나중에 따로 생각해도 된다.", "일부만 지금 생각하면 된다.", "잘 모르겠다."];
const REDECIDE_OPTIONS = ["하겠다.", "하지 않겠다.", "다른 선택을 하겠다.", "아직 정하기 어렵다.", "직접 적기"];

function compareDirection(lean, redecision) {
  if (redecision === "아직 정하기 어렵다.") return "unclear";
  const map = { "하려고 했다.": "하겠다.", "하지 않으려고 했다.": "하지 않겠다." };
  if (map[lean] === redecision) return "same";
  return "different";
}

function followupQuestion(direction) {
  if (direction === "same") return "판단할 범위를 다시 정한 뒤에도 같은 선택을 하는 이유는 무엇입니까?";
  if (direction === "unclear") return "범위를 줄여 보아도 아직 함께 판단해야 하는 것은 무엇입니까?";
  return "어떤 문제를 따로 떼어놓고 보면서 생각이 달라졌습니까?";
}

function buildResultPrompt(a, leanValue, redecisionValue, direction) {
  const together = a.items.filter((i) => a.scopes[i] === "지금 함께 생각해야 한다.");
  const later = a.items.filter((i) => a.scopes[i] === "나중에 따로 생각해도 된다.");
  const partial = a.items.filter((i) => a.scopes[i] === "일부만 지금 생각하면 된다.");
  const unclear = a.items.filter((i) => a.scopes[i] === "잘 모르겠다.");
  return `당신은 사용자가 하나의 결정에 함께 딸려 들어온 여러 문제를 펼쳐본 뒤,
지금 판단할 범위를 다시 정한 과정을 사실 그대로 정리하는 역할입니다.
"성장했습니다", "현명한 판단입니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
데이터:
- 생각이 복잡해졌던 일: "${a.scene}"
- 지금 결정해야 했던 것: "${a.decision}"
- 처음 판단: "${leanValue}"
- 함께 딸려 들어온 문제들과 각각의 분류:
  지금 함께 생각해야 한다: ${together.join(", ") || "없음"}
  나중에 따로 생각해도 된다: ${later.join(", ") || "없음"}
  일부만 지금 생각하면 된다: ${partial.join(", ") || "없음"}
  잘 모르겠다: ${unclear.join(", ") || "없음"}
- 지금 판단하기로 다시 정한 범위: "${a.narrowedScope}"
- 그 범위만 놓고 본 판단: "${redecisionValue}"
- 그 이유: "${a.followup}"
- 처음과 다시 본 판단의 방향: ${direction === "same" ? "같음" : direction === "unclear" ? "여전히 어려움" : "달라짐"}
작업:
1. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을
   지어내지 마세요.
2. 방향이 "같음"으로 확인된 경우도 실패가 아니라, 범위를 나눠본 뒤에도 같은 판단에
   이르렀다는 결과입니다. 그대로 쓰세요.
3. 제안은 행동 지시가 아니라, 다음에 비슷하게 복잡한 결정을 마주칠 때 살펴볼
   관찰 포인트 하나만 제시하세요.
두 값 모두 반드시 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "생각이 복잡해졌던 일 / 지금 결정해야 했던 것과 처음 판단 / 범위를 나눈 결과 / 지금 판단하기로 한 범위와 그 판단, 이 네 부분을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 관찰 포인트 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  scene: "",
  decision: "",
  lean: "", leanCustom: "",
  items: [],
  scopes: {},
  narrowedScope: "",
  redecision: "", redecisionCustom: "",
  followup: "",
  summary: "", suggestion: "",
};

export default function SurveyorLens({ onComplete } = {}) {
  const [step, setStep] = useState("intro");
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [newItemText, setNewItemText] = useState("");
  const [useLeanCustom, setUseLeanCustom] = useState(false);
  const [useRedecideCustom, setUseRedecideCustom] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setAnswers((p) => ({ ...p, [k]: v }));
  const leanValue = () => (answers.lean === "직접 적기" ? answers.leanCustom : answers.lean);
  const redecisionValue = () => (answers.redecision === "직접 적기" ? answers.redecisionCustom : answers.redecision);

  function addItem() {
    if (!newItemText.trim()) return;
    setAnswers((p) => ({ ...p, items: [...p.items, newItemText.trim()] }));
    setNewItemText("");
  }
  function removeItem(idx) {
    setAnswers((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
  }

  function classifyCurrent(v) {
    const item = answers.items[currentIdx];
    setAnswers((p) => ({ ...p, scopes: { ...p.scopes, [item]: v } }));
    if (currentIdx + 1 < answers.items.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      setCurrentIdx(0);
      setStep("s5");
    }
  }

  function groupBy(scope) {
    return answers.items.filter((i) => answers.scopes[i] === scope);
  }

  const direction = compareDirection(leanValue(), redecisionValue());

  async function goToResult() {
    setStep("loading-result");
    setError(null);
    try {
      const raw = await mockCallClaude(buildResultPrompt(answers, leanValue(), redecisionValue(), direction));
      const parsed = JSON.parse(raw);
      set("summary", parsed.summary);
      set("suggestion", parsed.suggestion);
      setStep("result");
    } catch (e) {
      console.error("goToResult failed:", e);
      setError("결과를 정리하는 중 문제가 생겼습니다. 다시 시도해주세요.");
      setStep("s7");
    }
  }

  function restart() {
    setAnswers(INITIAL_ANSWERS);
    setCurrentIdx(0);
    setNewItemText("");
    setUseLeanCustom(false);
    setUseRedecideCustom(false);
    setError(null);
    setStep("intro");
  }

  return (
    <div className="sv-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="sv-shell">
        <div className="sv-eyebrow">돌 하나를 얹다</div>
        <div className="sv-persona">
          <h1>측량사</h1>
          <div className="en">The Surveyor</div>
        </div>

        {step === "intro" && (
          <>
            <p className="sv-tagline">지금 꼭 결정해야 하는 건<br />어디까지일까.</p>
            <p className="sv-persona-header">지금 실제로 판단해야 하는 크기를 찾아봅시다.</p>
            <p className="sv-hint">여덟 개의 질문을 지나갑니다.</p>
            <button className="sv-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <p className="sv-q">최근 어떤 결정을 두고 생각이 복잡해졌던 일이 있었습니까? 무슨 일이었습니까?</p>
            <textarea className="sv-textarea" value={answers.scene} onChange={(e) => set("scene", e.target.value)} />
            <div className="sv-actions-row">
              <button className="sv-next" disabled={!answers.scene.trim()} onClick={() => setStep("s1")}>다음</button>
            </div>
          </>
        )}

        {step === "s1" && (
          <>
            <button className="sv-back" style={{ marginBottom: 16 }} onClick={() => setStep("s0")}>← 이전</button>
            <div className="sv-step-label">STEP 2</div>
            <div className="sv-subject">"{answers.scene}"</div>
            <p className="sv-q">그 상황에서 지금 결정해야 했던 것은 무엇입니까?</p>
            <textarea className="sv-textarea" value={answers.decision} onChange={(e) => set("decision", e.target.value)} placeholder="예: 이 제안을 받을지 말지 결정해야 했다" />
            <div className="sv-actions-row">
              <button className="sv-back" onClick={() => setStep("s0")}>← 이전</button>
              <button className="sv-next" disabled={!answers.decision.trim()} onClick={() => setStep("s2")}>다음</button>
            </div>
          </>
        )}

        {step === "s2" && (
          <>
            <div className="sv-step-label">STEP 3</div>
            <div className="sv-subject">"{answers.decision}"</div>
            <p className="sv-q">그때는 어느 쪽으로 생각하고 있었습니까?</p>
            {!useLeanCustom && (
              <div className="sv-opts">
                {LEAN_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={`sv-opt${answers.lean === opt ? " sel" : ""}`}
                    onClick={() => {
                      if (opt === "직접 적기") setUseLeanCustom(true);
                      else { set("lean", opt); setStep("s3"); }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {useLeanCustom && (
              <>
                <textarea className="sv-textarea" value={answers.leanCustom} onChange={(e) => set("leanCustom", e.target.value)} placeholder="직접 적어보세요" />
                <div className="sv-actions-row">
                  <button className="sv-back" onClick={() => setUseLeanCustom(false)}>← 보기에서 고를게요</button>
                  <button className="sv-next" disabled={!answers.leanCustom.trim()} onClick={() => { set("lean", "직접 적기"); setStep("s3"); }}>다음</button>
                </div>
              </>
            )}
            {!useLeanCustom && (
              <div className="sv-actions-row">
                <button className="sv-back" onClick={() => setStep("s1")}>← 이전</button>
              </div>
            )}
          </>
        )}

        {step === "s3" && (
          <>
            <div className="sv-step-label">STEP 4</div>
            <div className="sv-subject">"{answers.decision}"</div>
            <p className="sv-q">이것을 생각할 때, 같이 해결해야 할 것처럼 따라 들어온 다른 문제나 걱정은 무엇이었습니까?</p>
            <p className="sv-hint">한 가지씩 적어주세요. 한 개 이상 입력해야 다음으로 넘어갑니다.</p>
            {answers.items.map((item, idx) => (
              <div key={idx} className="sv-item-row">
                <div className="sv-item-text">{item}</div>
                <button className="sv-item-remove" onClick={() => removeItem(idx)}>×</button>
              </div>
            ))}
            <input className="sv-input" value={newItemText} onChange={(e) => setNewItemText(e.target.value)} placeholder="예: 새 환경에 잘 적응할 수 있을까" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }} />
            <button className="sv-add" onClick={addItem}>+ 항목 추가</button>
            <div className="sv-actions-row">
              <button className="sv-back" onClick={() => setStep("s2")}>← 이전</button>
              <button className="sv-next" disabled={answers.items.length < 1} onClick={() => { setCurrentIdx(0); setStep("s4"); }}>다음</button>
            </div>
          </>
        )}

        {step === "s4" && answers.items.length > 0 && (
          <>
            <div className="sv-step-label">STEP 5 · {currentIdx + 1} / {answers.items.length}</div>
            <p className="sv-q">"{answers.items[currentIdx]}"도 지금 "{answers.decision}"를 결정할 때 함께 결정해야 하는 문제입니까?</p>
            <div className="sv-opts">
              {SCOPE_OPTIONS.map((opt) => (
                <button key={opt} className={`sv-opt${answers.scopes[answers.items[currentIdx]] === opt ? " sel" : ""}`} onClick={() => classifyCurrent(opt)}>{opt}</button>
              ))}
            </div>
            <div className="sv-actions-row">
              <button className="sv-back" onClick={() => { if (currentIdx > 0) setCurrentIdx((i) => i - 1); else setStep("s3"); }}>← 이전</button>
            </div>
          </>
        )}

        {step === "s5" && (
          <>
            <div className="sv-step-label">측량</div>
            <div className="sv-summary-card">
              <div className="sv-summary-row">
                <div className="sv-summary-label">지금 함께 생각할 것</div>
                <div className="sv-summary-value">{groupBy("지금 함께 생각해야 한다.").join(", ") || "없음"}</div>
              </div>
              <div className="sv-summary-row">
                <div className="sv-summary-label">나중에 따로 생각할 수 있는 것</div>
                <div className="sv-summary-value">{groupBy("나중에 따로 생각해도 된다.").join(", ") || "없음"}</div>
              </div>
              <div className="sv-summary-row">
                <div className="sv-summary-label">일부만 지금 생각할 것</div>
                <div className="sv-summary-value">{groupBy("일부만 지금 생각하면 된다.").join(", ") || "없음"}</div>
              </div>
              <div className="sv-summary-row">
                <div className="sv-summary-label">아직 정하기 어려운 것</div>
                <div className="sv-summary-value">{groupBy("잘 모르겠다.").join(", ") || "없음"}</div>
              </div>
            </div>
            <p className="sv-q">이렇게 나누어 보면, 지금 이 결정에서 꼭 함께 생각해야 하는 것은 무엇입니까?</p>
            <textarea className="sv-textarea" value={answers.narrowedScope} onChange={(e) => set("narrowedScope", e.target.value)} placeholder="예: 제안을 받을지와 근무시간만 지금 판단하면 된다" />
            <div className="sv-actions-row">
              <button className="sv-back" onClick={() => { setCurrentIdx(answers.items.length - 1); setStep("s4"); }}>← 이전</button>
              <button className="sv-next" disabled={!answers.narrowedScope.trim()} onClick={() => setStep("s6")}>다음</button>
            </div>
          </>
        )}

        {step === "s6" && (
          <>
            <div className="sv-step-label">STEP 7</div>
            <div className="sv-subject">"{answers.narrowedScope}"</div>
            <p className="sv-q">지금 결정해야 할 것만 놓고 보면, 어떻게 하시겠습니까?</p>
            {!useRedecideCustom && (
              <div className="sv-opts">
                {REDECIDE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={`sv-opt${answers.redecision === opt ? " sel" : ""}`}
                    onClick={() => {
                      if (opt === "직접 적기") setUseRedecideCustom(true);
                      else { set("redecision", opt); setStep("s7"); }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {useRedecideCustom && (
              <>
                <textarea className="sv-textarea" value={answers.redecisionCustom} onChange={(e) => set("redecisionCustom", e.target.value)} placeholder="직접 적어보세요" />
                <div className="sv-actions-row">
                  <button className="sv-back" onClick={() => setUseRedecideCustom(false)}>← 보기에서 고를게요</button>
                  <button className="sv-next" disabled={!answers.redecisionCustom.trim()} onClick={() => { set("redecision", "직접 적기"); setStep("s7"); }}>다음</button>
                </div>
              </>
            )}
            {!useRedecideCustom && (
              <div className="sv-actions-row">
                <button className="sv-back" onClick={() => setStep("s5")}>← 이전</button>
              </div>
            )}
          </>
        )}

        {step === "s7" && (
          <>
            <div className="sv-step-label">STEP 8</div>
            <div className="sv-summary-card">
              <div className="sv-summary-row">
                <div className="sv-summary-label">처음 판단</div>
                <div className="sv-summary-value">{leanValue()}</div>
              </div>
              <div className="sv-summary-row">
                <div className="sv-summary-label">지금 판단</div>
                <div className="sv-summary-value">{redecisionValue()}</div>
              </div>
            </div>
            <p className="sv-q">{followupQuestion(direction)}</p>
            <textarea className="sv-textarea" value={answers.followup} onChange={(e) => set("followup", e.target.value)} />
            {error && <p className="sv-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="sv-actions-row">
              <button className="sv-back" onClick={() => setStep("s6")}>← 이전</button>
              <button className="sv-next" disabled={!answers.followup.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="sv-loading">
            측량사가 경계를 다시 그리고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="sv-result-block">
              <div className="sv-result-label">기록된 사실</div>
              <div className="sv-result-card">{answers.summary}</div>
            </div>
            <div className="sv-final-label">제안</div>
            <div className="sv-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="sv-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="sv-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
