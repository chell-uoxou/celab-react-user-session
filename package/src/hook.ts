"use client";

import { use } from "react";
import { UserSessionContext } from "./context";
import { UserSessionContextValue } from "./types";

/**
 * ## 被験者セッションフック
 * このフックは、ブラウザのlocalStorageを使用して被験者セッションを管理します。
 * セッションの開始、終了、追加データの取得・設定を行うことができます。
 * 追加データの型は、フック使用時に型引数で指定できます。
 *
 * @returns UserSessionContextValue<T>
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
export const useUserSession = <
  T extends object = Record<string, unknown>
>() => {
  const contextValue = use(
    UserSessionContext
  ) as UserSessionContextValue<T> | null;
  if (!contextValue) {
    throw new Error(
      "useUserSession() must be used within a UserSessionProvider"
    );
  }
  return contextValue;
};
