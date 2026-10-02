/** Replaces `@clerk/astro/client` when Clerk isn't configured: nobody is ever signed in. */
type AuthState = { userId: string | null };

export const $authStore = {
  subscribe(listener: (state: AuthState) => void) {
    listener({ userId: null });
    return () => {};
  },
};
