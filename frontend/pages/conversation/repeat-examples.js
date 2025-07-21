import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AudioPlayer from '../../components/AudioPlayer';
import { ArrowLeft, X, CheckCircle, Lightbulb } from 'lucide-react';
import { examplesData } from '../../data/audioData';

export default function RepeatExamples() {
  const router = useRouter();
  const { scenario, audioId } = router.query;
  const [exampleData, setExampleData] = useState(null);

  useEffect(() => {
    if (scenario) {
      // シナリオに基づいて例を選択
      let examples = null;
      if (scenario.includes('成功') || scenario.includes('プロジェクト')) {
        examples = examplesData.repeat.project;
      } else {
        // デフォルトはプロジェクトの例
        examples = examplesData.repeat.project;
      }
      setExampleData(examples);
    }
  }, [scenario]);

  if (!exampleData) {
    return (
      <Layout title="NG/OK例">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="全コピーのNG/OK例">
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="w-full max-w-md mx-auto mt-8 px-6 relative">
          <button 
            onClick={() => router.back()}
            className="text-green-600 flex items-center gap-1 hover:opacity-80 transition-opacity absolute left-6"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center px-6 py-4">
          <div className="w-full max-w-md">
            {/* ヘッダー */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-sm border border-white/40">
              <h1 className="text-xl font-bold text-green-600 mb-2">NGとOK例で学ぼう</h1>
              <p className="text-gray-600 text-sm mb-3">
                {exampleData.situation}
              </p>
            </div>

            {/* NG例 */}
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X size={16} />
                  </div>
                  <h2 className="font-bold text-red-700">NG例</h2>
                </div>
                
                <AudioPlayer
                  audioSrc={exampleData.ngExample.audioSrc}
                  title="良くない繰り返しの例"
                />
                
                <div className="mt-3 p-3 bg-red-100 rounded-lg">
                  <p className="text-sm text-red-800 font-medium mb-1">
                    発言内容: 「{exampleData.ngExample.text}」
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>なぜNG?</strong> {exampleData.ngExample.reason}
                  </p>
                </div>
              </div>
            </div>

            {/* OK例 */}
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                    <CheckCircle size={16} />
                  </div>
                  <h2 className="font-bold text-green-700">OK例</h2>
                </div>
                
                <AudioPlayer
                  audioSrc={exampleData.okExample.audioSrc}
                  title="良い繰り返しの例"
                />
                
                <div className="mt-3 p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-800 font-medium mb-1">
                    発言内容: 「{exampleData.okExample.text}」
                  </p>
                  <p className="text-sm text-green-700">
                    <strong>なぜOK?</strong> {exampleData.okExample.reason}
                  </p>
                </div>
              </div>
            </div>

            {/* ワンポイントアドバイス */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-sm border border-white/40">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="text-yellow-500" size={20} />
                <h3 className="font-bold text-gray-800">ワンポイントアドバイス</h3>
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed">
                {exampleData.advice}
              </p>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/conversation/repeat-new')}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl px-6 py-3 hover:opacity-90 transition-all"
              >
                続けて練習
              </button>
              
              <button
                onClick={() => router.push('/conversation/modes')}
                className="flex-1 bg-gray-500 text-white rounded-xl px-6 py-3 hover:opacity-90 transition-all"
              >
                練習終了
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}