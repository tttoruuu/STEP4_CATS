# UI デザインガイドライン

## 採用デザイン: ネオモーフィズムスタイル

このファイルは、MIRAIMアプリケーションのUI/UXデザインの統一基準を定義します。

## 🎨 デザインコンセプト

### 基本方針
- **スタイル**: ネオモーフィズム（柔らかい影と立体感）
- **ターゲット**: 20-40代男性ユーザー
- **印象**: シンプル、モダン、親しみやすい
- **マスコット**: 猫のキャラクター（将来的に導入予定）

## 🎨 カラーパレット

```css
:root {
  /* メインカラー */
  --primary-orange: #FF6B35;
  --light-orange: #FFB08A;
  --pale-orange: #FFF5F0;
  
  /* 背景色 */
  --bg-color: #FAF5F2;
  
  /* テキストカラー */
  --text-dark: #2D3436;
  --text-medium: #636E72;
  --text-light: #B2BEC3;
  
  /* その他 */
  --white: #FFFFFF;
}
```

## 🔲 影の設定（ネオモーフィズム）

```css
/* 通常の影 */
--shadow-light: 8px 8px 16px rgba(209, 186, 172, 0.5);
--shadow-dark: -8px -8px 16px rgba(255, 255, 255, 0.8);

/* インセット影 */
--shadow-inset-light: inset 4px 4px 8px rgba(209, 186, 172, 0.3);
--shadow-inset-dark: inset -4px -4px 8px rgba(255, 255, 255, 0.8);
```

## 📐 レイアウト基準

### スペーシング
- 最小単位: 4px
- 基本単位: 8px, 16px, 24px, 32px, 40px
- セクション間: 60px-80px

### ボーダー半径
- 小要素: 10px-12px
- 中要素: 15px-20px
- 大要素: 25px-30px

### コンテナ幅
- 最大幅: 1200px
- モバイル: 100% - 40px (padding: 20px)

## 🎯 コンポーネント仕様

### ボタン
```css
.neo-btn {
  padding: 18px 45px;
  border-radius: 25px;
  font-weight: 600;
  box-shadow: var(--shadow-light), var(--shadow-dark);
  transition: all 0.3s;
}

/* プライマリボタン */
.neo-btn-primary {
  background: linear-gradient(145deg, #FF6B35, #FFB08A);
  color: white;
}

/* セカンダリボタン */
.neo-btn-secondary {
  background: #FAF5F2;
  color: #FF6B35;
}
```

### カード
```css
.service-card {
  background: var(--bg-color);
  border-radius: 25px;
  padding: 35px;
  box-shadow: var(--shadow-light), var(--shadow-dark);
}
```

### フォーム要素
```css
.input-field {
  padding: 15px 20px;
  background: var(--bg-color);
  border-radius: 20px;
  box-shadow: inset 4px 4px 8px rgba(209, 186, 172, 0.3),
              inset -4px -4px 8px rgba(255, 255, 255, 0.8);
}
```

## 🐱 猫のマスコット仕様

### 配置場所
- ヘッダーロゴ横
- チャットアバター
- 空状態の表示
- ローディング画面

### スタイル
```css
.cat-container {
  width: 60px;
  height: 60px;
  background: var(--bg-color);
  border-radius: 20px;
  box-shadow: var(--shadow-light), var(--shadow-dark);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* アクティブ状態インジケーター */
.cat-container::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--primary-orange);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--primary-orange);
}
```

## 📱 レスポンシブ対応

### ブレークポイント
- モバイル: ~768px
- タブレット: 769px~1024px
- デスクトップ: 1025px~

### モバイル最適化
- タッチターゲット: 最小44px
- フォントサイズ: 最小14px
- パディング調整: デスクトップの70-80%

## ✨ アニメーション

### 基本トランジション
```css
transition: all 0.3s ease;
```

### ホバーエフェクト
- ボタン: translateY(-2px) + 影の強調
- カード: translateY(-5px) + 影の拡大
- インプット: 枠線カラー変更 + 背景色変更

### シマーエフェクト（プログレスバー）
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

## 🔤 タイポグラフィ

### フォントファミリー
```css
font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
```

### フォントサイズ
- 見出し1: 42px
- 見出し2: 28px
- 見出し3: 20px-22px
- 本文: 16px
- 補足: 14px
- 注釈: 12px

### フォントウェイト
- 通常: 400
- 中: 500
- 太字: 600-700

## 📋 実装チェックリスト

### 新規画面作成時
- [ ] カラーパレットの使用
- [ ] ネオモーフィズムの影の適用
- [ ] レスポンシブ対応
- [ ] アクセシビリティ考慮
- [ ] 猫マスコットの配置検討
- [ ] アニメーション実装

## 🚀 実装例

完全な実装例は以下のファイルを参照:
- `/ui-design-3-neomorphism.html` - 基本実装例
- `/frontend/styles/globals.css` - グローバルスタイル
- `/frontend/components/ui/` - UIコンポーネント群


## 📝 更新履歴

- 2025-01-08: 初版作成、ネオモーフィズムスタイル採用
