import type { InputHTMLAttributes, ReactNode } from 'react';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role'> {
  /** Say what is on ("Show abbreviations"), not the action. */
  label: ReactNode;
}

/** On/off toggle that applies immediately. */
export function Switch({ label, ...rest }: SwitchProps) {
  return (
    <label className="pd-switch">
      <input type="checkbox" role="switch" {...rest} />
      <span className="pd-track" />
      {label}
    </label>
  );
}
