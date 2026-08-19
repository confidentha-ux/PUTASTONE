import React, { useState } from "react";
import { useUserState } from "./state/UserStateContext";
import Start from "./screens/Start";
import Home from "./screens/Home";
import Studiolo from "./screens/Studiolo";
import Speculum from "./screens/Speculum";
import Lectio from "./components/Lectio";
import MeditatioV1 from "./components/MeditatioV1";

// App Shell — 구조 문서 확정 흐름을 그대로 따른다:
//   (로그인은 로드맵 8번, 이번 범위 밖) → 시작 → Lectio → Meditatio → Speculum(Family Routing까지)
//   → The Studiolo(첫 진입) → HOME → 이후 반복 사용
//
// Speculum은 Family Routing(어떤 렌즈가 왜 열렸는지)까지만 연결되어 있다 — 18개 persona 질문지
// 자체를 실행하는 것은 다음 로드맵 항목(Task #14)이라 아직 이 Shell에 없다. 로그인도 이번 범위 밖.

const NAV = [
  { key: "home", label: "홈" },
  { key: "lectio", label: "Lectio" },
  { key: "meditatio", label: "Meditatio" },
  { key: "speculum", label: "Speculum" },
  { key: "studiolo", label: "The Studiolo" },
];

export default function App() {
  const { state } = useUserState();
  const [screen, setScreen] = useState(state.meditatio.completedAt ? "home" : "start");
  const [showNav, setShowNav] = useState(screen !== "start");

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
            borderBottom: "1px solid rgba(236,231,222,0.1)",
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
                background: screen === item.key ? "#d6a756" : "transparent",
                color: screen === item.key ? "#1b1509" : "#7d7489",
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
        {screen === "meditatio" && <MeditatioV1 onComplete={() => goTo("speculum")} />}
        {screen === "speculum" && <Speculum onNavigate={goTo} />}
        {screen === "studiolo" && <Studiolo />}
      </div>
    </div>
  );
}
