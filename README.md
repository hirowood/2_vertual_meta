# バーチャルスクールプラットフォーム（MVP版）

## 概要

障害や体調などで外に出られない人が、まるで外に出ているかのように学習・交流・就労できるインクルーシブなプラットフォームです。

## MVP機能

1. **ユーザー認証・登録** ✅
   - JWT認証
   - セキュアなログイン/ログアウト
   - セッション管理

2. **2D空間移動** ✅
   - Phaser.jsによる2Dゲーム空間
   - キーボード操作での移動
   - リアルタイムでの他プレイヤー表示

3. **テキストチャット** ✅
   - グローバルチャット
   - リアルタイム通信（Socket.io）
   - メッセージ履歴

4. **個人プロフィール管理** ✅
   - プロフィール編集
   - 自己紹介・ステータス設定
   - 興味・関心の登録

## 技術スタック

### フロントエンド
- **Framework:** Next.js 14 + TypeScript
- **Game Engine:** Phaser.js
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod

### バックエンド
- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** SQLite (開発) / PostgreSQL (本番)
- **ORM:** Prisma
- **Real-time:** Socket.io
- **Authentication:** JWT

## セットアップ手順

### 必要要件
- Node.js 18以上
- pnpm（推奨）またはnpm

### インストール

1. リポジトリのクローン
```bash
git clone [repository-url]
cd 2_vertual_meta
```

2. バックエンドのセットアップ
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

3. フロントエンドのセットアップ（新しいターミナルで）
```bash
cd frontend
npm install
npm run dev
```

### 環境変数

#### バックエンド（`backend/.env`）
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-key-here"
PORT=5000
NODE_ENV=development
```

#### フロントエンド（`frontend/.env.local`）
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 使用方法

1. ブラウザで http://localhost:3000 にアクセス
2. 新規登録またはログイン
3. ダッシュボードでバーチャル空間に入る
4. 矢印キーで移動、チャットで交流

## プロジェクト構成

```
2_vertual_meta/
├── frontend/          # Next.js フロントエンド
│   ├── src/
│   │   ├── app/      # ページコンポーネント
│   │   ├── components/  # 再利用可能コンポーネント
│   │   │   ├── game/    # ゲーム関連
│   │   │   ├── chat/    # チャット機能
│   │   │   └── profile/ # プロフィール機能
│   │   ├── lib/      # ユーティリティ
│   │   ├── stores/   # 状態管理
│   │   └── types/    # TypeScript型定義
│   └── public/       # 静的ファイル
│
└── backend/          # Express バックエンド
    ├── src/
    │   ├── config/   # 設定ファイル
    │   ├── controllers/ # APIコントローラー
    │   ├── middleware/  # ミドルウェア
    │   ├── routes/   # APIルート
    │   ├── socket/   # Socket.ioハンドラー
    │   ├── services/ # ビジネスロジック
    │   └── types/    # TypeScript型定義
    └── prisma/       # データベーススキーマ
```

## 今後の開発計画（Phase 1）

- [ ] 予約制ルーム機能
- [ ] 近接音声通話（WebRTC）
- [ ] 基本的な出席管理
- [ ] 日報・体調記録

## 開発者向け情報

### コマンド一覧

#### バックエンド
```bash
npm run dev      # 開発サーバー起動
npm run build    # ビルド
npm run start    # 本番サーバー起動
npm run lint     # リント実行
```

#### フロントエンド
```bash
npm run dev      # 開発サーバー起動
npm run build    # ビルド
npm run start    # 本番サーバー起動
npm run lint     # リント実行
```

### データベース操作
```bash
# マイグレーション作成
npx prisma migrate dev --name [migration-name]

# データベースリセット
npx prisma migrate reset

# Prisma Studio起動（GUI）
npx prisma studio
```

## ライセンス

[ライセンス情報を追加]

## 貢献

[貢献ガイドラインを追加]

## お問い合わせ

[連絡先情報を追加]
