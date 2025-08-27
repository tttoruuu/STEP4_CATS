#!/usr/bin/env python3
"""OpenAI API CLI テストスクリプト"""

from openai import OpenAI
import os
import sys
from dotenv import load_dotenv

# 環境変数読み込み
load_dotenv()

def call_openai(prompt: str, system_prompt: str = None):
    """OpenAI APIを呼び出す"""
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("Error: OPENAI_API_KEY not set")
        sys.exit(1)
    
    client = OpenAI(api_key=api_key)
    
    messages = []
    if system_prompt:
        messages.append({'role': 'system', 'content': system_prompt})
    messages.append({'role': 'user', 'content': prompt})
    
    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=messages,
        max_tokens=500,
        temperature=0.7
    )
    
    return response

if __name__ == "__main__":
    # コマンドライン引数からプロンプトを取得
    if len(sys.argv) > 1:
        user_prompt = " ".join(sys.argv[1:])
    else:
        user_prompt = "こんにちは！今日の調子はどうですか？"
    
    print(f"プロンプト: {user_prompt}")
    print("-" * 50)
    
    response = call_openai(user_prompt)
    print(f"モデル: {response.model}")
    print(f"使用トークン数: {response.usage.total_tokens}")
    print("-" * 50)
    print(f"回答:\n{response.choices[0].message.content}")