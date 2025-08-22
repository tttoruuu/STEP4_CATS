import { Info, CheckSquare, Volume2, Mic } from 'lucide-react';

const DeepDivePracticeGuide = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFF9F5, #FFEFE5)',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '20px',
      border: '1px solid rgba(255, 107, 53, 0.12)',
      boxShadow: '0 2px 8px rgba(255, 107, 53, 0.06)'
    }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px'
      }}>
        <div style={{
          background: 'linear-gradient(145deg, #FF6B35, #FFB08A)',
          borderRadius: '8px',
          padding: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Info size={18} color="white" />
        </div>
        <h3 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: 'var(--text-dark)',
          margin: 0
        }}>
          練習方法
        </h3>
      </div>

      {/* ステップを横並びで表示 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: 'var(--text-dark)',
        lineHeight: '1.4'
      }}>
        <span style={{ 
          fontWeight: '600',
          color: 'var(--primary-orange)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <CheckSquare size={16} />
          1. 四択問題を選ぶ
        </span>
        <span style={{ color: 'var(--text-medium)' }}>→</span>
        <span style={{ 
          fontWeight: '600',
          color: 'var(--primary-orange)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Volume2 size={16} />
          2. 音声で練習する
        </span>
        <span style={{ color: 'var(--text-medium)' }}>→</span>
        <span style={{ 
          fontWeight: '600',
          color: 'var(--primary-orange)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Mic size={16} />
          3. シャドーイング
        </span>
      </div>

    </div>
  );
};

export default DeepDivePracticeGuide;