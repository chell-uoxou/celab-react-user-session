import { useState, useEffect, useCallback } from "react";

type LoginOptions = {
    id: string,
    name: string,
    maxAgeSec?: number // 期限（秒）
}

type AuthHook = {
    isLoggedIn: boolean;
    user: Omit<User, "expiresAt"> | null;
    login: (options: LoginOptions) => void;
    logout: () => void;
};

type User = {
    id: string;
    name: string;
    expiresAt: number; //期限（ミリ秒）
}

// 1000ms * 60秒 * 60分 ＝> 1時間
const DEFAULT_SESSION_DURATION_MS = 1000 * 60;

export const useExperimentUserSession = (): AuthHook => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<Omit<User, "expiresAt"> | null>(null);

    // 初期化処理：localStorageから復元
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const parsed: User = JSON.parse(stored);
            const now = Date.now();

            if (now < parsed.expiresAt) {
                setUser({ id: parsed.id, name: parsed.name });
                setIsLoggedIn(true);
            } else {
                localStorage.removeItem("user");
                setIsLoggedIn(false);
                setUser(null);

            }
        }
    }, []);

    // ログイン処理
    const login = useCallback((options: LoginOptions) => {
        const { id, name, maxAgeSec } = options
        const expiresAt = Date.now() + (maxAgeSec ? maxAgeSec * 1000 : DEFAULT_SESSION_DURATION_MS);
        const newUser: User = { id, name, expiresAt };
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser({ id, name });
        setIsLoggedIn(true);
    }, []);

    // ログアウト処理
    const logout = useCallback(() => {
        localStorage.removeItem("user");
        setUser(null);
        setIsLoggedIn(false);
    }, []);
    return { isLoggedIn, user, login, logout };
};