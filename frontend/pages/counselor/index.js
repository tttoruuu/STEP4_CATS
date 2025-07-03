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
      <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
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
          <h1 className="text-2xl font-bold text-[#FF8551] mb-2">AIカウンセラー</h1>
          <p className="text-gray-600 text-sm">
            24時間いつでも相談できる<br />
            あなた専用のカウンセラーです
          </p>
        </div>

        {/* 機能メニュー */}
        <div className="space-y-4">
          {/* 24時間相談 */}
          <Link href="/counselor/chat">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#FF8551] hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-[#FF8551] p-3 rounded-full">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-1">24時間相談チャット</h3>
                  <p className="text-sm text-gray-600">
                    婚活の悩みをいつでも相談できます
                  </p>
                </div>
                <div className="bg-green-100 px-2 py-1 rounded-full">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
          </Link>

          {/* 自己紹介文作成 */}
          <Link href="/counselor/profile-creator">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 p-3 rounded-full">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-1">自己紹介文作成</h3>
                  <p className="text-sm text-gray-600">
                    AIがあなたの魅力を引き出す文章を作成
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* 相談履歴 */}
          <Link href="/counselor/history">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 p-3 rounded-full">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-1">過去の相談履歴</h3>
                  <p className="text-sm text-gray-600">
                    これまでの相談内容を振り返る
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 今日のメッセージ */}
        <div className="mt-8 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] p-6 rounded-xl text-white">
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
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← ホームに戻る
          </button>
        </div>
      </main>
    </Layout>
  );
}