import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NeoProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  animated?: boolean;
}

const NeoProgress = React.forwardRef<HTMLDivElement, NeoProgressProps>(
  ({ className, value = 0, max = 100, label, showValue = false, animated = true, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div className="stat-item" ref={ref} {...props}>
        {(label || showValue) && (
          <div className="stat-header">
            {label && <span className="stat-name">{label}</span>}
            {showValue && <span className="stat-value">{percentage}%</span>}
          </div>
        )}
        <div className={cn('stat-bar', className)}>
          <div 
            className={cn('stat-fill', !animated && 'after:hidden')}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

NeoProgress.displayName = 'NeoProgress';

export { NeoProgress };