'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import {
  Ship,
  Boxes,
  Truck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  PieChart
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* EXECUTIVE BANNER & WELCOME */}
        <div className="glass-panel p-6 relative overflow-hidden bg-gradient-to-r from-amber-50 via-white to-amber-100/50 border-amber-200 shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full font-bold">
                شركة بي قاسم للاستيراد والتصدير والتوزيع
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
                لوحة التحكم والمؤشرات المالية التنفيذية
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                نظام متابعة عمليات الشحن والاستيراد من فيتنام وإندونيسيا، التوزيع بفروع مصر وسلطنة عمان، تكلفة الكيلو للسيارات، والتحليلات المالية.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/import-shipments"
                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Ship size={16} />
                حساب شحنة جديدة
              </Link>
            </div>
          </div>
        </div>

        {/* FLEET MAINTENANCE ALERT WARNING BANNER (1500 KM OIL CHANGE) */}
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3 animate-pulse shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 border border-rose-200">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-rose-800">
                تنبيه صيانة السيارات: سيارة تتجاوز الحد المسموح لتغيير الزيت!
              </h4>
              <p className="text-xs text-rose-600 mt-0.5">
                السيارة رقم <span className="font-bold font-mono">س ص ع 5678 (تويوتا دينا 5 طن)</span> قطعت 1,700 كم منذ آخر تغيير زيت (الحد الأقصى 1,500 كم).
              </p>
            </div>
          </div>
          <Link
            href="/fleet"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition"
          >
            تسجيل صيانة الآن
          </Link>
        </div>

        {/* TOP 4 EXECUTIVE KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 glass-panel-hover">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">تكلفة مخزون الفحم (طبيعي ومضغوط)</span>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <Boxes size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-3">$78,400 USD</div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>ما يعادل EGP:</span>
              <span className="font-mono text-sky-700 font-bold">3,802,400 ج.م</span>
            </div>
          </div>

          <div className="glass-panel p-5 glass-panel-hover">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">ديون العملاء (مصر وعمان)</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600 font-mono mt-3">145,000 ج.م</div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>عمان (OMR):</span>
              <span className="font-mono text-sky-700 font-bold">2,850 ر.ع</span>
            </div>
          </div>

          <div className="glass-panel p-5 glass-panel-hover">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">مستحقات الموردين بالخارج</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Ship size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-600 font-mono mt-3">$36,500 USD</div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>فيتنام وإندونيسيا</span>
              <span className="text-xs text-rose-600 font-bold">تحويلات معلقة</span>
            </div>
          </div>

          <div className="glass-panel p-5 glass-panel-hover">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">متوسط تكلفة الكيلو (السيارات)</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Truck size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-3">4.85 ج.م / كم</div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>شامل الوقود والصيانة</span>
              <span className="text-emerald-700 font-bold">كفاءة تشغيلية</span>
            </div>
          </div>
        </div>

        {/* IMPORT & SHIPMENT COST ALLOCATION HIGHLIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RECENT CONTAINERS & LANDED COSTS */}
          <div className="lg:col-span-2 glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                  <Ship className="text-amber-600" size={18} />
                  آخر حاويات الاستيراد وتوزيع التكاليف المباشرة وغير المباشرة
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  حساب النولي بالحجم (m³)، الجمرك بـ Tariff الكيلو، والضريبة 14%
                </p>
              </div>
              <Link
                href="/import-shipments"
                className="text-xs text-amber-600 hover:underline font-bold flex items-center gap-1"
              >
                عرض كل الحاويات
                <ChevronLeft size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-amber-700">CONT-68M3-INDO-2026</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                      تم التفريغ في المخزن
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">حاوية 68 متر مكعب - إندونيسيا</span>
                </div>

                {/* CONTAINER COST ALLOCATION BREAKDOWN */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[11px] text-slate-500 block">تكلفة الشحن (النولي):</span>
                    <span className="font-mono font-bold text-sky-700">$3,200 USD</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">الجمرك الإجمالي:</span>
                    <span className="font-mono font-bold text-amber-700">430,000 ج.م</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">ضريبة المبيعات 14%:</span>
                    <span className="font-mono font-bold text-purple-700">112,000 ج.م</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">تكلفة الفحم الواصل:</span>
                    <span className="font-mono font-bold text-emerald-700">27,005 ج.م / طن</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 border-b border-slate-100 pb-3">
              روابط سريعة لأقسام النظام
            </h3>

            <div className="space-y-2">
              <Link
                href="/customers"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-800 group-hover:text-amber-700">دليل العملاء والتحصيلات</p>
                    <p className="text-[11px] text-slate-500">مصر (EGP) وعمان (OMR)</p>
                  </div>
                </div>
                <ChevronLeft size={16} className="text-slate-400 group-hover:text-amber-600" />
              </Link>

              <Link
                href="/suppliers"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-400 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                    <Ship size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-800 group-hover:text-sky-700">الموردين والتحويلات الدولية</p>
                    <p className="text-[11px] text-slate-500">فيتنام وإندونيسيا ($ USD)</p>
                  </div>
                </div>
                <ChevronLeft size={16} className="text-slate-400 group-hover:text-sky-600" />
              </Link>

              <Link
                href="/fleet"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-400 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-800 group-hover:text-rose-700">حركة وتكلفة السيارات</p>
                    <p className="text-[11px] text-slate-500">قراءة العداد وإنذار تغيير الزيت</p>
                  </div>
                </div>
                <ChevronLeft size={16} className="text-slate-400 group-hover:text-rose-600" />
              </Link>

              <Link
                href="/finance"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <PieChart size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-800 group-hover:text-emerald-700">التقارير والتحليلات المالية</p>
                    <p className="text-[11px] text-slate-500">قائمة الدخل وميزان المراجعة</p>
                  </div>
                </div>
                <ChevronLeft size={16} className="text-slate-400 group-hover:text-emerald-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
