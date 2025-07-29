"use client";

import { useState } from "react";
import Counter from "../components/Counter";

export default function Home() {
  const [countState, setCountState] = useState(5);
  const tem = "晴れ";
  let count = 0;

  const handleClickFuyasu = () => {
    setCountState(countState + 1);
  };
  const handleClickHerasu = () => {
    setCountState(countState - 1);
  };


  return (
    <div>
      <h1>Hello</h1>
      <p>今日の天気は{tem}</p>
      <Counter />
      <Counter />
      <Counter />
      <Counter />

    </div>
  );
}
