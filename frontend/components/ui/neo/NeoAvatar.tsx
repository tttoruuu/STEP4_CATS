import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const neoAvatarVariants = cva(
  'flex items-center justify-center bg-[var(--bg-color)] shadow-[var(--shadow-light),var(--shadow-dark)]',
  {
    variants: {
      size: {
        default: 'w-12 h-12 text-xl',
        sm: 'w-8 h-8 text-base',
        lg: 'w-16 h-16 text-2xl',
        xl: 'w-20 h-20 text-3xl',
      },
      shape: {
        square: 'rounded-2xl',
        circle: 'rounded-full',
      },
    },
    defaultVariants: {
      size: 'default',
      shape: 'square',
    },
  }
);

export interface NeoAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof neoAvatarVariants> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

const NeoAvatar = React.forwardRef<HTMLDivElement, NeoAvatarProps>(
  ({ className, size, shape, src, alt, fallback, children, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(neoAvatarVariants({ size, shape, className }))}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-inherit"
            onError={() => setImageError(true)}
          />
        ) : (
          fallback || children || '👤'
        )}
      </div>
    );
  }
);

NeoAvatar.displayName = 'NeoAvatar';

// 猫マスコット専用コンポーネント
export interface CatMascotProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
}

const CatMascot = React.forwardRef<HTMLDivElement, CatMascotProps>(
  ({ className, animated = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'cat-container',
          animated && 'hover:scale-110 hover:rotate-[5deg]',
          className
        )}
        {...props}
      >
        🐱
      </div>
    );
  }
);

CatMascot.displayName = 'CatMascot';

export { NeoAvatar, CatMascot, neoAvatarVariants };