# Personality Test 機能ファイル設計（Miraim用）

## 📝 目的
ユーザーが性格診断を通じて自己理解を深め、結婚に向けたマッチングや行動変容に役立てるための機能を提供する。

---

## 🌐 フロントエンド構成（Next.js / Miraimと同一スタイル）

| ファイル                         | 役割                                          |
|----------------------------------|-----------------------------------------------|
| `pages/personality-test.tsx`     | 診断開始画面、質問の表示と回答入力            |
| `pages/personality-result.tsx`   | 診断結果の表示ページ                          |
| `components/PersonalityForm.tsx` | 質問フォーム（4択ボタン・回答の状態管理）     |
| `components/PersonalityResult.tsx` | 診断結果のUI表示用部品                     |
| `services/personalityAPI.ts`     | バックエンドとのAPI通信処理                   |
| `styles/personality.css`         | 必要に応じてUI調整用の追加スタイル            |

> 💡 色・フォントは Miraim の Tailwind CSS 設定に準拠する。

---

## 🔧 バックエンド構成（FastAPI）

| ファイル                            | 役割                                                        |
|-------------------------------------|-------------------------------------------------------------|
| `routers/personality.py`            | APIエンドポイント定義（例：`/api/personality`）             |
| `schemas/personality.py`            | Pydantic による入力／出力モデルの定義                      |
| `services/personality_logic.py`     | 診断ロジック（選択肢の集計、性格分類アルゴリズム）         |
| `tests/test_personality.py`         | テスト（診断ロジックのユニットテスト）                      |

> 🔐 APIリクエストは POST で JSON を送信。レスポンスに診断分類＋説明を返す。

---

## 🤖 Claude Code 利用時の補足

- 上記構造を Claude に共有し、ファイル単位でのプロンプトを行う
- 例：「`components/PersonalityForm.tsx` に4択式の質問 UI を作成して」など
- Tailwind クラス指定・雰囲気（カラー・パディング）は Miraim UI に合わせる

---

## 📌 今後の拡張案（メモ）

- 結果に応じたレコメンドやマッチング機能連携
- 診断履歴保存機能（要DB対応）
- 回答傾向に応じた改善ヒント提示（AI活用）

