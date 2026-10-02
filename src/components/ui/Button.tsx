import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from './Icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  icon?: IconName;
  iconRight?: IconName;
}

/**
 * Primary (ink fill), secondary (outlined, default) or ghost (no border).
 * Icon-only when `icon` is set without children: pass an aria-label.
 */
export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const iconSize = size === 'sm' ? 16 : 20;
  const classes = [
    'pd-btn',
    `pd-btn-${variant}`,
    size === 'sm' && 'pd-btn-sm',
    icon && !children && 'pd-btn-icon',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={classes} {...rest}>
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}
