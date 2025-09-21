# Virtual School Platform - Backend

Express + TypeScript + Prisma + Socket.io を使用したバーチャルスクールプラットフォームのバックエンド

## 技術スタック

- **フレームワーク**: Express.js
- **言語**: TypeScript
- **データベース**: SQLite (開発) / PostgreSQL (本番)
- **ORM**: Prisma
- **リアルタイム通信**: Socket.io
- **認証**: JWT (アクセストークン + リフレッシュトークン)
- **バリデーション**: express-validator
- **ロギング**: Winston

## プロジェクト構造

```
backend/
├── src/
│   ├── config/         # 設定ファイル
│   │   ├── config.ts   # アプリケーション設定
│   │   ├── database.ts # データベース接続
│   │   └── logger.ts   # ロガー設定
│   ├── controllers/    # コントローラー（HTTPリクエスト処理）
│   ├── middleware/     # ミドルウェア
│   │   ├── auth.middleware.ts       # 認証・認可
│   │   ├── error.middleware.ts      # エラーハンドリング
│   │   └── validation.middleware.ts # バリデーション
│   ├── models/         # データモデル（将来用）
│   ├── routes/         # APIルート定義
│   ├── services/       # ビジネスロジック
│   ├── socket/         # Socket.io関連
│   │   └── handlers/   # イベントハンドラー
│   ├── types/          # TypeScript型定義
│   ├── utils/          # ユーティリティ関数
│   ├── validators/     # バリデーションルール
│   └── server.ts       # エントリーポイント
├── prisma/
│   └── schema.prisma   # データベーススキーマ
└── logs/               # ログファイル（自動生成）
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、以下の変数を設定：

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRE=30d

# CORS
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=debug
```

### 3. データベースのセットアップ

```bash
# Prismaクライアントの生成
npm run db:generate

# データベースのマイグレーション
npm run db:push

# Prisma Studioでデータベースを確認（オプション）
npm run db:studio
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

サーバーは http://localhost:5000 で起動します。

## スクリプト

- `npm run dev` - 開発サーバー起動（ホットリロード対応）
- `npm run build` - TypeScriptのビルド
- `npm start` - 本番サーバー起動
- `npm run db:generate` - Prismaクライアント生成
- `npm run db:push` - データベーススキーマ同期
- `npm run db:migrate` - マイグレーション実行
- `npm run db:studio` - Prisma Studio起動
- `npm run lint` - ESLintチェック
- `npm test` - テスト実行

## API エンドポイント

### 認証 (`/api/auth`)
- `POST /register` - ユーザー登録
- `POST /login` - ログイン
- `POST /refresh-token` - トークン更新
- `GET /me` - 現在のユーザー情報取得 🔒
- `POST /logout` - ログアウト 🔒
- `PUT /change-password` - パスワード変更 🔒

### ユーザー (`/api/users`)
- `GET /` - ユーザー一覧取得 🔒
- `GET /:id` - ユーザー詳細取得 🔒
- `PUT /:id` - ユーザー情報更新 🔒
- `DELETE /:id` - ユーザー削除 🔒👨‍💼
- `PUT /profile` - プロフィール更新 🔒
- `PUT /position` - 位置情報更新 🔒
- `GET /positions` - オンラインユーザー位置取得 🔒

### ルーム (`/api/rooms`)
- `GET /` - ルーム一覧取得 🔒
- `GET /:id` - ルーム詳細取得 🔒
- `POST /` - ルーム作成 🔒👨‍🏫
- `PUT /:id` - ルーム更新 🔒
- `DELETE /:id` - ルーム削除 🔒
- `POST /:id/join` - ルーム参加 🔒
- `POST /:id/leave` - ルーム退出 🔒

🔒 = 要認証  
👨‍💼 = 管理者のみ  
👨‍🏫 = 教師・管理者のみ

## Socket.io イベント

### クライアント → サーバー
- `user:join` - ユーザー参加
- `user:move` - 位置移動
- `chat:message` - メッセージ送信
- `chat:typing` - タイピング通知
- `room:enter` - ルーム入室
- `room:leave` - ルーム退室

### サーバー → クライアント
- `user:joined` - ユーザー参加通知
- `user:moved` - 位置移動通知
- `user:left` - ユーザー退出通知
- `users:online` - オンラインユーザー一覧
- `chat:message` - メッセージ受信
- `chat:user_typing` - タイピング通知
- `room:user_entered` - ルーム入室通知
- `room:user_left` - ルーム退室通知
- `error` - エラー通知

## 開発ガイドライン

### ディレクトリ構造の責務

1. **Controllers**: HTTPリクエスト/レスポンスの処理
2. **Services**: ビジネスロジックの実装
3. **Middleware**: 横断的関心事の処理
4. **Routes**: エンドポイントとコントローラーのマッピング
5. **Socket**: WebSocket通信の処理
6. **Utils**: 汎用的なユーティリティ関数
7. **Types**: TypeScript型定義
8. **Validators**: 入力検証ルール

### エラーハンドリング

- AppErrorクラスを使用してカスタムエラーをスロー
- グローバルエラーハンドラーで一元的に処理
- 適切なHTTPステータスコードを返却

### ログ

- Winstonを使用した構造化ログ
- 環境に応じたログレベル設定
- ファイル出力とコンソール出力の両対応

## テスト

```bash
npm test
```

## 本番環境へのデプロイ

1. 環境変数を本番用に設定
2. PostgreSQLデータベースをセットアップ
3. `npm run build`でビルド
4. `npm start`で起動

## ライセンス

MIT
