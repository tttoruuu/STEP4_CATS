from typing import Dict, List, Tuple
from enum import Enum
from schemas.marriage_mbti import (
    MBTIType, MBTIDimension, MarriageCategory,
    MBTIAnswer, MarriageAnswer, MBTIScore, MarriageScore,
    CompatibleType, PersonalizedAdvice, MarriageMBTIResult
)


# MBTI質問データ（参考コードより）
MBTI_QUESTIONS = [
    # Extraversion vs Introversion
    {
        "id": 1,
        "question": "新しい環境で人と出会う時、あなたはどのような傾向がありますか？",
        "optionA": "積極的に話しかけて、多くの人とのつながりを作る",
        "optionB": "まず様子を見て、少数の人と深く話すことを好む",
        "dimension": MBTIDimension.EI,
        "direction": "A"
    },
    {
        "id": 2,
        "question": "エネルギーを回復する時、あなたは？",
        "optionA": "友人や家族と一緒に過ごす時間を増やす",
        "optionB": "一人でリラックスする時間を大切にする",
        "dimension": MBTIDimension.EI,
        "direction": "A"
    },
    {
        "id": 3,
        "question": "パートナーと過ごす理想的な休日は？",
        "optionA": "友人たちとのパーティーやイベントに参加",
        "optionB": "二人だけでゆっくりと過ごす静かな時間",
        "dimension": MBTIDimension.EI,
        "direction": "A"
    },
    {
        "id": 4,
        "question": "コミュニケーションにおいて、あなたは？",
        "optionA": "考えながら話すことが多い",
        "optionB": "まず考えてから話すことを好む",
        "dimension": MBTIDimension.EI,
        "direction": "A"
    },
    # Sensing vs iNtuition
    {
        "id": 5,
        "question": "パートナー選びで重視するのは？",
        "optionA": "具体的な条件（経済力、職業、性格など）",
        "optionB": "直感的な相性や将来への可能性",
        "dimension": MBTIDimension.SN,
        "direction": "A"
    },
    {
        "id": 6,
        "question": "将来の計画について話し合う時、あなたは？",
        "optionA": "具体的で実現可能な計画を立てたい",
        "optionB": "大きな夢やビジョンを共有したい",
        "dimension": MBTIDimension.SN,
        "direction": "A"
    },
    {
        "id": 7,
        "question": "結婚生活で重要だと思うのは？",
        "optionA": "日常の安定した生活リズムと実用的な協力",
        "optionB": "互いの成長と新しい可能性への挑戦",
        "dimension": MBTIDimension.SN,
        "direction": "A"
    },
    {
        "id": 8,
        "question": "パートナーとの会話で楽しいのは？",
        "optionA": "今起きていることや具体的な経験について",
        "optionB": "未来の可能性や抽象的なアイデアについて",
        "dimension": MBTIDimension.SN,
        "direction": "A"
    },
    # Thinking vs Feeling
    {
        "id": 9,
        "question": "パートナーに求める一番大切な資質は？",
        "optionA": "知的で論理的思考ができること",
        "optionB": "温かく思いやりがあること",
        "dimension": MBTIDimension.TF,
        "direction": "A"
    },
    {
        "id": 10,
        "question": "意見の対立が起きた時、あなたは？",
        "optionA": "事実と論理に基づいて解決したい",
        "optionB": "お互いの気持ちを理解し合うことを重視",
        "dimension": MBTIDimension.TF,
        "direction": "A"
    },
    {
        "id": 11,
        "question": "重要な決断を下す時、あなたは？",
        "optionA": "客観的なデータと分析を重視する",
        "optionB": "関係する人への影響を考慮する",
        "dimension": MBTIDimension.TF,
        "direction": "A"
    },
    {
        "id": 12,
        "question": "パートナーを支える時、あなたは？",
        "optionA": "問題の解決策を一緒に考える",
        "optionB": "感情的なサポートを最優先にする",
        "dimension": MBTIDimension.TF,
        "direction": "A"
    },
    # Judging vs Perceiving
    {
        "id": 13,
        "question": "結婚後の生活について、あなたは？",
        "optionA": "しっかりとした計画と規則正しい生活を好む",
        "optionB": "柔軟性があり、状況に応じて変化できる生活を好む",
        "dimension": MBTIDimension.JP,
        "direction": "A"
    },
    {
        "id": 14,
        "question": "デートの計画を立てる時、あなたは？",
        "optionA": "事前にしっかりと計画を立てて、予約も取っておく",
        "optionB": "その時の気分で決めて、自由に行動したい",
        "dimension": MBTIDimension.JP,
        "direction": "A"
    },
    {
        "id": 15,
        "question": "パートナーとの関係で、あなたが安心するのは？",
        "optionA": "明確な約束や決まりがある関係",
        "optionB": "自然体で、お互いの自由を尊重する関係",
        "dimension": MBTIDimension.JP,
        "direction": "A"
    },
    {
        "id": 16,
        "question": "新しい体験について、あなたは？",
        "optionA": "事前に情報を集めて、準備してから臨みたい",
        "optionB": "spontaneousに、その場の流れで楽しみたい",
        "dimension": MBTIDimension.JP,
        "direction": "A"
    }
]

