import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Privacy Policy · ZeroCom',
  description: 'ZeroCom Privacy Policy — GDPR/CCPA compliant. Learn how we collect, use, and protect your personal data.',
};

// Legacy route — canonical content now lives at /legal/privacy.html.
export default function PrivacyRedirect() {
  redirect('/legal/privacy.html');
}
