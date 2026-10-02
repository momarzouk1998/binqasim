'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Ship,
  Boxes,
  Truck,
  Users,
  Receipt,
  PieChart,
  Settings,
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
  UserCheck,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    selectedBranch,
    setSelectedBranch,
    usdToEgpRate,
    usdToOmrRate,
    currentUser,
    vehicles,
    products,
    shipments,
    resetAllData
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowNotifications(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('binqasim_user');
    document.cookie = 'binqasim_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  // Compute live alerts count
  const vehiclesNeedOil = vehicles.filter(
    (v) => v.lastOdometerKm - v.lastOilChangeKm >= 1500
  );
  const lowStockItems = products.filter((p) => p.stockQuantity <= p.minAlertLimit);
  const inTransitShipments = shipments.filter((s) => s.status === 'IN_TRANSIT' || s.status === 'ORDERED');
  const totalAlertsCount = vehiclesNeedOil.length + (lowStockItems.length > 0 ? 1 : 0);

  const navItems = [
    {
      title: 'لوحة التحكم الرئيسيّة',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'شحنات الاستيراد والحاويات',
      href: '/import-shipments',
      icon: Ship,
      badge: inTransitShipments.length > 0 ? `${inTransitShipments.length} نشطة` : undefined,
    },
    {
      title: 'المخزون وتقييم العملات',
      href: '/inventory',
      icon: Boxes,
      badge: lowStockItems.length > 0 ? `${lowStockItems.length} نواقص` : undefined,
    },
    {
      title: 'المبيعات والفواتير والأقساط',
      href: '/sales',
      icon: Receipt,
    },
    {
      title: 'أسطول السيارات وتكلفة الكيلو',
      href: '/fleet',
      icon: Truck,
      alertBadge: vehiclesNeedOil.length > 0 ? `${vehiclesNeedOil.length} إنذار زيت` : undefined,
    },
    {
      title: 'دليل العملاء والتحصيلات',
      href: '/customers',
      icon: Users,
    },
    {
      title: 'الموردين والتحويلات الدولية',
      href: '/suppliers',
      icon: Ship,
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
    {
      title: 'إعدادات النظام والعملات',
      href: '/settings',
      icon: Settings,
    },
  ];

  // Mobile Bottom Bar items
  const bottomNavItems = [
    { title: 'الرئيسية', href: '/', icon: LayoutDashboard },
    { title: 'الشحنات', href: '/import-shipments', icon: Ship },
    { title: 'المبيعات', href: '/sales', icon: Receipt },
    { title: 'المخزون', href: '/inventory', icon: Boxes },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col md:flex-row font-sans">
      {/* MOBILE BACKDROP OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* DESKTOP & MOBILE COLLAPSIBLE SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-50 bg-white border-l border-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm ${
          isMobileMenuOpen
            ? 'translate-x-0 w-72'
            : '-translate-x-full md:translate-x-0'
        } ${isSidebarOpen ? 'md:w-72' : 'md:w-20'}`}
      >
        {/* LOGO & BRAND HEADER */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 flex-shrink-0 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1">
                <Image
                  src="/logo.png"
                  alt="Bin Qasim Logo"
                  width={38}
                  height={38}
                  className="object-contain"
                />
              </div>
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <div className="flex flex-col whitespace-nowrap text-right">
                <span className="font-black text-lg text-slate-900 tracking-tight flex items-center gap-1">
                  شركة بي قاسم
                  <Sparkles size={14} className="text-amber-500" />
                </span>
                <span className="text-[11px] text-slate-500 font-bold">
                  للاستيراد والتصدير والتوزيع
                </span>
              </div>
            )}
          </Link>

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
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* BRANCH SELECTOR IN SIDEBAR */}
        {(isSidebarOpen || isMobileMenuOpen) && (
          <div className="p-3 mx-3 my-2.5 bg-gradient-to-br from-slate-50 to-amber-50/40 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Building2 size={13} className="text-amber-600" />
                الفرع النشط:
              </span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-600 font-bold">
                {selectedBranch}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setSelectedBranch('EGY')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-black transition flex items-center justify-center gap-1 ${
                  selectedBranch === 'EGY'
                    ? 'bg-amber-500 text-white shadow'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                🇪🇬 مصر
              </button>
              <button
                onClick={() => setSelectedBranch('OMN')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-black transition flex items-center justify-center gap-1 ${
                  selectedBranch === 'OMN'
                    ? 'bg-amber-500 text-white shadow'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                🇴🇲 عمان
              </button>
              <button
                onClick={() => setSelectedBranch('ALL')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-black transition flex items-center justify-center gap-1 ${
                  selectedBranch === 'ALL'
                    ? 'bg-slate-800 text-white shadow'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                🌐 المجمع
              </button>
            </div>
          </div>
        )}

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-extrabold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-amber-600'}
                />
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <span className="flex-1 whitespace-nowrap">{item.title}</span>
                )}
                {(isSidebarOpen || isMobileMenuOpen) && item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-700 border border-sky-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {(isSidebarOpen || isMobileMenuOpen) && item.alertBadge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5 animate-pulse ${
                      isActive
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <AlertTriangle size={10} />
                    {item.alertBadge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* RESET MOCK DATA DEMO BUTTON */}
        {(isSidebarOpen || isMobileMenuOpen) && (
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-800 border border-slate-200 hover:border-amber-300 text-[11px] font-bold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
              title="إعادة تعيين البيانات الوهمية لعرض الفيديو والشاشات"
            >
              <RotateCcw size={13} className="text-amber-600" />
              تحديث واستعادة البيانات الوهمية
            </button>
          </div>
        )}

        {/* USER PROFILE FOOTER */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <Link
              href="/profile"
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-black flex items-center justify-center text-xs flex-shrink-0 shadow hover:scale-105 transition-transform"
            >
              {currentUser.name.startsWith('و') ? 'و' : 'O'}
            </Link>

            {(isSidebarOpen || isMobileMenuOpen) && (
              <div className="flex-1 overflow-hidden">
                <Link href="/profile" className="block">
                  <p className="text-xs font-black text-slate-800 truncate hover:text-amber-600 transition">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate font-semibold">{currentUser.title}</p>
                </Link>
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
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 py-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none"
              aria-label="القائمة"
            >
              <Menu size={20} />
            </button>

            {/* Current Active Branch Indicator */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs bg-slate-50 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 font-extrabold flex items-center gap-1.5 shadow-sm">
                <Globe size={14} className="text-amber-600" />
                {selectedBranch === 'EGY'
                  ? '🇪🇬 فرع مصر (EGP)'
                  : selectedBranch === 'OMN'
                  ? '🇴🇲 سلطنة عمان (OMR)'
                  : '🌐 جميع الفروع الموحدة'}
              </span>

              <Link
                href="/profile"
                className="hidden lg:flex items-center gap-1 text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl font-bold hover:bg-amber-100 transition shadow-sm"
              >
                <UserCheck size={13} className="text-amber-600" />
                {currentUser.name}
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: LIVE RATES & NOTIFICATION CENTER */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Exchange Rates Live Display */}
            <Link
              href="/settings"
              className="hidden sm:flex items-center gap-2 bg-slate-50 hover:bg-amber-50/50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs transition shadow-sm"
              title="اضغط لتعديل أسعار الصرف"
            >
              <DollarSign size={14} className="text-emerald-600 font-bold" />
              <span className="text-slate-500 font-bold">أسعار الصرف:</span>
              <span className="text-emerald-700 font-mono font-black">$1 = {usdToEgpRate} ج.م</span>
              <span className="text-slate-300">|</span>
              <span className="text-sky-700 font-mono font-black">$1 = {usdToOmrRate} ر.ع</span>
            </Link>

            {/* Notifications Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 relative transition shadow-sm"
                title="تنبيهات النظام وصيانة السيارات"
              >
                <Bell size={18} />
                {totalAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {totalAlertsCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATION POPUP */}
              {showNotifications && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                      <Bell size={14} className="text-amber-600" />
                      التنبيهات الإدارية والتشغيلية ({totalAlertsCount})
                    </h4>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {vehiclesNeedOil.map((v) => (
                      <Link
                        key={v.id}
                        href="/fleet"
                        className="block bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-xs space-y-1 hover:bg-rose-100/70 transition"
                      >
                        <div className="flex items-center justify-between font-bold text-rose-800">
                          <span className="flex items-center gap-1">
                            <AlertTriangle size={13} />
                            إنذار تغيير زيت عاجل!
                          </span>
                          <span className="font-mono">{v.plateNumber}</span>
                        </div>
                        <p className="text-[11px] text-rose-600">
                          قطعت {v.lastOdometerKm - v.lastOilChangeKm} كم منذ آخر صيانة (الحد 1,500 كم).
                        </p>
                      </Link>
                    ))}

                    {lowStockItems.length > 0 && (
                      <Link
                        href="/inventory"
                        className="block bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs space-y-1 hover:bg-amber-100/70 transition"
                      >
                        <div className="flex items-center justify-between font-bold text-amber-800">
                          <span className="flex items-center gap-1">
                            <Boxes size={13} />
                            تنبيه انخفاض مخزون
                          </span>
                          <span>{lowStockItems.length} أصناف</span>
                        </div>
                        <p className="text-[11px] text-amber-700">
                          وصلت بعض أصناف الفحم إلى حد إعادة الطلب.
                        </p>
                      </Link>
                    )}

                    {totalAlertsCount === 0 && (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        <CheckCircle2 size={24} className="mx-auto mb-1 text-emerald-500" />
                        لا توجد تنبيهات معلقة حالياً
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT BODY */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* FIXED MOBILE BOTTOM NAVIGATION BAR (FOR SMARTPHONES) */}
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 z-40 md:hidden flex items-center justify-around shadow-lg">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
                  isActive ? 'text-amber-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-amber-600' : 'text-slate-400'} />
                <span className="text-[10px] mt-0.5">{item.title}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center py-1 px-3 rounded-xl text-slate-500 hover:text-slate-800"
          >
            <Menu size={20} className="text-slate-400" />
            <span className="text-[10px] mt-0.5">المزيد</span>
          </button>
        </div>
      </div>

      {/* CONFIRMATION MODAL: RESET DEMO DATA */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                <RotateCcw size={24} />
              </div>
              <h3 className="font-black text-base text-slate-900">
                استعادة البيانات النموذجية الكاملة؟
              </h3>
              <p className="text-xs text-slate-600">
                سيتم ملء النظام ببيانات واقعية شاملة (شحنات حاويات، فواتير، عملاء، سيارات، ومخزون) لتصوير وعرض البرنامج بأعلى احترافية.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                  window.location.reload();
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md"
              >
                تأكيد الاستعادة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
