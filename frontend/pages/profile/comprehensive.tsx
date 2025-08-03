import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Edit3, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Users, 
  Coffee, 
  Brain,
  User,
  HomeIcon
} from 'lucide-react';

const ComprehensiveProfilePage: React.FC = () => {
  const router = useRouter();

  const handleEdit = () => {
    router.push('/profile/edit');
  };

  const handleMBTITest = () => {
    router.push('/marriage-mbti-test');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-orange-500 to-orange-300 pt-8 pb-8 px-4 rounded-b-3xl">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">お名前</h1>
          <p className="text-white/90 text-lg mb-4">--歳</p>
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/30 hover:bg-white/30 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            編集
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
        
        {/* Basic Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">基本情報</h2>
          
          <div className="flex items-start gap-3 mb-4">
            <Calendar className="w-5 h-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">生年月日</p>
              <p className="text-gray-400">未設定</p>
            </div>
          </div>

          <div className="flex items-start gap-3 mb-4">
            <Users className="w-5 h-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">婚活の経験</p>
              <span className="px-3 py-1 rounded-full text-sm font-semibold text-white bg-gray-400">
                未設定
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">職業</p>
              <p className="text-gray-400">未設定</p>
            </div>
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">居住地情報</h2>
          
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">出身地</p>
              <p className="text-gray-400">未設定</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">現在の居住地</p>
              <p className="text-gray-400">未設定</p>
            </div>
          </div>
        </div>

        {/* Hobbies Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">趣味・興味</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-2 bg-gray-100 text-gray-400 rounded-full text-sm font-medium border border-gray-200">
              未設定
            </span>
          </div>
        </div>

        {/* Weekend Activities Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Coffee className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-800">休日の過ごし方</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">未設定</p>
        </div>

        {/* MBTI Card - 未診断状態 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="text-center">
            <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Marriage MBTI+を受けてみませんか？</h3>
            <p className="text-gray-600 mb-4">
              あなたの性格タイプを知ることで、より自分を客観的に見られるようになります。
            </p>
            <button
              onClick={handleMBTITest}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Marriage MBTI+を受ける
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-100/70 py-4 shadow-sm">
        <div className="max-w-md mx-auto px-6">
          <div className="flex justify-around">
            <Link href="/" className="flex flex-col items-center">
              <HomeIcon className="w-6 h-6 text-gray-400" />
              <span className="text-xs mt-1 text-gray-400">ホーム</span>
            </Link>
            
            <Link href="/profile" className="flex flex-col items-center">
              <User className="w-6 h-6 text-orange-500" />
              <span className="text-xs mt-1 text-orange-500">プロフィール</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ComprehensiveProfilePage;