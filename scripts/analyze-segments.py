import json
from pathlib import Path

# Read segment data
file_path = Path(__file__).parent.parent / 'frontend' / 'public' / 'conversation_segments_editable.json'
with open(file_path, 'r', encoding='utf-8') as f:
    segments = json.load(f)

print("Timing Analysis for Segments 6, 7, and 8:")
print("-" * 60)

# Focus on segments 6, 7, and 8
for i in range(5, 8):  # segments 6, 7, 8 (0-indexed: 5, 6, 7)
    seg = segments[i]
    duration = seg['end'] - seg['start']
    print(f"Segment {seg['id']}:")
    print(f"  Speaker: {seg['speaker']} ({seg['name']})")
    print(f"  Start: {seg['start']:.2f}s")
    print(f"  End: {seg['end']:.2f}s")
    print(f"  Duration: {duration:.2f}s")
    print(f"  Text: {seg['text']}")
    
    # Check gap to next segment
    if i < len(segments) - 1:
        next_seg = segments[i + 1]
        gap = next_seg['start'] - seg['end']
        print(f"  Gap to next: {gap:.2f}s")
        if gap < 0:
            print(f"  WARNING: Overlap of {-gap:.2f}s!")
    print()

print("\nOverall Timing Pattern Analysis:")
print("-" * 60)

gaps = []
overlaps = []
for i in range(len(segments) - 1):
    seg = segments[i]
    next_seg = segments[i + 1]
    gap = next_seg['start'] - seg['end']
    
    if gap > 0.01:
        gaps.append((i+1, i+2, gap))
    elif gap < -0.01:
        overlaps.append((i+1, i+2, -gap))

print(f"Total segments: {len(segments)}")
print(f"Gaps found: {len(gaps)}")
print(f"Overlaps found: {len(overlaps)}")

if gaps:
    print("\nGaps between segments:")
    for seg1, seg2, gap in gaps:
        print(f"  Segment {seg1} → {seg2}: {gap:.2f}s gap")
    avg_gap = sum(g[2] for g in gaps) / len(gaps)
    print(f"  Average gap: {avg_gap:.2f}s")

if overlaps:
    print("\nOverlaps between segments:")
    for seg1, seg2, overlap in overlaps:
        print(f"  Segment {seg1} → {seg2}: {overlap:.2f}s overlap")