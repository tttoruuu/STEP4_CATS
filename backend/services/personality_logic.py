from typing import Dict, List, Tuple
from enum import Enum


class PersonalityType(str, Enum):
    """性格タイプ分類（婚活特化版）"""
    COMMUNICATOR = "コミュニケーター"  # 外向的で協調性が高い
    SUPPORTER = "サポーター"  # 内向的で思いやりがある
    LEADER = "リーダー"  # 外向的で決断力がある
    ANALYST = "アナリスト"  # 内向的で論理的
    CREATIVE = "クリエイター"  # 創造性が高く柔軟
    RELIABLE = "信頼できるパートナー"  # 安定性と責任感が高い


class PersonalityDimension(str, Enum):
    """性格診断の軸"""
    EXTROVERSION = "外向性"  # 外向性 vs 内向性
    COMMUNICATION = "コミュニケーション"  # コミュニケーション能力
    EMOTIONAL_STABILITY = "感情安定性"  # 感情コントロール
    DECISION_MAKING = "意思決定"  # 決断力と計画性
    EMPATHY = "共感性"  # 相手への理解と思いやり
    COMMITMENT = "コミット力"  # 関係への責任感


# 質問データ構造
PERSONALITY_QUESTIONS = [
    {
        "id": 1,
        "question": "初対面の人との会話で、あなたはどう感じますか？",
        "dimension": PersonalityDimension.EXTROVERSION,
        "options": [
            {"text": "楽しくて自然に話せる", "score": 4},
            {"text": "少し緊張するが、話すのは好き", "score": 3},
            {"text": "緊張するが、相手に合わせて話す", "score": 2},
            {"text": "とても緊張して話すのが難しい", "score": 1}
        ]
    },
    {
        "id": 2,
        "question": "パートナーとの会話で最も大切だと思うことは？",
        "dimension": PersonalityDimension.COMMUNICATION,
        "options": [
            {"text": "お互いの気持ちを理解し合うこと", "score": 4},
            {"text": "楽しく盛り上がること", "score": 3},
            {"text": "相手の話をよく聞くこと", "score": 2},
            {"text": "自分の考えを正確に伝えること", "score": 1}
        ]
    },
    {
        "id": 3,
        "question": "ストレスを感じた時、どのように対処しますか？",
        "dimension": PersonalityDimension.EMOTIONAL_STABILITY,
        "options": [
            {"text": "友人や家族に相談する", "score": 4},
            {"text": "一人で冷静に考える", "score": 3},
            {"text": "趣味や運動で気分転換する", "score": 2},
            {"text": "時間が解決するまで待つ", "score": 1}
        ]
    },
    {
        "id": 4,
        "question": "デートの計画を立てる時、あなたのスタイルは？",
        "dimension": PersonalityDimension.DECISION_MAKING,
        "options": [
            {"text": "事前に詳しく計画を立てる", "score": 4},
            {"text": "大まかな予定を決めておく", "score": 3},
            {"text": "相手の希望を聞いてから決める", "score": 2},
            {"text": "その場の流れで決める", "score": 1}
        ]
    },
    {
        "id": 5,
        "question": "パートナーが落ち込んでいる時、どう接しますか？",
        "dimension": PersonalityDimension.EMPATHY,
        "options": [
            {"text": "話を聞いて共感し、支える", "score": 4},
            {"text": "解決策を一緒に考える", "score": 3},
            {"text": "そっと見守る", "score": 2},
            {"text": "元気になる方法を提案する", "score": 1}
        ]
    },
    {
        "id": 6,
        "question": "結婚について、あなたの考えは？",
        "dimension": PersonalityDimension.COMMITMENT,
        "options": [
            {"text": "人生で最も重要な決断の一つ", "score": 4},
            {"text": "お互いを支え合う大切なパートナーシップ", "score": 3},
            {"text": "愛情があれば自然な流れ", "score": 2},
            {"text": "良い相手が見つかれば考える", "score": 1}
        ]
    },
    {
        "id": 7,
        "question": "意見が対立した時、どう解決しますか？",
        "dimension": PersonalityDimension.COMMUNICATION,
        "options": [
            {"text": "お互いの立場を理解し合うまで話し合う", "score": 4},
            {"text": "冷静になってから建設的に議論する", "score": 3},
            {"text": "妥協点を見つけて解決する", "score": 2},
            {"text": "時間をおいて自然に解決を待つ", "score": 1}
        ]
    },
    {
        "id": 8,
        "question": "新しい環境や変化に対して、どう感じますか？",
        "dimension": PersonalityDimension.EXTROVERSION,
        "options": [
            {"text": "わくわくして積極的に取り組む", "score": 4},
            {"text": "少し不安だが、チャレンジしたい", "score": 3},
            {"text": "慎重に準備してから臨む", "score": 2},
            {"text": "できれば安定した環境を好む", "score": 1}
        ]
    },
    {
        "id": 9,
        "question": "将来の家庭について、どのような役割分担を想像しますか？",
        "dimension": PersonalityDimension.DECISION_MAKING,
        "options": [
            {"text": "お互いの得意分野を活かした分担", "score": 4},
            {"text": "話し合って決める", "score": 3},
            {"text": "相手に合わせて柔軟に対応", "score": 2},
            {"text": "従来の役割分担が良い", "score": 1}
        ]
    },
    {
        "id": 10,
        "question": "パートナーの家族や友人との関係で大切にしたいことは？",
        "dimension": PersonalityDimension.EMPATHY,
        "options": [
            {"text": "積極的に良い関係を築きたい", "score": 4},
            {"text": "相手を尊重し、自然に接したい", "score": 3},
            {"text": "必要な時にはしっかりと関わる", "score": 2},
            {"text": "距離感を保ちながら礼儀正しく", "score": 1}
        ]
    }
]


