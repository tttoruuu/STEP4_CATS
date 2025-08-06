import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const neoBadgeVariants = cva(
  'inline-block px-4 py-1 rounded-full text-sm font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-[var(--primary-orange)] to-[var(--light-orange)] text-white',
        success: 'bg-gradient-to-r from-[#00B894] to-[#00A784] text-white',
        warning: 'bg-gradient-to-r from-[#FDCB6E] to-[#FDB85E] text-white',
        error: 'bg-gradient-to-r from-[#D63031] to-[#C62021] text-white',
        outline: 'bg-[var(--bg-color)] text-[var(--primary-orange)] border-2 border-[var(--primary-orange)]',
      },
      size: {
        default: 'px-4 py-1 text-sm',
        sm: 'px-3 py-0.5 text-xs',
        lg: 'px-5 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface NeoBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof neoBadgeVariants> {}

const NeoBadge = React.forwardRef<HTMLSpanElement, NeoBadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(neoBadgeVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

NeoBadge.displayName = 'NeoBadge';

export { NeoBadge, neoBadgeVariants };