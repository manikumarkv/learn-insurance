import type { ReactNode } from 'react';

export interface CardProps {
  title?: string;
  /** Heading level for the title, so cards fit the page's outline. */
  headingLevel?: 2 | 3 | 4;
  children?: ReactNode;
  /** Buttons under the body. From Astro, pass them with slot="actions". */
  actions?: ReactNode;
  className?: string;
}

/** White card with a thin border and a soft shadow. At most one primary button in `actions`. */
export function Card({ title, headingLevel = 3, children, actions, className }: CardProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div className={['ui-card', className].filter(Boolean).join(' ')}>
      {title && <Heading className="ui-card-title">{title}</Heading>}
      {children && <div className="ui-card-body">{children}</div>}
      {actions && <div className="ui-card-actions">{actions}</div>}
    </div>
  );
}
