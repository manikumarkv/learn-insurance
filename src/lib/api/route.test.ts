import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ok, route } from './route';
import { call, fakeContext } from './test-helpers';

vi.mock('../db/client', () => ({ getDb: () => ({}) }));

const echo = route({
  access: 'user',
  input: z.object({ name: z.string().min(1) }),
  handler: async ({ input, userId }) => ok({ name: input.name, userId }),
});

describe('route()', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when a signed-in user is required', async () => {
    const res = await call(echo, fakeContext('POST', { body: { name: 'a' } }));
    expect(res.status).toBe(401);
    expect(res.json).toEqual({
      error: { code: 'unauthenticated', message: 'Sign in to do this.' },
    });
  });

  it('returns data for a valid request', async () => {
    const res = await call(echo, fakeContext('POST', { userId: 'user_1', body: { name: 'Ram' } }));
    expect(res).toEqual({ status: 200, json: { data: { name: 'Ram', userId: 'user_1' } } });
  });

  it('returns 400 with field errors when input is wrong', async () => {
    const res = await call(echo, fakeContext('POST', { userId: 'user_1', body: { name: '' } }));
    expect(res.status).toBe(400);
    expect(res.json).toMatchObject({
      error: { code: 'invalid_request', details: { name: expect.any(Array) } },
    });
  });

  it('returns 400 when the body is not JSON', async () => {
    const res = await call(echo, fakeContext('POST', { userId: 'user_1', body: '{oops' }));
    expect(res.json).toMatchObject({ error: { code: 'invalid_request' } });
  });

  it('reads GET input from the query string', async () => {
    const res = await call(echo, fakeContext('GET', { userId: 'user_1', query: 'name=Ram' }));
    expect(res.json).toEqual({ data: { name: 'Ram', userId: 'user_1' } });
  });

  it('lets anyone call a public endpoint', async () => {
    const hello = route({ access: 'public', handler: async ({ userId }) => ok({ userId }) });
    const res = await call(hello, fakeContext('GET'));
    expect(res.json).toEqual({ data: { userId: null } });
  });

  it('hides unexpected errors behind a 500', async () => {
    const broken = route({
      access: 'public',
      handler: async () => {
        throw new Error('database password is wrong');
      },
    });
    const res = await call(broken, fakeContext('GET'));
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.json)).not.toContain('password');
  });
});
