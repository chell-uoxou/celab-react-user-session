"use client";

import { DEFAULT_SESSION_DURATION_MS, LOCALSTORAGE_KEY } from "@/constants";
import { StartOptions, UserSession, UserSessionContextValue } from "@/types";
import {
  getSessionFromLocalStorage,
  safeLocalStorageRemove,
  safeLocalStorageSet,
} from "@/utils";
import { useState, useEffect, useCallback, PropsWithChildren } from "react";
import { UserSessionContext } from "./context";

/**
 * ## 被験者セッションフック
 * このフックは、ブラウザのlocalStorageを使用して被験者セッションを管理します。
 * セッションの開始、終了、追加データの取得・設定を行うことができます。
 * 追加データの型は、フック使用時に型引数で指定できます。
 *
 * @returns UserSessionHook<T>
 *
 * @example
 * ```tsx
 * // あらかじめ追加データの型を定義しておくと...
 * type SessionData = {
 *  name: string;
 *  studentNumber: number;
 * };
 *
 * // フック使用時に型引数を指定できます
 * const { isSessionLoading, isSessionActive, startSession, getData, userId } = useUserSession<SessionData>();
 *
 * // 認証成功時などに、セッションを開始
 * // ユーザーIDとしてRainbowユーザーIDを使用し、追加データとして氏名を保存
 * startSession("is1234ab", {
 *   data: { name: "田中 太郎", studentNumber: 12345678 },
 *   maxAgeSec: 3600, // 1時間
 * });
 *
 * if (isSessionLoading)
 *  return <div>Loading...</div>;
 *
 * if (!isSessionActive){
 *   return <div>ログインしてください</div>;
 * } else {
 *   return (
 *     <div>
 *       被験者セッションが有効です <br />
 *       ユーザーID: {userId} <br />
 *       氏名: {getData("name") || "未設定"} <br />
 *       学籍番号: {getData("studentNumber") || "未設定"}
 *     </div>
 *   );
 * }
 */
export const UserSessionProvider = <
  T extends object = Record<string, unknown>
>({
  children,
}: PropsWithChildren) => {
  const [isSessionActive, setIsSessionActive] = useState<boolean | null>(null);
  const [session, setSession] = useState<UserSession<T> | null>(null);

  const isSessionLoading = isSessionActive === null;
  const userId = session !== null ? session.userId : null;

  const _touchSession = useCallback(
    (oldSession: UserSession<T>, seconds?: number) => {
      const durationMs =
        seconds !== undefined ? seconds * 1000 : DEFAULT_SESSION_DURATION_MS;
      const baseExpiresAt = Date.now() + durationMs;

      // もともとのセッションの有効期限と比較して、より長い方を選択
      const newExpiresAt = Math.max(oldSession.expiresAt, baseExpiresAt);
      const updatedSession: UserSession<T> = {
        ...oldSession,
        expiresAt: newExpiresAt,
      };

      safeLocalStorageSet(LOCALSTORAGE_KEY, JSON.stringify(updatedSession));
      return updatedSession;
    },
    []
  );

  const touchSession = useCallback(
    (seconds?: number) => {
      if (!session) {
        console.warn("No active session to touch.");
        return;
      }
      const updatedSession = _touchSession(session, seconds);
      setSession(updatedSession);
      setIsSessionActive(true);
    },
    [_touchSession, session]
  );

  // localStorageから復元
  useEffect(() => {
    const parsedSession = getSessionFromLocalStorage<T>();
    if (parsedSession) {
      // マウント時にセッションが存在する場合は有効期限を更新
      const updatedSession = _touchSession(parsedSession);
      setIsSessionActive(true);
      setSession(updatedSession);
    } else {
      setSession(null);
      setIsSessionActive(false);
    }
  }, [_touchSession]);

  // ログイン処理
  const startSession = useCallback(
    (userId: string, options?: StartOptions<T>) => {
      const { data, maxAgeSec } = options || {};

      const expiresAt =
        Date.now() +
        (maxAgeSec !== undefined
          ? maxAgeSec * 1000
          : DEFAULT_SESSION_DURATION_MS);

      const newSession: UserSession<T> = {
        userId,
        data: data ?? ({} as T),
        expiresAt,
      };

      safeLocalStorageSet(LOCALSTORAGE_KEY, JSON.stringify(newSession));
      setSession(newSession);
      setIsSessionActive(true);
    },
    []
  );

  // ログアウト処理
  const endSession = useCallback(() => {
    safeLocalStorageRemove(LOCALSTORAGE_KEY);
    setSession(null);
    setIsSessionActive(false);
  }, []);

  // データ取得関数
  const getData = useCallback(
    (key: keyof T): T[keyof T] | undefined => {
      if (!session) {
        return undefined;
      }
      if (!session.data) {
        return undefined;
      }
      return session.data[key];
    },
    [session]
  );

  // データ設定関数
  const setData = useCallback(
    (key: keyof T, value: T[keyof T]) => {
      if (session) {
        const updatedData: T = {
          ...session.data,
          [key]: value,
        } as T;
        const updatedSession: UserSession<T> = {
          ...session,
          data: updatedData,
        };
        safeLocalStorageSet(LOCALSTORAGE_KEY, JSON.stringify(updatedSession));
        setSession(updatedSession);
      }
    },
    [session]
  );

  const contextValue: UserSessionContextValue<T> = {
    isSessionLoading,
    isSessionActive,
    startSession,
    endSession,
    touchSession,
    getData,
    setData,
    userId,
  };

  return (
    <UserSessionContext value={contextValue}>{children}</UserSessionContext>
  );
};
