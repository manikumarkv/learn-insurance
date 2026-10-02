/*
 * GET /api/admin/term-requests (admins only): the newest 100 term requests and issue reports,
 * for the admin review screen (Epic 9). Served by src/pages/api/admin/term-requests.ts.
 */
import { desc } from 'drizzle-orm';
import { ok, route } from '../../lib/api/route';
import { schema } from '../../lib/db/client';

const { termRequests } = schema;

export const GET = route({
  access: 'admin',
  handler: async ({ db }) => {
    const rows = await db
      .select()
      .from(termRequests)
      .orderBy(desc(termRequests.createdAt))
      .limit(100);
    return ok({ requests: rows });
  },
});
