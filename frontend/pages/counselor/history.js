import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Calendar, MessageSquare, FileText, Search } from 'lucide-react';

export default function CounselorHistory() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 相談履歴のサンプルデータ
  const historyData = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'chat',
      title: 'プロフィール写真について相談',
      summary: 'どのような写真を使うべきか、第一印象を良くする方法について話し合いました。',
      tags: ['プロフィール', '写真', '第一印象']
    },
    {
      id: 2,
      date: '2024-01-12',
      type: 'profile',
      title: '自己紹介文の作成',
      summary: '趣味や性格を活かした自己紹介文を3パターン作成しました。',
      tags: ['自己紹介', '文章作成', 'AI生成']
    },
    {
      id: 3,
      date: '2024-01-10',
      type: 'chat',
      title: 'デートでの会話について',
      summary: '初回デートで話すべき話題や避けるべき話題について相談しました。',
      tags: ['デート', '会話', 'コミュニケーション']
    },
    {
      id: 4,
      date: '2024-01-08',
      type: 'chat',
      title: 'マッチングアプリでの不安',
      summary: 'マッチングしても会話が続かない不安について話し合いました。',
      tags: ['マッチング', '不安', 'メンタルサポート']
    },
    {
      id: 5,
      date: '2024-01-05',
      type: 'profile',
      title: '趣味欄の充実',
      summary: '趣味の書き方を見直し、より魅力的に表現する方法を検討しました。',
      tags: ['趣味', 'プロフィール改善']
    }
  ];

  const filteredHistory = historyData.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type) => {
    return type === 'chat' ? <MessageSquare className="w-4 h-4" /> : <FileText className="w-4 h-4" />;
  };

  const getTypeColor = (type) => {
    return type === 'chat' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <Layout title="相談履歴">
      <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-[#FF8551]">相談履歴</h1>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="履歴を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8551] focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                selectedFilter === 'all' 
                  ? 'bg-[#FF8551] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setSelectedFilter('chat')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                selectedFilter === 'chat' 
                  ? 'bg-[#FF8551] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              チャット相談
            </button>
            <button
              onClick={() => setSelectedFilter('profile')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                selectedFilter === 'profile' 
                  ? 'bg-[#FF8551] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              プロフィール作成
            </button>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <div className="text-2xl font-bold text-[#FF8551] mb-1">
              {historyData.filter(item => item.type === 'chat').length}
            </div>
            <div className="text-xs text-gray-600">チャット相談</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <div className="text-2xl font-bold text-[#FF8551] mb-1">
              {historyData.filter(item => item.type === 'profile').length}
            </div>
            <div className="text-xs text-gray-600">プロフィール作成</div>
          </div>
        </div>

        {/* 履歴リスト */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>検索条件に一致する履歴がありません</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800 text-sm">{item.title}</h3>
                      <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">{item.summary}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 新しい相談ボタン */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/counselor/chat')}
            className="w-full py-3 bg-[#FF8551] text-white rounded-lg hover:bg-[#FF7043] transition-colors"
          >
            新しい相談を始める
          </button>
        </div>
      </main>
    </Layout>
  );
}