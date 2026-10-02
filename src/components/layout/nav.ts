export interface NavItem {
  href: string;
  label: string;
}

export const MAIN_NAV: NavItem[] = [
  { href: '/terms', label: 'Terms A–Z' },
  { href: '/types', label: 'Insurance types' },
  { href: '/paths', label: 'Learning paths' },
];

// TODO(story 5.4): "Cookie settings" should reopen the consent banner once it exists.
export const FOOTER_NAV: NavItem[] = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms-of-use', label: 'Terms of use' },
  { href: '/privacy#cookies', label: 'Cookie settings' },
];

/** True when `pathname` is the nav item's page or one of its sub-pages. */
export function isActive(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === href || path.startsWith(`${href}/`);
}
