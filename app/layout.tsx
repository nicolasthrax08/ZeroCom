import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LanguageProvider } from '@/lib/i18n/language-context';
import { cookies } from 'next/headers';
import { translate, type Lang } from '@/lib/i18n/dictionary';

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang: Lang = cookieStore.get('zerocom_lang')?.value === 'en' ? 'en' : 'zh';
  return {
    title: translate('meta.title', lang),
    description: translate('meta.description', lang),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang: Lang = cookieStore.get('zerocom_lang')?.value === 'en' ? 'en' : 'zh';

  return (
    <html lang={translate('meta.htmlLang', lang)}>
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
