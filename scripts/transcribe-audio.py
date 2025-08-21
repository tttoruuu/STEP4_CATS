import os
import json
import requests
from openai import OpenAI
from pathlib import Path

# OpenAI APIキーを環境変数から取得
api_key = os.environ.get('OPENAI_API_KEY')
if not api_key:
    # .env.localファイルから読み込み
    env_path = Path(__file__).parent.parent / 'frontend' / '.env.local'
    if env_path.exists():
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('OPENAI_API_KEY='):
                    api_key = line.split('=', 1)[1].strip()
                    break

if not api_key:
    raise ValueError("OPENAI_API_KEY が設定されていません")

# OpenAIクライアントの初期化
client = OpenAI(api_key=api_key)

# 音声ファイルのURL
audio_url = "https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/conversation_full.mp3"

# 音声ファイルをダウンロード
print("音声ファイルをダウンロード中...")
response = requests.get(audio_url)
audio_file_path = Path(__file__).parent / "conversation_full.mp3"

with open(audio_file_path, 'wb') as f:
    f.write(response.content)
print(f"ダウンロード完了: {audio_file_path}")

# Whisper APIで文字起こし（タイムスタンプ付き）
print("Whisper APIで文字起こし中...")
with open(audio_file_path, 'rb') as audio_file:
    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        response_format="verbose_json",
        timestamp_granularities=["segment", "word"]
    )

# セグメントデータを解析
segments = []
speaker_a = True  # 話者を交互に割り当て（仮）

for i, segment in enumerate(transcription.segments):
    # 話者を推定（簡易的に交互に割り当て）
    # 実際の音声分析や話者識別が必要な場合は、より高度な処理が必要
    speaker = "A" if speaker_a else "B"
    name = "女性" if speaker_a else "男性"
    
    segment_data = {
        "id": i + 1,
        "speaker": speaker,
        "name": name,
        "start": segment.start,
        "end": segment.end,
        "text": segment.text.strip()
    }
    
    segments.append(segment_data)
    
    # 次の話者を切り替え（簡易的な実装）
    # より正確には、無音区間や音声の特徴で判断する必要がある
    if segment.end - segment.start > 3:  # 3秒以上の発話で話者交代と仮定
        speaker_a = not speaker_a

# 結果をJSONファイルに保存
output_path = Path(__file__).parent.parent / 'frontend' / 'public' / 'conversation_segments.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(segments, f, ensure_ascii=False, indent=2)

print(f"文字起こし完了！セグメント数: {len(segments)}")
print(f"保存先: {output_path}")

# 最初の5セグメントを表示
print("\n最初の5セグメント:")
for segment in segments[:5]:
    print(f"{segment['name']} ({segment['start']:.1f}s - {segment['end']:.1f}s): {segment['text']}")

# ダウンロードした音声ファイルを削除
audio_file_path.unlink()
print("\n一時ファイルを削除しました")