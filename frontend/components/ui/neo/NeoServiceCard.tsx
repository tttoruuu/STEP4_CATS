import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NeoServiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

const NeoServiceCard = React.forwardRef<HTMLDivElement, NeoServiceCardProps>(
  ({ className, icon, title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('service-card', className)}
        {...props}
      >
        {icon && (
          <div className="service-icon-box">
            {icon}
          </div>
        )}
        {title && (
          <h3 className="service-title">{title}</h3>
        )}
        {description && (
          <p className="service-desc">{description}</p>
        )}
        {children}
      </div>
    );
  }
);

NeoServiceCard.displayName = 'NeoServiceCard';

// サービスグリッドコンテナ
export interface NeoServiceGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
}

const NeoServiceGrid = React.forwardRef<HTMLDivElement, NeoServiceGridProps>(
  ({ className, columns, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'service-grid',
          columns && `grid-cols-${columns}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeoServiceGrid.displayName = 'NeoServiceGrid';

export { NeoServiceCard, NeoServiceGrid };