# バーチャルスクールプラットフォーム（フロントエンド/バックエンド分離版）

インクルーシブな仮想学習環境を提供するWebアプリケーション

## 概要

このプロジェクトは、様々な事情で外出が困難な方々が、まるで実際の学校にいるかのように学習や交流ができるプラットフォームです。

## アーキテクチャ

- **フロントエンド**: Next.js 14 (ポート3000)
- **バックエンド**: Express + TypeScript (ポート5000)
- **リアルタイム通信**: Socket.io
- **データベース**: SQLite（開発）/ PostgreSQL（本番）

## 機能（MVP）

- ✅ ユーザー認証（JWT）
- ✅ 2D空間でのキャラクター移動（Phaser.js）
- ✅ リアルタイムチャット
- ✅ ルーム機能
- ✅ プロフィール管理

## 技術スタック

### バックエンド (`/backend`)
- Express.js + TypeScript
- Prisma ORM
- Socket.io
- JWT認証
- bcryptjs

### フロントエンド (`/frontend`)
- Next.js 14 + TypeScript
- Phaser.js（ゲームエンジン）
- Tailwind CSS + shadcn/ui
- Zustand（状態管理）
- Socket.io-client
- Axios

## セットアップ

### 1. リポジトリのクローン

```bash
git clone [repository-url]
cd 2_vertual_meta
```

### 2. バックエンドのセットアップ

```bash
cd backend

# 依存関係のインストール
npm install

# 環境変数の設定（.envファイルを編集）
# DATABASE_URL, JWT_SECRET等を設定

# Prismaのセットアップ
npx prisma generate
npx prisma db push

# 開発サーバーの起動
npm run dev
```

バックエンドは http://localhost:5000 で起動します。

### 3. フロントエンドのセットアップ

新しいターミナルで：

```bash
cd frontend

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

フロントエンドは http://localhost:3000 で起動します。

## API エンドポイント

### 認証 (`/api/auth`)
- `POST /register` - ユーザー登録
- `POST /login` - ログイン
- `GET /me` - 現在のユーザー情報取得
- `PUT /change-password` - パスワード変更

### ユーザー (`/api/users`)
- `GET /` - ユーザー一覧取得
- `PUT /profile` - プロフィール更新
- `PUT /position` - 位置情報更新
- `GET /positions` - オンラインユーザーの位置取得

### チャット (`/api/chat`)
- `GET /messages` - メッセージ取得
- `POST /messages` - メッセージ送信
- `DELETE /messages/:id` - メッセージ削除

### ルーム (`/api/rooms`)
- `GET /` - ルーム一覧取得
- `POST /` - ルーム作成（教師・管理者のみ）
- `PUT /:id` - ルーム更新（教師・管理者のみ）
- `DELETE /:id` - ルーム削除（管理者のみ）

## Socket.io イベント

### クライアント → サーバー
- `user:join` - ユーザー参加
- `user:move` - 位置移動
- `chat:message` - メッセージ送信
- `room:enter` - ルーム参加
- `room:leave` - ルーム退出
- `chat:typing` - タイピング通知

### サーバー → クライアント
- `user:joined` - 他ユーザーの参加通知
- `user:moved` - 他ユーザーの移動通知
- `user:left` - 他ユーザーの退出通知
- `chat:message` - メッセージ受信
- `chat:user_typing` - タイピング通知
- `users:online` - オンラインユーザー一覧

## プロジェクト構成

```
2_vertual_meta/
├── backend/               # Expressバックエンド
│   ├── src/
│   │   ├── config/       # 設定
│   │   ├── controllers/  # コントローラー
│   │   ├── middleware/   # ミドルウェア
│   │   ├── routes/       # ルート定義
│   │   ├── socket/       # Socket.ioハンドラー
│   │   ├── types/        # 型定義
│   │   └── server.ts     # エントリーポイント
│   ├── prisma/           # Prismaスキーマ
│   └── package.json
│
├── frontend/             # Next.jsフロントエンド
│   ├── src/
│   │   ├── components/   # UIコンポーネント
│   │   ├── contexts/     # Reactコンテキスト
│   │   ├── hooks/        # カスタムフック
│   │   ├── lib/          # ユーティリティ
│   │   ├── pages/        # ページコンポーネント
│   │   ├── stores/       # Zustandストア
│   │   ├── styles/       # スタイル
│   │   └── types/        # 型定義
│   └── package.json
│
└── README.md
```

## 本番環境へのデプロイ

### バックエンド
1. PostgreSQLデータベースをセットアップ
2. 環境変数を本番用に設定
3. `npm run build`でビルド
4. `npm start`で起動

### フロントエンド
1. 環境変数を本番用に設定
2. `npm run build`でビルド
3. `npm start`で起動
4. または、Vercelにデプロイ

## ライセンス

MIT

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。
