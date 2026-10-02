'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Ship,
  Boxes,
  Truck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Users,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  PieChart,
  Plus,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Globe
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function DashboardPage() {
  const {
    selectedBranch,
    usdToEgpRate,
    usdToOmrRate,
    products,
    customers,
    suppliers,
    vehicles,
    shipments,
    invoices,
  } = useApp();

  // Helper for multi-currency display
  const currencySymbol = selectedBranch === 'OMN' ? 'ر.ع' : 'ج.م';

  // 1. Filtered or branch-specific calculations
  const totalStockValueUSD = products.reduce(
    (sum, p) => sum + p.stockQuantity * p.basePriceUSD,
    0
  );
  const totalStockValueEGP = totalStockValueUSD * usdToEgpRate;
  const totalStockValueOMR = totalStockValueUSD * usdToOmrRate;

  // Receivables from customers
  const totalDebtsEGP = customers
    .filter((c) => c.currency === 'EGP' && c.balance > 0)
    .reduce((sum, c) => sum + c.balance, 0);

  const totalDebtsOMR = customers
    .filter((c) => c.currency === 'OMR' && c.balance > 0)
    .reduce((sum, c) => sum + c.balance, 0);

  // Payables to foreign suppliers in USD
  const totalPayablesUSD = suppliers.reduce((sum, s) => sum + (s.balanceUSD || 0), 0);

  // Fleet Vehicles needing oil change (> 1500 km)
  const urgentVehicles = vehicles.filter(
    (v) => v.lastOdometerKm - v.lastOilChangeKm >= 1500
  );

  // In-transit / active shipments
  const activeShipments = shipments.filter(
    (s) => s.status === 'IN_TRANSIT' || s.status === 'ORDERED'
  );

  // Recent 4 sales invoices
  const recentInvoices = invoices.slice(0, 4);

  // Monthly sales & landed profit trend
  const financialTrendData = [
    { month: 'يناير', sales: 2800000, landedCost: 1950000, netProfit: 670000 },
    { month: 'فبراير', sales: 3100000, landedCost: 2200000, netProfit: 700000 },
    { month: 'مارس', sales: 3450000, landedCost: 2400000, netProfit: 840000 },
    { month: 'أبريل', sales: 3200000, landedCost: 2250000, netProfit: 755000 },
    { month: 'مايو', sales: 3900000, landedCost: 2700000, netProfit: 970000 },
    { month: 'يونيو', sales: 4250000, landedCost: 2950000, netProfit: 1055000 },
    { month: 'يوليو', sales: 4400000, landedCost: 3050000, netProfit: 1100000 },
    { month: 'أغسطس', sales: 4618000, landedCost: 3279600, netProfit: 1138400 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* EXECUTIVE HERO BANNER */}
        <div className="glass-panel p-5 sm:p-7 relative overflow-hidden bg-gradient-to-r from-amber-500/15 via-white to-sky-500/10 border-amber-200 shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs bg-amber-500 text-white font-black px-3 py-1 rounded-full shadow-sm">
                  شركة بي قاسم للاستيراد والتصدير والتوزيع
                </span>
                <span className="text-xs bg-white text-slate-700 font-bold px-2.5 py-1 rounded-full border border-slate-200">
                  فروع مصر وسلطنة عمان
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-2.5">
                لوحة المؤشرات والتحكم التنفيذية الشاملة
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                متابعة حركة شحن الحاويات من فيتنام وإندونيسيا، تكلفة الطن والكيلو واصل للمخازن، أسطول التوزيع، الفواتير والأقساط والتحصيلات النقدية.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/sales"
                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Receipt size={16} />
                + فاتورة مبيعات جديدة
              </Link>
              <Link
                href="/import-shipments"
                className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Ship size={16} />
                حساب شحنة وحاوية
              </Link>
            </div>
          </div>
        </div>

        {/* OIL CHANGE ALERT BANNER IF APPLICABLE (1500 KM ALARM) */}
        {urgentVehicles.length > 0 && (
          <div className="bg-rose-50 border border-rose-300 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3 shadow-sm animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 border border-rose-300">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-rose-800">
                  تنبيه هام لصيانة الأسطول: {urgentVehicles.length} سيارة تجاوزت الحد الأقصى لتغيير الزيت (1,500 كم)!
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  السيارة: <span className="font-bold font-mono">{urgentVehicles[0].model} ({urgentVehicles[0].plateNumber})</span> قطعت {urgentVehicles[0].lastOdometerKm - urgentVehicles[0].lastOilChangeKm} كم منذ آخر صيانة.
                </p>
              </div>
            </div>
            <Link
              href="/fleet"
              className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition shadow"
            >
              تسجيل صيانة الآن
            </Link>
          </div>
        )}

        {/* TOP 4 EXECUTIVE KPIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* INVENTORY VALUATION CARD */}
          <div className="glass-panel p-5 glass-panel-hover border-sky-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">تقييم المخزون المتاح (فحم وتعبئة)</span>
              <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
                <Boxes size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-3">
              ${Math.round(totalStockValueUSD).toLocaleString()} USD
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100 font-medium">
              <span>ما يعادله بالمحلي:</span>
              <span className="font-mono text-sky-700 font-extrabold">
                {selectedBranch === 'OMN'
                  ? `${Math.round(totalStockValueOMR).toLocaleString()} ر.ع`
                  : `${Math.round(totalStockValueEGP).toLocaleString()} ج.م`}
              </span>
            </div>
          </div>

          {/* CUSTOMER DEBTS RECEIVABLES CARD */}
          <div className="glass-panel p-5 glass-panel-hover border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">ديون وتحصيلات العملاء</span>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600 font-mono mt-3">
              {totalDebtsEGP.toLocaleString()} ج.م
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100 font-medium">
              <span>فرع عمان (OMR):</span>
              <span className="font-mono text-amber-700 font-extrabold">
                {totalDebtsOMR.toLocaleString()} ر.ع
              </span>
            </div>
          </div>

          {/* FOREIGN SUPPLIERS PAYABLES CARD */}
          <div className="glass-panel p-5 glass-panel-hover border-rose-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">مستحقات الموردين بالخارج</span>
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                <Ship size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-600 font-mono mt-3">
              ${totalPayablesUSD.toLocaleString()} USD
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100 font-medium">
              <span>فيتنام وإندونيسيا:</span>
              <span className="text-xs text-rose-600 font-bold">تحويلات LC/TT</span>
            </div>
          </div>

          {/* FLEET EFFICIENCY CARD */}
          <div className="glass-panel p-5 glass-panel-hover border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">متوسط تكلفة الكيلو (السيارات)</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Truck size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-3">
              4.78 ج.م / كم
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100 font-medium">
              <span>شامل الوقود والزيوت:</span>
              <span className="text-emerald-700 font-bold">كفاءة تشغيل ممتازة</span>
            </div>
          </div>
        </div>

        {/* FINANCIAL PERFORMANCE CHART & INCOMING SHIPMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SALES VS LANDED COST MONTHLY AREA CHART */}
          <div className="lg:col-span-2 glass-panel p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <TrendingUp className="text-amber-600" size={18} />
                  مؤشر الإيرادات مقابل التكلفة الواصلة وصافي الربح
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  حساب تكلفة الشراء + نولي الشحن + الجمارك مقابل إيراد البيع المحقق (ج.م)
                </p>
              </div>
              <Link
                href="/finance"
                className="text-xs text-amber-600 hover:underline font-bold flex items-center gap-1"
              >
                التقارير المفصلة
                <ChevronLeft size={14} />
              </Link>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialTrendData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`${Number(val).toLocaleString()} ج.م`, '']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    name="إجمالي المبيعات"
                    stroke="#0284c7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                  <Area
                    type="monotone"
                    dataKey="netProfit"
                    name="صافي الربح المحقق"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ACTIVE IMPORT SHIPMENTS SUMMARY */}
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Ship className="text-amber-600" size={18} />
                حركة الحاويات والاستيراد
              </h3>
              <span className="text-[11px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                {shipments.length} حاويات
              </span>
            </div>

            <div className="space-y-3">
              {shipments.slice(0, 3).map((ship) => (
                <div
                  key={ship.id}
                  className="p-3 bg-slate-50 hover:bg-amber-50/40 rounded-xl border border-slate-200 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-amber-700">
                      {ship.containerNo}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        ship.status === 'IN_WAREHOUSE'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : ship.status === 'IN_TRANSIT'
                          ? 'bg-sky-100 text-sky-800 border border-sky-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {ship.status === 'IN_WAREHOUSE'
                        ? 'بالمخزن'
                        : ship.status === 'IN_TRANSIT'
                        ? 'في البحر'
                        : 'تم الطلب'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{ship.originCountry} ➔ {ship.destinationPort.split('-')[0]}</span>
                    <span className="font-mono font-bold text-slate-700">{ship.totalVolumeM3} m³</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60 font-medium">
                    <span className="text-slate-500">التكلفة الواصلة:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      ${ship.grandTotalLandedUSD.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              ))}

              <Link
                href="/import-shipments"
                className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-1 transition shadow-sm"
              >
                عرض تفاصيل تكاليف الحاويات
                <ChevronLeft size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* RECENT INVOICES & QUICK NAVIGATION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RECENT SALES INVOICES TABLE */}
          <div className="lg:col-span-2 glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Receipt className="text-amber-600" size={18} />
                  أحدث فواتير المبيعات والتوزيع
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  فواتير البيع النقدي والآجل والأقساط والشيكات
                </p>
              </div>
              <Link
                href="/sales"
                className="text-xs text-amber-600 hover:underline font-bold flex items-center gap-1"
              >
                عرض كل الفواتير
                <ChevronLeft size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">رقم الفاتورة</th>
                    <th className="p-3">العميل</th>
                    <th className="p-3">طريقة الدفع</th>
                    <th className="p-3">الإجمالي</th>
                    <th className="p-3">المتبقي (آجل)</th>
                    <th className="p-3">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-amber-700">{inv.invoiceNumber}</td>
                      <td className="p-3 font-bold text-slate-800">
                        <p className="truncate max-w-[140px]">{inv.customerName}</p>
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] border border-slate-200 font-bold">
                          {inv.paymentType === 'CASH'
                            ? 'نقدي'
                            : inv.paymentType === 'CREDIT'
                            ? 'آجل'
                            : inv.paymentType === 'INSTALLMENT'
                            ? 'تقسيط'
                            : 'شيك'}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900">
                        {inv.totalAmount.toLocaleString()} {inv.currency}
                      </td>
                      <td className="p-3 font-mono font-bold">
                        {inv.remainingAmount > 0 ? (
                          <span className="text-rose-600">
                            {inv.remainingAmount.toLocaleString()} {inv.currency}
                          </span>
                        ) : (
                          <span className="text-emerald-600">مسدد بالكامل</span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-slate-500">{inv.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* QUICK LINKS HUB */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
              روابط الوصول السريع
            </h3>

            <div className="space-y-2">
              <Link
                href="/inventory"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                    <Boxes size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-800 group-hover:text-amber-700">
                      دليل المخزون والأسعار
                    </p>
                    <p className="text-[11px] text-slate-500">تسعير USD / EGP / OMR</p>
                  </div>
                </div>
                <ChevronLeft size={16} className="text-slate-400 group-hover:text-amber-600" />
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
                    <p className="font-bold text-xs text-slate-800 group-hover:text-rose-700">
                      حركة السيارات والعداد
                    </p>
                    <p className="text-[11px] text-slate-500">إنذار تغيير الزيت كل 1500 كم</p>
                  </div>
                </div>
                <ChevronLeft size={16} className="text-slate-400 group-hover:text-rose-600" />
              </Link>

              <Link
                href="/customers"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-800 group-hover:text-amber-700">
                      دليل العملاء والتحصيلات
                    </p>
                    <p className="text-[11px] text-slate-500">أرصدة وخطوط سير التوزيع</p>
                  </div>
                </div>
                <ChevronLeft size={16} className="text-slate-400 group-hover:text-amber-600" />
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
                    <p className="font-bold text-xs text-slate-800 group-hover:text-emerald-700">
                      التقارير وقائمة الدخل
                    </p>
                    <p className="text-[11px] text-slate-500">أرباح الحاويات والأصناف</p>
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
