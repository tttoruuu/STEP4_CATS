import * as React from 'react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
}

export interface NeoChatWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  messages?: Message[];
  avatar?: React.ReactNode;
  name?: string;
  status?: string;
  onSendMessage?: (message: string) => void;
  placeholder?: string;
}

const NeoChatWindow = React.forwardRef<HTMLDivElement, NeoChatWindowProps>(
  ({ 
    className, 
    messages = [], 
    avatar = '🐱', 
    name = 'AIアシスタント',
    status = '● オンライン',
    onSendMessage,
    placeholder = 'メッセージを入力...',
    ...props 
  }, ref) => {
    const [inputValue, setInputValue] = React.useState('');
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const handleSend = () => {
      if (inputValue.trim() && onSendMessage) {
        onSendMessage(inputValue.trim());
        setInputValue('');
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    return (
      <div ref={ref} className={cn('chat-window', className)} {...props}>
        <div className="chat-header">
          <div className="chat-avatar">{avatar}</div>
          <div className="chat-info">
            <div className="chat-name">{name}</div>
            <div className="chat-status">{status}</div>
          </div>
        </div>
        
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={cn('message', message.sender === 'user' && 'user')}>
              <div className="message-bubble">{message.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="chat-send" onClick={handleSend}>
            →
          </button>
        </div>
      </div>
    );
  }
);

NeoChatWindow.displayName = 'NeoChatWindow';

// 個別のメッセージコンポーネント
export interface NeoChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
}

const NeoChatMessage = React.forwardRef<HTMLDivElement, NeoChatMessageProps>(
  ({ className, content, sender, timestamp, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn('message', sender === 'user' && 'user', className)} 
        {...props}
      >
        <div className="message-bubble">
          {content}
          {timestamp && (
            <div className="text-xs opacity-70 mt-1">
              {timestamp.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    );
  }
);

NeoChatMessage.displayName = 'NeoChatMessage';

export { NeoChatWindow, NeoChatMessage };