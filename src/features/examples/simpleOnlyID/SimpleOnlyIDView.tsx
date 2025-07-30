"use client";

import { useAuth } from "@/hooks/useAuth";
import React from "react";

const SimpleOnlyIDView = () => {
  const {} = useAuth();

  return (
    <div className="flex flex-col p-8">
      <h1 className="text-xl font-bold">実験システムにログイン</h1>
    </div>
  );
};

export default SimpleOnlyIDView;
