import { useState, useEffect, useCallback } from "react";

type StartOptions = {
  id: string;
  name: string;
  maxAgeSec?: number; // 期限（秒）
};

type ExperimentSessionHook = {
  isSessionActive: boolean;
  user: Omit<User, "expiresAt"> | null;
  startSession: (options: StartOptions) => void;
  endSession: () => void;
};

type User = {
  id: string;
  name: string;
  expiresAt: number; //期限（ミリ秒）
};

// 1000ms * 60秒 * 60分 ＝> 1時間
const DEFAULT_SESSION_DURATION_MS = 1000 * 60;

export const useExperimentUserSession = (): ExperimentSessionHook => {
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [user, setUser] = useState<Omit<User, "expiresAt"> | null>(null);

  // 初期化処理：localStorageから復元
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed: User = JSON.parse(stored);
      const now = Date.now();

      if (now < parsed.expiresAt) {
        setUser({ id: parsed.id, name: parsed.name });
        setIsSessionActive(true);
      } else {
        localStorage.removeItem("user");
        setIsSessionActive(false);
        setUser(null);
      }
    }
  }, []);

  // ログイン処理
  const startSession = useCallback((options: StartOptions) => {
    const { id, name, maxAgeSec } = options;
    const expiresAt =
      Date.now() + (maxAgeSec ? maxAgeSec * 1000 : DEFAULT_SESSION_DURATION_MS);
    const newUser: User = { id, name, expiresAt };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser({ id, name });
    setIsSessionActive(true);
  }, []);

  // ログアウト処理
  const endSession = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    setIsSessionActive(false);
  }, []);
  return {
    isSessionActive,
    user,
    startSession,
    endSession,
  };
};
