import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireUser } from '@/server/auth';
import { listingReportSchema } from '@/lib/validation/listing';
import { logAnalytics } from '@/server/audit';
import { BadRequest, NotFound } from '@/server/errors';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const listing = await store.findListingById(id);
  if (!listing) throw new NotFound('房源不存在');
  const body = await req.json().catch(() => null);
  const parsed = listingReportSchema.safeParse({ ...(body ?? {}), listingId: id });
  if (!parsed.success) throw new BadRequest(parsed.error.issues[0]?.message ?? '输入无效');
  const report = await store.createReport({
    reporterId: user.id,
    listingId: listing.id,
    reportedUserId: listing.sellerId,
    reason: parsed.data.reason,
    details: parsed.data.details ?? null,
    status: 'OPEN',
    resolvedAt: null,
  });
  await logAnalytics('report_submitted', { userId: user.id, listingId: listing.id });
  return NextResponse.json({ ok: true, data: { id: report.id, status: report.status } }, { status: 201 });
}
