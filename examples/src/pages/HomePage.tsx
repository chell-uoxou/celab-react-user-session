import { Github, Hexagon } from "lucide-react";
import ExampleLink from "../components/ExampleLink";
import Button from "../components/Button";
import Command from "../components/Command";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-16 mx-auto max-w-2xl my-10 px-10">
      <h1 className="text-3xl font-bold font-mono break-all">
        useUserSession()のデモ集
      </h1>
      <div className="flex flex-col gap-4">
        <p>
          研究実験システム向けの、被験者セッション管理を簡単に行うReact
          hookです。
        </p>
        <div className="flex gap-4 w-full">
          <a
            href="https://github.com/yurayui/celab-auth-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              <Github className="inline-block mr-2" />
              GitHub
            </Button>
          </a>

          <a
            href="https://www.npmjs.com/package/@celab/react-user-session"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              <Hexagon className="inline-block mr-2" />
              npm
            </Button>
          </a>
        </div>
        <Command isCopyable>npm i @celab/react-user-session</Command>
      </div>
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
