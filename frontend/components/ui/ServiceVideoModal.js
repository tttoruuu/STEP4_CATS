import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './ServiceVideoModal.module.css';

const ServiceVideoModal = ({ isOpen, onClose, onDontShowAgain }) => {
  const router = useRouter();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (dontShowAgain) {
      onDontShowAgain();
    }
    onClose();
  };

  const handleGoToHome = () => {
    handleClose();
    router.push('/');
  };

  const handleHowToUse = () => {
    handleClose();
    router.push('/features');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        <h2 className={styles.modalTitle}>MIRAIMへようこそ！</h2>
        
        <div className={styles.videoContainer}>
          <video 
            controls 
            autoPlay 
            className={styles.video}
            poster="/video-poster.jpg"
          >
            <source 
              src="https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/one-sided%20talk%20man005.mp4" 
              type="video/mp4" 
            />
            お使いのブラウザは動画をサポートしていません。
          </video>
        </div>

        <div className={styles.buttonGroup}>
          <button 
            className={`${styles.actionButton} ${styles.primaryButton}`}
            onClick={handleGoToHome}
          >
            ホーム画面にいく
          </button>
          <button 
            className={`${styles.actionButton} ${styles.secondaryButton}`}
            onClick={handleHowToUse}
          >
            使い方を見る
          </button>
        </div>

        <div className={styles.checkboxContainer}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>次回、このページを表示しない</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ServiceVideoModal;