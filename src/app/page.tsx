"use client";

import ExampleLink from "@/features/topPage/components/ExampleLink";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex flex-col gap-2 mx-auto max-w-2xl my-10">
      <h1 className="text-3xl font-bold">
        <span className="font-mono">useCelabLoginSession()</span>の使用例集
      </h1>
      {/* <Link href={"/examples/name_and_id"}>氏名とIDでログインする例</Link> */}
      <ExampleLink
        href="/examples/name_and_id"
        title="氏名とIDでログインする例"
        description="useCelabLoginSession()を使って、氏名とIDでログインする例です。"
      />
    </div>
  );
};

export default LoginPage;
