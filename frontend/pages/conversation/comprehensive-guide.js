import React from 'react';
import { useRouter } from 'next/router';
import IntegratedPracticeGuide from '../../components/conversation/IntegratedPracticeGuide';

export default function ComprehensiveGuidePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/conversation/comprehensive');
  };

  return (
    <IntegratedPracticeGuide onStart={handleStart} />
  );
}