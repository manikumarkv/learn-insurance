/**
 * Quick previews for term links (story 3.8).
 * Desktop: hover or keyboard focus shows the preview; the link works as normal.
 * Touch: the first tap shows the preview with an "Open term" link; tapping elsewhere closes it.
 * Escape always closes it.
 */
const HIDE_DELAY_MS = 150;

function init() {
  const links = document.querySelectorAll<HTMLAnchorElement>('a[data-term-link]');
  if (links.length === 0) return;

  const box = document.createElement('div');
  box.id = 'term-preview';
  box.className = 'term-preview';
  box.setAttribute('role', 'tooltip');
  box.hidden = true;
  document.body.append(box);

  let current: HTMLAnchorElement | null = null;
  let hideTimer: number | undefined;
  const touch = window.matchMedia('(hover: none)').matches;

  function show(link: HTMLAnchorElement) {
    window.clearTimeout(hideTimer);
    current?.removeAttribute('aria-describedby');
    current = link;
    box.replaceChildren();
    const title = document.createElement('p');
    title.className = 'text-label m-0';
    title.textContent = link.dataset.previewTitle ?? link.textContent ?? '';
    const text = document.createElement('p');
    text.className = 'text-body-sm m-0';
    text.textContent = link.dataset.previewText ?? '';
    const open = document.createElement('a');
    open.href = link.href;
    open.className = 'text-label';
    open.textContent = 'Open term →';
    box.append(title, text, open);
    box.hidden = false;
    link.setAttribute('aria-describedby', box.id);

    const r = link.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 32);
    box.style.width = `${width}px`;
    const left = Math.min(
      Math.max(16, r.left + window.scrollX),
      window.scrollX + window.innerWidth - width - 16,
    );
    box.style.left = `${left}px`;
    box.style.top = `${r.bottom + window.scrollY + 8}px`;
  }

  function hide() {
    box.hidden = true;
    current?.removeAttribute('aria-describedby');
    current = null;
  }

  const hideSoon = () => {
    hideTimer = window.setTimeout(hide, HIDE_DELAY_MS);
  };

  for (const link of links) {
    if (touch) {
      // A tap fires focus and mouse events before click, so only the click decides:
      // the first tap previews, a second tap on the same link opens it.
      link.addEventListener('click', (e) => {
        if (current !== link) {
          e.preventDefault();
          show(link);
        }
      });
      continue;
    }
    link.addEventListener('mouseenter', () => show(link));
    link.addEventListener('mouseleave', hideSoon);
    link.addEventListener('focus', () => show(link));
    link.addEventListener('blur', hideSoon);
  }
  box.addEventListener('mouseenter', () => window.clearTimeout(hideTimer));
  box.addEventListener('mouseleave', hideSoon);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
  });
  document.addEventListener('click', (e) => {
    const target = e.target as Node;
    if (current && !box.contains(target) && !current.contains(target)) hide();
  });
}

init();
