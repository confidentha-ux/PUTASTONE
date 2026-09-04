import React, { useEffect, useState } from "react";
import { useUserState } from "./state/UserStateContext";
import Login from "./screens/Login";
import Start from "./screens/Start";
import Home from "./screens/Home";
import Studiolo from "./screens/Studiolo";
import Ending from "./screens/Ending";
import Speculum from "./screens/Speculum";
import Lectio from "./components/Lectio";
import MeditatioV1 from "./components/MeditatioV1";

// App Shell — 2026-09-04 구조 수정본:
//   로그인 → 첫 화면(돌탑의 의미) → 홈(전체 흐름과 현재 위치) → 01 나를 받치는 돌 →
//   02 내 판단의 지형 → 03 다른 돌을 얹어보기(고민 가져오기 → 두 역할 추천 → 역할 시작하기 →
//   역할을 마치고 → 03을 마치며) → 현재의 돌탑(별도 공간, 홈에서 언제든 진입 가능)
// "지금의 판단"(구 CurrentJudgment)은 더 이상 별도 App 화면이 아니다 — 03 안의 내부 단계
// (concern/concernConfirm)로 흡수되었다. Speculum.jsx가 그 입력을 직접 들고 있다가
// Speculum Session의 Initial Judgment로 그대로 쓴다.
// 기존 "세 가지 경험" 화면은 삭제 — 첫 화면 버튼을 누르면 바로 홈으로 이동한다.
// 로그인은 실제 인증이 없다(백엔드 미구현) — 버튼을 누르면 바로 다음 화면으로 넘어간다.

const NAV = [
  { key: "home", label: "홈" },
  { key: "lectio", label: "받치는 돌" },
  { key: "meditatio", label: "판단 지형" },
  { key: "speculum", label: "다른 돌" },
  { key: "studiolo", label: "현재의 돌탑" },
];

const ONBOARDING_SCREENS = ["login", "start"];

export default function App() {
  const { state, actions, isLoggedIn, authLoading } = useUserState();
  const [screen, setScreen] = useState("login");
  const [showNav, setShowNav] = useState(!ONBOARDING_SCREENS.includes(screen));

  const goTo = (next) => {
    // "첫 여정을 마치며"는 01·02·03(최소 한 세션)을 처음 다 돈 뒤, 현재의 돌탑에 처음
    // 들어가기 직전에만 끼워 넣는다 — 그 뒤로는 studiolo로 바로 간다.
    const isFirstFullJourney =
      !state.hasSeenFirstJourneyEnding &&
      state.lectio.completedAt &&
      state.meditatio.completedAt &&
      state.speculumSessions.length >= 1;
    const target = next === "studiolo" && isFirstFullJourney ? "ending" : next;
    setScreen(target);
    setShowNav(!ONBOARDING_SCREENS.includes(target));
  };

  // 인증 확인이 끝났는데 이미 로그인되어 있으면(재방문, 또는 Google/이메일 인증 뒤 리다이렉트로
  // 돌아온 경우 포함) login 화면을 건너뛴다 — 인트로 시(start)는 로그인마다 한 번은 보여준다.
  useEffect(() => {
    if (!authLoading && isLoggedIn && screen === "login") {
      goTo("start");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isLoggedIn]);

  if (authLoading) {
    return <div style={{ minHeight: "100vh", background: "#eae6da" }} />;
  }

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
        {screen === "login" && <Login />}
        {screen === "start" && <Start onStart={() => goTo("home")} />}
        {screen === "home" && <Home onNavigate={goTo} />}
        {screen === "lectio" && <Lectio onComplete={() => goTo("meditatio")} />}
        {screen === "meditatio" && <MeditatioV1 onComplete={() => goTo("speculum")} />}
        {screen === "speculum" && <Speculum onNavigate={goTo} />}
        {screen === "ending" && (
          <Ending
            onDone={() => {
              actions.markEndingSeen();
              goTo("studiolo");
            }}
          />
        )}
        {screen === "studiolo" && <Studiolo onNavigate={goTo} />}
      </div>
    </div>
  );
}
