import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شركة بي قاسم للاستيراد والتصدير والتوزيع',
  description: 'نظام إدارة الاستيراد والتصدير، حساب شحنات الفحم والتوابل، وحركة السيارات والتكاليف',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-950 text-slate-100 min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
