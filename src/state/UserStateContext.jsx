import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { createInitialUserState } from "./schema";
import { supabase } from "../lib/supabaseClient";
import {
  loadUserStateFromSupabase,
  saveLectioToSupabase,
  saveMeditatioAnswerToSupabase,
  saveMeditatioCompleteToSupabase,
  saveSpeculumSessionToSupabase,
  saveJudgmentPathsToSupabase,
} from "./supabaseSync";

const STORAGE_KEY = "pebbletrail.userState.v1";

// localStorage는 계속 "즉시 쓰는 로컬 캐시"로 남겨둔다 — Supabase 요청이 오가는 동안에도 화면은
// 바로바로 반응해야 하고, 로그인 전(게스트) 상태에서도 앱이 그대로 동작해야 하기 때문이다.
// 로그인된 사용자의 진짜 소스는 Supabase이고, localStorage는 그 캐시 역할만 한다.
function loadFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
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

    case "REPLACE":
      // Supabase에서 막 불러온 상태로 전체 교체 (로그인 직후에만 쓴다).
      return action.payload;

    case "LECTIO_COMPLETE": {
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
      return {
        ...state,
        meditatio: {
          ...state.meditatio,
          raw: { ...state.meditatio.raw, [action.payload.questionId]: action.payload.value },
        },
      };
    }

    case "MEDITATIO_COMPLETE": {
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
      return {
        ...state,
        speculumSessions: [...state.speculumSessions, action.payload],
      };
    }

    case "JUDGMENT_PATHS_SET": {
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
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 인증 상태 추적 — 이미 로그인되어 있으면(다른 기기에서 로그인한 세션 포함) 여기서 잡힌다.
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
      })
      .catch((e) => {
        console.warn("[UserState] 인증 상태 확인 실패(Supabase 미설정 또는 네트워크 오류) — 게스트 모드로 계속합니다.", e);
      })
      .finally(() => {
        setAuthLoading(false);
      });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // 로그인되면 Supabase에 저장된 상태를 불러와서 로컬 상태를 덮어쓴다.
  // (Supabase에 아직 아무 데이터가 없는 최초 로그인이면 로컬 상태를 그대로 유지한다.)
  useEffect(() => {
    if (!session?.user) return;
    let cancelled = false;
    loadUserStateFromSupabase(session.user.id).then((remote) => {
      if (cancelled || !remote) return;
      const hasAnyRemoteData =
        remote.lectio.completedAt || remote.meditatio.completedAt || remote.speculumSessions.length > 0;
      if (hasAnyRemoteData) dispatch({ type: "REPLACE", payload: remote });
    });
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const userId = session?.user?.id ?? null;

  const actions = useMemo(
    () => ({
      reset: () => dispatch({ type: "RESET" }),
      completeLectio: (payload) => {
        dispatch({ type: "LECTIO_COMPLETE", payload });
        if (userId) saveLectioToSupabase(userId, payload);
      },
      setMeditatioAnswer: (questionId, value) => {
        dispatch({ type: "MEDITATIO_SET_ANSWER", payload: { questionId, value } });
        if (userId) saveMeditatioAnswerToSupabase(userId, { ...state.meditatio.raw, [questionId]: value });
      },
      completeMeditatio: (derived) => {
        dispatch({ type: "MEDITATIO_COMPLETE", payload: { derived } });
        if (userId) saveMeditatioCompleteToSupabase(userId, derived);
      },
      addSpeculumSession: (session_) => {
        dispatch({ type: "SPECULUM_ADD_SESSION", payload: session_ });
        if (userId) saveSpeculumSessionToSupabase(userId, session_);
      },
      setJudgmentPaths: (paths) => {
        dispatch({ type: "JUDGMENT_PATHS_SET", payload: { paths } });
        if (userId) saveJudgmentPathsToSupabase(userId, paths);
      },
    }),
    [userId, state.meditatio.raw]
  );

  const value = useMemo(
    () => ({ state, actions, session, authLoading, isLoggedIn: !!session?.user }),
    [state, actions, session, authLoading]
  );

  return <UserStateContext.Provider value={value}>{children}</UserStateContext.Provider>;
}

export function useUserState() {
  const ctx = useContext(UserStateContext);
  if (!ctx) throw new Error("useUserState must be used within UserStateProvider");
  return ctx;
}
