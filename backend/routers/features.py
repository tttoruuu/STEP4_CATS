from fastapi import APIRouter

router = APIRouter()

@router.get("/features")
async def get_features():
    """アプリ機能一覧API"""
    return {
        "features": [
            {
                "id": "ai_counselor",
                "title": "AIカウンセラー",
                "description": "24時間いつでも相談できる心強いパートナー",
                "icon": "heart",
                "details": [
                    "24時間相談チャット",
                    "自己紹介文作成サポート",
                    "過去の相談履歴管理",
                    "今日のメッセージ配信"
                ],
                "color": "bg-red-50 border-red-200"
            },
            {
                "id": "conversation_practice",
                "title": "会話練習機能",
                "description": "挨拶から深い会話まで、段階的にスキルアップ",
                "icon": "message-circle",
                "details": [
                    "基本的な挨拶の練習",
                    "相槌・共感スキルの向上",
                    "会話ポイントのコピー機能",
                    "聞く力トレーニング",
                    "フリー会話練習"
                ],
                "color": "bg-blue-50 border-blue-200"
            },
            {
                "id": "marriage_mbti",
                "title": "Marriage MBTI+",
                "description": "あなたに最適なパートナータイプを診断",
                "icon": "brain",
                "details": [
                    "MBTI性格診断",
                    "結婚観の詳細分析",
                    "相性の良いパートナータイプ",
                    "恋愛傾向の把握"
                ],
                "color": "bg-purple-50 border-purple-200"
            },
            {
                "id": "styling",
                "title": "スタイリング提案",
                "description": "魅力を最大限に引き出すトータルサポート",
                "icon": "sparkles",
                "details": [
                    "スキンケアアドバイス",
                    "ファッション提案",
                    "ヘアスタイル相談",
                    "身だしなみチェック"
                ],
                "color": "bg-yellow-50 border-yellow-200"
            }
        ],
        "key_points": [
            {
                "icon": "ear",
                "title": "聞くスキルが身につく",
                "subtitle": "話すより、聞く。それが愛される男の条件",
                "description": "多くの男性が勘違いしています。女性は「面白い話」より「私の話を聞いてくれる人」を求めています。"
            },
            {
                "icon": "users",
                "title": "共感力を育てる",
                "subtitle": "適切な相槌、共感の言葉、深掘りする質問",
                "description": "これらの「聞くスキル」が、あなたを「また会いたい人」に変えます。"
            },
            {
                "icon": "target",
                "title": "理解される喜び",
                "subtitle": "自分を理解してくれる人を好きになる",
                "description": "自分が思っている感情を理解してくれる、自分自身を理解してくれる人のことを好きになります。"
            }
        ]
    }