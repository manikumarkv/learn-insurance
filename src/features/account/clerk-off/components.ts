/** Replaces `@clerk/astro/components` when Clerk isn't configured (see astro.config.mjs). */
export { default as Show } from './Nothing.astro';
export { default as UserButton } from './Nothing.astro';
export { default as SignIn } from './NotSetUp.astro';
export { default as SignUp } from './NotSetUp.astro';
export { default as UserProfile } from './NotSetUp.astro';
