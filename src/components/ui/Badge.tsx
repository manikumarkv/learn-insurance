import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export interface BadgeProps {
  tone?: 'soft' | 'solid' | 'muted' | 'success';
  icon?: IconName;
  children: ReactNode;
}

/** One or two words of status. Meaning comes from the word and icon; colour only supports it. */
export function Badge({ tone = 'soft', icon, children }: BadgeProps) {
  return (
    <span className={`ui-badge ui-badge-${tone}`}>
      {icon && <Icon name={icon} size={16} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
