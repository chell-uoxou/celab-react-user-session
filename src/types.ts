export type StartOptions<T> = {
  maxAgeSec?: number; // 期限（秒）
  data?: T;
};

export type UserSession<T> = {
  userId: string;
  expiresAt: number; //期限（ミリ秒）
  data: T;
};

export type UserSessionContextValue<T> = {
  /**
   * ## 被験者セッションが有効かどうか
   * ブラウザに有効な被験者セッションが存在するかどうかを示します。
   *
   * ### 取る値
   * - `true`: セッションが有効
   * - `false`: セッションが無効
   * - `null`: セッション情報が未読み込み
   */
  isSessionActive: boolean | null;

  /**
   * ## 被験者セッションが読み込み中かどうか
   * ブラウザから被験者セッションを読み込んでいるかどうかを示します。
   * 読み込み中UIの表示などに利用できます。
   *
   * ### 取る値
   * - `true`: ブラウザから被験者セッションを読み込み中
   * - `false`: 被験者セッションの読み込みが完了
   */
  isSessionLoading: boolean;

  /**
   * ## 被験者セッションのユーザーID
   * `startSession()`時に設定された、現在有効な被験者セッションのユーザーIDです。
   *
   * ### 取る値の型
   * - `null`: セッションがアクティブでない場合
   * - `string`: セッションがアクティブな場合はユーザーID
   *
   * ### 例
   * - `"2600210300-0"` （学籍番号）
   * - `"is1234ab"` （Rainbow ユーザーID）
   * - `"b4_tanaka_taro"` （氏名と学年の組み合わせ）
   * - `"test002"` （テストユーザー）
   * - `null`（セッションがアクティブでない場合）
   */
  userId: string | null;

  /**
   * ## 被験者セッションを開始する
   * ユーザーIDを指定して被験者セッションを開始し、ブラウザに保存します。
   *
   * ### 引数
   * - `userId`: ユーザーID（学籍番号やRainbow IDなど） （必須）
   * - `options`: オプションオブジェクト （任意）
   *   - `maxAgeSec`: セッションの有効期限（秒単位、デフォルトは7日間） （任意）
   *   - `data`: 任意のデータを保存するためのオブジェクト （任意）
   *
   * ### 例（ユーザーIDのみ、1週間の有効期限）
   * ```typescript
   * startSession("is1234ab");
   * ```
   *
   * ### 例（追加データ、有効期限の指定付き）
   * ```typescript
   * startSession("2600210300-0", {
   *   data: { name: "田中 太郎 " },
   *   maxAgeSec: 3600 // 1時間
   * });
   * ```
   *
   * ### ユーザーIDの例
   * - `"23"` （連番の実験者ID）
   * - `"2600210300-0"` （学籍番号）
   * - `"is1234ab"` （Rainbow ユーザーID）
   * - `"b4_tanaka_taro"` （氏名と学年の組み合わせ）
   * - `"test002"` （テストユーザー）
   */
  startSession: (userId: string, options?: StartOptions<T>) => void;

  /**
   * ## 被験者セッションの終了
   * セッションを終了し、localStorageから情報を削除します。
   * 同端末で被験者を切り替える場合などに使用します。
   */
  endSession: () => void;

  /**
   * ## 現行の被験者セッションから追加データを取得する
   * セッションに保存された追加情報を取得します。
   *
   * ### 例
   * ```typescript
   * const name = getData("name"); // セッションにnameキーで保存された氏名を取得
   * ```
   */
  getData: (key: keyof T) => T[keyof T] | undefined;

  /**
   * ## 現行の被験者セッションに追加データを保存する
   * セッションに追加情報を保存します。
   *
   * ### 例
   * ```typescript
   * setData("name", "山田 花子"); // セッションのnameキーを"山田 花子"に更新
   * ```
   */
  setData: (key: keyof T, value: T[keyof T]) => void;

  /**
   * ## 被験者セッションの有効期限を更新する
   * セッションの有効期限を延長します。
   * デフォルトでは7日間ですが、引数で秒数を指定できます。
   * 更新の結果、原稿の有効期限より短くなる場合は、元の有効期限を保持します。
   *
   * ### 例
   * ```typescript
   * touchSession(); // デフォルトの7日間延長
   * touchSession(3600); // 1時間延長
   * ```
   */
  touchSession: (seconds?: number) => void;
};
