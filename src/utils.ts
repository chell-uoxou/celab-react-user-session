import { LOCALSTORAGE_KEY } from "./constants";
import { UserSession } from "./types";

export function isValidUserSession<T>(value: unknown): value is UserSession<T> {
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
export function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn("Failed to access localStorage.getItem", e);
    return null;
  }
}

export function safeLocalStorageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn("Failed to access localStorage.setItem", e);
  }
}

export function safeLocalStorageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn("Failed to access localStorage.removeItem", e);
  }
}

export function getSessionFromLocalStorage<T>(): UserSession<T> | null {
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
