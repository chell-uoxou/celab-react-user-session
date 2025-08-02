import { useState, useEffect, useCallback } from "react";

type StartOptions<T> = {
  maxAgeSec?: number; // 期限（秒）
  data?: T;
};

type ExperimentSessionHook<T = Record<string, unknown>> = {
  isSessionActive: boolean | null;
  isSessionLoading: boolean;
  userId: string | null;
  startSession: (userId: string, options: StartOptions<T>) => void;
  endSession: () => void;
  getData: (key: keyof T) => T[keyof T] | undefined;
  setData: (key: keyof T, value: T[keyof T]) => void;
};

type ExperimentSession<T = Record<string, unknown>> = {
  userId: string;
  expiresAt: number; //期限（ミリ秒）
  data: T;
};

// 1000ms * 60秒 * 60分 ＝> 1時間
const DEFAULT_SESSION_DURATION_MS = 1000 * 60;
const LOCALSTORAGE_KEY = "celab.experimentUserSession.v1";

export const useExperimentUserSession = <
  T = Record<string, unknown>
>(): ExperimentSessionHook<T> => {
  const [isSessionActive, setIsSessionActive] = useState<boolean | null>(null);
    const [session, setSession] = useState<ExperimentSession<T> | null>(null);

  const isSessionLoading = isSessionActive === null;
  const userId = session !== null ? session.userId : null;

  // 初期化処理：localStorageから復元
  useEffect(() => {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    if (stored) {
      const parsed: ExperimentSession<T> = JSON.parse(stored);
      const now = Date.now();

      if (now < parsed.expiresAt) {
        setSession(parsed);
        setIsSessionActive(true);
      } else {
        localStorage.removeItem(LOCALSTORAGE_KEY);
        setIsSessionActive(false);
        setSession(null);
      }
} else {
      setIsSessionActive(false);
      setSession(null);
    }
      }, []);

  // ログイン処理
  const startSession = useCallback(
    (userId: string, options: StartOptions<T>) => {
      const { data, maxAgeSec } = options;
      const expiresAt =
        Date.now() +
        (maxAgeSec ? maxAgeSec * 1000 : DEFAULT_SESSION_DURATION_MS);
      const newSession: ExperimentSession<T> = {
        userId,
        data: data ?? ({} as T),
        expiresAt,
      };
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(newSession));
      setSession(newSession);
      setIsSessionActive(true);
    },
    []
  );

  // ログアウト処理
  const endSession = useCallback(() => {
    localStorage.removeItem(LOCALSTORAGE_KEY);
    setSession(null);
    setIsSessionActive(false);
  }, []);

  // データ取得関数
  const getData = useCallback(
    (key: keyof T): T[keyof T] | undefined => {
      if (!session) {
        console.error("Session is not active");
        return undefined;
      }
      if (!session.data) {
        console.error("No data available in session");
        return undefined;
      }
      return session.data[key];
    },
    [session]
  );

  // データ設定関数
  const setData = (key: keyof T, value: T[keyof T]) => {
    if (session) {
      const updatedData: T = {
        ...session.data,
        [key]: value,
      } as T;
      const updatedSession: ExperimentSession<T> = {
        ...session,
        data: updatedData,
      };
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedSession));
      setSession(updatedSession);
    }
  };

  return {
    isSessionActive,
    isSessionLoading,
    userId,
    getData,
    setData,
    startSession,
    endSession,
  };
};
