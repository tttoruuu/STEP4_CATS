import { Info, Volume2, Mic, CheckCircle } from 'lucide-react';

const PracticeGuide = () => {
  const steps = [
    {
      number: 1,
      icon: <Volume2 size={20} />,
      title: '再生ボタンを押す',
      description: '女性の音声を聞いてください'
    },
    {
      number: 2,
      icon: <Mic size={20} />,
      title: '声を出して返答してみる',
      description: '実際に声に出して練習しましょう'
    },
    {
      number: 3,
      icon: <CheckCircle size={20} />,
      title: '正解を聞くボタンを押して正解を聞く',
      description: '模範解答を確認します'
    }
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFF9F5, #FFEFE5)',
      borderRadius: '20px',
      padding: '25px',
      marginBottom: '30px',
      border: '1px solid rgba(255, 107, 53, 0.15)',
      boxShadow: '0 4px 12px rgba(255, 107, 53, 0.08)'
    }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(145deg, #FF6B35, #FFB08A)',
          borderRadius: '12px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Info size={24} color="white" />
        </div>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--text-dark)',
          margin: 0
        }}>
          練習方法
        </h3>
      </div>

      {/* ステップリスト */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {steps.map((step, index) => (
          <div
            key={step.number}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              padding: '12px',
              background: 'white',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(5px)';
              e.currentTarget.style.boxShadow = '4px 4px 12px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* ステップ番号 */}
            <div style={{
              minWidth: '32px',
              height: '32px',
              background: 'linear-gradient(145deg, #FF6B35, #FFB08A)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '2px 2px 6px rgba(0,0,0,0.1)'
            }}>
              {step.number}
            </div>

            {/* アイコンとテキスト */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <span style={{ color: 'var(--primary-orange)' }}>
                  {step.icon}
                </span>
                <h4 style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'var(--text-dark)',
                  margin: 0
                }}>
                  {step.title}
                </h4>
              </div>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-medium)',
                margin: 0,
                paddingLeft: '28px'
              }}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 注意事項 */}
      <div style={{
        marginTop: '20px',
        padding: '12px 16px',
        background: 'rgba(255, 107, 53, 0.08)',
        borderRadius: '10px',
        borderLeft: '3px solid var(--primary-orange)'
      }}>
        <p style={{
          fontSize: '13px',
          color: 'var(--primary-orange)',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '16px' }}>💡</span>
          <strong>ポイント：</strong>正解はあくまで一例です。自分なりの表現で練習してみましょう！
        </p>
      </div>
    </div>
  );
};

export default PracticeGuide;