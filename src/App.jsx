import React, { useState } from "react";
import { useUserState } from "./state/UserStateContext";
import Start from "./screens/Start";
import Home from "./screens/Home";
import Studiolo from "./screens/Studiolo";
import Speculum from "./screens/Speculum";
import CurrentJudgment from "./screens/CurrentJudgment";
import Lectio from "./components/Lectio";
import MeditatioV1 from "./components/MeditatioV1";

// App Shell — claude/돌하나를-얹다-app-spec-v1.md 확정 흐름을 그대로 따른다:
//   (로그인은 로드맵 8번, 이번 범위 밖) → 시작 → Lectio → Meditatio → 지금의 판단(신설) →
//   Speculum(Operation 선택 → Persona) → 현재의 돌탑(첫 진입) → HOME → 이후 반복 사용
//
// "지금의 판단" 화면(CurrentJudgment)에서 받은 두 번째 입력이 Speculum Session의
// Initial Judgment가 되어 Speculum.jsx로 그대로 전달된다.

const NAV = [
  { key: "home", label: "홈" },
  { key: "lectio", label: "Lectio" },
  { key: "meditatio", label: "Meditatio" },
  { key: "speculum", label: "Speculum" },
  { key: "studiolo", label: "현재의 돌탑" },
];

export default function App() {
  const { state } = useUserState();
  const [screen, setScreen] = useState(state.meditatio.completedAt ? "home" : "start");
  const [showNav, setShowNav] = useState(screen !== "start");
  const [currentJudgment, setCurrentJudgment] = useState(null);

  const goTo = (next) => {
    setScreen(next);
    setShowNav(next !== "start");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {showNav && (
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: "10px 16px",
            background: "#0f0d14",
            borderBottom: "1px solid rgba(49,53,45,0.1)",
          }}
        >
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => goTo(item.key)}
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                border: "none",
                background: screen === item.key ? "#5c7a5e" : "transparent",
                color: screen === item.key ? "#f2f4ef" : "#5f6354",
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

      <div style={{ flex: 1 }}>
        {screen === "start" && <Start onStart={() => goTo("lectio")} />}
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
