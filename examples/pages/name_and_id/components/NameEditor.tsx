import React from "react";
import { SessionData } from "../types/SessionData";
import { useUserSession } from "@/hook";

const NameEditor = () => {
  const { getData, setData } = useUserSession<SessionData>();

  return (
    <div className="flex flex-col items-start gap-4 mt-2 w-full">
      <hr className="border w-full" />
      <h2 className="font-semibold">被験者氏名を編集</h2>
      <p className="text-sm text-gray-600 text-start font-mono whitespace-pre-wrap">
        {
          "子コンポーネント<NameEditor>がuseUserSession()を使っている例です。\n同じProviderを親に持つ、どの子コンポーネントも被験者セッションのデータにアクセス・更新が可能です。"
        }
      </p>
      <form
        action={(formData: FormData) => {
          const name = formData.get("name") as string;
          setData("name", name);
        }}
        className="flex gap-4 h-10 w-full"
      >
        <input
          type="text"
          name="name"
          defaultValue={getData("name") || ""}
          placeholder="氏名を入力"
          className="flex-1 border p-2 rounded bg-white"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition"
        >
          更新
        </button>
      </form>
    </div>
  );
};

export default NameEditor;
