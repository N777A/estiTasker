# README

# EstiTasker
生成AIによる自動タスク作成、自動作業時間見積り機能付きのタスク管理ツールです <br >
タスク管理、タスクの一括作成、タスクの細分化、自動で作業時間見積りなどができます。<br >

# URL
ゲストログインボタンから、メールアドレスパスワードなしで機能を試すことができます。

# 使用技術
### バックエンド
- Ruby
- Ruby on Rails
- devise
- devise_token_auth
- rack-cors
- PostgreSQL
- Rspec

### フロントエンド
- Next.js
- React
- Typescript
- Material-UI
- dnd-kit
- day-js
- axios
- nookies
- tailwindcss

### 開発・デプロイツール,　その他
- AWS
  - AWS SDK
  - AWS Bedrock
- Docker/Docker-compose
- Github Actions
- Heroku
- Vercel

# Github Actions
- Githubへのpush時に、Rspecが自動で実行されます。
- masterへのpushで、Herokuに自動デプロイが実行されます。

# 機能一覧
- ユーザ登録、ログイン機能(devise, devise_token_auth)
- プロジェクト機能
  - プロジェクト名、プロジェクトの説明を登録、編集、削除
  - プロジェクト一覧
- セクション機能
  - セクションを追加、編集、削除
  - セクションの並べ替え(dnd-kit)
- タスク機能
  - タスク作成、編集、削除
  - タスクタイトル、memo、期日を設定
  - タスク見積時間を設定、編集
  - タスクの並べ替え(dnd-kit)
- AIによる自動作成機能(AWS Bedrock)
  - タスクのタイトルと説明を入力すると、AIがタスクと作業時間見積りを自動作成
  - 既存のタスクを更に細分化して自動作成
