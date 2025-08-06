import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const neoButtonVariants = cva(
  'neo-btn', // globals.cssのベースクラスを使用
  {
    variants: {
      variant: {
        primary: 'neo-btn-primary',
        secondary: 'neo-btn-secondary',
        ghost: 'neo-btn-ghost',
      },
      size: {
        default: '',
        sm: 'text-sm px-6 py-3',
        lg: 'text-lg px-14 py-5',
        icon: 'p-3 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface NeoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neoButtonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
}

const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant, size, loading, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(neoButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="loading-spinner" style={{ width: '20px', height: '20px' }} />
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

NeoButton.displayName = 'NeoButton';

export { NeoButton, neoButtonVariants };