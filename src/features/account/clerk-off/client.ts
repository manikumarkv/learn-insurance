/** Replaces `@clerk/astro/client` when Clerk isn't configured: nobody is ever signed in. */
type AuthState = { userId: string | null };

export const $authStore = {
  subscribe(listener: (state: AuthState) => void) {
    listener({ userId: null });
    return () => {};
  },
};

/** Nobody is signed in, so there is never a user. */
export const $userStore = {
  subscribe(listener: (user: null) => void) {
    listener(null);
    return () => {};
  },
};
