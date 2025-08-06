import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const neoToastVariants = cva(
  'neo-card rounded-lg p-4 flex items-center gap-3 min-w-[300px] max-w-[500px] animate-slideIn',
  {
    variants: {
      variant: {
        default: '',
        success: 'border-l-4 border-[#00B894]',
        warning: 'border-l-4 border-[#FDCB6E]',
        error: 'border-l-4 border-[#D63031]',
        info: 'border-l-4 border-[var(--primary-orange)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface NeoToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof neoToastVariants> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  duration?: number;
  onClose?: () => void;
}

const NeoToast = React.forwardRef<HTMLDivElement, NeoToastProps>(
  ({ 
    className, 
    variant,
    title,
    description,
    icon,
    action,
    duration = 5000,
    onClose,
    ...props 
  }, ref) => {
    React.useEffect(() => {
      if (duration && onClose) {
        const timer = setTimeout(() => {
          onClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    const getDefaultIcon = () => {
      switch (variant) {
        case 'success':
          return '✓';
        case 'warning':
          return '⚠';
        case 'error':
          return '✕';
        case 'info':
          return 'ℹ';
        default:
          return '💬';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(neoToastVariants({ variant, className }))}
        {...props}
      >
        {(icon || variant) && (
          <div className="text-2xl">
            {icon || getDefaultIcon()}
          </div>
        )}
        
        <div className="flex-1">
          {title && (
            <div className="font-semibold text-[var(--text-primary)]">
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm text-[var(--text-secondary)] mt-1">
              {description}
            </div>
          )}
        </div>

        {action}

        {onClose && (
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ×
          </button>
        )}
      </div>
    );
  }
);

NeoToast.displayName = 'NeoToast';

// Toast Container for managing multiple toasts
export interface NeoToastContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

const NeoToastContainer = React.forwardRef<HTMLDivElement, NeoToastContainerProps>(
  ({ className, position = 'top-right', children, ...props }, ref) => {
    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col gap-2',
          positionClasses[position],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeoToastContainer.displayName = 'NeoToastContainer';

export { NeoToast, NeoToastContainer, neoToastVariants };