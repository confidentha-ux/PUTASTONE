import React, { useState } from "react";
import { useUserState } from "./state/UserStateContext";
import Login from "./screens/Login";
import Purpose from "./screens/Purpose";
import ThreeExperiences from "./screens/ThreeExperiences";
import Start from "./screens/Start";
import Home from "./screens/Home";
import Studiolo from "./screens/Studiolo";
import Speculum from "./screens/Speculum";
import CurrentJudgment from "./screens/CurrentJudgment";
import Lectio from "./components/Lectio";
import MeditatioV1 from "./components/MeditatioV1";

// App Shell — claude/돌하나를-얹다-app-spec-v1.md 확정 흐름 + claude/renaissance-mirror-full-copy-v1.md·
// claude/온보딩 에 확정된 로그인/사용목적/세 가지 경험(브랜드명·라틴어만 교체)을 앞에 붙였다:
//   로그인 → 인트로(돌탑 시) → 사용목적 → 세 가지 경험 → Lectio → Meditatio → 지금의 판단(신설) →
//   Speculum(Operation 선택 → Persona) → 현재의 돌탑(첫 진입) → HOME → 이후 반복 사용
// 로그인은 실제 인증이 없다(백엔드 미구현) — 버튼을 누르면 바로 다음 화면으로 넘어간다.
//
// "지금의 판단" 화면(CurrentJudgment)에서 받은 두 번째 입력이 Speculum Session의
// Initial Judgment가 되어 Speculum.jsx로 그대로 전달된다.

const NAV = [
  { key: "home", label: "홈" },
  { key: "lectio", label: "받치는 돌" },
  { key: "meditatio", label: "판단 과정" },
  { key: "speculum", label: "다른 역할" },
  { key: "studiolo", label: "현재의 돌탑" },
];

const ONBOARDING_SCREENS = ["login", "start", "purpose", "threeExperiences"];

export default function App() {
  const { state } = useUserState();
  const [screen, setScreen] = useState(state.meditatio.completedAt ? "home" : "login");
  const [showNav, setShowNav] = useState(!ONBOARDING_SCREENS.includes(screen));
  const [currentJudgment, setCurrentJudgment] = useState(null);

  const goTo = (next) => {
    setScreen(next);
    setShowNav(!ONBOARDING_SCREENS.includes(next));
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {showNav && (
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: "10px 16px",
            background: "#f2eee0",
            borderBottom: "1px solid rgba(49,53,45,0.1)",
          }}
        >
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => goTo(item.key)}
              style={{
                padding: "6px 12px",
                borderRadius: 2,
                border: "none",
                background: screen === item.key ? "#1c1a17" : "transparent",
                color: screen === item.key ? "#eae6da" : "#847c6b",
                fontSize: 12.5,
                cursor: "pointer",
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {screen === "login" && <Login onDone={() => goTo("start")} />}
        {screen === "start" && <Start onStart={() => goTo("purpose")} />}
        {screen === "purpose" && <Purpose onDone={() => goTo("threeExperiences")} />}
        {screen === "threeExperiences" && <ThreeExperiences onDone={() => goTo("lectio")} />}
        {screen === "home" && <Home onNavigate={goTo} />}
        {screen === "lectio" && <Lectio onComplete={() => goTo("meditatio")} />}
        {screen === "meditatio" && <MeditatioV1 onComplete={() => goTo("judgment")} />}
        {screen === "judgment" && (
          <CurrentJudgment
            onComplete={(value) => {
              setCurrentJudgment(value);
              goTo("speculum");
            }}
          />
        )}
        {screen === "speculum" && <Speculum onNavigate={goTo} currentJudgment={currentJudgment} />}
        {screen === "studiolo" && <Studiolo />}
      </div>
    </div>
  );
}
