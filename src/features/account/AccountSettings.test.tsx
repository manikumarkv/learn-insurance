// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getConsent } from '../../lib/consent';
import { AccountSettings } from './AccountSettings';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let container: HTMLDivElement;

function button(name: string): HTMLButtonElement {
  const found = [...container.querySelectorAll('button')].find((b) => b.textContent === name);
  if (!found) throw new Error(`No "${name}" button`);
  return found;
}

beforeEach(() => {
  localStorage.clear();
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(<AccountSettings />));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

describe('AccountSettings', () => {
  it('turns analytics on and off', () => {
    const toggle = container.querySelector<HTMLInputElement>('input[role="switch"]');
    if (!toggle) throw new Error('No switch');
    expect(toggle.checked).toBe(false);
    act(() => toggle.click());
    expect(getConsent()).toBe('analytics');
    act(() => toggle.click());
    expect(getConsent()).toBe('necessary');
  });

  it('asks to confirm, then deletes the account', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    act(() => button('Delete my account').click());
    expect(fetchMock).not.toHaveBeenCalled();
    await act(async () => button('Yes, delete everything').click());

    expect(fetchMock).toHaveBeenCalledWith('/api/account', { method: 'DELETE' });
    expect(container.textContent).toContain('Your account is deleted');
  });

  it('can be cancelled, and says so when deletion fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('{}', { status: 500 })),
    );

    act(() => button('Delete my account').click());
    act(() => button('Keep my account').click());
    expect(button('Delete my account')).toBeDefined();

    act(() => button('Delete my account').click());
    await act(async () => button('Yes, delete everything').click());
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('Not deleted');
  });
});
