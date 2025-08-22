import React, { useState, useEffect } from 'react';
import { X, HelpCircle, BookOpen, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { apiClient } from '../lib/api';

const HelpPage = () => {
  const [helpData, setHelpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('faqs');
  const [selectedCategory, setSelectedCategory] = useState('全て');

  useEffect(() => {
    const loadHelp = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getHelpFaqs();
        setHelpData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHelp();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ヘルプ情報を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">データの読み込みに失敗しました</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  const { faqs = [], guide_steps = [], tips = [] } = helpData || {};

  // カテゴリ一覧を取得
  const categories = ['全て', ...new Set(faqs.map(faq => faq.category))];

  // 選択されたカテゴリでFAQをフィルタリング
  const filteredFaqs = selectedCategory === '全て' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <Layout title="ヘルプ">
      <div className="bg-gray-50">
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">ヘルプ</h1>
            <p className="text-gray-600">
              アプリの使い方やよくある質問にお答えします
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('faqs')}
              className={`flex-1 py-3 px-6 text-center font-medium transition-colors ${
                activeTab === 'faqs'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <HelpCircle className="w-5 h-5 inline mr-2" />
              よくある質問
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-3 px-6 text-center font-medium transition-colors ${
                activeTab === 'guide'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              使い方ガイド
            </button>
          </div>

          {/* FAQ Section */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start space-x-3 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        faq.priority === 'high' ? 'bg-red-100 text-red-700' :
                        faq.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Q. {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      A. {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guide Section */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">アプリの使い方</h3>
              <div className="space-y-6">
                {guide_steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    <div className="text-3xl">{step.image}</div>
                  </div>
                ))}
              </div>
              
              {/* Tips */}
              {tips.map((tip, index) => (
                <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">{tip.title}</h4>
                  <p className="text-orange-700 text-sm">
                    {tip.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                解決しない場合は
              </h3>
              <p className="text-gray-600 mb-4">
                ここに載っていない質問やお困りのことがあれば、お気軽にお問い合わせください。
              </p>
              <Link 
                href="/" 
                className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                aria-label="ホームに戻る"
              >
                ホーム画面に戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default HelpPage;