'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Ship,
  Boxes,
  Truck,
  Users,
  Receipt,
  PieChart,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  Globe,
  DollarSign,
  AlertTriangle,
  Building2,
  X,
  LogOut,
  UserCheck
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Sidebar open/collapsed state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<'EGY' | 'OMN'>('EGY');

  // Primary User state
  const [currentUser, setCurrentUser] = useState({
    name: 'وائل قاسم',
    title: 'المدير',
    phone: '01111189666',
  });

  useEffect(() => {
    setIsMobileMenuOpen(false);

    try {
      const stored = localStorage.getItem('binqasim_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setCurrentUser(parsed);
      }
    } catch (err) {
      console.error(err);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('binqasim_user');
    document.cookie = 'binqasim_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const navItems = [
    {
      title: 'لوحة التحكم الرئيسيّة',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'حساب شحنات الاستيراد',
      href: '/import-shipments',
      icon: Ship,
      badge: 'توزيع التكاليف',
    },
    {
      title: 'المخزون وتقييم العملات',
      href: '/inventory',
      icon: Boxes,
    },
    {
      title: 'السيارات وتكلفة الكيلو',
      href: '/fleet',
      icon: Truck,
      alertBadge: 'إنذار الزيت',
    },
    {
      title: 'دليل العملاء والتحصيلات',
      href: '/customers',
      icon: Users,
    },
    {
      title: 'دليل الموردين للشحن',
      href: '/suppliers',
      icon: Ship,
    },
    {
      title: 'المبيعات والعملاء والأقساط',
      href: '/sales',
      icon: Receipt,
    },
    {
      title: 'الموارد البشرية والرواتب',
      href: '/hr',
      icon: Users,
    },
    {
      title: 'التقارير والتحليلات المالية',
      href: '/finance',
      icon: PieChart,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col md:flex-row font-sans">
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* LIGHT MODE COLLAPSIBLE SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-50 bg-white border-l border-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm ${
          isMobileMenuOpen
            ? 'translate-x-0 w-72'
            : '-translate-x-full md:translate-x-0'
        } ${isSidebarOpen ? 'md:w-72' : 'md:w-20'}`}
      >
        {/* LOGO & SIDEBAR TOGGLE HEADER */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-11 h-11 rounded-xl bg-slate-50 p-1 border border-slate-200 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Bin Qasim Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-extrabold text-lg text-slate-900 tracking-wide">
                  شركة بي قاسم
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  للاستيراد والتصدير والتوزيع
                </span>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex items-center justify-center p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-amber-600 hover:bg-slate-200 transition"
            title={isSidebarOpen ? 'طي القائمة الجانبية' : 'توسيع القائمة'}
          >
            {isSidebarOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* BRANCH SELECTOR IN SIDEBAR */}
        {(isSidebarOpen || isMobileMenuOpen) && (
          <div className="p-3 mx-3 my-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center justify-between">
              <span>الفرع الحالي:</span>
              <Building2 size={13} className="text-amber-600" />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setSelectedBranch('EGY')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                  selectedBranch === 'EGY'
                    ? 'bg-amber-500 text-white shadow'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                🇪🇬 فرع مصر
              </button>
              <button
                onClick={() => setSelectedBranch('OMN')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                  selectedBranch === 'OMN'
                    ? 'bg-amber-500 text-white shadow'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                🇴🇲 سلطنة عمان
              </button>
            </div>
          </div>
        )}

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group ${
                  isActive
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/80 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? 'text-amber-600' : 'text-slate-400 group-hover:text-amber-600'}
                />
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <span className="flex-1 whitespace-nowrap">{item.title}</span>
                )}
                {(isSidebarOpen || isMobileMenuOpen) && item.badge && (
                  <span className="text-[10px] bg-sky-100 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded-md font-bold">
                    {item.badge}
                  </span>
                )}
                {(isSidebarOpen || isMobileMenuOpen) && item.alertBadge && (
                  <span className="text-[10px] bg-rose-100 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5 animate-pulse">
                    <AlertTriangle size={10} />
                    {item.alertBadge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* USER PROFILE FOOTER */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-xs flex-shrink-0 shadow">
              {currentUser.name.startsWith('و') ? 'و' : 'O'}
            </div>

            {(isSidebarOpen || isMobileMenuOpen) && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-extrabold text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.title}</p>
              </div>
            )}

            {(isSidebarOpen || isMobileMenuOpen) && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="تسجيل الخروج"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR HEADER */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              <Menu size={22} />
            </button>

            {/* Current Page Title */}
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-bold flex items-center gap-1.5">
                <Globe size={14} className="text-amber-600" />
                {selectedBranch === 'EGY' ? 'مصر (EGP)' : 'سلطنة عمان (OMR)'}
              </span>

              <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                <UserCheck size={13} />
                {currentUser.name} ({currentUser.title})
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: RATES & ALERTS */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <DollarSign size={14} className="text-emerald-600" />
              <span className="text-slate-500">أسعار الصرف:</span>
              <span className="text-emerald-700 font-mono font-bold">$1 = 48.5 EGP</span>
              <span className="text-slate-300">|</span>
              <span className="text-sky-700 font-mono font-bold">$1 = 0.385 OMR</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 relative transition"
                title="التنبيهات الإدارية وصيانة السيارات"
              >
                <Bell size={19} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                  2
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT BODY */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
