'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n/language-context';

export function PhoneForm({
  onSubmit,
  error,
  loading,
}: {
  onSubmit: (phone: string) => void | Promise<void>;
  error?: string;
  loading?: boolean;
}) {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit(phone);
      }}
      className="space-y-3"
    >
      <Input
        label={t('auth.phone.label')}
        placeholder={t('auth.phone.placeholder')}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={error}
        inputMode="numeric"
        hint={t('auth.phone.hint')}
      />
      <Button type="submit" variant="accent" className="w-full" loading={loading}>
        {t('auth.phone.submit')}
      </Button>
    </form>
  );
}
