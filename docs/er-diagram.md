# ダイエットアプリ ER図

## ER図（Mermaid形式）

```mermaid
erDiagram
    users ||--|| user_profiles : has
    users ||--o{ meals : records
    users ||--o{ daily_progress : tracks
    users ||--o{ ai_advice : receives
    users ||--o{ user_lessons : completes
    users ||--o{ user_achievements : earns
    users ||--o{ user_challenges : participates
    
    foods ||--|| nutrition_info : contains
    foods }o--|| food_categories : belongs_to
    foods ||--o{ meal_foods : included_in
    
    meals ||--o{ meal_foods : contains
    meal_foods }o--|| foods : references
    
    lessons ||--o{ user_lessons : taken_by
    
    achievements ||--o{ user_achievements : unlocked_by
    
    challenges ||--o{ user_challenges : joined_by
    
    meals }o--o| ai_advice : generates

    users {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar name
        text avatar_url
        boolean is_active
        boolean email_verified
        timestamp created_at
        timestamp updated_at
    }
    
    user_profiles {
        uuid id PK
        uuid user_id FK
        integer age
        varchar gender
        decimal height
        decimal current_weight
        decimal target_weight
        varchar activity_level
        varchar diet_goal
        varchar timezone
        timestamp created_at
        timestamp updated_at
    }
    
    foods {
        uuid id PK
        varchar name
        varchar name_kana
        varchar brand
        varchar barcode
        integer category_id FK
        decimal serving_size
        varchar serving_unit
        text image_url
        boolean is_verified
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    food_categories {
        serial id PK
        varchar name
        integer parent_id FK
        integer sort_order
        varchar icon
    }
    
    nutrition_info {
        uuid id PK
        uuid food_id FK
        decimal calories
        decimal protein
        decimal carbs
        decimal fat
        decimal fiber
        decimal sugar
        decimal sodium
        decimal cholesterol
        decimal saturated_fat
        decimal trans_fat
        decimal calcium
        decimal iron
        decimal vitamin_a
        decimal vitamin_c
        timestamp created_at
        timestamp updated_at
    }
    
    meals {
        uuid id PK
        uuid user_id FK
        date date
        varchar meal_type
        time meal_time
        text image_url
        text notes
        timestamp created_at
        timestamp updated_at
    }
    
    meal_foods {
        uuid id PK
        uuid meal_id FK
        uuid food_id FK
        decimal quantity
        varchar unit
        decimal calories
        timestamp created_at
    }
    
    daily_progress {
        uuid id PK
        uuid user_id FK
        date date UK
        decimal weight
        decimal body_fat_percentage
        decimal muscle_mass
        integer steps
        integer water_intake
        integer sleep_duration
        varchar sleep_quality
        varchar mood
        text notes
        timestamp created_at
        timestamp updated_at
    }
    
    ai_advice {
        uuid id PK
        uuid user_id FK
        date date
        varchar type
        varchar title
        text content
        varchar priority
        jsonb action_items
        uuid related_meal_id FK
        boolean is_read
        timestamp created_at
    }
    
    lessons {
        uuid id PK
        varchar title
        text content
        integer duration
        varchar category
        varchar difficulty
        integer sort_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    user_lessons {
        uuid id PK
        uuid user_id FK
        uuid lesson_id FK
        boolean completed
        timestamp completed_at
        timestamp created_at
    }
    
    achievements {
        uuid id PK
        varchar code UK
        varchar type
        varchar name
        text description
        varchar icon
        jsonb condition
        integer points
        integer sort_order
        boolean is_active
    }
    
    user_achievements {
        uuid id PK
        uuid user_id FK
        uuid achievement_id FK
        timestamp unlocked_at
        jsonb progress
    }
    
    challenges {
        uuid id PK
        varchar title
        text description
        date start_date
        date end_date
        varchar target_type
        decimal target_value
        text reward
        boolean is_active
        timestamp created_at
    }
    
    user_challenges {
        uuid id PK
        uuid user_id FK
        uuid challenge_id FK
        timestamp joined_at
        decimal current_value
        boolean completed
        timestamp completed_at
    }
```

## テーブル関係の説明

### 1. ユーザー関連
- **users** - **user_profiles**: 1対1の関係。各ユーザーは1つのプロフィールを持つ
- **users** - **meals**: 1対多の関係。1人のユーザーは複数の食事記録を持つ
- **users** - **daily_progress**: 1対多の関係。1人のユーザーは複数の日次進捗を持つ

### 2. 食品・食事関連
- **foods** - **nutrition_info**: 1対1の関係。各食品は1つの栄養情報を持つ
- **foods** - **food_categories**: 多対1の関係。複数の食品が1つのカテゴリに属する
- **meals** - **meal_foods**: 1対多の関係。1つの食事は複数の食品を含む
- **meal_foods** - **foods**: 多対1の関係。食事内容は食品マスタを参照

### 3. 学習・達成関連
- **users** - **user_lessons**: 1対多の関係。ユーザーは複数のレッスンを受講
- **lessons** - **user_lessons**: 1対多の関係。1つのレッスンは複数のユーザーが受講
- **users** - **user_achievements**: 1対多の関係。ユーザーは複数のアチーブメントを獲得
- **achievements** - **user_achievements**: 1対多の関係。1つのアチーブメントは複数のユーザーが獲得可能

### 4. AI・アドバイス関連
- **users** - **ai_advice**: 1対多の関係。ユーザーは複数のAIアドバイスを受信
- **meals** - **ai_advice**: 1対多の関係。食事に基づいてアドバイスが生成される（optional）

### 5. チャレンジ関連
- **users** - **user_challenges**: 1対多の関係。ユーザーは複数のチャレンジに参加
- **challenges** - **user_challenges**: 1対多の関係。1つのチャレンジに複数のユーザーが参加

## 主要な制約とビジネスルール

1. **一意性制約**
   - users.email: メールアドレスは一意
   - (user_id, date, meal_type) in meals: 1日の同じ食事タイプは1つのみ
   - (user_id, date) in daily_progress: 1日1つの進捗記録

2. **参照整合性**
   - すべての外部キーは親テーブルの存在を保証
   - カスケード削除は原則使用せず、論理削除を推奨

3. **データ整合性**
   - meal_type: breakfast, lunch, dinner, snack のみ
   - gender: male, female, other のみ
   - activity_level: sedentary, light, moderate, active, very_active のみ

## パフォーマンス考慮事項

1. **頻繁にJOINされるテーブル**
   - meals ⟷ meal_foods ⟷ foods
   - users ⟷ daily_progress
   - foods ⟷ nutrition_info

2. **大量データが予想されるテーブル**
   - meals: パーティショニング推奨
   - meal_foods: インデックス最適化必須
   - ai_advice: 古いデータのアーカイブ検討

## 拡張性の考慮

1. **将来的な機能追加に備えた設計**
   - JSONB型の活用（action_items, condition, progress）
   - カテゴリの階層構造（parent_id）
   - 汎用的なtype, status フィールド

2. **国際化対応**
   - name_kana: 日本語検索用
   - timezone: ユーザーごとのタイムゾーン
   - 多言語対応は別テーブルで管理可能