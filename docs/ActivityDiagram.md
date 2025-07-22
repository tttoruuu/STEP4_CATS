# 画面フロー図（アクティビティ図）

## 全体アクティビティ図

```mermaid
graph TD
    Start([アプリ起動]) --> CheckAuth{認証チェック}
    
    CheckAuth -->|未認証| Login[ログイン画面]
    CheckAuth -->|認証済| Home[ホーム画面]
    
    Login --> LoginForm[ログインフォーム入力]
    LoginForm --> LoginSubmit{ログイン処理}
    LoginSubmit -->|成功| Home
    LoginSubmit -->|失敗| LoginError[エラー表示]
    LoginError --> LoginForm
    
    Login --> Register[新規登録へ]
    Register --> RegisterForm[登録フォーム入力]
    RegisterForm --> RegisterSubmit{登録処理}
    RegisterSubmit -->|成功| Login
    RegisterSubmit -->|失敗| RegisterError[エラー表示]
    RegisterError --> RegisterForm
    
    Home --> Feature{機能選択}
    
    Feature -->|AIカウンセラー| Counselor[カウンセラー機能]
    Feature -->|会話練習| Conversation[会話練習機能]
    Feature -->|相性診断| Compatibility[相性診断機能]
    Feature -->|スタイリング| Styling[スタイリング機能]
    Feature -->|プロフィール| Profile[プロフィール機能]
    Feature -->|ログアウト| Logout[ログアウト処理]
    
    Logout --> Login
```

## AIカウンセラー機能フロー

```mermaid
graph TD
    Counselor[カウンセラーメニュー] --> CounselorChoice{選択}
    
    CounselorChoice -->|24時間チャット| Chat[チャット画面]
    CounselorChoice -->|プロフィール作成| ProfileCreator[プロフィール作成]
    CounselorChoice -->|履歴確認| History[履歴一覧]
    
    Chat --> InputMessage[メッセージ入力]
    InputMessage --> SendMessage[送信]
    SendMessage --> AIResponse[AI応答表示]
    AIResponse --> ChatContinue{続ける？}
    ChatContinue -->|はい| InputMessage
    ChatContinue -->|終了| Counselor
    
    ProfileCreator --> ProfileQuestions[質問に回答]
    ProfileQuestions --> GenerateProfile[プロフィール生成]
    GenerateProfile --> SaveProfile{保存する？}
    SaveProfile -->|はい| ProfileSaved[保存完了]
    SaveProfile -->|編集| ProfileQuestions
    ProfileSaved --> Counselor
    
    History --> ViewHistory[履歴詳細表示]
    ViewHistory --> HistoryAction{アクション}
    HistoryAction -->|削除| DeleteConfirm{削除確認}
    HistoryAction -->|戻る| History
    DeleteConfirm -->|はい| History
    DeleteConfirm -->|いいえ| ViewHistory
```

## 会話練習機能フロー

```mermaid
graph TD
    ConvMenu[会話練習メニュー] --> ConvChoice{選択}
    
    ConvChoice -->|新規登録| Register[パートナー登録]
    ConvChoice -->|一覧から選ぶ| Partners[パートナー一覧]
    ConvChoice -->|深い質問練習| DeepQuestions[深い質問練習]
    ConvChoice -->|会話のコツ| TipsSelection[コツ選択]
    
    Register --> InputPartnerInfo[情報入力]
    InputPartnerInfo --> SavePartner[保存]
    SavePartner --> Partners
    
    Partners --> SelectPartner[パートナー選択]
    SelectPartner --> Setup[練習設定]
    Setup --> SetMeetingCount[会った回数設定]
    SetMeetingCount --> SetRallyCount[ラリー回数設定]
    SetRallyCount --> Practice[練習開始]
    
    Practice --> UserSpeak[ユーザー発話]
    UserSpeak --> AIPartnerResponse[AIパートナー応答]
    AIPartnerResponse --> ContinueRally{ラリー継続？}
    ContinueRally -->|継続| UserSpeak
    ContinueRally -->|終了| Feedback[フィードバック]
    
    Feedback --> FeedbackChoice{選択}
    FeedbackChoice -->|コツを見る| ShowTips{初回？}
    FeedbackChoice -->|もう一度| Practice
    FeedbackChoice -->|チェックリスト保存| SaveChecklist[保存]
    FeedbackChoice -->|終了| ConvMenu
    
    ShowTips -->|初回| TipsFirst[初回のコツ]
    ShowTips -->|2回目以降| TipsLater[継続のコツ]
    TipsFirst --> FeedbackChoice
    TipsLater --> FeedbackChoice
    
    DeepQuestions --> SelectQuestion[質問選択]
    SelectQuestion --> PracticeQuestion[質問練習]
    PracticeQuestion --> QuestionFeedback[フィードバック]
    QuestionFeedback --> DeepQuestions
```

