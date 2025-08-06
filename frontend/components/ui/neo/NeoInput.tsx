import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NeoInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const NeoInput = React.forwardRef<HTMLInputElement, NeoInputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'neo-input',
            icon && 'pl-12',
            error && 'border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

NeoInput.displayName = 'NeoInput';

export { NeoInput };