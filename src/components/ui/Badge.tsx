import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export interface BadgeProps {
  tone?: 'outline' | 'solid' | 'muted';
  icon?: IconName;
  children: ReactNode;
}

/** One or two words of status. Meaning comes from the word and icon, never colour. */
export function Badge({ tone = 'outline', icon, children }: BadgeProps) {
  return (
    <span className={`pd-badge pd-badge-${tone}`}>
      {icon && <Icon name={icon} size={16} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
