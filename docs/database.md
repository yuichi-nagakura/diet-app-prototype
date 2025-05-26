# ダイエットアプリ データベース設計書

## 概要
本設計書は、ダイエットアプリの本番環境におけるデータベース設計を定義します。
RDBMSを想定し、PostgreSQLでの実装を前提としています。

## データベース構成

### スキーマ
- **public**: メインアプリケーションデータ
- **analytics**: 分析用集計データ

## テーブル一覧

### 1. users（ユーザー）
ユーザーの基本情報を管理

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| email | VARCHAR(255) | NO | - | メールアドレス（ユニーク） |
| password_hash | VARCHAR(255) | NO | - | パスワードハッシュ |
| name | VARCHAR(100) | NO | - | ユーザー名 |
| avatar_url | TEXT | YES | NULL | アバター画像URL |
| is_active | BOOLEAN | NO | true | アクティブフラグ |
| email_verified | BOOLEAN | NO | false | メール認証済みフラグ |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- `idx_users_email` (email)
- `idx_users_created_at` (created_at)

### 2. user_profiles（ユーザープロフィール）
ユーザーの詳細プロフィール情報

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| user_id | UUID | NO | - | ユーザーID（外部キー） |
| age | INTEGER | NO | - | 年齢 |
| gender | VARCHAR(10) | NO | - | 性別（male/female/other） |
| height | DECIMAL(5,2) | NO | - | 身長（cm） |
| current_weight | DECIMAL(5,2) | NO | - | 現在の体重（kg） |
| target_weight | DECIMAL(5,2) | NO | - | 目標体重（kg） |
| activity_level | VARCHAR(20) | NO | - | 活動レベル |
| diet_goal | VARCHAR(20) | NO | - | ダイエット目標（lose/maintain/gain） |
| timezone | VARCHAR(50) | NO | 'Asia/Tokyo' | タイムゾーン |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- `idx_user_profiles_user_id` (user_id)

**制約:**
- `chk_activity_level` CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active'))
- `chk_diet_goal` CHECK (diet_goal IN ('lose', 'maintain', 'gain'))
- `chk_gender` CHECK (gender IN ('male', 'female', 'other'))

### 3. foods（食品マスタ）
食品の基本情報と栄養成分

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| name | VARCHAR(255) | NO | - | 食品名 |
| name_kana | VARCHAR(255) | YES | NULL | 食品名カナ |
| brand | VARCHAR(100) | YES | NULL | ブランド名 |
| barcode | VARCHAR(50) | YES | NULL | バーコード |
| category_id | INTEGER | YES | NULL | カテゴリID（外部キー） |
| serving_size | DECIMAL(7,2) | NO | - | 1食分の量 |
| serving_unit | VARCHAR(20) | NO | - | 単位（g, ml等） |
| image_url | TEXT | YES | NULL | 画像URL |
| is_verified | BOOLEAN | NO | false | 検証済みフラグ |
| created_by | UUID | YES | NULL | 作成者ID |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- `idx_foods_name` (name)
- `idx_foods_barcode` (barcode)
- `idx_foods_category_id` (category_id)
- `idx_foods_name_trgm` USING gin (name gin_trgm_ops) -- 全文検索用

### 4. food_categories（食品カテゴリ）
食品のカテゴリマスタ

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | SERIAL | NO | - | プライマリキー |
| name | VARCHAR(100) | NO | - | カテゴリ名 |
| parent_id | INTEGER | YES | NULL | 親カテゴリID |
| sort_order | INTEGER | NO | 0 | 表示順 |
| icon | VARCHAR(50) | YES | NULL | アイコン |

