import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export interface NeoCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface NeoCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface NeoCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const NeoCard = React.forwardRef<HTMLDivElement, NeoCardProps>(
  ({ className, hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'neo-card',
          hover && 'hover:transform hover:translateY(-5px)',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeoCard.displayName = 'NeoCard';

const NeoCardHeader = React.forwardRef<HTMLDivElement, NeoCardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('pb-6 border-b border-black/5 mb-6', className)}
      {...props}
    />
  )
);

NeoCardHeader.displayName = 'NeoCardHeader';

const NeoCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('service-title', className)}
    {...props}
  />
));

NeoCardTitle.displayName = 'NeoCardTitle';

const NeoCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('service-desc', className)}
    {...props}
  />
));

NeoCardDescription.displayName = 'NeoCardDescription';

const NeoCardContent = React.forwardRef<HTMLDivElement, NeoCardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('py-4', className)} {...props} />
  )
);

NeoCardContent.displayName = 'NeoCardContent';

const NeoCardFooter = React.forwardRef<HTMLDivElement, NeoCardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('pt-6 border-t border-black/5 mt-6', className)}
      {...props}
    />
  )
);

NeoCardFooter.displayName = 'NeoCardFooter';

export {
  NeoCard,
  NeoCardHeader,
  NeoCardFooter,
  NeoCardTitle,
  NeoCardDescription,
  NeoCardContent,
};