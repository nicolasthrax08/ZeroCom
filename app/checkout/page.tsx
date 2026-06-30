import { redirect } from 'next/navigation';
import { currentUser } from '@/server/auth';
import { CheckoutFlow } from '@/components/payments/checkout-flow';
import { serverT } from '@/lib/i18n/lang-server';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const user = await currentUser();
  if (!user) redirect('/auth');
  const t = await serverT();
  return (
    <main className="container-page py-12">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold text-foreground">{t('pay.checkoutTitle')}</h1>
        <CheckoutFlow />
      </div>
    </main>
  );
}