def calculate_personality_scores(answers: Dict[int, int]) -> Dict[PersonalityDimension, float]:
    """
    回答から各性格軸のスコアを計算
    
    Args:
        answers: {question_id: selected_option_index} の辞書
    
    Returns:
        各性格軸のスコア (0-100)
    """
    dimension_scores = {dim: [] for dim in PersonalityDimension}
    
    for question in PERSONALITY_QUESTIONS:
        question_id = question["id"]
        if question_id in answers:
            selected_option_index = answers[question_id]
            if 0 <= selected_option_index < len(question["options"]):
                score = question["options"][selected_option_index]["score"]
                dimension_scores[question["dimension"]].append(score)
    
    # 各軸の平均スコアを計算し、100点満点に変換
    result = {}
    for dimension, scores in dimension_scores.items():
        if scores:
            avg_score = sum(scores) / len(scores)
            # 1-4スケールを0-100に変換
            normalized_score = ((avg_score - 1) / 3) * 100
            result[dimension] = round(normalized_score, 1)
        else:
            result[dimension] = 0.0
    
    return result


def determine_personality_type(scores: Dict[PersonalityDimension, float]) -> PersonalityType:
    """
    スコアから性格タイプを判定
    """
    extroversion = scores.get(PersonalityDimension.EXTROVERSION, 0)
    communication = scores.get(PersonalityDimension.COMMUNICATION, 0)
    emotional_stability = scores.get(PersonalityDimension.EMOTIONAL_STABILITY, 0)
    decision_making = scores.get(PersonalityDimension.DECISION_MAKING, 0)
    empathy = scores.get(PersonalityDimension.EMPATHY, 0)
    commitment = scores.get(PersonalityDimension.COMMITMENT, 0)
    
    # 性格タイプ判定ロジック
    if extroversion >= 70 and communication >= 70:
        return PersonalityType.COMMUNICATOR
    elif empathy >= 70 and emotional_stability >= 60:
        return PersonalityType.SUPPORTER
    elif extroversion >= 70 and decision_making >= 70:
        return PersonalityType.LEADER
    elif decision_making >= 70 and emotional_stability >= 70:
        return PersonalityType.ANALYST
    elif extroversion >= 60 and empathy >= 60 and communication >= 60:
        return PersonalityType.CREATIVE
    else:
        return PersonalityType.RELIABLE


