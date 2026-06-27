'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import { Checkbox } from '@/components/ui/checkbox';

export function OtpForm({
  phone,
  loading,
  error,
  cooldown,
  devOtp,
  onVerify,
}: {
  phone: string;
  loading?: boolean;
  error?: string;
  cooldown?: number;
  devOtp?: string;
  onVerify: (otp: string, acceptTerms: boolean, acceptPrivacy: boolean) => void | Promise<void>;
}) {
  const [otp, setOtp] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onVerify(otp, acceptTerms, acceptPrivacy);
      }}
      className="space-y-4"
    >
      <p className="text-sm text-muted-foreground">
        已发送验证码到 <span className="font-medium text-foreground">{phone}</span>
      </p>
      <OtpInput onComplete={setOtp} error={error} />
      {devOtp && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          开发模式 · 测试验证码：<strong>{devOtp}</strong>
        </p>
      )}
      <div className="space-y-2">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          label="我已阅读并同意《服务条款》"
        />
        <Checkbox
          id="privacy"
          checked={acceptPrivacy}
          onChange={(e) => setAcceptPrivacy(e.target.checked)}
          label="我已阅读并同意《隐私政策》"
        />
      </div>
      <Button type="submit" variant="accent" className="w-full" loading={loading}>
        登录 / 注册
      </Button>
      {cooldown && cooldown > 0 && (
        <p className="text-center text-xs text-muted-foreground">{cooldown} 秒后可重新发送</p>
      )}
    </form>
  );
}
