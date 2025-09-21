# TypeScriptエラーの解決方法

## エラーの原因
Node.jsの型定義とパッケージがインストールされていないため、TypeScriptがNode.js環境の型を認識できない状態です。

## 解決手順

### 1. セットアップスクリプトを実行

プロジェクトルートで以下のコマンドを実行：

```batch
setup.bat
```

これにより、必要なパッケージがすべてインストールされます。

### 2. 手動でインストールする場合

#### バックエンドの依存関係をインストール

```bash
cd backend
npm install
```

#### Prismaのセットアップ

```bash
npm run db:generate
npm run db:push
```

### 3. VS Codeの再起動

依存関係をインストール後、VS Codeを再起動してTypeScriptサーバーをリロードします：

1. VS Codeで `Ctrl+Shift+P` を押す
2. "TypeScript: Restart TS Server" を選択

### 4. それでもエラーが解決しない場合

#### node_modulesを削除して再インストール

```bash
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install
```

#### TypeScriptのバージョン確認

```bash
npx tsc --version
```

TypeScript 5.0以上であることを確認してください。

### 5. 環境変数の確認

`backend/.env`ファイルが存在し、以下の内容が含まれていることを確認：

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

## インストールされる主要パッケージ

### 本番依存関係
- `@prisma/client` - Prisma ORM クライアント
- `express` - Webフレームワーク
- `dotenv` - 環境変数管理
- `jsonwebtoken` - JWT認証
- `bcryptjs` - パスワードハッシュ化
- `socket.io` - リアルタイム通信

### 開発依存関係
- `@types/node` - Node.jsの型定義
- `@types/express` - Expressの型定義
- `typescript` - TypeScriptコンパイラ
- `ts-node` - TypeScriptの直接実行
- `nodemon` - ファイル変更の監視と自動再起動

## 開発サーバーの起動

すべてのセットアップが完了したら：

```bash
# バックエンド
cd backend
npm run dev

# フロントエンド（別ターミナル）
cd frontend
npm run dev
```

または、両方を同時に起動：

```batch
start-dev.bat
```

## よくある問題と解決策

### "Cannot find module" エラー
- `node_modules`フォルダが存在することを確認
- `npm install`を再実行

### "Cannot find name 'process'" エラー
- `@types/node`がインストールされていることを確認
- `tsconfig.json`に`"types": ["node"]`が含まれていることを確認

### Prisma関連のエラー
- `npx prisma generate`を実行
- `npx prisma db push`を実行

## サポート

問題が解決しない場合は、以下の情報と共に報告してください：
- Node.jsのバージョン (`node -v`)
- npmのバージョン (`npm -v`)
- エラーメッセージの全文
- 実行したコマンドの順序
