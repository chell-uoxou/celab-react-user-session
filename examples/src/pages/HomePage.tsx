import ExampleLink from "../components/ExampleLink";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-16 mx-auto max-w-2xl my-10 px-10">
      <h1 className="text-3xl font-bold font-mono break-all">
        useUserSession()のデモ集
      </h1>
      <div className="flex flex-col gap-8">
        <ExampleLink
          href="/examples/name_and_id"
          title="IDに氏名を加えたセッションのデモ"
          description="任意のuserIDに加えて、string型の氏名をセッションデータに保存する例です。"
        />
      </div>
    </div>
  );
};

export default HomePage;
