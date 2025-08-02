import { useState, useEffect, useCallback } from "react";

type StartOptions<T> = {
  maxAgeSec?: number; // 期限（秒）
  data?: T;
};

type UserSessionHook<T> = {
  /**
   * ## 被験者セッションが有効かどうか
   * ブラウザに有効な被験者セッションが存在するかどうかを示します。
   *
   * ### 取る値
   * - `true`: セッションが有効
   * - `false`: セッションが無効
   * - `null`: セッション情報が未読み込み
   */
  isSessionActive: boolean | null;

  /**
   * ## 被験者セッションが読み込み中かどうか
   * ブラウザから被験者セッションを読み込んでいるかどうかを示します。
   * 読み込み中UIの表示などに利用できます。
   *
   * ### 取る値
   * - `true`: ブラウザから被験者セッションを読み込み中
   * - `false`: 被験者セッションの読み込みが完了
   */
  isSessionLoading: boolean;

  /**
   * ## 被験者セッションのユーザーID
   * `startSession()`時に設定された、現在有効な被験者セッションのユーザーIDです。
   *
   * ### 取る値の型
   * - `null`: セッションがアクティブでない場合
   * - `string`: セッションがアクティブな場合はユーザーID
   *
   * ### 例
   * - `"2600210300-0"` （学籍番号）
   * - `"is1234ab"` （Rainbow ユーザーID）
   * - `"b4_tanaka_taro"` （氏名と学年の組み合わせ）
   * - `"test002"` （テストユーザー）
   * - `null`（セッションがアクティブでない場合）
   */
  userId: string | null;

  /**
   * ## 被験者セッションを開始する
   * ユーザーIDを指定して被験者セッションを開始し、ブラウザに保存します。
   *
   * ### 引数
   * - `userId`: ユーザーID（学籍番号やRainbow IDなど） （必須）
   * - `options`: オプションオブジェクト （任意）
   *   - `maxAgeSec`: セッションの有効期限（秒単位、デフォルトは7日間） （任意）
   *   - `data`: 任意のデータを保存するためのオブジェクト （任意）
   *
   * ### 例（ユーザーIDのみ、1週間の有効期限）
   * ```typescript
   * startSession("is1234ab");
   * ```
   *
   * ### 例（追加データ、有効期限の指定付き）
   * ```typescript
   * startSession("2600210300-0", {
   *   data: { name: "田中 太郎" },
   *   maxAgeSec: 3600 // 1時間
   * });
   * ```
   *
   * ### ユーザーIDの例
   * - `"23"` （連番の実験者ID）
   * - `"2600210300-0"` （学籍番号）
   * - `"is1234ab"` （Rainbow ユーザーID）
   * - `"b4_tanaka_taro"` （氏名と学年の組み合わせ）
   * - `"test002"` （テストユーザー）
   */
  startSession: (userId: string, options?: StartOptions<T>) => void;

  /**
   * ## 被験者セッションの終了
   * セッションを終了し、localStorageから情報を削除します。
   * 同端末で被験者を切り替える場合などに使用します。
   */
  endSession: () => void;

  /**
   * ## 現行の被験者セッションから追加データを取得する
   * セッションに保存された追加情報を取得します。
   *
   * ### 例
   * ```typescript
   * const name = getData("name"); // セッションにnameキーで保存された氏名を取得
   * ```
   */
  getData: (key: keyof T) => T[keyof T] | undefined;

  /**
   * ## 現行の被験者セッションに追加データを保存する
   * セッションに追加情報を保存します。
   *
   * ### 例
   * ```typescript
   * setData("name", "山田 花子"); // セッションのnameキーを"山田 花子"に更新
   * ```
   */
  setData: (key: keyof T, value: T[keyof T]) => void;
};

type UserSession<T> = {
  userId: string;
  expiresAt: number; //期限（ミリ秒）
  data: T;
};

const DEFAULT_SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7日間
const LOCALSTORAGE_KEY = "celab.userSession.v1";

function isValidUserSession<T>(value: unknown): value is UserSession<T> {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<UserSession<unknown>>;

  return (
    typeof candidate.userId === "string" &&
    typeof candidate.expiresAt === "number" &&
    typeof candidate.data === "object" &&
    candidate.data !== null
  );
}

// localStorage操作を安全にラップするヘルパー
function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn("Failed to access localStorage.getItem", e);
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn("Failed to access localStorage.setItem", e);
  }
}

function safeLocalStorageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn("Failed to access localStorage.removeItem", e);
  }
}

function getSessionFromLocalStorage<T>(): UserSession<T> | null {
  const stored = safeLocalStorageGet(LOCALSTORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    if (isValidUserSession<T>(parsed)) {
      // 有効期限のチェック
      if (parsed.expiresAt > Date.now()) {
        return parsed;
      } else {
        // セッションが期限切れの場合は削除
        safeLocalStorageRemove(LOCALSTORAGE_KEY);
        return null;
      }
    } else {
      console.error("Invalid session data format in localStorage, removing.");
      safeLocalStorageRemove(LOCALSTORAGE_KEY);
      return null;
    }
  } catch (error) {
    console.error("Failed to parse session data from localStorage:", error);
    safeLocalStorageRemove(LOCALSTORAGE_KEY);
    return null;
  }
}

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
export const useUserSession = <
  T extends object = Record<string, unknown>
>(): UserSessionHook<T> => {
  const [isSessionActive, setIsSessionActive] = useState<boolean | null>(null);
  const [session, setSession] = useState<UserSession<T> | null>(null);

  const isSessionLoading = isSessionActive === null;
  const userId = session !== null ? session.userId : null;

  // localStorageから復元
  useEffect(() => {
    const session = getSessionFromLocalStorage<T>();
    if (session) {
      setIsSessionActive(true);
      setSession(session);
    } else {
      setSession(null);
      setIsSessionActive(false);
    }
  }, []);

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
