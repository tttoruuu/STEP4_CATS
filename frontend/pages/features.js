import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Brain, Sparkles, Ear, Users, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { apiClient } from '../lib/api';

const FeaturesPage = () => {
  const [featuresData, setFeaturesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const iconMap = {
    heart: Heart,
    'message-circle': MessageCircle,
    brain: Brain,
    sparkles: Sparkles,
    ear: Ear,
    users: Users,
    target: Target
  };

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getFeatures();
        setFeaturesData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  const nextSlide = () => {
    if (featuresData?.key_points) {
      setCurrentSlide((prev) => (prev + 1) % featuresData.key_points.length);
    }
  };

  const prevSlide = () => {
    if (featuresData?.key_points) {
      setCurrentSlide((prev) => (prev - 1 + featuresData.key_points.length) % featuresData.key_points.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">機能情報を読み込んでいます...</p>
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

  const { features = [], key_points = [] } = featuresData || {};

  return (
    <Layout title="アプリの特徴">
      <div className="bg-gray-50">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              なぜ聞く力が重要なのか
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              結婚相談所に通うあなたのための、また会いたい人になるアプリ
            </p>
          </div>

          {/* Key Points Slider */}
          {key_points.length > 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 mb-16">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">なぜ聞く力が重要なのか</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={prevSlide}
                    className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {React.createElement(iconMap[key_points[currentSlide]?.icon] || Target, {
                      className: "w-12 h-12 text-orange-600"
                    })}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {key_points[currentSlide]?.title}
                    </h4>
                    <p className="text-orange-600 font-medium mb-3">
                      {key_points[currentSlide]?.subtitle}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {key_points[currentSlide]?.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4 space-x-2">
                {key_points.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-orange-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              4つの主要機能
            </h2>
            <div className="grid gap-8">
              {features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || Heart;
                return (
                  <div key={index} className={`${feature.color} rounded-2xl p-8 border-2`}>
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-8 h-8 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 mb-6 text-lg">
                          {feature.description}
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          {feature.details?.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0" />
                              <span className="text-gray-700">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              今すぐ始めて、理想のパートナーとの出会いを実現しましょう
            </h2>
            <p className="text-xl mb-8 text-orange-100">
              聞く力を中心とした総合的なコミュニケーション向上で、婚活を成功に導きます
            </p>
            <Link 
              href="/" 
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              aria-label="ホームに戻る"
            >
              ホーム画面に戻る
            </Link>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default FeaturesPage;