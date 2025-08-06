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
 * @template T - 追加データの型。デフォルトはRecord<string, unknown>。
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
