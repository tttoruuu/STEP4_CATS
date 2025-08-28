import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import IntegratedPracticeGuide from '../../components/conversation/IntegratedPracticeGuide';

export default function IntegratedPracticeGuidePage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const handleStart = () => {
    // 音声再生ページに遷移
    router.push('/conversation/deepen');
  };

  return (
    <Layout title="総合練習 - 練習方法">
      <IntegratedPracticeGuide 
        onStart={handleStart}
        isReady={isReady}
        setIsReady={setIsReady}
      />
    </Layout>
  );
}