# 結婚観質問データ（参考コードより）
MARRIAGE_QUESTIONS = [
    {
        "id": 1,
        "question": "パートナーとのコミュニケーションで最も重視することは？",
        "options": [
            "論理的で明確な話し合い",
            "どちらかといえば論理的",
            "バランスの取れた対話",
            "どちらかといえば感情的",
            "感情的な理解と共感"
        ],
        "category": MarriageCategory.COMMUNICATION
    },
    {
        "id": 2,
        "question": "理想的なライフスタイルは？",
        "options": [
            "非常にアクティブで刺激的",
            "比較的アクティブ",
            "バランスの取れた生活",
            "比較的穏やか",
            "非常に静かで安定"
        ],
        "category": MarriageCategory.LIFESTYLE
    },
    {
        "id": 3,
        "question": "パートナーとの価値観の違いについて？",
        "options": [
            "完全に同じ価値観を持つべき",
            "基本的な価値観は共有したい",
            "違いを認めつつ、話し合いで解決",
            "多様性を尊重し、学び合う",
            "完全に独立した価値観でも良い"
        ],
        "category": MarriageCategory.VALUES
    },
    {
        "id": 4,
        "question": "将来の子育てについて、どう考えますか？",
        "options": [
            "絶対に子供が欲しい",
            "できれば子供が欲しい",
            "パートナーと話し合って決める",
            "あまり重要ではない",
            "子供は望まない"
        ],
        "category": MarriageCategory.FUTURE
    },
    {
        "id": 5,
        "question": "結婚におけるお金の管理は？",
        "options": [
            "完全に共同管理",
            "基本的に共同、一部個人管理",
            "話し合いで決める",
            "基本的に個人管理、一部共同",
            "完全に個人管理"
        ],
        "category": MarriageCategory.FUTURE
    },
    {
        "id": 6,
        "question": "パートナーとの親密さの表現は？",
        "options": [
            "言葉での愛情表現を重視",
            "どちらかといえば言葉を重視",
            "言葉と行動の両方",
            "どちらかといえば行動を重視",
            "行動で愛情を示すことを重視"
        ],
        "category": MarriageCategory.INTIMACY
    },
    {
        "id": 7,
        "question": "パートナーとの時間の過ごし方は？",
        "options": [
            "常に一緒にいることを重視",
            "多くの時間を共有したい",
            "適度な距離感を保ちつつ",
            "お互いの時間も大切にする",
            "独立性を最も重視"
        ],
        "category": MarriageCategory.LIFESTYLE
    },
    {
        "id": 8,
        "question": "結婚後のキャリアについて？",
        "options": [
            "両方がキャリアを最優先",
            "どちらかといえばキャリア重視",
            "家庭とキャリアのバランス",
            "どちらかといえば家庭重視",
            "家庭が最優先"
        ],
        "category": MarriageCategory.VALUES
    },
    {
        "id": 9,
        "question": "結婚後の住環境について？",
        "options": [
            "都市部の便利な場所",
            "都市近郊のバランス良い場所",
            "どちらでも構わない",
            "自然豊かな郊外",
            "田舎での静かな生活"
        ],
        "category": MarriageCategory.LIFESTYLE
    },
    {
        "id": 10,
        "question": "パートナーとの関係で最も大切にしたいのは？",
        "options": [
            "情熱的な愛情",
            "深い信頼関係",
            "お互いの成長",
            "安定した協力関係",
            "独立性の尊重"
        ],
        "category": MarriageCategory.VALUES
    }
]


