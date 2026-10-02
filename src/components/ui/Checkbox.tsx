import type { InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
}

/** For choices that apply on submit. For settings that apply at once, use Switch. */
export function Checkbox({ label, ...rest }: CheckboxProps) {
  return (
    <label className="ui-check">
      <input type="checkbox" {...rest} />
      <span className="ui-box">
        <Icon name="check" size={17} strokeWidth={3} />
      </span>
      {label}
    </label>
  );
}
