import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Terms of Service · ZeroCom',
  description: 'ZeroCom Terms of Service — user agreement for the ZeroCom real-estate marketplace platform.',
};

// Legacy route — canonical content now lives at /legal/terms.html.
export default function TermsRedirect() {
  redirect('/legal/terms.html');
}
