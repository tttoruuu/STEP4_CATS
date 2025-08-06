import * as React from 'react';
import { cn } from '@/lib/utils';

// Form Container
export interface NeoFormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const NeoForm = React.forwardRef<HTMLFormElement, NeoFormProps>(
  ({ className, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn('form', className)}
        {...props}
      />
    );
  }
);

NeoForm.displayName = 'NeoForm';

// Form Field Container
export interface NeoFormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helpText?: string;
}

const NeoFormField = React.forwardRef<HTMLDivElement, NeoFormFieldProps>(
  ({ className, label, error, required, helpText, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('form-group', className)}
        {...props}
      >
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="text-[var(--primary-orange)] ml-1">*</span>}
          </label>
        )}
        {children}
        {helpText && !error && (
          <p className="form-help text-sm text-[var(--text-secondary)] mt-1">
            {helpText}
          </p>
        )}
        {error && (
          <p className="form-error text-sm text-[#D63031] mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

NeoFormField.displayName = 'NeoFormField';

// Select Component
export interface NeoSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<{ value: string; label: string }>;
}

const NeoSelect = React.forwardRef<HTMLSelectElement, NeoSelectProps>(
  ({ className, options = [], children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn('neo-input', className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
    );
  }
);

NeoSelect.displayName = 'NeoSelect';

// Checkbox Component
export interface NeoCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const NeoCheckbox = React.forwardRef<HTMLInputElement, NeoCheckboxProps>(
  ({ className, label, ...props }, ref) => {
    const id = React.useId();
    
    return (
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className={cn('neo-checkbox', className)}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    );
  }
);

NeoCheckbox.displayName = 'NeoCheckbox';

// Radio Component
export interface NeoRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const NeoRadio = React.forwardRef<HTMLInputElement, NeoRadioProps>(
  ({ className, label, ...props }, ref) => {
    const id = React.useId();
    
    return (
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          type="radio"
          id={id}
          className={cn('neo-radio', className)}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    );
  }
);

NeoRadio.displayName = 'NeoRadio';

// Radio Group Component
export interface NeoRadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name?: string;
  options?: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
}

const NeoRadioGroup = React.forwardRef<HTMLDivElement, NeoRadioGroupProps>(
  ({ className, name, options = [], value, onChange, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-2', className)}
        {...props}
      >
        {options.map((option) => (
          <NeoRadio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        ))}
      </div>
    );
  }
);

NeoRadioGroup.displayName = 'NeoRadioGroup';

// Textarea Component
export interface NeoTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const NeoTextarea = React.forwardRef<HTMLTextAreaElement, NeoTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn('neo-input min-h-[100px] resize-y', className)}
        {...props}
      />
    );
  }
);

NeoTextarea.displayName = 'NeoTextarea';

export { 
  NeoForm, 
  NeoFormField, 
  NeoSelect, 
  NeoCheckbox, 
  NeoRadio, 
  NeoRadioGroup,
  NeoTextarea 
};