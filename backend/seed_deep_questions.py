#!/usr/bin/env python3
"""
Deep Questions seed script
深堀り質問のサンプルデータをデータベースに投入するスクリプト
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models.deep_question import DeepQuestion
import json

def seed_deep_questions():
    """深堀り質問のサンプルデータを投入"""
    db = SessionLocal()
    
    try:
        # 既存データをクリア
        db.query(DeepQuestion).delete()
        
        # サンプルデータ
        questions_data = [
            {
                "category": "趣味について",
                "level": 1,
                "situation_text": "初めてのデートで、相手の女性が次のように話しました：",
                "partner_info": {
                    "name": "みゆきさん",
                    "age": "26歳",
                    "occupation": "看護師"
                },
                "statement": "最近ヨガを始めたんです",
                "options": [
                    {
                        "id": "A",
                        "text": "ヨガって体に良さそうですね",
                        "isCorrect": False,
                        "explanation": "一般論で返答しており、会話が深まりません"
                    },
                    {
                        "id": "B",
                        "text": "どのくらいの頻度で通われているんですか？きっかけは何かあったんですか？",
                        "isCorrect": True,
                        "explanation": "具体的な質問で相手の興味を深堀りでき、さらにきっかけを聞くことで背景を理解できます"
                    },
                    {
                        "id": "C",
                        "text": "僕もスポーツは好きです",
                        "isCorrect": False,
                        "explanation": "自分の話にすり替えてしまい、相手への関心を示せていません"
                    },
                    {
                        "id": "D",
                        "text": "ヨガは難しくないですか？",
                        "isCorrect": False,
                        "explanation": "ネガティブな印象を与える可能性があります"
                    }
                ],
                "correct_answer": "B",
                "audio_url": "/audio/samples/yoga-question.mp3",
                "key_points": [
                    "具体的な頻度を聞くことで相手の生活スタイルを知る",
                    "きっかけを聞くことで相手の価値観や動機を理解",
                    "2つの質問を自然につなげている"
                ]
            },
            {
                "category": "仕事について",
                "level": 1,
                "situation_text": "カフェでの会話中、相手が仕事について話しました：",
                "partner_info": {
                    "name": "さくらさん",
                    "age": "28歳",
                    "occupation": "保育士"
                },
                "statement": "保育士をしています。子供たちはとても可愛いです",
                "options": [
                    {
                        "id": "A",
                        "text": "保育士さんは大変そうですね",
                        "isCorrect": False,
                        "explanation": "ネガティブな面にフォーカスしており、相手の気持ちを下げる可能性があります"
                    },
                    {
                        "id": "B",
                        "text": "子供たちと接していて、一番やりがいを感じるのはどんな時ですか？",
                        "isCorrect": True,
                        "explanation": "仕事の喜びや価値観を聞き出す素晴らしい質問です。相手のポジティブな感情を引き出せます"
                    },
                    {
                        "id": "C",
                        "text": "何歳くらいの子供を担当しているんですか？",
                        "isCorrect": False,
                        "explanation": "悪くない質問ですが、感情面への踏み込みが不足しています"
                    },
                    {
                        "id": "D",
                        "text": "保育士の資格を取るの大変でしたか？",
                        "isCorrect": False,
                        "explanation": "過去の苦労話にフォーカスしており、現在の楽しみを聞き出せません"
                    }
                ],
                "correct_answer": "B",
                "audio_url": "/audio/samples/teacher-question.mp3",
                "key_points": [
                    "仕事のやりがいを聞くことで価値観を理解",
                    "ポジティブな感情を引き出す質問",
                    "相手の専門性への敬意を示している"
                ]
            },
            {
                "category": "価値観について",
                "level": 2,
                "situation_text": "お互いの価値観について話している時：",
                "partner_info": {
                    "name": "あやかさん",
                    "age": "25歳",
                    "occupation": "事務職"
                },
                "statement": "家族との時間をとても大切にしています",
                "options": [
                    {
                        "id": "A",
                        "text": "家族思いなんですね",
                        "isCorrect": False,
                        "explanation": "共感は示していますが、会話が続きません"
                    },
                    {
                        "id": "B",
                        "text": "ご家族とはどんな風に過ごされることが多いんですか？どんな時間が一番幸せですか？",
                        "isCorrect": True,
                        "explanation": "具体的な過ごし方と感情面の両方を聞き出す優れた質問です"
                    },
                    {
                        "id": "C",
                        "text": "僕も家族は大切だと思います",
                        "isCorrect": False,
                        "explanation": "共感は良いですが、相手についてもっと知る機会を逃しています"
                    },
                    {
                        "id": "D",
                        "text": "ご家族は何人ですか？",
                        "isCorrect": False,
                        "explanation": "情報収集に留まり、感情面に踏み込めていません"
                    }
                ],
                "correct_answer": "B",
                "audio_url": "/audio/samples/family-question.mp3",
                "key_points": [
                    "具体的な過ごし方を聞いて相手の日常を知る",
                    "幸せを感じる瞬間を聞いて価値観を理解",
                    "感情面に踏み込んだ深い質問"
                ]
            },
            {
                "category": "休日の過ごし方",
                "level": 1,
                "situation_text": "お互いの趣味について話している時：",
                "partner_info": {
                    "name": "ゆりこさん",
                    "age": "27歳",
                    "occupation": "デザイナー"
                },
                "statement": "休日はよくカフェ巡りをしています",
                "options": [
                    {
                        "id": "A",
                        "text": "カフェ巡り良いですね",
                        "isCorrect": False,
                        "explanation": "共感は示していますが、会話が続きません"
                    },
                    {
                        "id": "B",
                        "text": "お気に入りのカフェはありますか？どんな雰囲気のお店が好みですか？",
                        "isCorrect": True,
                        "explanation": "具体的なお店と好みの理由を聞くことで、相手の価値観や好みを深く知ることができます"
                    },
                    {
                        "id": "C",
                        "text": "僕もコーヒーは好きです",
                        "isCorrect": False,
                        "explanation": "自分の話にすり替えてしまい、相手についてもっと知る機会を逃しています"
                    },
                    {
                        "id": "D",
                        "text": "一人で行くんですか？",
                        "isCorrect": False,
                        "explanation": "やや踏み込みすぎで、相手が答えにくい可能性があります"
                    }
                ],
                "correct_answer": "B",
                "audio_url": "/audio/samples/cafe-question.mp3",
                "key_points": [
                    "お気に入りを聞くことで相手の好みを知る",
                    "雰囲気の好みから価値観を探る",
                    "具体的な質問で会話を発展させる"
                ]
            },
            {
                "category": "将来について",
                "level": 2,
                "situation_text": "お互いの将来について話している時：",
                "partner_info": {
                    "name": "かなこさん",
                    "age": "29歳",
                    "occupation": "営業職"
                },
                "statement": "将来は海外で働いてみたいと思っています",
                "options": [
                    {
                        "id": "A",
                        "text": "海外は大変そうですね",
                        "isCorrect": False,
                        "explanation": "ネガティブな印象を与え、相手の夢を萎縮させる可能性があります"
                    },
                    {
                        "id": "B",
                        "text": "どの国で働きたいですか？その国の何に魅力を感じるんですか？",
                        "isCorrect": True,
                        "explanation": "具体的な希望と動機を聞くことで、相手の価値観と情熱を理解できます"
                    },
                    {
                        "id": "C",
                        "text": "語学は得意なんですか？",
                        "isCorrect": False,
                        "explanation": "能力面の確認に留まり、夢への想いを聞き出せていません"
                    },
                    {
                        "id": "D",
                        "text": "僕は日本が一番だと思います",
                        "isCorrect": False,
                        "explanation": "相手の価値観を否定するような返答です"
                    }
                ],
                "correct_answer": "B",
                "audio_url": "/audio/samples/future-question.mp3",
                "key_points": [
                    "具体的な希望を聞いて夢を共有する",
                    "動機を探ることで価値観を理解",
                    "相手の情熱を尊重する姿勢を示す"
                ]
            }
        ]
        
        # データベースに投入
        for question_data in questions_data:
            question = DeepQuestion(
                category=question_data["category"],
                level=question_data["level"],
                situation_text=question_data["situation_text"],
                partner_info=question_data["partner_info"],
                statement=question_data["statement"],
                options=question_data["options"],
                correct_answer=question_data["correct_answer"],
                audio_url=question_data["audio_url"],
                key_points=question_data["key_points"]
            )
            db.add(question)
        
        db.commit()
        print(f"✅ {len(questions_data)}個の深堀り質問をデータベースに追加しました")
        
    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🌱 深堀り質問のサンプルデータを投入します...")
    seed_deep_questions()
    print("✨ 完了しました！")