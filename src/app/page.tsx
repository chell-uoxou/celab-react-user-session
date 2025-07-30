"use client";

import ExampleLink from "@/features/topPage/components/ExampleLink";

const LoginPage = () => {
  return (
    <div className="flex flex-col gap-16 mx-auto max-w-2xl my-10">
      <h1 className="text-3xl font-bold">
        <span className="font-mono">useCelabLoginSession()</span>の使用例集
      </h1>
      <div className="flex flex-col gap-8">
        <ExampleLink
          href="/examples/name_and_id"
          title="氏名とIDでログインする、デザインされたログイン画面の例"
          description="useCelabLoginSession()を使って、氏名とIDでログインする例です。"
        />
        <ExampleLink
          href="/examples/simple_only_id"
          title="IDのみでログインする、シンプルなHTMLのログイン画面の例"
          description="useCelabLoginSession()を使って、IDのみでログインする例です。"
        />
      </div>
    </div>
  );
};

export default LoginPage;
