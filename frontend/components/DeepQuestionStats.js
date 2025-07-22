import { useState, useEffect } from 'react';
import { Trophy, Target, Clock, TrendingUp, Award } from 'lucide-react';
import deepQuestionsService from '../services/deepQuestions';

export default function DeepQuestionStats({ onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await deepQuestionsService.getUserStats();
      setStats(data);
    } catch (err) {
      console.error('統計データの取得に失敗:', err);
      setError('統計データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 text-center max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>統計データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 text-center max-w-md w-full mx-4">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl"
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const progressPercentage = stats.total_questions > 0 
    ? Math.round((stats.attempted_questions / stats.total_questions) * 100)
    : 0;

  const getBadges = () => {
    const badges = [];
    
    if (stats.accuracy_rate >= 90) {
      badges.push({ name: '完璧主義者', icon: '💎', description: '正答率90%以上' });
    } else if (stats.accuracy_rate >= 80) {
      badges.push({ name: '深堀りマスター', icon: '🏆', description: '正答率80%以上' });
    } else if (stats.accuracy_rate >= 70) {
      badges.push({ name: '質問上手', icon: '⭐', description: '正答率70%以上' });
    }
    
    if (stats.attempted_questions >= 50) {
      badges.push({ name: '練習の鬼', icon: '🔥', description: '50問以上に挑戦' });
    } else if (stats.attempted_questions >= 20) {
      badges.push({ name: '継続は力なり', icon: '💪', description: '20問以上に挑戦' });
    } else if (stats.attempted_questions >= 10) {
      badges.push({ name: 'スタートダッシュ', icon: '🚀', description: '10問以上に挑戦' });
    }
    
    if (stats.shadowing_stats.total_sessions >= 10) {
      badges.push({ name: 'シャドウィングマスター', icon: '🎤', description: '10回以上の音声練習' });
    }
    
    return badges;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-3xl text-white text-center">
          <h2 className="text-2xl font-bold mb-2">📊 学習統計</h2>
          <p className="opacity-90">あなたの深堀り質問スキルの成長記録</p>
        </div>

        <div className="p-6 space-y-6">
          {/* 全体の進捗 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Target size={20} />
                全体の進捗
              </h3>
              <span className="text-2xl font-bold text-purple-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {stats.attempted_questions}/{stats.total_questions}問に挑戦済み
            </p>
          </div>

          {/* 正答率 */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp size={20} />
                正答率
              </h3>
              <span className="text-2xl font-bold text-green-600">{stats.accuracy_rate}%</span>
            </div>
            <p className="text-sm text-gray-600">
              {stats.correct_answers}/{stats.attempted_questions}問正解
            </p>
          </div>

          {/* カテゴリー別成績 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Award size={20} />
              カテゴリー別成績
            </h3>
            <div className="space-y-2">
              {Object.entries(stats.category_progress).map(([category, progress]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{progress.attempted}問</span>
                    <span className={`text-sm font-medium ${
                      progress.accuracy >= 80 ? 'text-green-600' :
                      progress.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {progress.accuracy.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* シャドウィング統計 */}
          {stats.shadowing_stats.total_sessions > 0 && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock size={20} />
                シャドウィング練習
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{stats.shadowing_stats.total_sessions}</p>
                  <p className="text-sm text-gray-600">練習回数</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-pink-600">{stats.shadowing_stats.avg_duration}秒</p>
                  <p className="text-sm text-gray-600">平均練習時間</p>
                </div>
              </div>
            </div>
          )}

          {/* 獲得バッジ */}
          <div className="bg-gradient-to-r from-gold-50 to-yellow-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Trophy size={20} />
              獲得バッジ
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {getBadges().map((badge, index) => (
                <div key={index} className="flex items-center gap-3 bg-white rounded-xl p-3">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="font-medium text-gray-800">{badge.name}</p>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                </div>
              ))}
              {getBadges().length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  まだバッジがありません。<br />
                  練習を続けてバッジを獲得しましょう！
                </p>
              )}
            </div>
          </div>

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}