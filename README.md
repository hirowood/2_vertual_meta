# バーチャルスクールプラットフォーム

インクルーシブな仮想学習環境を提供するWebアプリケーション

## 🚀 クイックスタート

### 自動セットアップ（Windows）

```batch
# プロジェクトをダウンロード後、以下を実行
setup.bat
```

### 開発サーバーの起動

```batch
# 両方のサーバーを同時に起動
start-dev.bat
```

または手動で：

```bash
# Terminal 1 - バックエンド
cd backend
npm run dev

# Terminal 2 - フロントエンド
cd frontend
npm run dev
```

## 📁 プロジェクト構成

```
2_vertual_meta/
├── backend/               # Express バックエンド
│   ├── src/
│   │   ├── config/       # 設定
│   │   ├── controllers/  # コントローラー（HTTPリクエスト処理）
│   │   ├── middleware/   # ミドルウェア
│   │   ├── routes/       # APIルート
│   │   ├── services/     # ビジネスロジック
│   │   ├── socket/       # Socket.ioハンドラー
│   │   ├── types/        # 型定義
│   │   ├── utils/        # ユーティリティ
│   │   ├── validators/   # バリデーション
│   │   └── server.ts     # エントリーポイント
│   └── prisma/
│       └── schema.prisma # データベーススキーマ
│
├── frontend/             # Next.js フロントエンド
│   └── src/
│       ├── components/   # UIコンポーネント
│       ├── hooks/        # カスタムフック
│       ├── lib/          # ライブラリ設定
│       ├── pages/        # ページコンポーネント
│       ├── stores/       # 状態管理（Zustand）
│       ├── styles/       # スタイル
│       └── types/        # 型定義
│
├── setup.bat            # 自動セットアップスクリプト
├── start-dev.bat        # 開発サーバー起動スクリプト
└── README.md
```

## 🛠 技術スタック

### バックエンド
- **Express.js** - Webフレームワーク
- **TypeScript** - 型安全な開発
- **Prisma** - ORM
- **Socket.io** - リアルタイム通信
- **JWT** - 認証
- **SQLite/PostgreSQL** - データベース

### フロントエンド
- **Next.js 14** - Reactフレームワーク
- **TypeScript** - 型安全な開発
- **Phaser.js** - 2Dゲームエンジン
- **Tailwind CSS** - スタイリング
- **Zustand** - 状態管理
- **Socket.io-client** - リアルタイム通信

## ✨ 主要機能（MVP）

- 🔐 **ユーザー認証** - JWT認証、ロールベースアクセス制御
- 🎮 **2D空間移動** - Phaser.jsによるアバター移動
- 💬 **リアルタイムチャット** - Socket.ioによる即時メッセージング
- 🏫 **ルーム機能** - 公開/プライベートルームの作成・参加
- 👤 **プロフィール管理** - ユーザー情報の編集

## 🔧 手動セットアップ

### 必要要件
- Node.js 18.0以上
- npm または yarn

### 1. リポジトリのクローン
```bash
git clone [repository-url]
cd 2_vertual_meta
```

### 2. バックエンドセットアップ
```bash
cd backend
npm install
npm run db:generate
npm run db:push
npm run dev
```

### 3. フロントエンドセットアップ
```bash
cd frontend
npm install
npm run dev
```

### 4. アクセス
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:5000/api

## 🔑 環境変数

### バックエンド（`backend/.env`）
```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-jwt-secret-change-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### フロントエンド（`frontend/.env.local`）
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 📚 API ドキュメント

### 認証
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト

### ユーザー
- `GET /api/users` - ユーザー一覧
- `PUT /api/users/profile` - プロフィール更新
- `PUT /api/users/position` - 位置情報更新

### ルーム
- `GET /api/rooms` - ルーム一覧
- `POST /api/rooms` - ルーム作成
- `POST /api/rooms/:id/join` - ルーム参加

## 🎯 今後の実装予定

### Phase 1
- [ ] 近接音声通話（WebRTC）
- [ ] 日報・体調記録
- [ ] 出席管理システム

### Phase 2
- [ ] 学習支援機能
- [ ] イベントシステム
- [ ] ゲーミフィケーション要素

## 📝 ライセンス

MIT License

## 🤝 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて議論してください。

## 🐛 トラブルシューティング

### npm installでエラーが出る場合
```bash
# キャッシュをクリア
npm cache clean --force
# 再インストール
npm install
```

### データベースエラーが出る場合
```bash
cd backend
# データベースをリセット
rm prisma/dev.db
npm run db:push
```

### ポートが既に使用されている場合
- バックエンドポート（5000）を変更: `backend/.env`のPORTを編集
- フロントエンドポート（3000）を変更: `frontend/package.json`のdevスクリプトを編集

## 📞 サポート

問題が発生した場合は、GitHubのIssuesで報告してください。
