import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireAdmin } from '@/server/auth';

export async function GET() {
  await requireAdmin();
  const allListings = await store.listListings({ includeShadowBanned: true });
  const allSignals = await store.listBrokerSignals();
  const allReports = await store.listReports();
  const allOrders = await store.listAllPaymentOrders();
  return NextResponse.json({
    ok: true,
    data: {
      counts: {
        totalListings: allListings.length,
        activeListings: allListings.filter((l) => l.status === 'ACTIVE').length,
        pendingListings: allListings.filter((l) => l.status === 'PENDING_VERIFICATION').length,
        totalSignals: allSignals.length,
        criticalSignals: allSignals.filter((s) => s.severity === 'CRITICAL').length,
        openReports: allReports.filter((r) => r.status === 'OPEN').length,
        paidOrders: allOrders.filter((o) => o.status === 'PAID').length,
        pendingOrders: allOrders.filter((o) => o.status === 'PENDING_USER_PAY').length,
      },
    },
  });
}
