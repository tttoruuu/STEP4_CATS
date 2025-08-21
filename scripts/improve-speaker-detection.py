import json
from pathlib import Path

# 既存のセグメントデータを読み込み
input_path = Path(__file__).parent.parent / 'frontend' / 'public' / 'conversation_segments.json'
with open(input_path, 'r', encoding='utf-8') as f:
    segments = json.load(f)

# 話者判定ルール
# 1. 短い相槌や返答は前の話者と同じ
# 2. 質問文は話者交代の可能性が高い
# 3. 長い無音の後は話者交代の可能性が高い

current_speaker = "A"
improved_segments = []

for i, segment in enumerate(segments):
    text = segment['text']
    duration = segment['end'] - segment['start']
    
    # 前のセグメントとの間隔を計算
    gap = 0
    if i > 0:
        gap = segment['start'] - segments[i-1]['end']
    
    # 話者判定ロジック
    should_switch = False
    
    # 長い間隔（1.5秒以上）の後は話者交代
    if gap > 1.5:
        should_switch = True
    
    # 短い返答（2秒未満）は話者維持の可能性が高い
    elif duration < 2.0:
        should_switch = False
    
    # 質問文の後は話者交代
    elif i > 0 and any(q in segments[i-1]['text'] for q in ['ですか', 'ますか', 'でしょうか']):
        should_switch = True
    
    # 「そうですね」「わかります」などの相槌の後は話者交代
    elif any(word in text for word in ['そうですね', 'わかります', 'なるほど', 'そうなんですね']):
        should_switch = True
    
    # デフォルトでは3秒以上の発話で話者交代
    elif duration > 3.0:
        should_switch = True
    
    if should_switch and i > 0:
        current_speaker = "B" if current_speaker == "A" else "A"
    
    # セグメントを更新
    segment['speaker'] = current_speaker
    segment['name'] = "女性" if current_speaker == "A" else "男性"
    improved_segments.append(segment)

# 結果を保存
output_path = Path(__file__).parent.parent / 'frontend' / 'public' / 'conversation_segments_improved.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(improved_segments, f, ensure_ascii=False, indent=2)

print(f"話者分離を改善しました！")
print(f"保存先: {output_path}")

# 話者の分布を表示
speaker_a_count = sum(1 for s in improved_segments if s['speaker'] == 'A')
speaker_b_count = len(improved_segments) - speaker_a_count
print(f"\n話者A（女性）: {speaker_a_count}セグメント")
print(f"話者B（男性）: {speaker_b_count}セグメント")

# 最初の10セグメントを表示
print("\n最初の10セグメント:")
for segment in improved_segments[:10]:
    print(f"{segment['name']} ({segment['start']:.1f}s): {segment['text'][:30]}...")