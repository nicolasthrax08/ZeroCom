'use client';
import { useState } from 'react';
import { ListingForm } from '@/components/seller/listing-form';
import { Card, CardBody } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/language-context';

export default function NewListingPage() {
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(data: any) {
    setSubmitting(true);
    setError(null);
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    setSubmitting(false);
    if (!json.ok) {
      setError(json.error?.message ?? t('seller.submitFailed'));
      return;
    }
    window.location.href = '/seller';
  }

  return (
    <main className="container-page py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t('seller.newTitle')}</h1>
      <ListingForm onSubmit={handleSubmit} submitting={submitting} serverError={error ?? undefined} />
    </main>
  );
}