def calculate_mbti(answers: List[MBTIAnswer]) -> Tuple[MBTIType, MBTIScore]:
    """MBTI分析を実行"""
    scores = {"E": 0, "I": 0, "S": 0, "N": 0, "T": 0, "F": 0, "J": 0, "P": 0}
    
    # 質問マッピング（参考コードより）
    question_mappings = [
        {"dimension": "EI", "aLetter": "E", "bLetter": "I"},
        {"dimension": "EI", "aLetter": "E", "bLetter": "I"},
        {"dimension": "EI", "aLetter": "E", "bLetter": "I"},
        {"dimension": "EI", "aLetter": "E", "bLetter": "I"},
        {"dimension": "SN", "aLetter": "S", "bLetter": "N"},
        {"dimension": "SN", "aLetter": "S", "bLetter": "N"},
        {"dimension": "SN", "aLetter": "S", "bLetter": "N"},
        {"dimension": "SN", "aLetter": "S", "bLetter": "N"},
        {"dimension": "TF", "aLetter": "T", "bLetter": "F"},
        {"dimension": "TF", "aLetter": "T", "bLetter": "F"},
        {"dimension": "TF", "aLetter": "T", "bLetter": "F"},
        {"dimension": "TF", "aLetter": "T", "bLetter": "F"},
        {"dimension": "JP", "aLetter": "J", "bLetter": "P"},
        {"dimension": "JP", "aLetter": "J", "bLetter": "P"},
        {"dimension": "JP", "aLetter": "J", "bLetter": "P"},
        {"dimension": "JP", "aLetter": "J", "bLetter": "P"},
    ]
    
    for answer in answers:
        mapping = question_mappings[answer.questionId]
        if answer.answer == "A":
            scores[mapping["aLetter"]] += 1
        else:
            scores[mapping["bLetter"]] += 1
    
    # MBTI タイプを決定
    mbti_string = (
        ("E" if scores["E"] >= scores["I"] else "I") +
        ("S" if scores["S"] >= scores["N"] else "N") +
        ("T" if scores["T"] >= scores["F"] else "F") +
        ("J" if scores["J"] >= scores["P"] else "P")
    )
    
    mbti_type = MBTIType(mbti_string)
    mbti_score = MBTIScore(**scores)
    
    return mbti_type, mbti_score


def calculate_marriage_scores(answers: List[MarriageAnswer]) -> MarriageScore:
    """結婚観スコアを計算"""
    category_scores = {
        MarriageCategory.COMMUNICATION: [],
        MarriageCategory.LIFESTYLE: [],
        MarriageCategory.VALUES: [],
        MarriageCategory.FUTURE: [],
        MarriageCategory.INTIMACY: []
    }
    
    # 質問とカテゴリのマッピング
    question_categories = [
        MarriageCategory.COMMUNICATION,  # Q1
        MarriageCategory.LIFESTYLE,      # Q2
        MarriageCategory.VALUES,         # Q3
        MarriageCategory.FUTURE,         # Q4
        MarriageCategory.FUTURE,         # Q5
        MarriageCategory.INTIMACY,       # Q6
        MarriageCategory.LIFESTYLE,      # Q7
        MarriageCategory.VALUES,         # Q8
        MarriageCategory.LIFESTYLE,      # Q9
        MarriageCategory.VALUES,         # Q10
    ]
    
    for answer in answers:
        category = question_categories[answer.questionId]
        category_scores[category].append(answer.answer)
    
    # 各カテゴリの平均スコアを計算
    avg_scores = {}
    for category, scores in category_scores.items():
        if scores:
            avg_scores[category.value] = sum(scores) / len(scores)
        else:
            avg_scores[category.value] = 3.0  # デフォルト値
    
    return MarriageScore(**avg_scores)


