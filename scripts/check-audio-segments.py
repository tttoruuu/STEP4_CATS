import json
from pathlib import Path

# セグメントデータを読み込み
file_path = Path(__file__).parent.parent / 'frontend' / 'public' / 'conversation_segments_editable.json'
with open(file_path, 'r', encoding='utf-8') as f:
    segments = json.load(f)

print("セグメントの時間チェック:")
print("-" * 60)

total_gaps = 0
for i in range(len(segments)):
    seg = segments[i]
    print(f"ID {seg['id']:2d}: {seg['start']:6.2f}s - {seg['end']:6.2f}s ({seg['end'] - seg['start']:5.2f}s) {seg['speaker']}")
    
    # 次のセグメントとの間隔をチェック
    if i < len(segments) - 1:
        next_seg = segments[i + 1]
        gap = next_seg['start'] - seg['end']
        if gap > 0.01:  # 0.01秒以上の隙間
            print(f"      → 隙間: {gap:.2f}秒")
            total_gaps += gap
        elif gap < -0.01:  # 重複
            print(f"      → 重複: {-gap:.2f}秒")

print("-" * 60)
print(f"総音声時間: {segments[-1]['end']:.2f}秒")
print(f"総隙間時間: {total_gaps:.2f}秒")
print(f"実効時間: {segments[-1]['end'] - total_gaps:.2f}秒")