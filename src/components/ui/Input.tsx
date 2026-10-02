import { useId, type InputHTMLAttributes } from 'react';
import { Icon } from './Icon';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  /** Replaces the hint. Shown with an alert icon and bold text, never a colour. */
  error?: string;
}

export function Input({ label, hint, error, id, className, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;
  return (
    <div className={['pd-field', className].filter(Boolean).join(' ')}>
      <label className="pd-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        className="pd-input"
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...rest}
      />
      {message && (
        <span
          id={messageId}
          className={['pd-hint', error && 'pd-hint-error'].filter(Boolean).join(' ')}
        >
          {error && <Icon name="alert" size={16} />}
          {message}
        </span>
      )}
    </div>
  );
}