## 相性診断機能フロー

```mermaid
graph TD
    CompMenu[相性診断メニュー] --> CheckProgress{進捗確認}
    
    CheckProgress -->|未完了| TestSelection[テスト選択]
    CheckProgress -->|全完了| Results[結果表示]
    
    TestSelection --> TestChoice{選択}
    TestChoice -->|MBTI| MBTITest[MBTI診断]
    TestChoice -->|ライフスタイル| LifestyleTest[ライフスタイル診断]
    TestChoice -->|恋愛スタイル| LoveTest[恋愛スタイル診断]
    
    MBTITest --> MBTIQuestions[質問回答]
    LifestyleTest --> LifestyleQuestions[質問回答]
    LoveTest --> LoveQuestions[質問回答]
    
    MBTIQuestions --> SaveMBTI[結果保存]
    LifestyleQuestions --> SaveLifestyle[結果保存]
    LoveQuestions --> SaveLove[結果保存]
    
    SaveMBTI --> CheckProgress
    SaveLifestyle --> CheckProgress
    SaveLove --> CheckProgress
    
    Results --> ViewMatching[マッチング提案表示]
    ViewMatching --> ResultAction{アクション}
    ResultAction -->|詳細を見る| DetailedResults[詳細結果]
    ResultAction -->|戻る| CompMenu
```

## スタイリング機能フロー

```mermaid
graph TD
    StyleMenu[スタイリングメニュー] --> StyleChoice{選択}
    
    StyleChoice -->|スキンケア| Skincare[スキンケア診断]
    StyleChoice -->|ファッション| Fashion[ファッション診断]
    StyleChoice -->|ヘアスタイル| Hair[ヘアスタイル診断]
    StyleChoice -->|グルーミング| Grooming[グルーミング診断]
    StyleChoice -->|商品推薦| Products[商品一覧]
    
    Skincare --> SkinQuestions[肌質診断]
    Fashion --> FashionQuestions[スタイル診断]
    Hair --> HairQuestions[髪質診断]
    Grooming --> GroomingQuestions[グルーミング診断]
    
    SkinQuestions --> SkinRecommend[推薦表示]
    FashionQuestions --> FashionRecommend[推薦表示]
    HairQuestions --> HairRecommend[推薦表示]
    GroomingQuestions --> GroomingRecommend[推薦表示]
    
    SkinRecommend --> SavePreference{保存する？}
    FashionRecommend --> SavePreference
    HairRecommend --> SavePreference
    GroomingRecommend --> SavePreference
    
    SavePreference -->|はい| StyleMenu
    SavePreference -->|いいえ| StyleMenu
    
    Products --> ProductDetail[商品詳細]
    ProductDetail --> Purchase{購入する？}
    Purchase -->|はい| ExternalLink[外部サイトへ]
    Purchase -->|いいえ| Products
```

## 主要な画面遷移パターン

### 1. 認証ゲート
- すべての機能ページで認証チェック
- 未認証時は自動的にログイン画面へリダイレクト
- トークン有効期限切れも同様の処理

### 2. 階層的ナビゲーション
- ホーム画面がハブとなる構造
- 各機能は独立したフローを持つ
- 戻るボタンで前の画面へ

### 3. 状態保持
- URLパラメータで状態を保持（partnerId、meetingCount等）
- 複雑なフローでもコンテキストを維持
- ディープリンク対応

### 4. プログレッシブディスクロージャー
- 相性診断は全テスト完了で結果表示
- 会話練習は回数によってコツの内容が変化
- ユーザーの進捗に応じた表示制御