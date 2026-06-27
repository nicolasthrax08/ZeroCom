import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LanguageProvider } from '@/lib/i18n/language-context';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'ZeroCom · 零佣金房产直连',
  description: '零佣金，房东买家直接见面 — ZeroCom',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('zerocom_lang')?.value === 'en' ? 'en' : 'zh-CN';

  return (
    <html lang={lang}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
