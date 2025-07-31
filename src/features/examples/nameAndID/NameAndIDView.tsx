"use client";

import React, { useState } from "react";
import { useExperimentUserSession } from "@/hooks/useExperimentUserSession";

type SessionData = {
  name: string;
};

const NameAndIDView = () => {
  const {
    startSession,
    isSessionActive,
    userId,
    endSession,
    getData,
    isSessionLoading,
  } = useExperimentUserSession<SessionData>();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      setShowConfirm(true);
    }
  };

  const confirmLogin = () => {
    startSession(id, { data: { name }, maxAgeSec: 3600 });
    console.log(id, name);
    setShowConfirm(false);
  };

  return (
    <div>
      {!isSessionLoading && isSessionActive ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white border border-gray-300 rounded p-6 w-full max-w-md shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              実験者セッションが有効です
            </h2>
            <p className="text-start mb-4 w-fit mx-auto font-mono">
              ID: {userId}
              <br />
              氏名: {getData("name") || "未設定"}
            </p>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={endSession}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-fit"
              >
                実験者セッションを終了
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition w-fit"
              >
                アプリを再読み込み
              </button>
            </div>
          </div>
        </div>
      ) : isSessionLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-gray-600 text-lg">セッションを読み込み中...</div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <h2 className="text-2xl font-semibold mb-4">
            実験者セッションのデモ
          </h2>
          <p className="text-gray-600 text-sm mb-6 max-w-md">
            このブラウザには現在有効な実験者セッションが見つかりませんでした。
            実験者IDを入力して実験者セッションを開始してみましょう！
            <span className="block h-2" />
            氏名は任意ですが、入力するとセッションデータに保存されます。
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md w-full max-w-md"
          >
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                ID（必須）
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 font-medium text-gray-700">
                氏名
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              実験者セッションを開始
            </button>
          </form>

          {/* モーダル */}
          {showConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm text-center">
                <p className="text-lg mb-4">
                  以下で実験者セッションを開始しますか？
                  <br />
                  ID: {id}
                  <br />
                  氏名：{name || "未設定"}
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={confirmLogin}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    はい
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    いいえ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NameAndIDView;
