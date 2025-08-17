from fastapi import APIRouter

router = APIRouter()

@router.get("/help/faqs")
async def get_help_faqs():
    """ヘルプ・FAQ API"""
    return {
        "faqs": [
            {
                "id": 1,
                "category": "基本操作",
                "question": "アプリの使い方がわからない",
                "answer": "ホーム画面から4つの主要機能（AIカウンセラー、会話練習、診断、スタイリング）を選択できます。初めての方は「使い方ガイド」をご覧ください。",
                "priority": "high"
            },
            {
                "id": 2,
                "category": "会話練習",
                "question": "会話練習は何回でもできますか？",
                "answer": "はい、回数制限はありません。基本練習から始めて、徐々に難易度を上げていくことをおすすめします。",
                "priority": "medium"
            },
            {
                "id": 3,
                "category": "AIカウンセラー",
                "question": "相談内容は保存されますか？",
                "answer": "はい、過去の相談履歴は保存され、いつでも確認できます。個人情報は安全に管理されています。",
                "priority": "high"
            },
            {
                "id": 4,
                "category": "診断機能",
                "question": "Marriage MBTI診断の結果は変わりますか？",
                "answer": "診断は何度でも受けることができ、結果は時間と共に変化する可能性があります。定期的に受診することをおすすめします。",
                "priority": "medium"
            },
            {
                "id": 5,
                "category": "技術的問題",
                "question": "音声認識がうまく動作しない",
                "answer": "マイクの許可設定を確認し、静かな環境で明瞭に話してください。問題が続く場合は設定を確認してください。",
                "priority": "low"
            },
            {
                "id": 6,
                "category": "アカウント",
                "question": "プロフィール情報を変更したい",
                "answer": "マイページからプロフィール編集画面に進み、必要な情報を更新できます。",
                "priority": "medium"
            }
        ],
        "guide_steps": [
            {
                "step": 1,
                "title": "アプリを開く",
                "description": "ホーム画面から始めましょう",
                "image": "📱"
            },
            {
                "step": 2,
                "title": "機能を選択",
                "description": "4つの主要機能から選んでください",
                "image": "🎯"
            },
            {
                "step": "3-1",
                "title": "AIカウンセラー",
                "description": "24時間いつでも相談できます",
                "image": "💝"
            },
            {
                "step": "3-2",
                "title": "会話練習",
                "description": "レベルに合わせて練習を始めます",
                "image": "💬"
            },
            {
                "step": "3-3",
                "title": "Marriage MBTI+",
                "description": "性格診断と結婚観の分析を行います",
                "image": "🧠"
            },
            {
                "step": "3-4",
                "title": "スタイリング提案",
                "description": "魅力を引き出すスタイリングサポート",
                "image": "✨"
            }
        ],
        "tips": [
            {
                "title": "💡 ヒント",
                "content": "最初は基本的な挨拶から始めて、徐々に難しい会話練習に挑戦しましょう。毎日少しずつでも続けることが上達の秘訣です。"
            }
        ]
    }