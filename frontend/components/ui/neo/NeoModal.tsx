import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NeoModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
}

const NeoModal = React.forwardRef<HTMLDivElement, NeoModalProps>(
  ({ 
    className, 
    isOpen = false, 
    onClose,
    title,
    description,
    showCloseButton = true,
    children,
    ...props 
  }, ref) => {
    React.useEffect(() => {
      // SSR対応
      if (typeof document === 'undefined') return;
      
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    // コンポーネントアンマウント時の強制クリーンアップ
    React.useEffect(() => {
      return () => {
        if (typeof document !== 'undefined') {
          document.body.style.overflow = 'unset';
        }
      };
    }, []);

    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div 
          ref={ref}
          className={cn('modal-content', className)}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {showCloseButton && (
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          )}
          
          {title && (
            <div className="modal-header">
              <h2 className="modal-title">{title}</h2>
              {description && (
                <p className="modal-description">{description}</p>
              )}
            </div>
          )}
          
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

NeoModal.displayName = 'NeoModal';

// モーダルフッター
export interface NeoModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const NeoModalFooter = React.forwardRef<HTMLDivElement, NeoModalFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('modal-footer', className)}
        {...props}
      />
    );
  }
);

NeoModalFooter.displayName = 'NeoModalFooter';

export { NeoModal, NeoModalFooter };