### 5. nutrition_info（栄養情報）
食品の栄養成分詳細

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| food_id | UUID | NO | - | 食品ID（外部キー） |
| calories | DECIMAL(7,2) | NO | - | カロリー（kcal） |
| protein | DECIMAL(7,2) | NO | - | タンパク質（g） |
| carbs | DECIMAL(7,2) | NO | - | 炭水化物（g） |
| fat | DECIMAL(7,2) | NO | - | 脂質（g） |
| fiber | DECIMAL(7,2) | YES | 0 | 食物繊維（g） |
| sugar | DECIMAL(7,2) | YES | 0 | 糖質（g） |
| sodium | DECIMAL(7,2) | YES | 0 | ナトリウム（mg） |
| cholesterol | DECIMAL(7,2) | YES | 0 | コレステロール（mg） |
| saturated_fat | DECIMAL(7,2) | YES | NULL | 飽和脂肪酸（g） |
| trans_fat | DECIMAL(7,2) | YES | NULL | トランス脂肪酸（g） |
| calcium | DECIMAL(7,2) | YES | NULL | カルシウム（mg） |
| iron | DECIMAL(7,2) | YES | NULL | 鉄（mg） |
| vitamin_a | DECIMAL(7,2) | YES | NULL | ビタミンA（μg） |
| vitamin_c | DECIMAL(7,2) | YES | NULL | ビタミンC（mg） |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- `idx_nutrition_info_food_id` (food_id)

### 6. meals（食事記録）
ユーザーの食事記録

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| user_id | UUID | NO | - | ユーザーID（外部キー） |
| date | DATE | NO | - | 食事日 |
| meal_type | VARCHAR(20) | NO | - | 食事タイプ |
| meal_time | TIME | YES | NULL | 食事時刻 |
| image_url | TEXT | YES | NULL | 食事画像URL |
| notes | TEXT | YES | NULL | メモ |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- `idx_meals_user_id_date` (user_id, date)
- `idx_meals_meal_type` (meal_type)

**制約:**
- `chk_meal_type` CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack'))
- `unique_meal_type_per_day` UNIQUE (user_id, date, meal_type)

### 7. meal_foods（食事内容）
食事に含まれる食品の詳細

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| meal_id | UUID | NO | - | 食事ID（外部キー） |
| food_id | UUID | NO | - | 食品ID（外部キー） |
| quantity | DECIMAL(7,2) | NO | - | 数量 |
| unit | VARCHAR(20) | NO | - | 単位 |
| calories | DECIMAL(7,2) | NO | - | 実際のカロリー |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |

**インデックス:**
- `idx_meal_foods_meal_id` (meal_id)
- `idx_meal_foods_food_id` (food_id)

### 8. daily_progress（日次進捗）
日ごとの進捗記録

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| user_id | UUID | NO | - | ユーザーID（外部キー） |
| date | DATE | NO | - | 日付 |
| weight | DECIMAL(5,2) | YES | NULL | 体重（kg） |
| body_fat_percentage | DECIMAL(4,2) | YES | NULL | 体脂肪率（%） |
| muscle_mass | DECIMAL(5,2) | YES | NULL | 筋肉量（kg） |
| steps | INTEGER | YES | NULL | 歩数 |
| water_intake | INTEGER | YES | NULL | 水分摂取量（ml） |
| sleep_duration | INTEGER | YES | NULL | 睡眠時間（分） |
| sleep_quality | VARCHAR(20) | YES | NULL | 睡眠の質 |
| mood | VARCHAR(20) | YES | NULL | 気分 |
| notes | TEXT | YES | NULL | メモ |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- `idx_daily_progress_user_id_date` (user_id, date)
- `unique_progress_per_day` UNIQUE (user_id, date)

**制約:**
- `chk_sleep_quality` CHECK (sleep_quality IN ('poor', 'fair', 'good', 'excellent'))
- `chk_mood` CHECK (mood IN ('stressed', 'sad', 'neutral', 'happy', 'energetic'))

