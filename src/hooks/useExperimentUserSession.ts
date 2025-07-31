import { useState, useEffect, useCallback } from "react";

type StartOptions<T> = {
  maxAgeSec?: number; // 期限（秒）
  data?: T;
};

type ExperimentSessionHook<T = Record<string, unknown>> = {
  isSessionActive: boolean;
  userId: string | null;
  startSession: (userId: string, options: StartOptions<T>) => void;
  endSession: () => void;
  getData: (key: keyof T) => T[keyof T] | undefined;
  setData: (key: keyof T, value: T[keyof T]) => void;
};

type ExperimentSession<T = Record<string, unknown>> = {
  userId: string;
  expiresAt: number; //期限（ミリ秒）
  data?: T;
};

// 1000ms * 60秒 * 60分 ＝> 1時間
const DEFAULT_SESSION_DURATION_MS = 1000 * 60;

export const useExperimentUserSession = <
  T = Record<string, unknown>
>(): ExperimentSessionHook<T> => {
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [session, setSession] = useState<ExperimentSession<T> | null>(null);

  // 初期化処理：localStorageから復元
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed: ExperimentSession<T> = JSON.parse(stored);
      const now = Date.now();

      if (now < parsed.expiresAt) {
        setSession(parsed);
        setIsSessionActive(true);
      } else {
        localStorage.removeItem("user");
        setIsSessionActive(false);
        setSession(null);
      }
    }
  }, []);

  // ログイン処理
  const startSession = useCallback(
    (userId: string, options: StartOptions<T>) => {
      const { data, maxAgeSec } = options;
      const expiresAt =
        Date.now() +
        (maxAgeSec ? maxAgeSec * 1000 : DEFAULT_SESSION_DURATION_MS);
      const newSession: ExperimentSession<T> = { userId, data, expiresAt };
      localStorage.setItem("user", JSON.stringify(newSession));
      setSession(newSession);
      setIsSessionActive(true);
    },
    []
  );

  // ログアウト処理
  const endSession = useCallback(() => {
    localStorage.removeItem("user");
    setSession(null);
    setIsSessionActive(false);
  }, []);

  // データ取得関数
  const getData = useCallback(
    (key: keyof T): T[keyof T] | undefined => {
      return session?.data?.[key];
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
      localStorage.setItem("user", JSON.stringify(updatedSession));
      setSession(updatedSession);
    }
  };

  return {
    isSessionActive,
    userId: session?.userId || null,
    getData,
    setData,
    startSession,
    endSession,
  };
};
