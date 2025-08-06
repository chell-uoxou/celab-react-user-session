"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserSessionContextValue } from "./types";
import { createContext } from "react";

export const UserSessionContext =
  createContext<UserSessionContextValue<any> | null>(null);
