'use client';

import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Message } from '../types/auth';

interface ChatMessageProps {
  message: Message;
  onButtonClick?: (value: string) => void;
}

interface ChatButton {
  label: string;
  value: string;
  emoji?: string;
}

export default function ChatMessage({ message, onButtonClick }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.type === 'bot') {
      setIsTyping(true);
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= message.content.length) {
          setDisplayedContent(message.content.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, message.type]);

  // ボタンを表示するかどうかを判定
  const shouldShowButtons = (content: string): boolean => {
    return content.includes('婚活の経験を教えてください') || 
           content.includes('以下から選んでください') ||
           content.includes('数字でも、ボタンでも');
  };

  // ボタンの設定を取得
  const getButtons = (): ChatButton[] => {
    return [
      { label: '初心者', value: '1', emoji: '🔰' },
      { label: '経験あり', value: '2', emoji: '💪' },
      { label: '再チャレンジ', value: '3', emoji: '🔄' }
    ];
  };

  if (message.type === 'system') {
    return (
      <div className="flex justify-center">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  const isBot = message.type === 'bot';
  const showButtons = isBot && shouldShowButtons(displayedContent);
  const buttons = showButtons ? getButtons() : [];

  return (
    <div className={`flex items-start space-x-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">M</span>
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md ${isBot ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isBot
              ? 'bg-white rounded-tl-md text-gray-800'
              : 'bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-tr-md'
          }`}
        >
          <p className="whitespace-pre-wrap leading-relaxed">
            {displayedContent}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
        </div>
        
        {/* ボタンUI */}
        {showButtons && !isTyping && (
          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap gap-2">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={() => onButtonClick?.(button.value)}
                  className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-gray-700 rounded-lg border border-orange-200 transition-all duration-200 hover:shadow-md hover:scale-105"
                >
                  <span className="text-sm">{button.emoji}</span>
                  <span className="text-sm font-medium">{button.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              数字入力でも、ボタンでも、お好きな方法でどうぞ！
            </p>
          </div>
        )}
        
        <div className={`mt-1 text-xs text-gray-500 ${isBot ? 'text-left' : 'text-right'}`}>
          {message.timestamp.toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
}