def get_mbti_description_and_compatibility(mbti_type: MBTIType) -> Dict:
    """MBTI タイプの説明と相性を取得"""
    type_descriptions = {
        MBTIType.INTJ: {
            "name": "建築家タイプ",
            "description": "独立心が強く、長期的なビジョンを持って関係を築く理想主義者",
            "loveCharacteristics": [
                "深く意味のある関係を求める",
                "パートナーの知性と独立性を重視",
                "長期的な計画を立てて関係を発展させる",
                "感情表現は控えめだが、深い愛情を持つ"
            ],
            "compatibleTypes": [
                {"type": "ENFP (活動家)", "reason": "互いの創造性と理想を刺激し合える"},
                {"type": "ENTP (討論者)", "reason": "知的な刺激と新しい視点を提供し合える"},
                {"type": "INFJ (提唱者)", "reason": "深いレベルでの理解と価値観の共有"}
            ]
        },
        MBTIType.INTP: {
            "name": "論理学者タイプ",
            "description": "知的好奇心旺盛で、パートナーとの深い理解を求める思考家",
            "loveCharacteristics": [
                "知的な刺激を重視する",
                "独立性と自由を大切にする",
                "感情よりも論理的な理解を優先",
                "深く考えてから行動する慎重さ"
            ],
            "compatibleTypes": [
                {"type": "ENFJ (主人公)", "reason": "感情面でのサポートと成長の機会"},
                {"type": "ENTJ (指揮官)", "reason": "共通の目標と知的な議論"},
                {"type": "INFP (仲裁者)", "reason": "創造性と深い理解の共有"}
            ]
        },
        MBTIType.ENTJ: {
            "name": "指揮官タイプ",
            "description": "リーダーシップがあり、パートナーと共に目標を達成することを重視",
            "loveCharacteristics": [
                "関係においてもリーダーシップを発揮",
                "共通の目標達成を重視",
                "効率的で建設的な関係を好む",
                "パートナーの成長をサポート"
            ],
            "compatibleTypes": [
                {"type": "INFP (仲裁者)", "reason": "感情面での深さとバランス"},
                {"type": "INTP (論理学者)", "reason": "知的な刺激と補完関係"},
                {"type": "ENFP (活動家)", "reason": "エネルギーと創造性の共有"}
            ]
        },
        MBTIType.ENTP: {
            "name": "討論者タイプ",
            "description": "創造的で社交的、パートナーとの知的な交流を楽しむ革新者",
            "loveCharacteristics": [
                "知的な議論と新しいアイデアを楽しむ",
                "変化と刺激を求める",
                "パートナーの可能性を引き出す",
                "自由で開放的な関係を好む"
            ],
            "compatibleTypes": [
                {"type": "INFJ (提唱者)", "reason": "深い洞察と理想の共有"},
                {"type": "INTJ (建築家)", "reason": "長期的なビジョンと戦略的思考"},
                {"type": "ENFJ (主人公)", "reason": "人間関係とコミュニケーションの得意さ"}
            ]
        },
        MBTIType.INFJ: {
            "name": "提唱者タイプ",
            "description": "深い洞察力を持ち、理想的な関係を追求する理想主義者",
            "loveCharacteristics": [
                "深い精神的なつながりを求める",
                "パートナーの内面を理解したがる",
                "理想的な関係像を持っている",
                "献身的で思いやりがある"
            ],
            "compatibleTypes": [
                {"type": "ENTP (討論者)", "reason": "創造的なエネルギーと新しい視点"},
                {"type": "ENFP (活動家)", "reason": "感情面での理解と共感"},
                {"type": "INTJ (建築家)", "reason": "深い理解と長期的なビジョン"}
            ]
        },
        MBTIType.INFP: {
            "name": "仲裁者タイプ",
            "description": "価値観を大切にし、真の理解者を求める情熱的な理想主義者",
            "loveCharacteristics": [
                "価値観の一致を重視",
                "真の理解と受容を求める",
                "創造的で情熱的な関係",
                "個性と独立性を尊重"
            ],
            "compatibleTypes": [
                {"type": "ENFJ (主人公)", "reason": "感情面での深いサポート"},
                {"type": "ENTJ (指揮官)", "reason": "目標達成と成長の機会"},
                {"type": "INTP (論理学者)", "reason": "知的好奇心と創造性の共有"}
            ]
        },
        MBTIType.ENFJ: {
            "name": "主人公タイプ",
            "description": "人の成長を支援し、調和の取れた関係を築くカリスマ的リーダー",
            "loveCharacteristics": [
                "パートナーの成長をサポート",
                "調和とコミュニケーションを重視",
                "感情的な絆を大切にする",
                "関係に情熱と献身を注ぐ"
            ],
            "compatibleTypes": [
                {"type": "INFP (仲裁者)", "reason": "価値観と感情面での深いつながり"},
                {"type": "ISFP (冒険家)", "reason": "感受性と芸術的センスの共有"},
                {"type": "INTP (論理学者)", "reason": "知的刺激と成長の機会"}
            ]
        },
        MBTIType.ENFP: {
            "name": "活動家タイプ",
            "description": "熱意溢れ、創造的で、パートナーとの可能性を探求する自由な魂",
            "loveCharacteristics": [
                "情熱的で創造的な関係",
                "新しい経験と冒険を共有",
                "パートナーの可能性を信じる",
                "自由と成長を重視"
            ],
            "compatibleTypes": [
                {"type": "INTJ (建築家)", "reason": "深いビジョンと戦略的思考"},
                {"type": "INFJ (提唱者)", "reason": "精神的なつながりと理想の共有"},
                {"type": "ENTJ (指揮官)", "reason": "目標達成と相互成長"}
            ]
        },
        MBTIType.ISTJ: {
            "name": "管理者タイプ",
            "description": "責任感が強く、安定した信頼できる関係を築く実用主義者",
            "loveCharacteristics": [
                "安定性と信頼性を提供",
                "伝統的な価値観を重視",
                "責任感と献身性",
                "実用的で現実的なアプローチ"
            ],
            "compatibleTypes": [
                {"type": "ESFP (エンターテイナー)", "reason": "楽しさとspontaneityのバランス"},
                {"type": "ESTP (起業家)", "reason": "活動的なエネルギーと新しい体験"},
                {"type": "ISFP (冒険家)", "reason": "感受性と芸術的センスの共有"}
            ]
        },
        MBTIType.ISFJ: {
            "name": "擁護者タイプ",
            "description": "思いやりがあり、パートナーのニーズを満たすことを喜びとする保護者",
            "loveCharacteristics": [
                "パートナーの幸福を最優先",
                "献身的で思いやりがある",
                "安定した調和の取れた関係",
                "細やかな気配りとサポート"
            ],
            "compatibleTypes": [
                {"type": "ESTP (起業家)", "reason": "活動的なエネルギーとバランス"},
                {"type": "ESFP (エンターテイナー)", "reason": "楽しさとwarmthの共有"},
                {"type": "ISFP (冒険家)", "reason": "感受性と価値観の共有"}
            ]
        },
        MBTIType.ESTJ: {
            "name": "幹部タイプ",
            "description": "組織力があり、効率的で安定した関係を築く実行力のあるリーダー",
            "loveCharacteristics": [
                "責任感と安定性を提供",
                "効率的で計画的な関係",
                "家族や将来への責任感",
                "実用的で現実的なサポート"
            ],
            "compatibleTypes": [
                {"type": "ISFP (冒険家)", "reason": "感受性と創造性のバランス"},
                {"type": "INFP (仲裁者)", "reason": "価値観と感情面での深さ"},
                {"type": "ISTP (巨匠)", "reason": "実用性と独立性の尊重"}
            ]
        },
        MBTIType.ESFJ: {
            "name": "領事タイプ",
            "description": "社交的で思いやりがあり、調和の取れた関係を築く協力者",
            "loveCharacteristics": [
                "調和とコミュニケーションを重視",
                "パートナーのニーズに敏感",
                "社交的で家族思い",
                "感情的なサポートを提供"
            ],
            "compatibleTypes": [
                {"type": "ISFP (冒険家)", "reason": "芸術性と感受性の共有"},
                {"type": "ISTP (巨匠)", "reason": "実用性と独立性のバランス"},
                {"type": "INFP (仲裁者)", "reason": "価値観と創造性の共有"}
            ]
        },
        MBTIType.ISTP: {
            "name": "巨匠タイプ",
            "description": "独立心があり、実用的で柔軟な関係を好む現実主義者",
            "loveCharacteristics": [
                "独立性と自由を重視",
                "実用的で現実的なアプローチ",
                "行動で愛情を示す",
                "冷静で客観的な判断"
            ],
            "compatibleTypes": [
                {"type": "ESFJ (領事)", "reason": "感情面でのサポートと社交性"},
                {"type": "ESTJ (幹部)", "reason": "効率性と目標達成の共有"},
                {"type": "ISFJ (擁護者)", "reason": "思いやりと安定性"}
            ]
        },
        MBTIType.ISFP: {
            "name": "冒険家タイプ",
            "description": "感受性豊かで、真の理解と美的体験を求める芸術的な魂",
            "loveCharacteristics": [
                "感受性と芸術的センス",
                "価値観の深い共有",
                "個性と独立性の尊重",
                "美的体験と感情の共有"
            ],
            "compatibleTypes": [
                {"type": "ENFJ (主人公)", "reason": "感情面での理解とサポート"},
                {"type": "ESFJ (領事)", "reason": "調和と思いやりの共有"},
                {"type": "ESTJ (幹部)", "reason": "安定性と責任感のバランス"}
            ]
        },
        MBTIType.ESTP: {
            "name": "起業家タイプ",
            "description": "活動的で現実的、楽しく刺激的な関係を築く行動派",
            "loveCharacteristics": [
                "活動的で楽しい関係",
                "現在を楽しむことを重視",
                "柔軟性と適応性",
                "エネルギッシュで社交的"
            ],
            "compatibleTypes": [
                {"type": "ISFJ (擁護者)", "reason": "安定性と思いやりのバランス"},
                {"type": "ISTJ (管理者)", "reason": "責任感と実用性の共有"},
                {"type": "INFJ (提唱者)", "reason": "深い理解と長期的視点"}
            ]
        },
        MBTIType.ESFP: {
            "name": "エンターテイナータイプ",
            "description": "楽しく温かい、人生を共に楽しむパートナーを求める自由な魂",
            "loveCharacteristics": [
                "楽しさと喜びを共有",
                "温かく思いやりがある",
                "spontaneousで柔軟",
                "人との繋がりを大切にする"
            ],
            "compatibleTypes": [
                {"type": "ISTJ (管理者)", "reason": "安定性と責任感のバランス"},
                {"type": "ISFJ (擁護者)", "reason": "思いやりと調和の共有"},
                {"type": "INTJ (建築家)", "reason": "深いビジョンと戦略的思考"}
            ]
        }
    }
    
    return type_descriptions.get(mbti_type, {
        "name": "未知のタイプ",
        "description": "性格タイプの分析結果です",
        "loveCharacteristics": [],
        "compatibleTypes": []
    })


