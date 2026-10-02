export interface NavItem {
  href: string;
  label: string;
  action?: 'cookie-settings';
}

export const MAIN_NAV: NavItem[] = [
  { href: '/terms', label: 'Terms A–Z' },
  { href: '/types', label: 'Insurance types' },
  { href: '/paths', label: 'Learning paths' },
];

export const FOOTER_NAV: NavItem[] = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms-of-use', label: 'Terms of use' },
  // Reopens the cookie banner (see SiteFooter). Without JavaScript it opens the privacy policy.
  { href: '/privacy', label: 'Cookie settings', action: 'cookie-settings' },
];

/** True when `pathname` is the nav item's page or one of its sub-pages. */
export function isActive(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === href || path.startsWith(`${href}/`);
}
