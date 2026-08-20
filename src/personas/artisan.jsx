import React, { useState } from "react";
import { mockCallClaude } from "../speculum/aiStub";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
.at-root { --ground:#eae6da; --paper:#1c1a17; --ink:#1c1a17; --muted:#847c6b; --open:#1c1a17; --line:rgba(49,53,45,.14);
  flex: 1; min-height: 0; background:radial-gradient(120% 90% at 50% 0%,#f2eee0 0%,var(--ground) 62%); color:var(--paper);
  font-family:Pretendard,-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; padding:28px 20px 44px; box-sizing:border-box; }
.at-shell { width:100%; max-width:460px; display:flex; flex-direction:column; flex:1; }
.at-eyebrow { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); text-align:center; margin-bottom:6px; }
.at-persona { text-align:center; margin-bottom:24px; }
.at-persona h1 { font-family:Pretendard,sans-serif;  font-size:32px; margin:0; font-weight:500; }
.at-persona .en { font-size:12px; color:var(--muted); margin-top:4px; }
.at-tagline { font-family:Pretendard,sans-serif; font-size:16px; line-height:1.6; color:var(--paper); text-align:center; margin:0 0 24px; }
.at-persona-header { font-family:Pretendard,sans-serif; font-size:15px; line-height:1.6; color:#1c1a17; text-align:center; margin:0 0 20px; font-weight:600; }
.at-subject { font-size:12px; color:var(--open); border-left:2px solid rgba(28,26,23,.5); padding-left:10px; margin-bottom:20px; line-height:1.6; }
.at-step-label { font-size:11px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; }
.at-q { font-family:Pretendard,sans-serif; font-size:18px; line-height:1.65; margin:0 0 6px; font-weight:400; }
.at-hint { font-size:12.5px; color:var(--muted); margin:0 0 16px; line-height:1.6; }
.at-textarea { width:100%; min-height:80px; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:14px 15px; box-sizing:border-box; resize:vertical; margin-bottom:16px; }
.at-textarea::placeholder { color:rgba(49,53,45,.28); }
.at-input { width:100%; background:rgba(49,53,45,.04); border:1px solid var(--line);
  border-radius:2px; color:var(--paper); font-family:inherit; font-size:14px; padding:12px 14px; box-sizing:border-box; margin-bottom:10px; }
.at-input::placeholder { color:rgba(49,53,45,.28); }
.at-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.at-opt { text-align:left; padding:13px 15px; border-radius:2px; cursor:pointer; background:rgba(49,53,45,.035);
  border:1px solid var(--line); color:var(--paper); font-size:14px; font-family:inherit; }
.at-opt:hover { background:rgba(49,53,45,.07); }
.at-opt.sel { background:rgba(28,26,23,.13); border-color:var(--open); color:#1c1a17; }
.at-next { width:100%; padding:14px; border-radius:2px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; font-family:inherit; }
.at-next:disabled { background:rgba(49,53,45,.07); color:var(--muted); cursor:default; }
.at-add { padding:10px 16px; border-radius:2px; background:rgba(28,26,23,.15); border:1px solid var(--open); color:#1c1a17; font-size:13px; cursor:pointer; font-family:inherit; margin-bottom:16px; }
.at-back { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; padding:0; text-align:left; flex-shrink:0; }
.at-actions-row { display:flex; align-items:center; gap:14px; }
.at-actions-row .at-next { flex:1; }
.at-item-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.at-item-text { flex:1; font-size:14px; padding:10px 12px; background:rgba(49,53,45,.05); border-radius:2px; }
.at-item-remove { background:none; border:none; color:var(--muted); cursor:pointer; font-size:16px; padding:0 6px; }
.at-summary-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:18px 20px;
  font-family:Pretendard,sans-serif; font-size:13.5px; line-height:1.7; margin-bottom:20px; box-shadow:0 8px 20px rgba(0,0,0,.28); }
.at-summary-row { margin-bottom:12px; }
.at-summary-row:last-child { margin-bottom:0; }
.at-summary-label { font-size:10.5px; color:#6b6a5c; letter-spacing:.04em; margin-bottom:3px; }
.at-summary-value { font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.6; white-space:pre-line; }
.at-loading { text-align:center; padding:60px 0; color:var(--muted); font-size:13px; }
.at-loading .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--open); margin:0 3px; animation:at-pulse 1.2s infinite ease-in-out; }
.at-loading .dot:nth-child(2) { animation-delay:.2s; }
.at-loading .dot:nth-child(3) { animation-delay:.4s; }
@keyframes at-pulse { 0%,80%,100%{opacity:.2;} 40%{opacity:1;} }
.at-result-block { margin-bottom:16px; }
.at-result-label { font-size:11px; color:var(--muted); letter-spacing:.06em; margin-bottom:8px; }
.at-result-card { background:linear-gradient(160deg,#f7f5ee,#ddd8ca); color:var(--ink); border-radius:3px; padding:16px 18px;
  font-family:Pretendard,sans-serif; font-size:14.5px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.25); white-space:pre-line; }
.at-final-label { font-size:11px; color:var(--open); letter-spacing:.06em; margin:20px 0 8px; }
.at-final-text { font-size:14px; line-height:1.85; color:#1c1a17; }
.at-restart { width:100%; padding:14px; margin-top:24px; background:transparent; border:1px solid var(--line); color:var(--muted); font-size:13px; cursor:pointer; border-radius:2px; font-family:inherit; }
.at-complete { width:100%; padding:14px; margin-top:24px; background:var(--open); border:none; color:#eae6da; font-weight:600; font-size:14.5px; cursor:pointer; border-radius:2px; font-family:inherit; }
`;

const LEAN_OPTIONS = ["하려고 했다.", "하지 않으려고 했다.", "다른 선택을 생각하고 있었다.", "아직 어느 쪽도 정하지 못했다.", "직접 적기"];
const PART_OPTIONS = ["하겠다.", "하지 않겠다.", "다른 선택을 하겠다.", "이것만으로는 결정하기 어렵다.", "직접 적기"];
const REJUDGE_OPTIONS = ["하겠다.", "하지 않겠다.", "다른 선택을 하겠다.", "아직 결정하기 어렵다.", "직접 적기"];

function compareDirection(lean, rejudgment) {
  if (rejudgment === "아직 결정하기 어렵다.") return "unclear";
  const map = {
    "하려고 했다.": "하겠다.",
    "하지 않으려고 했다.": "하지 않겠다.",
    "다른 선택을 생각하고 있었다.": "다른 선택을 하겠다.",
  };
  if (map[lean] === rejudgment) return "same";
  return "different";
}

function followupQuestion(direction) {
  if (direction === "same") return "하나씩 따로 본 뒤에도 같은 판단을 하는 이유는 무엇입니까?";
  if (direction === "unclear") return "각각 따로 보아도 다시 함께 놓으면 무엇 때문에 결정하기 어렵습니까?";
  return "하나씩 따로 보면서 무엇이 다르게 보였습니까?";
}

function buildResultPrompt(a, leanValue, rejudgmentValue, direction) {
  const itemLines = a.items.map((item) => `- ${item} → ${a.verdicts[item]}`).join("\n");
  return `당신은 사용자가 하나의 판단을 여러 요소로 나누어 본 뒤 다시 합쳐 본 과정을
사실 그대로 정리하는 역할입니다.
"성장했습니다", "현명한 판단입니다" 같은 평가 문구를 절대 쓰지 마세요.
행동을 제안하거나 다음에 뭘 하라고 지시하지 마세요.
데이터:
- 고민한 일: "${a.scene}"
- 처음 판단: "${leanValue}"
- 하나씩 따로 본 요소와 각각의 판단:
${itemLines}
- 다시 합쳐 본 판단: "${rejudgmentValue}"
- 그 이유: "${a.followup}"
- 처음과 다시 본 판단의 방향: ${direction === "same" ? "같음" : direction === "unclear" ? "여전히 어려움" : "달라짐"}
작업:
1. 아래 형식대로 사용자가 실제로 쓴 답변을 인용해서 사실만 나열하세요. 새 결론을
   지어내지 마세요.
2. 방향이 "같음"으로 확인된 경우도 실패가 아니라, 요소를 모두 따로 본 뒤에도 같은
   판단에 이르렀다는 결과입니다. 그대로 쓰세요.
3. 제안은 행동 지시가 아니라, 다음에 비슷한 판단을 나눠볼 때 살펴볼 관찰 포인트
   하나만 제시하세요.
두 값 모두 반드시 채워야 합니다. 비워두는 것은 허용되지 않습니다.
출력은 JSON만:
{
  "summary": "고민한 일 / 처음 판단 / 요소별 판단 / 다시 합쳐 본 판단과 이유, 이 네 부분을 순서대로 담은 텍스트 (줄바꿈 \\n으로 구분)",
  "suggestion": "이 사람의 답변에 맞춘 구체적 관찰 포인트 1~2문장"
}`;
}

const INITIAL_ANSWERS = {
  scene: "",
  lean: "", leanCustom: "",
  items: [],
  verdicts: {}, verdictCustoms: {},
  rejudgment: "", rejudgmentCustom: "",
  followup: "",
  summary: "", suggestion: "",
};

export default function ArtisanLens({ onComplete } = {}) {
  const [step, setStep] = useState("intro");
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [newItemText, setNewItemText] = useState("");
  const [useLeanCustom, setUseLeanCustom] = useState(false);
  const [useVerdictCustom, setUseVerdictCustom] = useState(false);
  const [verdictCustomText, setVerdictCustomText] = useState("");
  const [useRejudgeCustom, setUseRejudgeCustom] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setAnswers((p) => ({ ...p, [k]: v }));
  const leanValue = () => (answers.lean === "직접 적기" ? answers.leanCustom : answers.lean);
  const rejudgmentValue = () => (answers.rejudgment === "직접 적기" ? answers.rejudgmentCustom : answers.rejudgment);

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
    if (v === "직접 적기") {
      setUseVerdictCustom(true);
      return;
    }
    setAnswers((p) => ({ ...p, verdicts: { ...p.verdicts, [item]: v } }));
    advanceItem();
  }

  function classifyCurrentCustom() {
    const item = answers.items[currentIdx];
    setAnswers((p) => ({ ...p, verdicts: { ...p.verdicts, [item]: verdictCustomText }, verdictCustoms: { ...p.verdictCustoms, [item]: verdictCustomText } }));
    setVerdictCustomText("");
    setUseVerdictCustom(false);
    advanceItem();
  }

  function advanceItem() {
    if (currentIdx + 1 < answers.items.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      setCurrentIdx(0);
      setStep("s3");
    }
  }

  const direction = compareDirection(leanValue(), rejudgmentValue());

  async function goToResult() {
    setStep("loading-result");
    setError(null);
    try {
      const raw = await mockCallClaude(buildResultPrompt(answers, leanValue(), rejudgmentValue(), direction));
      const parsed = JSON.parse(raw);
      set("summary", parsed.summary);
      set("suggestion", parsed.suggestion);
      setStep("result");
    } catch (e) {
      console.error("goToResult failed:", e);
      setError("결과를 정리하는 중 문제가 생겼습니다. 다시 시도해주세요.");
      setStep("s4");
    }
  }

  function restart() {
    setAnswers(INITIAL_ANSWERS);
    setCurrentIdx(0);
    setNewItemText("");
    setUseLeanCustom(false);
    setUseVerdictCustom(false);
    setVerdictCustomText("");
    setUseRejudgeCustom(false);
    setError(null);
    setStep("intro");
  }

  const list = answers.items;

  return (
    <div className="at-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="at-shell">
        <div className="at-eyebrow">돌 하나를 얹다</div>
        <div className="at-persona">
          <h1>레고</h1>
          <div className="en">The Artisan</div>
        </div>

        {step === "intro" && (
          <>
            <p className="at-tagline">이 고민을 몇 조각으로 나누면,<br />각각은 어떻게 보일까.</p>
            <p className="at-persona-header">이 판단을 하나씩 나눠봅시다.</p>
            <p className="at-hint">여섯 개의 질문을 지나갑니다.</p>
            <button className="at-next" onClick={() => setStep("s0")}>시작하기</button>
          </>
        )}

        {step === "s0" && (
          <>
            <p className="at-q">최근 어떤 일을 두고 어떻게 할지 고민했던 순간이 있었습니까? 무슨 일이었습니까?</p>
            <textarea className="at-textarea" value={answers.scene} onChange={(e) => set("scene", e.target.value)} />
            <div className="at-actions-row">
              <button className="at-next" disabled={!answers.scene.trim()} onClick={() => setStep("s1")}>다음</button>
            </div>
          </>
        )}

        {step === "s1" && (
          <>
            <button className="at-back" style={{ marginBottom: 16 }} onClick={() => setStep("s0")}>← 이전</button>
            <div className="at-step-label">STEP 2</div>
            <div className="at-subject">"{answers.scene}"</div>
            <p className="at-q">그때는 어떻게 하는 쪽으로 생각하고 있었습니까?</p>
            {!useLeanCustom && (
              <div className="at-opts">
                {LEAN_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={`at-opt${answers.lean === opt ? " sel" : ""}`}
                    onClick={() => {
                      if (opt === "직접 적기") setUseLeanCustom(true);
                      else { set("lean", opt); setStep("s2"); }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {useLeanCustom && (
              <>
                <textarea className="at-textarea" value={answers.leanCustom} onChange={(e) => set("leanCustom", e.target.value)} placeholder="직접 적어보세요" />
                <div className="at-actions-row">
                  <button className="at-back" onClick={() => setUseLeanCustom(false)}>← 보기에서 고를게요</button>
                  <button className="at-next" disabled={!answers.leanCustom.trim()} onClick={() => { set("lean", "직접 적기"); setStep("s2"); }}>다음</button>
                </div>
              </>
            )}
          </>
        )}

        {step === "s2" && (
          <>
            <div className="at-step-label">STEP 3</div>
            <div className="at-subject">"{leanValue()}"</div>
            <p className="at-q">그 일을 판단하면서 함께 생각하고 있던 것들을 하나씩 적어보세요.</p>
            <p className="at-hint">최소 두 개를 입력해야 다음으로 넘어갑니다.</p>
            {list.map((item, idx) => (
              <div key={idx} className="at-item-row">
                <div className="at-item-text">{item}</div>
                <button className="at-item-remove" onClick={() => removeItem(idx)}>×</button>
              </div>
            ))}
            <input className="at-input" value={newItemText} onChange={(e) => setNewItemText(e.target.value)} placeholder="예: 들어가는 시간" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }} />
            <button className="at-add" onClick={addItem}>+ 항목 추가</button>
            <div className="at-actions-row">
              <button className="at-back" onClick={() => setStep("s1")}>← 이전</button>
              <button className="at-next" disabled={list.length < 2} onClick={() => { setCurrentIdx(0); setStep("s2a"); }}>다음</button>
            </div>
          </>
        )}

        {step === "s2a" && list.length > 0 && (
          <>
            <div className="at-step-label">STEP 4 · {currentIdx + 1} / {list.length}</div>
            <p className="at-q">먼저 "{list[currentIdx]}"만 생각해보겠습니다.</p>
            <p className="at-hint">이것 하나만 놓고 보면, 어떻게 하는 게 좋겠습니까?</p>
            {!useVerdictCustom && (
              <div className="at-opts">
                {PART_OPTIONS.map((opt) => (
                  <button key={opt} className={`at-opt${answers.verdicts[list[currentIdx]] === opt ? " sel" : ""}`} onClick={() => classifyCurrent(opt)}>{opt}</button>
                ))}
              </div>
            )}
            {useVerdictCustom && (
              <>
                <textarea className="at-textarea" value={verdictCustomText} onChange={(e) => setVerdictCustomText(e.target.value)} placeholder="직접 적어보세요" />
                <div className="at-actions-row">
                  <button className="at-back" onClick={() => setUseVerdictCustom(false)}>← 보기에서 고를게요</button>
                  <button className="at-next" disabled={!verdictCustomText.trim()} onClick={classifyCurrentCustom}>다음</button>
                </div>
              </>
            )}
            {!useVerdictCustom && (
              <div className="at-actions-row">
                <button className="at-back" onClick={() => { if (currentIdx > 0) setCurrentIdx((i) => i - 1); else setStep("s2"); }}>← 이전</button>
              </div>
            )}
          </>
        )}

        {step === "s3" && (
          <>
            <div className="at-step-label">세공</div>
            <div className="at-summary-card">
              <div className="at-summary-row">
                <div className="at-summary-label">처음 판단</div>
                <div className="at-summary-value">{leanValue()}</div>
              </div>
              <div className="at-summary-row">
                <div className="at-summary-label">하나씩 따로 보았을 때</div>
                <div className="at-summary-value">{list.map((item) => `${item} → ${answers.verdicts[item]}`).join("\n")}</div>
              </div>
            </div>
            <p className="at-q">이제 이것들을 다시 함께 놓고 보면, 어떻게 하는 게 좋겠습니까?</p>
            {!useRejudgeCustom && (
              <div className="at-opts">
                {REJUDGE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={`at-opt${answers.rejudgment === opt ? " sel" : ""}`}
                    onClick={() => {
                      if (opt === "직접 적기") setUseRejudgeCustom(true);
                      else { set("rejudgment", opt); setStep("s4"); }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {useRejudgeCustom && (
              <>
                <textarea className="at-textarea" value={answers.rejudgmentCustom} onChange={(e) => set("rejudgmentCustom", e.target.value)} placeholder="직접 적어보세요" />
                <div className="at-actions-row">
                  <button className="at-back" onClick={() => setUseRejudgeCustom(false)}>← 보기에서 고를게요</button>
                  <button className="at-next" disabled={!answers.rejudgmentCustom.trim()} onClick={() => { set("rejudgment", "직접 적기"); setStep("s4"); }}>다음</button>
                </div>
              </>
            )}
            {!useRejudgeCustom && (
              <div className="at-actions-row">
                <button className="at-back" onClick={() => { setCurrentIdx(list.length - 1); setStep("s2a"); }}>← 이전</button>
              </div>
            )}
          </>
        )}

        {step === "s4" && (
          <>
            <div className="at-step-label">STEP 6</div>
            <div className="at-subject">"{rejudgmentValue()}"</div>
            <p className="at-q">{followupQuestion(direction)}</p>
            <textarea className="at-textarea" value={answers.followup} onChange={(e) => set("followup", e.target.value)} />
            {error && <p className="at-hint" style={{ color: "#c85f5f" }}>{error}</p>}
            <div className="at-actions-row">
              <button className="at-back" onClick={() => setStep("s3")}>← 이전</button>
              <button className="at-next" disabled={!answers.followup.trim()} onClick={goToResult}>결과 보기</button>
            </div>
          </>
        )}

        {step === "loading-result" && (
          <div className="at-loading">
            레고가 조각들을 맞춰보고 있습니다
            <div style={{ marginTop: 12 }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        {step === "result" && (
          <>
            <div className="at-result-block">
              <div className="at-result-label">기록된 사실</div>
              <div className="at-result-card">{answers.summary}</div>
            </div>
            <div className="at-final-label">제안</div>
            <div className="at-final-text">{answers.suggestion}</div>
            {onComplete && (
              <button className="at-complete" onClick={() => onComplete(answers)}>완료하고 Speculum으로 돌아가기</button>
            )}
            <button className="at-restart" onClick={restart}>처음부터 다시</button>
          </>
        )}
      </div>
    </div>
  );
}
