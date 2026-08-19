import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { createInitialUserState } from "./schema";

const STORAGE_KEY = "pebbletrail.userState.v1";

function loadFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // 아주 기본적인 형태 검증 — 스키마가 완전히 달라지면 초기값으로 되돌린다.
    if (!parsed || typeof parsed !== "object" || !parsed.versions) return null;
    return parsed;
  } catch (e) {
    console.warn("[UserState] localStorage 읽기 실패, 초기값으로 시작합니다.", e);
    return null;
  }
}

function saveToStorage(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("[UserState] localStorage 저장 실패", e);
  }
}

// ---------------------------------------------------------------------------
// Reducer — raw/derived 분리, 세션 독립 저장 원칙을 여기서 강제한다.
// ---------------------------------------------------------------------------
function reducer(state, action) {
  switch (action.type) {
    case "RESET":
      return createInitialUserState();

    case "LECTIO_COMPLETE": {
      // payload: { raw, items, dominantDomain }
      return {
        ...state,
        lectio: {
          raw: action.payload.raw,
          items: action.payload.items,
          dominantDomain: action.payload.dominantDomain,
          completedAt: Date.now(),
        },
      };
    }

    case "MEDITATIO_SET_ANSWER": {
      // payload: { questionId, value }
      return {
        ...state,
        meditatio: {
          ...state.meditatio,
          raw: { ...state.meditatio.raw, [action.payload.questionId]: action.payload.value },
        },
      };
    }

    case "MEDITATIO_COMPLETE": {
      // payload: { derived }
      return {
        ...state,
        meditatio: {
          ...state.meditatio,
          derived: action.payload.derived,
          completedAt: Date.now(),
        },
      };
    }

    case "SPECULUM_ADD_SESSION": {
      // payload: SpeculumSession — 기존 세션을 절대 덮어쓰지 않고 새 세션으로 추가한다.
      return {
        ...state,
        speculumSessions: [...state.speculumSessions, action.payload],
      };
    }

    case "JUDGMENT_PATHS_SET": {
      // payload: { paths }
      return {
        ...state,
        judgmentPaths: action.payload.paths,
        judgmentPathsGeneratedAt: Date.now(),
      };
    }

    default:
      console.warn("[UserState] unknown action", action);
      return state;
  }
}

const UserStateContext = createContext(null);

export function UserStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadFromStorage() ?? createInitialUserState());

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const actions = useMemo(
    () => ({
      reset: () => dispatch({ type: "RESET" }),
      completeLectio: (payload) => dispatch({ type: "LECTIO_COMPLETE", payload }),
      setMeditatioAnswer: (questionId, value) => dispatch({ type: "MEDITATIO_SET_ANSWER", payload: { questionId, value } }),
      completeMeditatio: (derived) => dispatch({ type: "MEDITATIO_COMPLETE", payload: { derived } }),
      addSpeculumSession: (session) => dispatch({ type: "SPECULUM_ADD_SESSION", payload: session }),
      setJudgmentPaths: (paths) => dispatch({ type: "JUDGMENT_PATHS_SET", payload: { paths } }),
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <UserStateContext.Provider value={value}>{children}</UserStateContext.Provider>;
}

export function useUserState() {
  const ctx = useContext(UserStateContext);
  if (!ctx) throw new Error("useUserState must be used within UserStateProvider");
  return ctx;
}