### 9. ai_advice（AIアドバイス）
AI栄養士からのアドバイス履歴

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| user_id | UUID | NO | - | ユーザーID（外部キー） |
| date | DATE | NO | - | アドバイス日付 |
| type | VARCHAR(20) | NO | - | アドバイスタイプ |
| title | VARCHAR(255) | NO | - | タイトル |
| content | TEXT | NO | - | 内容 |
| priority | VARCHAR(10) | NO | 'medium' | 優先度 |
| action_items | JSONB | YES | NULL | アクションアイテム |
| related_meal_id | UUID | YES | NULL | 関連する食事ID |
| is_read | BOOLEAN | NO | false | 既読フラグ |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |

**インデックス:**
- `idx_ai_advice_user_id_date` (user_id, date)
- `idx_ai_advice_type` (type)
- `idx_ai_advice_is_read` (is_read)

**制約:**
- `chk_advice_type` CHECK (type IN ('meal', 'exercise', 'lifestyle', 'motivation'))
- `chk_priority` CHECK (priority IN ('low', 'medium', 'high'))

### 10. lessons（レッスン）
行動変容のためのレッスンコンテンツ

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| title | VARCHAR(255) | NO | - | タイトル |
| content | TEXT | NO | - | 内容 |
| duration | INTEGER | NO | 5 | 所要時間（分） |
| category | VARCHAR(20) | NO | - | カテゴリ |
| difficulty | VARCHAR(20) | NO | 'beginner' | 難易度 |
| sort_order | INTEGER | NO | - | 表示順 |
| is_active | BOOLEAN | NO | true | 有効フラグ |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 更新日時 |

**制約:**
- `chk_lesson_category` CHECK (category IN ('nutrition', 'psychology', 'exercise', 'lifestyle'))
- `chk_difficulty` CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'))

### 11. user_lessons（ユーザーレッスン進捗）
ユーザーのレッスン受講状況

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| user_id | UUID | NO | - | ユーザーID（外部キー） |
| lesson_id | UUID | NO | - | レッスンID（外部キー） |
| completed | BOOLEAN | NO | false | 完了フラグ |
| completed_at | TIMESTAMP | YES | NULL | 完了日時 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |

**インデックス:**
- `idx_user_lessons_user_id` (user_id)
- `idx_user_lessons_completed` (completed)
- `unique_user_lesson` UNIQUE (user_id, lesson_id)

### 12. achievements（アチーブメント定義）
アチーブメントのマスタデータ

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| code | VARCHAR(50) | NO | - | アチーブメントコード（ユニーク） |
| type | VARCHAR(20) | NO | - | タイプ |
| name | VARCHAR(100) | NO | - | 名称 |
| description | TEXT | NO | - | 説明 |
| icon | VARCHAR(50) | NO | - | アイコン |
| condition | JSONB | NO | - | 達成条件 |
| points | INTEGER | NO | 0 | ポイント |
| sort_order | INTEGER | NO | 0 | 表示順 |
| is_active | BOOLEAN | NO | true | 有効フラグ |

**制約:**
- `chk_achievement_type` CHECK (type IN ('streak', 'milestone', 'badge', 'challenge'))

### 13. user_achievements（ユーザーアチーブメント）
ユーザーが獲得したアチーブメント

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| user_id | UUID | NO | - | ユーザーID（外部キー） |
| achievement_id | UUID | NO | - | アチーブメントID（外部キー） |
| unlocked_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 解除日時 |
| progress | JSONB | YES | NULL | 進捗状況 |

**インデックス:**
- `idx_user_achievements_user_id` (user_id)
- `unique_user_achievement` UNIQUE (user_id, achievement_id)

### 14. challenges（チャレンジ）
期間限定のチャレンジイベント

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| title | VARCHAR(255) | NO | - | タイトル |
| description | TEXT | NO | - | 説明 |
| start_date | DATE | NO | - | 開始日 |
| end_date | DATE | NO | - | 終了日 |
| target_type | VARCHAR(50) | NO | - | 目標タイプ |
| target_value | DECIMAL(10,2) | NO | - | 目標値 |
| reward | TEXT | YES | NULL | 報酬 |
| is_active | BOOLEAN | NO | true | 有効フラグ |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |

