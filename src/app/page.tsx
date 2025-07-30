"use client";

import React, { use, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { login, isLoggedIn, user, logout } = useAuth();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id && name) {
      setShowConfirm(true);
    }
  };
  const confirmLogin = () => {
    login({ id, name });
    console.log(id, name);
    setShowConfirm(false);
  }

  return (
    <div>
      {/* 必要でなければコメントアウト */}
      {isLoggedIn ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white border border-gray-300 rounded p-6 w-full max-w-md shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              以下でログイン中<br />
              ID：{user?.id}<br />
              {user?.name}
            </h2>
            <button
              onClick={logout}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              ログアウト
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <h2 className="text-2xl font-semibold mb-4">ログインフォーム</h2>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md w-full max-w-md"
          >
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">ID：</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 font-medium text-gray-700">名前：</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              ログイン
            </button>
          </form>

          {/* モーダル */}
          {showConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm text-center">
                <p className="text-lg mb-4">
                  以下でログインしますか？<br />
                  ID: {id}<br />
                  名前：{name}
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

export default LoginPage;
