# Virtual School Platform

インクルーシブな仮想学校プラットフォーム - MVP版

## 🎯 プロジェクト概要

障害や体調などで外に出られない人が、まるで外に出ているかのように学習・交流・就労できるプラットフォームです。

### 主要機能（MVP）
- ✅ ユーザー認証（JWT）
- ✅ 基本的なダッシュボード
- ✅ Socket.io接続
- 🚧 2D空間移動（Phaser.js）
- 🚧 リアルタイムチャット
- 🚧 プロフィール管理

## 🚀 クイックスタート

### 必要な環境
- Node.js 18.0.0以上
- npm 9.0.0以上

### セットアップ手順

1. **バックエンドのセットアップ**
```bash
# バックエンドの依存関係をインストール
./install-backend.bat

# データベースの初期化
cd backend
npm run db:push
npm run db:generate
```

2. **フロントエンドのセットアップ**
```bash
# フロントエンドの依存関係をインストール
./install-frontend.bat
```

3. **開発サーバーの起動**
```bash
# 両方のサーバーを同時に起動
./start-all.bat

# または個別に起動
# バックエンド
cd backend && npm run dev

# フロントエンド
cd frontend && npm run dev
```

### アクセスURL
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:5000
- Prisma Studio: http://localhost:5555

## 📁 プロジェクト構造

```
/
├── backend/          # Express + TypeScript バックエンド
│   ├── src/
│   │   ├── config/   # 設定ファイル
│   │   ├── controllers/  # コントローラー
│   │   ├── middleware/   # ミドルウェア
│   │   ├── routes/       # APIルート
│   │   ├── services/     # ビジネスロジック
│   │   ├── types/        # TypeScript型定義
│   │   └── utils/        # ユーティリティ
│   ├── prisma/       # Prismaスキーマ
│   └── .env          # 環境変数
│
└── frontend/         # Next.js 14 フロントエンド
    ├── src/
    │   ├── app/          # Next.js App Router
    │   ├── components/   # Reactコンポーネント
    │   ├── lib/          # ライブラリ・ユーティリティ
    │   ├── stores/       # Zustand状態管理
    │   └── types/        # TypeScript型定義
    └── .env.local        # 環境変数
```

## 🔧 技術スタック

### フロントエンド
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (状態管理)
- Socket.io-client
- Phaser.js (2D空間)
- React Hook Form + Zod

### バックエンド
- Express
- TypeScript
- Prisma ORM
- SQLite (開発) / PostgreSQL (本番)
- Socket.io
- JWT認証
- bcrypt

## 🔑 環境変数

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Virtual School Platform
```

## 📝 開発メモ

### 現在の実装状況
- ✅ バックエンドAPI構造
- ✅ 認証システム（JWT）
- ✅ フロントエンド基本構造
- ✅ ログイン/登録フォーム
- ✅ ダッシュボード画面
- ✅ Socket.io接続

### 次の実装予定
- [ ] Phaser.jsによる2D空間
- [ ] リアルタイムチャット機能
- [ ] ユーザープロフィール編集
- [ ] ルーム管理機能

## 🐛 トラブルシューティング

### よくある問題と解決方法

1. **JWTエラーが発生する**
   - `auth.utils.ts`のexpiresInの型エラーは修正済み

2. **フロントエンドが起動しない**
   - `npm install`を再実行
   - `.next`フォルダを削除して再ビルド

3. **Socket.ioが接続できない**
   - バックエンドが起動していることを確認
   - CORSの設定を確認

## 📄 ライセンス

MIT

## 👥 コントリビューション

プルリクエストを歓迎します！

---

**開発中のプロジェクトです。機能は段階的に追加されていきます。**
