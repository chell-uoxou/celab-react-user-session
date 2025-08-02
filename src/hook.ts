"use client";

import { use } from "react";
import { UserSessionContext } from "./context";
import { UserSessionContextValue } from "./types";

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
