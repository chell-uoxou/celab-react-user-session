# @celab/react-user-session
研究実験システム向けの、被験者セッション管理を簡単に行うReact hookです。
React 19以降のバージョンで動作します。

## 概要
`@celab/react-user-session` は、研究の実験システムなどで、「どの被験者が実験システムを使っているのか」を手軽にブラウザに保存できる React フックです。

* **ブラウザに情報を自動保存**
  `startSession(userId)` を呼ぶだけで、ブラウザの`localStorage` に被験者の情報が保存されます。
* **再読み込み時も状態を維持**
  現在どの被験者が実験システムを使っているかの被験者IDがブラウザに記憶し、ページの再読み込み後も状態が維持されるので、毎回ログインする必要がありません。
* **難しい設定は不要**
  `<UserSessionProvider>` でアプリ全体を包み、`useUserSession()` が返す関数や状態を呼び出すだけ。
* **任意のデータを保存可能**
  `startSession()` のオプションで、被験者に関する任意のデータ（氏名や学籍番号など）を保存できます。再読み込み時にメモリにロードされ、`getData(key)` で簡単に取得できます。
* **TypeScript 対応**
  TypeScript なら、セッション中に扱うデータの型を宣言できるため、キーの打ち間違いや型エラーを防ぎ安全に開発できます。
* **有効期限の自動管理**
  デフォルトで 7 日間、オプションで好きな秒数に設定可能。`touchSession()` で明示的な延長も可能です。

## 注意点
* **認証処理は外部で**
  このライブラリはログイン・ログアウトなどの認証フロー自体は提供しません。認証に成功した後、`startSession()` を呼び出してセッションを開始してください。

## インストール
```bash
npm install @celab/react-user-session

# yarnを使用している場合
yarn add @celab/react-user-session

# pnpmを使用している場合
pnpm add @celab/react-user-session
```

## 使用例
```tsx
// App.tsx
import { useUserSession } from '@celab/react-user-session';
import ExampleComponent from './ExampleComponent';

const App = () => {
  const { UserSessionProvider } = useUserSession();

  return (
    // UserSessionProviderでアプリケーション全体をラップします
    <UserSessionProvider>
      <ExampleComponent />
    </UserSessionProvider>
  );
}

```

```tsx
// ExampleComponent.tsx
import { useUserSession } from "@celab/react-user-session";

// あらかじめ追加データの型を定義しておくと...
export type SessionData = {
  name: string;
  studentNumber: number;
};

const ExampleComponent = () => {
  // フック使用時に型引数を指定することで、型安全に取得・保存ができます
  const { isSessionLoading, isSessionActive, startSession, getData, userId } =
    useUserSession<SessionData>();

  // 架空の認証システムを想定
  const auth = useAuth();

  // formのボタンがクリックされたときの処理
  const handleSubmitStartSession = (formData: FormData) => {
    const userId = formData.get("userId") as string;
    auth.login(userId).then(() => {
      // 認証成功時に、startSessionを呼び出してブラウザにセッション情報を保存
      startSession(userId, {
        data: {
          name: "田中 太郎",
          studentNumber: 12345678,
        },
        // セッションの有効期限を任意に設定できます
        // デフォルトでは7日間です
        maxAgeSec: 3600,
      });
    });
  };

  // localStorageからデータ取得中はisSessionLoadingがtrueになります
  if (isSessionLoading) return <div>Loading...</div>;

  // startSession()実行後はセッションが有効になり、
  // isSessionActiveがtrueになります
  if (!isSessionActive) {
    return (
      <div>
        被験者ログイン
        <br />
        <form action={handleSubmitStartSession}>
          <label>ユーザーID:</label>
          <button type="submit">セッション開始</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        被験者セッションが有効です <br />
        ユーザーID: {userId} <br />
        氏名: {getData("name") || "未設定"} <br /> {/* 田中 太郎 */}
        学籍番号: {getData("studentNumber") || "未設定"}　{/* 12345678 */}
      </div>
    );
  }
};

export default ExampleComponent;
```

## API
### `useUserSession<T extends object>()`
React hookを使用して、被験者セッションの状態や操作を提供します。

### 戻り値の型
```typescript
{
  isSessionActive: boolean | null;
  isSessionLoading: boolean;
  userId: string | null;
  startSession: (userId: string, options?: StartOptions<T>) => void;
  endSession: () => void;
  getData: (key: keyof T) => T[keyof T] | undefined;
  setData: (key: keyof T, value: T[keyof T]) => void;
  touchSession: (seconds?: number) => void;
};
```

### `<UserSessionProvider>`
被験者セッションの状態をアプリケーション全体で共有するためのコンテキストプロバイダーです。`useUserSession`フックを使用するコンポーネントは、このプロバイダーでラップされている必要があります。
```tsx
import { UserSessionProvider } from '@celab/react-user-session';

const App = () => {
  return (
    <UserSessionProvider>
      <ExampleComponent />
    </UserSessionProvider>
  );
};

```

## API（hookの返り値の各プロパティ）
### `isSessionActive`
ブラウザに有効な被験者セッションが存在するかどうかを示します。
- `true`: セッションが有効
- `false`: セッションが無効
- `null`: セッション情報が未読み込み

### `isSessionLoading`
ブラウザから被験者セッションを読み込んでいるかどうかを示します。
読み込み中UIの表示などに利用できます。
- `true`: ブラウザから被験者セッションを読み込み中
- `false`: 被験者セッションの読み込みが完了 

### `userId`
`startSession()`時に設定された、現在有効な被験者セッションのユーザーIDです。
- `null`: セッションがアクティブでない場合
- `string`: セッションがアクティブな場合はユーザーID
  - 例: `"2600210300-0"` （学籍番号）
  - 例: `"is1234ab"` （Rainbow ユーザーID）
  - 例: `"b4_tanaka_taro"` （氏名と学年の組み合わせ）
  - 例: `"test002"` （テストユーザー）
  - `null`（セッションがアクティブでない場合）

### `startSession(userId: string, options?: StartOptions<T>)`
被験者セッションを開始し、ブラウザに保存します。
- `userId`: ユーザーID（学籍番号やRainbow IDなど）**（必須）**
- `options`: オプションオブジェクト **（省略可能）**
  - `maxAgeSec`: セッションの有効期限（秒単位、デフォルトは7日間）
  - `data`: 任意のデータを保存するためのオブジェクト

### `endSession()`
セッションを終了し、localStorageから情報を削除します。ログアウトを行った際や、同端末で被験者を切り替える場合などに使用します。

### `getData(key: keyof T)`
現在の被験者セッションから追加データを取得します。
- `key`: 取得したいデータのキー
- 戻り値: セッションに保存されたデータ （存在しない場合は`undefined`）

### `setData(key: keyof T, value: T[keyof T])`
現在の被験者セッションに追加データを保存します。
- `key`: 保存したいデータのキー
- `value`: 保存する値 

### `touchSession(seconds?: number)`
セッションの有効期限を明示的に延長します。デフォルトでは7日間ですが、引数で秒数を指定できます。更新の結果、現行の有効期限より短くなる場合は、元の有効期限を保持します。
- `seconds`: 延長する秒数 **（省略時は7日間）**

