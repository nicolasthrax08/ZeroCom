'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function PhoneForm({
  onSubmit,
  error,
  loading,
}: {
  onSubmit: (phone: string) => void | Promise<void>;
  error?: string;
  loading?: boolean;
}) {
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
        label="中国大陆手机号"
        placeholder="13800138000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={error}
        inputMode="numeric"
        hint="目前仅支持中国大陆手机号（11 位，1 开头）"
      />
      <Button type="submit" variant="accent" className="w-full" loading={loading}>
        获取验证码
      </Button>
    </form>
  );
}
