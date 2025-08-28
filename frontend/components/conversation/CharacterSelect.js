import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Users, Info } from 'lucide-react';
import CharacterCard from './CharacterCard';

const CharacterSelect = () => {
  const router = useRouter();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [lastCharacterId, setLastCharacterId] = useState(null);

  const characters = [
    {
      id: 'misaki',
      name: '佐藤美咲',
      age: 28,
      job: '看護師',
      personality: '優しい・聞き上手',
      difficulty: '初級',
      description: '穏やかで話しやすい雰囲気。初めての練習に最適です。',
      tags: ['共感的', '聞き上手', 'ゆっくり'],
      conversationStyle: {
        responseSpeed: 'ゆっくり',
        topicDepth: '浅め',
        emotionExpression: '豊か'
      }
    },
    {
      id: 'ai',
      name: '鈴木愛',
      age: 26,
      job: 'イベントプランナー',
      personality: '明るい・話好き',
      difficulty: '中級',
      description: 'テンポが速く、話題が豊富。会話のリズムを掴む練習に。',
      tags: ['活発', 'テンポ速い', '話題豊富'],
      conversationStyle: {
        responseSpeed: '速い',
        topicDepth: '普通',
        emotionExpression: 'とても豊か'
      }
    },
    {
      id: 'kaori',
      name: '田中香織',
      age: 32,
      job: '外資系コンサルタント',
      personality: '知的・理論的',
      difficulty: '中級',
      description: '論理的な会話を好む。深い話題での練習に適しています。',
      tags: ['論理的', '深い話', 'ビジネス'],
      conversationStyle: {
        responseSpeed: '普通',
        topicDepth: '深い',
        emotionExpression: '控えめ'
      }
    },
    {
      id: 'shizuka',
      name: '山田静香',
      age: 30,
      job: '図書館司書',
      personality: '控えめ・慎重',
      difficulty: '上級',
      description: '最初は心を開きにくいタイプ。聞く力が試されます。',
      tags: ['控えめ', '文化的', '徐々に開く'],
      conversationStyle: {
        responseSpeed: 'ゆっくり',
        topicDepth: '徐々に深く',
        emotionExpression: '最初は少なめ'
      }
    }
  ];

  useEffect(() => {
    // ローカルストレージから前回のキャラクターIDを取得
    const lastId = localStorage.getItem('lastCharacterId');
    if (lastId) {
      setLastCharacterId(lastId);
    }
  }, []);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    // 選択したキャラクターIDを保存
    localStorage.setItem('lastCharacterId', character.id);
    
    // 会話画面へ遷移
    router.push({
      pathname: '/conversation/practice-new',
      query: {
        characterId: character.id,
        characterName: character.name
      }
    });
  };

  const getRecommendedCharacter = () => {
    if (!lastCharacterId) return 'misaki'; // 初回は初級を推奨
    
    // 前回と違うキャラクターを推奨
    const otherCharacters = characters.filter(c => c.id !== lastCharacterId);
    return otherCharacters[0].id;
  };

  const recommendedId = getRecommendedCharacter();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg-gradient-main)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* ヘッダー */}
        <div style={{ 
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <button
            onClick={() => router.push('/conversation/modes')}
            style={{
              background: 'var(--bg-color)',
              border: 'none',
              borderRadius: '15px',
              padding: '12px',
              boxShadow: 'var(--shadow-light), var(--shadow-dark)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <ArrowLeft size={24} color="var(--text-dark)" />
          </button>
          
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: 'var(--text-dark)'
          }}>
            会話相手を選ぶ
          </h1>
        </div>

        {/* 説明カード */}
        <div style={{
          background: 'var(--bg-color)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: 'var(--shadow-light), var(--shadow-dark)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #FF6B35, #FFB08A)',
            borderRadius: '12px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Info size={24} color="white" />
          </div>
          <div>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-medium)',
              margin: 0
            }}>
              10分間の聴く練習を行います。様々なタイプの女性と会話することで、実践的な「聞く力」を身につけましょう。
            </p>
          </div>
        </div>

        {/* キャラクターリスト */}
        <div>
          {characters.map(character => (
            <CharacterCard
              key={character.id}
              character={character}
              onSelect={handleCharacterSelect}
              isRecommended={character.id === recommendedId}
            />
          ))}
        </div>

        {/* ヒント */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255, 107, 53, 0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 107, 53, 0.2)'
        }}>
          <p style={{
            fontSize: '14px',
            color: 'var(--primary-orange)',
            margin: 0,
            textAlign: 'center'
          }}>
            💡 ヒント：初めての方は「初級」から始めることをおすすめします
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelect;