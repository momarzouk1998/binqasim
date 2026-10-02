import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'شركة بي قاسم للاستيراد والتصدير والتوزيع | ERP',
  description: 'النظام الإداري والمالي المتكامل لاستيراد الفحم والحاويات وتوزيع المنتجات وإدارة الأسطول',
  icons: {
    icon: '/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-100 text-slate-900 min-h-screen font-sans antialiased selection:bg-amber-500 selection:text-white pb-16 md:pb-0">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
