"use client";

import { Button } from "@/components/ui/button"
import { useState } from "react";
import { Switch } from "@/components/ui/switch"

export default function Pages() {
    const [isMysteryChecked, setIsMysteryChecked] = useState(false);
    const handleChangeSwitch = (checked: boolean) => {
        setIsMysteryChecked(checked);
    };
    return (
        <div className="flex flex-col items-center gap-4 bg-gray-200 p-10 m-10 rounded-2xl">
            <h2 className="font-bold text-2xl">確認</h2>
            <p className="text-red-400">変更を保存しますか</p>
            <Switch onCheckedChange={handleChangeSwitch} />
            <p className={isMysteryChecked ? "font-bold" : ""}>謎のスイッチ，{isMysteryChecked ? "オン！" : "オフ..."}</p>
            <div className="flex gap-2 items-center">
                <Button className="w-30 shadow-gray-500 hover:bg-blue-200 hover:text-black">保存</Button>
                <Button className="w-30 shadow-gray-500" variant={"secondary"}>キャンセル</Button>
            </div>
        </div>

    )
}