import json
from pathlib import Path

# 既存のセグメントデータを読み込み
input_path = Path(__file__).parent.parent / 'frontend' / 'public' / 'conversation_segments_improved.json'
with open(input_path, 'r', encoding='utf-8') as f:
    segments = json.load(f)

# 手動で話者を修正
manual_corrections = {
    # ID: 正しい話者
    1: "A",  # 女性: こんにちは加藤さんですか
    2: "B",  # 男性: 初めまして加藤です
    3: "A",  # 女性: 初対面ってやっぱり緊張しますね
    4: "B",  # 男性: そう言ってもらえて安心しました
    5: "A",  # 女性: 本当ですね落ち着いた雰囲気が素敵です
    6: "B",  # 男性: わかります
    7: "A",  # 女性: 表参道の路地裏にある小さなカフェ
    8: "B",  # 男性: そういえばこの前は友人と京都に
    9: "A",  # 女性: 紅葉がすごく綺麗で
    10: "B", # 男性: わかります 旅行での思い出って
}

# 複数の発話が含まれるセグメントを分割
split_segments = []

for segment in segments:
    seg_id = segment['id']
    
    if seg_id == 3:
        # "初対面ってやっぱり緊張しますね そうですねでもお会いできて嬉しいです"を分割
        split_segments.append({
            "id": 3,
            "speaker": "A",
            "name": "女性",
            "start": segment['start'],
            "end": segment['start'] + 3.5,
            "text": "初対面ってやっぱり緊張しますね"
        })
        split_segments.append({
            "id": 3.5,
            "speaker": "B",
            "name": "男性",
            "start": segment['start'] + 3.5,
            "end": segment['end'],
            "text": "そうですねでもお会いできて嬉しいです"
        })
    elif seg_id == 7:
        # "表参道の路地裏にある小さなカフェが特にお気に入りなんです いいですね隠れ家っぽいお店ってテンション上がりますよね"を分割
        split_segments.append({
            "id": 7,
            "speaker": "A",
            "name": "女性",
            "start": segment['start'],
            "end": segment['start'] + 5.0,
            "text": "表参道の路地裏にある小さなカフェが特にお気に入りなんです"
        })
        split_segments.append({
            "id": 7.5,
            "speaker": "B",
            "name": "男性",
            "start": segment['start'] + 5.0,
            "end": segment['end'],
            "text": "いいですね隠れ家っぽいお店ってテンション上がりますよね"
        })
    elif seg_id == 8:
        # "そういえばこの前は友人と京都に行ってきたんです 京都いいですね何が印象的でした"を分割
        split_segments.append({
            "id": 8,
            "speaker": "B",
            "name": "男性", 
            "start": segment['start'],
            "end": segment['start'] + 4.0,
            "text": "そういえばこの前は友人と京都に行ってきたんです"
        })
        split_segments.append({
            "id": 8.5,
            "speaker": "A",
            "name": "女性",
            "start": segment['start'] + 4.0,
            "end": segment['end'],
            "text": "京都いいですね何が印象的でした"
        })
    else:
        # 修正が必要な場合は手動修正を適用
        if seg_id in manual_corrections:
            segment['speaker'] = manual_corrections[seg_id]
            segment['name'] = "女性" if manual_corrections[seg_id] == "A" else "男性"
        split_segments.append(segment)

# IDを再採番
for i, segment in enumerate(split_segments):
    segment['id'] = i + 1

# 結果を保存
output_path = Path(__file__).parent.parent / 'frontend' / 'public' / 'conversation_segments_corrected.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(split_segments, f, ensure_ascii=False, indent=2)

print(f"話者を手動で修正しました！")
print(f"セグメント数: {len(segments)} → {len(split_segments)}")
print(f"保存先: {output_path}")

# 話者の分布を表示
speaker_a_count = sum(1 for s in split_segments if s['speaker'] == 'A')
speaker_b_count = len(split_segments) - speaker_a_count
print(f"\n話者A（女性）: {speaker_a_count}セグメント")
print(f"話者B（男性）: {speaker_b_count}セグメント")

# 修正されたセグメントを表示
print("\n修正されたセグメント:")
for segment in split_segments:
    print(f"{segment['id']}. {segment['name']} ({segment['start']:.1f}s): {segment['text']}")