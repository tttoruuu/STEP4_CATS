import Link from 'next/link';
import { Info, HelpCircle } from 'lucide-react';

export default function TopQuickLinks() {
  return (
    <div className="fixed top-2 right-4 z-50 flex gap-2 sm:top-4">
      <Link
        href="/features"
        className="neo-btn neo-btn-secondary inline-flex items-center gap-2 px-3 py-2 text-sm"
        aria-label="特徴へ移動"
      >
        <Info className="w-4 h-4 text-orange-500" />
        <span>特徴</span>
      </Link>
      <Link
        href="/help"
        className="neo-btn neo-btn-secondary inline-flex items-center gap-2 px-3 py-2 text-sm"
        aria-label="ヘルプへ移動"
      >
        <HelpCircle className="w-4 h-4 text-orange-500" />
        <span>ヘルプ</span>
      </Link>
    </div>
  );
}