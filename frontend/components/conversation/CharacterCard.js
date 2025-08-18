import { Heart, Briefcase, Star } from 'lucide-react';

const CharacterCard = ({ character, onSelect, isRecommended }) => {
  const getDifficultyColor = (level) => {
    switch(level) {
      case '初級': return '#4CAF50';
      case '中級': return '#FF9800';
      case '上級': return '#F44336';
      default: return '#999';
    }
  };

  const getAvatar = (character) => {
    // キャラクターのアバター設定
    const avatars = {
      misaki: { initial: 'M', bg: '#FFE0EC', color: '#E91E63' },
      ai: { initial: 'A', bg: '#FFF3E0', color: '#FF9800' },
      kaori: { initial: 'K', bg: '#E8EAF6', color: '#3F51B5' },
      shizuka: { initial: 'S', bg: '#F3E5F5', color: '#9C27B0' }
    };
    return avatars[character.id] || { initial: '?', bg: '#F5F5F5', color: '#999' };
  };

  return (
    <div 
      className="character-card"
      onClick={() => onSelect(character)}
      style={{
        background: 'var(--bg-color)',
        borderRadius: '25px',
        padding: '30px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: 'var(--shadow-light), var(--shadow-dark)',
        position: 'relative',
        marginBottom: '20px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '12px 12px 24px rgba(209, 186, 172, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.9)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-light), var(--shadow-dark)';
      }}
    >
      {isRecommended && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '20px',
          background: 'linear-gradient(145deg, #FF6B35, #FFB08A)',
          color: 'white',
          padding: '5px 15px',
          borderRadius: '15px',
          fontSize: '12px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <Star size={14} />
          おすすめ
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: getAvatar(character).bg,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: '4px 4px 8px rgba(0,0,0,0.1)'
        }}>
          <span style={{
            fontSize: '32px',
            fontWeight: '600',
            color: getAvatar(character).color,
            fontFamily: 'sans-serif'
          }}>
            {getAvatar(character).initial}
          </span>
          <div style={{
            position: 'absolute',
            bottom: '5px',
            right: '5px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            color: getAvatar(character).color,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {character.age}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '600',
              color: 'var(--text-dark)'
            }}>
              {character.name}
            </h3>
            <span style={{
              background: getDifficultyColor(character.difficulty),
              color: 'white',
              padding: '3px 10px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {character.difficulty}
            </span>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '15px',
            marginBottom: '10px',
            fontSize: '14px',
            color: 'var(--text-medium)'
          }}>
            <span>{character.age}歳</span>
            <span>{character.job}</span>
          </div>

          <p style={{
            fontSize: '14px',
            color: 'var(--text-medium)',
            marginBottom: '12px'
          }}>
            {character.description}
          </p>

          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {character.tags && character.tags.map((tag, index) => (
              <span key={index} style={{
                background: 'var(--pale-orange)',
                color: 'var(--primary-orange)',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;