def generate_personalized_advice(marriage_answers: List[MarriageAnswer]) -> List[PersonalizedAdvice]:
    """パーソナライズドアドバイスを生成"""
    advice = []
    
    # 質問1: コミュニケーション
    comm_answer = next((a.answer for a in marriage_answers if a.questionId == 0), 3)
    if comm_answer <= 2:
        advice.append(PersonalizedAdvice(
            category="コミュニケーション",
            content="論理的なコミュニケーションを重視するあなたは、感情的な表現も大切にすることで、より深い関係を築けるでしょう。"
        ))
    elif comm_answer >= 4:
        advice.append(PersonalizedAdvice(
            category="コミュニケーション",
            content="感情的な理解を重視するあなたは、時には論理的な話し合いも取り入れることで、より建設的な関係を築けます。"
        ))
    
    # 質問2: ライフスタイル
    lifestyle_answer = next((a.answer for a in marriage_answers if a.questionId == 1), 3)
    if lifestyle_answer <= 2:
        advice.append(PersonalizedAdvice(
            category="ライフスタイル",
            content="活動的な生活を好むあなたは、パートナーと一緒に新しい体験を共有することで関係が深まります。"
        ))
    elif lifestyle_answer >= 4:
        advice.append(PersonalizedAdvice(
            category="ライフスタイル",
            content="穏やかな生活を好むあなたは、質の高い時間をパートナーと過ごすことで深い絆を築けます。"
        ))
    
    # 質問3: 価値観
    values_answer = next((a.answer for a in marriage_answers if a.questionId == 2), 3)
    if values_answer <= 2:
        advice.append(PersonalizedAdvice(
            category="価値観",
            content="価値観の一致を重視するあなたは、お互いの違いも受け入れる柔軟性を持つことで、より豊かな関係を築けます。"
        ))
    elif values_answer >= 4:
        advice.append(PersonalizedAdvice(
            category="価値観",
            content="多様性を重視するあなたは、基本的な価値観の共有も大切にすることで、安定した関係を維持できます。"
        ))
    
    # 質問4: 将来設計
    future_answer = next((a.answer for a in marriage_answers if a.questionId == 3), 3)
    if future_answer <= 2:
        advice.append(PersonalizedAdvice(
            category="将来設計",
            content="子育てを重視するあなたは、パートナーと育児方針について早めに話し合うことをお勧めします。"
        ))
    elif future_answer >= 4:
        advice.append(PersonalizedAdvice(
            category="将来設計",
            content="柔軟な将来設計を好むあなたは、パートナーの希望も聞きながら、一緒に人生設計を考えることが大切です。"
        ))
    
    return advice


def analyze_marriage_mbti(mbti_answers: List[MBTIAnswer], marriage_answers: List[MarriageAnswer]) -> MarriageMBTIResult:
    """Marriage MBTI+ 総合分析"""
    # MBTI 分析
    mbti_type, mbti_scores = calculate_mbti(mbti_answers)
    
    # 結婚観分析
    marriage_scores = calculate_marriage_scores(marriage_answers)
    
    # MBTI説明と相性を取得
    type_info = get_mbti_description_and_compatibility(mbti_type)
    
    # パーソナライズアドバイスを生成
    advice = generate_personalized_advice(marriage_answers)
    
    # 相性タイプをフォーマット
    compatible_types = [
        CompatibleType(type=ct["type"], reason=ct["reason"])
        for ct in type_info["compatibleTypes"]
    ]
    
    return MarriageMBTIResult(
        mbtiType=mbti_type,
        typeName=type_info["name"],
        description=type_info["description"],
        loveCharacteristics=type_info["loveCharacteristics"],
        compatibleTypes=compatible_types,
        advice=advice,
        mbtiScores=mbti_scores,
        marriageScores=marriage_scores
    )