def get_personality_description(personality_type: PersonalityType) -> Dict[str, str]:
    """
    性格タイプの詳細説明を取得
    """
    descriptions = {
        PersonalityType.COMMUNICATOR: {
            "title": "コミュニケーター",
            "summary": "あなたは自然な会話力と協調性を持つ、魅力的なパートナーです。",
            "strengths": "・相手の話をよく聞き、共感する能力が高い\n・明るく前向きな性格で、周囲を楽しませる\n・チームワークを大切にし、調和を保つのが得意",
            "marriage_advice": "パートナーとの対話を大切にし、お互いの気持ちを理解し合うことで、深い絆を築けるでしょう。コミュニケーション能力を活かして、結婚生活でも良好な関係を維持できます。",
            "growth_points": "時には自分の意見もしっかりと伝え、相手との健全な議論も大切にしましょう。"
        },
        PersonalityType.SUPPORTER: {
            "title": "サポーター", 
            "summary": "あなたは思いやりがあり、パートナーを支える温かい心を持っています。",
            "strengths": "・相手の気持ちに寄り添い、支える力がある\n・安定した関係を築くのが得意\n・誠実で信頼できる人柄",
            "marriage_advice": "あなたの優しさと安定性は、長期的な関係において大きな強みです。相手を支えながらも、自分の気持ちも大切に表現していくことで、より良いパートナーシップを築けます。",
            "growth_points": "自分の意見や感情ももっと積極的に表現し、対等な関係を心がけましょう。"
        },
        PersonalityType.LEADER: {
            "title": "リーダー",
            "summary": "あなたは決断力があり、関係をリードしていく力を持っています。",
            "strengths": "・計画性があり、将来を見据えた行動ができる\n・責任感が強く、頼りになる存在\n・積極的に問題解決に取り組む",
            "marriage_advice": "リーダーシップを活かして家庭を支えながらも、パートナーの意見も尊重し、二人で決断していく姿勢が大切です。",
            "growth_points": "相手の気持ちにもっと寄り添い、一緒に決めていく協調性を育てましょう。"
        },
        PersonalityType.ANALYST: {
            "title": "アナリスト",
            "summary": "あなたは論理的で冷静な判断力を持つ、信頼できるパートナーです。",
            "strengths": "・物事を客観的に分析し、的確な判断ができる\n・感情に左右されず、安定した関係を築ける\n・計画的で将来を見据えた行動が得意",
            "marriage_advice": "論理的思考力を活かして、パートナーと建設的な話し合いができます。感情面でのコミュニケーションも大切にすることで、より深い絆を築けるでしょう。",
            "growth_points": "感情表現をもっと豊かにし、相手の感情にも寄り添う姿勢を育てましょう。"
        },
        PersonalityType.CREATIVE: {
            "title": "クリエイター",
            "summary": "あなたは創造性と柔軟性を持つ、刺激的なパートナーです。",
            "strengths": "・新しいアイデアや体験を楽しむ\n・相手を楽しませる創造力がある\n・変化に柔軟に対応できる",
            "marriage_advice": "あなたの創造性と柔軟性は、関係に新鮮さをもたらします。一方で、安定性も大切にし、パートナーとのバランスを保ちながら成長していけるでしょう。",
            "growth_points": "創造性を活かしながらも、継続性や安定性も意識して関係を築きましょう。"
        },
        PersonalityType.RELIABLE: {
            "title": "信頼できるパートナー",
            "summary": "あなたは安定性と責任感を持つ、頼りになるパートナーです。",
            "strengths": "・約束を守り、相手から信頼される\n・安定した関係を維持するのが得意\n・誠実で一途な愛情を持っている",
            "marriage_advice": "あなたの信頼性と責任感は、長期的な関係の基盤となります。安定性を保ちながらも、時には新しいことにもチャレンジして、関係に変化をもたらすことも大切です。",
            "growth_points": "安定性を保ちながらも、もう少し積極性や表現力を身につけることで、より魅力的になれるでしょう。"
        }
    }
    
    return descriptions.get(personality_type, {
        "title": "個性的なパートナー",
        "summary": "あなたは独自の魅力を持つパートナーです。",
        "strengths": "あなただけの特別な魅力があります。",
        "marriage_advice": "自分らしさを大切にしながら、相手との関係を築いていきましょう。",
        "growth_points": "自分の強みを活かしながら、さらに成長していきましょう。"
    })


def get_compatible_types(personality_type: PersonalityType) -> List[PersonalityType]:
    """
    相性の良い性格タイプを取得
    """
    compatibility_map = {
        PersonalityType.COMMUNICATOR: [PersonalityType.SUPPORTER, PersonalityType.ANALYST, PersonalityType.RELIABLE],
        PersonalityType.SUPPORTER: [PersonalityType.COMMUNICATOR, PersonalityType.LEADER, PersonalityType.CREATIVE],
        PersonalityType.LEADER: [PersonalityType.SUPPORTER, PersonalityType.ANALYST, PersonalityType.RELIABLE],
        PersonalityType.ANALYST: [PersonalityType.COMMUNICATOR, PersonalityType.LEADER, PersonalityType.CREATIVE],
        PersonalityType.CREATIVE: [PersonalityType.SUPPORTER, PersonalityType.ANALYST, PersonalityType.RELIABLE],
        PersonalityType.RELIABLE: [PersonalityType.COMMUNICATOR, PersonalityType.LEADER, PersonalityType.CREATIVE],
    }
    
    return compatibility_map.get(personality_type, [])