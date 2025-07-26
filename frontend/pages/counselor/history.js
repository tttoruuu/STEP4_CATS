import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Calendar, MessageSquare, FileText, Search, ArrowRight, RefreshCw } from 'lucide-react';

export default function CounselorHistory() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  // 履歴データを取得
  useEffect(() => {
    setIsMounted(true);
    fetchHistory();
    fetchCurrentDateTime();
    
    // ページにフォーカスが戻ったときに履歴を更新
    const handleFocus = () => {
      fetchHistory();
      fetchCurrentDateTime();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // サーバーから現在日時を取得
  const fetchCurrentDateTime = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/counselor/current-time');
      if (response.ok) {
        const data = await response.json();
        // 日本語の曜日に変換
        const dateStr = data.formatted_date
          .replace('Sun', '日')
          .replace('Mon', '月') 
          .replace('Tue', '火')
          .replace('Wed', '水')
          .replace('Thu', '木')
          .replace('Fri', '金')
          .replace('Sat', '土');
        setCurrentDateTime(`${dateStr} ${data.formatted_time}`);
      }
    } catch (error) {
      console.error('Failed to fetch current time:', error);
    }
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const headers = {};
      
      // 開発環境以外では認証が必要
      if (process.env.NODE_ENV !== 'development') {
        const token = localStorage.getItem('token');
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // キャッシュを無効化して最新データを取得
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/counselor/history?_t=${Date.now()}`, {
        headers,
        cache: 'no-cache'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched history data:', data);
        const processedData = data.map(session => ({
          id: session.id,
          conversation_id: session.conversation_id,
          date: session.created_at,
          type: 'chat',
          title: session.title || '無題の相談',
          summary: session.summary || 'AIカウンセラーとの相談セッション',
          exchange_count: session.exchange_count || 1,
          last_updated: session.last_updated || session.created_at,
          tags: [`${session.exchange_count || 1}往復の相談`, 'チャット相談']
        }));
        setHistoryData(processedData);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
      // フォールバック: サンプルデータを使用
      setHistoryData([
        {
          id: 1,
          conversation_id: 'conv_sample_1',
          date: '2024-01-15',
          type: 'chat',
          title: 'プロフィール写真について相談',
          summary: 'どのような写真を使うべきか、第一印象を良くする方法について話し合いました。',
          exchange_count: 5,
          last_updated: '2024-01-15',
          tags: ['5往復の相談', 'チャット相談']
        },
        {
          id: 2,
          conversation_id: 'conv_sample_2',
          date: '2024-01-12',
          type: 'chat',
          title: '自己紹介文の作成',
          summary: '趣味や性格を活かした自己紹介文を3パターン作成しました。',
          exchange_count: 3,
          last_updated: '2024-01-12',
          tags: ['3往復の相談', 'チャット相談']
        },
        {
          id: 3,
          conversation_id: 'conv_sample_3',
          date: '2024-01-10',
          type: 'chat',
          title: 'デートでの会話について',
          summary: '初回デートで話すべき話題や避けるべき話題について相談しました。',
          exchange_count: 7,
          last_updated: '2024-01-10',
          tags: ['7往復の相談', 'チャット相談']
        },
        {
          id: 4,
          conversation_id: 'conv_sample_4',
          date: '2024-01-08',
          type: 'chat',
          title: 'マッチングアプリでの不安',
          summary: 'マッチングしても会話が続かない不安について話し合いました。',
          exchange_count: 4,
          last_updated: '2024-01-08',
          tags: ['4往復の相談', 'チャット相談']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const continueConversation = (conversationId) => {
    if (conversationId) {
      router.push(`/counselor/chat?conversationId=${conversationId}`);
    } else {
      router.push('/counselor/chat');
    }
  };

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
    return currentDateTime || 'loading...';
  };

  return (
    <Layout title="相談履歴">
      <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/counselor">
              <button className="text-gray-500 hover:text-gray-700">
                ←
              </button>
            </Link>
            <h1 className="text-xl font-bold text-[#FF8551]">相談履歴</h1>
          </div>
          <button
            onClick={() => fetchHistory()}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="履歴を更新"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
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
                    <div className="mb-2">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500">{isMounted ? formatDate(item.date) : ''}</p>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">{item.summary}</p>
                    <div className="flex items-center justify-between">
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
                      {item.type === 'chat' && (
                        <button
                          onClick={() => continueConversation(item.conversation_id)}
                          className="flex items-center gap-1 px-3 py-1 bg-[#FF8551] text-white text-xs rounded-full hover:bg-[#FF7043] transition-colors"
                        >
                          続ける
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
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