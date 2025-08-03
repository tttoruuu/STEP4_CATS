import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/Layout';
import { MessageSquare, FileText, Clock, Heart } from 'lucide-react';

export default function CounselorIndex() {
  const router = useRouter();

  return (
    <Layout title="AIカウンセラー">
      <main className="max-w-sm mx-auto px-6 py-8 min-h-screen" style={{background: 'var(--bg-gradient-main)'}}>
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 relative mb-4 flex justify-center mx-auto">
            <Image
              src="/images/logo.png"
              alt="Miraim ロゴ"
              width={128}
              height={128}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{color: 'var(--color-primary-500)'}}>AIカウンセラー</h1>
          <p className="text-sm" style={{color: 'var(--color-gray-600)'}}>
            24時間いつでも相談できる<br />
            あなた専用のカウンセラーです
          </p>
        </div>

        {/* 機能メニュー */}
        <div className="space-y-4">
          {/* 24時間相談 */}
          <Link href="/counselor/chat">
            <div className="card" style={{borderLeft: '4px solid var(--color-primary-500)'}}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full" style={{backgroundColor: 'var(--color-primary-500)'}}>
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1" style={{color: 'var(--color-gray-800)'}}>24時間相談チャット</h3>
                  <p className="text-sm" style={{color: 'var(--color-gray-600)'}}>
                    婚活の悩みをいつでも相談できます
                  </p>
                </div>
                <div className="px-2 py-1 rounded-full" style={{backgroundColor: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.1)'}}>
                  <Clock className="w-4 h-4" style={{color: 'var(--color-success)'}} />
                </div>
              </div>
            </div>
          </Link>

          {/* 自己紹介文作成 */}
          <Link href="/counselor/profile-creator">
            <div className="card" style={{borderLeft: '4px solid var(--color-secondary-500)'}}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full" style={{backgroundColor: 'var(--color-secondary-500)'}}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1" style={{color: 'var(--color-gray-800)'}}>自己紹介文作成</h3>
                  <p className="text-sm" style={{color: 'var(--color-gray-600)'}}>
                    AIがあなたの魅力を引き出す文章を作成
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* 相談履歴 */}
          <Link href="/counselor/history">
            <div className="card" style={{borderLeft: '4px solid var(--color-accent-500)'}}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full" style={{backgroundColor: 'var(--color-accent-500)'}}>
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1" style={{color: 'var(--color-gray-800)'}}>過去の相談履歴</h3>
                  <p className="text-sm" style={{color: 'var(--color-gray-600)'}}>
                    これまでの相談内容を振り返る
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 今日のメッセージ */}
        <div className="mt-8 p-6 rounded-xl text-white" style={{background: 'var(--bg-gradient-primary)'}}>
          <h3 className="font-medium mb-2">今日のメッセージ</h3>
          <p className="text-sm opacity-90">
            婚活は一歩ずつ進むものです。今日もあなたのペースで大丈夫。
            何か気になることがあれば、いつでも話しかけてくださいね。
          </p>
        </div>

        {/* 戻るボタン */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="transition-colors"
            style={{color: 'var(--color-gray-500)'}}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gray-700)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-500)'}
          >
            ← ホームに戻る
          </button>
        </div>
      </main>
    </Layout>
  );
}