### 15. user_challenges（ユーザーチャレンジ参加）
ユーザーのチャレンジ参加状況

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プライマリキー |
| user_id | UUID | NO | - | ユーザーID（外部キー） |
| challenge_id | UUID | NO | - | チャレンジID（外部キー） |
| joined_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 参加日時 |
| current_value | DECIMAL(10,2) | NO | 0 | 現在の値 |
| completed | BOOLEAN | NO | false | 完了フラグ |
| completed_at | TIMESTAMP | YES | NULL | 完了日時 |

## ビュー

### 1. v_daily_nutrition_summary
日次の栄養摂取サマリー

```sql
CREATE VIEW v_daily_nutrition_summary AS
SELECT 
    m.user_id,
    m.date,
    COUNT(DISTINCT m.id) as meal_count,
    SUM(mf.calories) as total_calories,
    SUM(ni.protein * mf.quantity / f.serving_size) as total_protein,
    SUM(ni.carbs * mf.quantity / f.serving_size) as total_carbs,
    SUM(ni.fat * mf.quantity / f.serving_size) as total_fat,
    SUM(ni.fiber * mf.quantity / f.serving_size) as total_fiber
FROM meals m
JOIN meal_foods mf ON m.id = mf.meal_id
JOIN foods f ON mf.food_id = f.id
JOIN nutrition_info ni ON f.id = ni.food_id
GROUP BY m.user_id, m.date;
```

### 2. v_user_streak
ユーザーの連続記録日数

```sql
CREATE VIEW v_user_streak AS
WITH streak_data AS (
    SELECT 
        user_id,
        date,
        date - INTERVAL '1 day' * ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY date) as streak_group
    FROM (
        SELECT DISTINCT user_id, date
        FROM meals
    ) daily_records
)
SELECT 
    user_id,
    MAX(date) as last_record_date,
    COUNT(*) as current_streak
FROM streak_data
WHERE streak_group = (
    SELECT MAX(streak_group) 
    FROM streak_data sd2 
    WHERE sd2.user_id = streak_data.user_id
)
GROUP BY user_id;
```

## インデックス戦略

### パフォーマンス最適化のための追加インデックス

1. **頻繁な検索クエリ用**
   - `idx_meals_user_date_type` (user_id, date, meal_type)
   - `idx_daily_progress_user_date_weight` (user_id, date, weight)

2. **集計クエリ用**
   - `idx_meal_foods_meal_calories` (meal_id, calories)
   - `idx_ai_advice_user_created` (user_id, created_at DESC)

3. **全文検索用**
   - `idx_foods_search` USING gin (to_tsvector('japanese', name || ' ' || COALESCE(brand, '')))

## パーティショニング戦略

### meals テーブルのパーティショニング
月単位でのレンジパーティショニングを実装

```sql
CREATE TABLE meals_2024_01 PARTITION OF meals
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

## セキュリティ考慮事項

1. **行レベルセキュリティ (RLS)**
   - ユーザーは自分のデータのみアクセス可能
   ```sql
   ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
   CREATE POLICY meals_user_policy ON meals
   FOR ALL USING (user_id = current_user_id());
   ```

2. **暗号化**
   - パスワードはbcryptでハッシュ化
   - 機密データはアプリケーションレベルで暗号化

3. **監査ログ**
   - audit_logsテーブルで重要な操作を記録

## バックアップとリカバリ

1. **バックアップ戦略**
   - 日次: フルバックアップ
   - 時間毎: 増分バックアップ
   - WALアーカイブ: 継続的

2. **リカバリ目標**
   - RPO (Recovery Point Objective): 1時間
   - RTO (Recovery Time Objective): 2時間

## スケーリング考慮事項

1. **読み取り負荷分散**
   - リードレプリカの活用
   - キャッシュ層（Redis）の導入

2. **書き込み最適化**
   - バッチ挿入の活用
   - 非同期処理の導入

3. **データアーカイブ**
   - 1年以上前のデータは別テーブルへ
   - 集計データの事前計算