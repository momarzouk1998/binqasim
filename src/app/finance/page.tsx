'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  PieChart as PieChartIcon,
  TrendingUp,
  DollarSign,
  Ship,
  Boxes,
  Truck,
  Users,
  Calendar,
  Download,
  Printer,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Layers,
  Scale,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function FinanceReportsPage() {
  const [activeTab, setActiveTab] = useState<'decision' | 'income' | 'products' | 'aging' | 'containers'>('decision');
  const [selectedCurrency, setSelectedCurrency] = useState<'EGP' | 'USD' | 'OMR'>('EGP');
  const [selectedPeriod, setSelectedPeriod] = useState<'MONTH' | 'QUARTER' | 'YEAR'>('MONTH');
  const [selectedBranch, setSelectedBranch] = useState<'ALL' | 'EGY' | 'OMN'>('ALL');

  // Multi-currency coefficients
  const usdRate = 48.5;
  const omrRate = 0.385;

  const convertAmount = (egpAmount: number) => {
    if (selectedCurrency === 'USD') return egpAmount / usdRate;
    if (selectedCurrency === 'OMR') return (egpAmount / usdRate) * omrRate;
    return egpAmount;
  };

  const currencySymbol = selectedCurrency === 'USD' ? '$' : selectedCurrency === 'OMR' ? 'ر.ع' : 'ج.م';

  // 1. REVENUE VS LANDED COST MONTHLY TREND DATA
  const monthlyFinancialData = [
    { month: 'يناير', sales: 2800000, landedCost: 1950000, operatingCost: 180000, netProfit: 670000 },
    { month: 'فبراير', sales: 3100000, landedCost: 2200000, operatingCost: 200000, netProfit: 700000 },
    { month: 'مارس', sales: 3450000, landedCost: 2400000, operatingCost: 210000, netProfit: 840000 },
    { month: 'أبريل', sales: 3200000, landedCost: 2250000, operatingCost: 195000, netProfit: 755000 },
    { month: 'مايو', sales: 3900000, landedCost: 2700000, operatingCost: 230000, netProfit: 970000 },
    { month: 'يونيو', sales: 4250000, landedCost: 2950000, operatingCost: 245000, netProfit: 1055000 },
  ];

  // 2. LANDED COST COMPOSITION DATA
  const costBreakdownData = [
    { name: 'الشراء المباشر للمورد ($)', value: 58, color: '#f59e0b' },
    { name: 'شحن الحاوية والنولي (m³)', value: 14, color: '#0284c7' },
    { name: 'الرسوم الجمركية للكيلو', value: 18, color: '#e11d48' },
    { name: 'ضريبة القيمة المضافة (14%)', value: 10, color: '#8b5cf6' },
  ];

  // 3. AGING OF RECEIVABLES DATA
  const debtAgingData = [
    { category: '0 - 30 يوم (جاري حديث)', amountEGP: 85000, count: 8, color: '#10b981' },
    { category: '31 - 60 يوم (مستحق متابعة)', amountEGP: 42000, count: 4, color: '#f59e0b' },
    { category: 'أكثر من 60 يوم (متأخر السداد)', amountEGP: 18000, count: 2, color: '#ef4444' },
  ];

  // 4. PRODUCT PROFITABILITY DATA
  const productsProfitability = [
    {
      id: 'p1',
      name: 'فحم طبيعي فاخر والشواء (درجة أولى)',
      origin: 'إندونيسيا',
      unit: 'طن',
      soldQty: 75,
      purchasePriceUSD: 420,
      landedCostEGP: 25400,
      avgSellingPriceEGP: 34000,
      unitProfitEGP: 8600,
      marginPercent: 25.3,
      totalSalesEGP: 2550000,
      totalProfitEGP: 645000,
      profitContribution: 57,
    },
    {
      id: 'p2',
      name: 'بصل أحمر درجة أولى للتصدير',
      origin: 'مصر (صادر عُمان)',
      unit: 'طن',
      soldQty: 48,
      purchasePriceUSD: 360,
      landedCostEGP: 20200,
      avgSellingPriceEGP: 27500,
      unitProfitEGP: 7300,
      marginPercent: 26.5,
      totalSalesEGP: 1320000,
      totalProfitEGP: 350400,
      profitContribution: 31,
    },
    {
      id: 'p3',
      name: 'توابل وفلفل أسود فاخر (فيتنامي)',
      origin: 'فيتنام',
      unit: 'كجم',
      soldQty: 2200,
      purchasePriceUSD: 4.8,
      landedCostEGP: 275,
      avgSellingPriceEGP: 340,
      unitProfitEGP: 65,
      marginPercent: 19.1,
      totalSalesEGP: 748000,
      totalProfitEGP: 143000,
      profitContribution: 12,
    },
  ];

  // 5. CONTAINERS PERFORMANCE DATA
  const containerPerformance = [
    {
      containerCode: 'CONT-68M3-INDO-2026',
      origin: 'إندونيسيا (Jakarta)',
      volumeUsed: '68 / 68 m³ (100%)',
      itemsCount: '25 طن فحم + 12 طن بصل',
      totalLandedCostEGP: 1420000,
      realizedSalesEGP: 1890000,
      netProfitEGP: 470000,
      roiPercent: 33.1,
      status: 'تم البيع والتوزيع بالكامل',
    },
    {
      containerCode: 'CONT-68M3-VN-2026',
      origin: 'فيتنام (Ho Chi Minh)',
      volumeUsed: '62 / 68 m³ (91%)',
      itemsCount: '4.5 طن توابل + 20 طن فحم',
      totalLandedCostEGP: 1280000,
      realizedSalesEGP: 1690000,
      netProfitEGP: 410000,
      roiPercent: 32.0,
      status: 'قيد التوزيع (متبقي 20%)',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* EXECUTIVE HEADER WITH CONTROLS */}
        <div className="glass-panel p-6 bg-gradient-to-r from-amber-500/10 via-white to-sky-500/10 border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-500 text-white font-extrabold px-2.5 py-0.5 rounded-md shadow-sm">
                  مركز دعم القرار المالي
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                  شركة بي قاسم للاستيراد والتصدير
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-2 flex items-center gap-2">
                <BarChart3 className="text-amber-600" />
                التقارير المالية والتحليلات الاستراتيجية للأرباح
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                تحليل ربحية الحاويات المستوردة، تكلفة الكيلو والطن واصل للمخازن، قائمة الدخل الموحدة، وحركة التدفقات النقدية لاتخاذ قرارات تسعير وشحن فورية.
              </p>
            </div>

            {/* CURRENCY & FILTER SWITCHERS */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Currency Selector */}
              <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center shadow-sm text-xs font-bold">
                <button
                  onClick={() => setSelectedCurrency('EGP')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    selectedCurrency === 'EGP' ? 'bg-amber-500 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🇪🇬 ج.م (EGP)
                </button>
                <button
                  onClick={() => setSelectedCurrency('USD')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    selectedCurrency === 'USD' ? 'bg-amber-500 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  💵 دولار ($)
                </button>
                <button
                  onClick={() => setSelectedCurrency('OMR')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    selectedCurrency === 'OMR' ? 'bg-amber-500 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🇴🇲 ر.ع (OMR)
                </button>
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-sm transition"
              >
                <Printer size={16} className="text-amber-600" />
                طباعة التقرير الرسمي
              </button>
            </div>
          </div>
        </div>

        {/* TOP LEVEL NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('decision')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap -mb-[5px] ${
              activeTab === 'decision'
                ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles size={16} className="text-amber-600" />
            لوحة مؤشرات الأداء والأرباح
          </button>

          <button
            onClick={() => setActiveTab('income')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap -mb-[5px] ${
              activeTab === 'income'
                ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Scale size={16} className="text-amber-600" />
            قائمة الدخل والأرباح والخسائر (P&L)
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap -mb-[5px] ${
              activeTab === 'products'
                ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Boxes size={16} className="text-amber-600" />
            مصفوفة ربحية الأصناف وتكلفة الكيلو
          </button>

          <button
            onClick={() => setActiveTab('containers')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap -mb-[5px] ${
              activeTab === 'containers'
                ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Ship size={16} className="text-amber-600" />
            تحليل عائد وربحية الحاويات المستوردة
          </button>

          <button
            onClick={() => setActiveTab('aging')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap -mb-[5px] ${
              activeTab === 'aging'
                ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock size={16} className="text-amber-600" />
            أعمار الديون والتدفقات النقدية
          </button>
        </div>

        {/* TAB 1: EXECUTIVE DECISION DASHBOARD */}
        {activeTab === 'decision' && (
          <div className="space-y-6">
            {/* TOP 4 STRATEGIC FINANCIAL KPIS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-5 border-emerald-200 bg-emerald-50/20 glass-panel-hover">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">صافي الأرباح المحققة (Net Profit)</span>
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-700 font-mono mt-3">
                  {Math.round(convertAmount(1138400)).toLocaleString()} {currencySymbol}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
                  <span>هامش صافي الربح:</span>
                  <span className="font-bold text-emerald-700 font-mono">24.7%</span>
                </div>
              </div>

              <div className="glass-panel p-5 border-amber-200 bg-amber-50/20 glass-panel-hover">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">العائد على الاستثمار للحاويات (ROI)</span>
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <Ship size={20} />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-700 font-mono mt-3">
                  32.6% ROI
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
                  <span>فيتنام وإندونيسيا:</span>
                  <span className="font-bold text-amber-700">عائد دورة الشحن</span>
                </div>
              </div>

              <div className="glass-panel p-5 border-sky-200 bg-sky-50/20 glass-panel-hover">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">إجمالي إيرادات المبيعات</span>
                  <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                    <DollarSign size={20} />
                  </div>
                </div>
                <div className="text-2xl font-black text-sky-800 font-mono mt-3">
                  {Math.round(convertAmount(4618000)).toLocaleString()} {currencySymbol}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
                  <span>مصر (EGP) وعمان (OMR):</span>
                  <span className="font-bold text-sky-700">نمو +18%</span>
                </div>
              </div>

              <div className="glass-panel p-5 border-purple-200 bg-purple-50/20 glass-panel-hover">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">كفاءة تشغيل الأسطول (تكلفة/كم)</span>
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <Truck size={20} />
                  </div>
                </div>
                <div className="text-2xl font-black text-purple-800 font-mono mt-3">
                  4.78 ج.م / كم
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
                  <span>شامل الوقود والزيوت:</span>
                  <span className="font-bold text-purple-700">ضمن المعيار الأمثل</span>
                </div>
              </div>
            </div>

            {/* VISUAL CHARTS ROW: SALES TREND & COST PIE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* REVENUE VS COSTS BAR/AREA CHART */}
              <div className="lg:col-span-2 glass-panel p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <TrendingUp className="text-amber-600" size={18} />
                      تطور الإيرادات والمبيعات مقابل التكاليف الواصلة وصافي الأرباح
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      مقارنة شهرية لتكلفة الشحن والجمرك مقابل الإيراد المحقق ({currencySymbol})
                    </p>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                    النصف الأول 2026
                  </span>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyFinancialData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickFormatter={(val) => `${Math.round(convertAmount(val) / 1000)}k`}
                      />
                      <Tooltip
                        formatter={(value: any) => [
                          `${Math.round(convertAmount(Number(value))).toLocaleString()} ${currencySymbol}`,
                          '',
                        ]}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="sales" name="إجمالي المبيعات" fill="#0284c7" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="landedCost" name="التكلفة الواصلة (شراء+شحن+جمرك)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="netProfit" name="صافي الربح" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* LANDED COST COMPOSITION PIE CHART */}
              <div className="glass-panel p-5 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Layers className="text-amber-600" size={18} />
                    هيكل توزيع تكلفة الحاوية الواصلة
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    النسبة المئوية لعناصر التكلفة المباشرة وغير المباشرة
                  </p>
                </div>

                <div className="h-56 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => [`${val}%`, 'النسبة من التكلفة']}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1.5 text-xs">
                  {costBreakdownData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-mono font-bold text-slate-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: P&L INCOME STATEMENT */}
        {activeTab === 'income' && (
          <div className="glass-panel p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <Scale className="text-amber-600" />
                  قائمة الدخل والأرباح والخسائر الشاملة (Profit & Loss Statement)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تفصيل الإيرادات، تكلفة البضاعة المباعة (شراء + نولي بحري + جمارك + ضرائب)، ومصاريف التشغيل
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedBranch}
                  onChange={(e: any) => setSelectedBranch(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">🌐 القوائم المالية الموحدة (مصر + عمان)</option>
                  <option value="EGY">🇪🇬 فرع مصر فقط (EGP)</option>
                  <option value="OMN">🇴🇲 فرع سلطنة عمان فقط (OMR)</option>
                </select>
              </div>
            </div>

            {/* STRUCTURED P&L TABLE */}
            <div className="space-y-4 text-xs font-medium">
              {/* SECTION 1: REVENUES */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2">
                  <span>1. إجمالي إيرادات المبيعات (Gross Revenues)</span>
                  <span className="font-mono text-sky-700 text-base">
                    {Math.round(convertAmount(4618000)).toLocaleString()} {currencySymbol}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pr-4">
                  <span>• مبيعات الفحم الطبيعي والشواء</span>
                  <span className="font-mono font-bold">
                    {Math.round(convertAmount(2550000)).toLocaleString()} {currencySymbol}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pr-4">
                  <span>• مبيعات البصل الأحمر الصادر</span>
                  <span className="font-mono font-bold">
                    {Math.round(convertAmount(1320000)).toLocaleString()} {currencySymbol}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pr-4">
                  <span>• مبيعات التوابل والفلفل الأسود</span>
                  <span className="font-mono font-bold">
                    {Math.round(convertAmount(748000)).toLocaleString()} {currencySymbol}
                  </span>
                </div>
              </div>

              {/* SECTION 2: COST OF GOODS SOLD (COGS) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between font-extrabold text-sm text-rose-800 border-b border-slate-200 pb-2">
                  <span>2. تكلفة البضاعة المباعة الواصلة (Cost of Goods Sold - COGS)</span>
                  <span className="font-mono text-rose-700 text-base">
                    ({Math.round(convertAmount(3279600)).toLocaleString()} {currencySymbol})
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pr-4">
                  <span>• تكلفة الشراء المباشر من الموردين بالخارج (USD)</span>
                  <span className="font-mono">
                    {Math.round(convertAmount(1902000)).toLocaleString()} {currencySymbol}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pr-4">
                  <span>• نولي الشحن البحري للحاويات (متر مكعب m³)</span>
                  <span className="font-mono text-sky-700">
                    {Math.round(convertAmount(459000)).toLocaleString()} {currencySymbol}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pr-4">
                  <span>• الرسوم والتعريفة الجمركية للبضائع</span>
                  <span className="font-mono text-amber-700">
                    {Math.round(convertAmount(590000)).toLocaleString()} {currencySymbol}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pr-4">
                  <span>• ضريبة القيمة المضافة / المبيعات المدفوعة</span>
                  <span className="font-mono text-purple-700">
                    {Math.round(convertAmount(328600)).toLocaleString()} {currencySymbol}
                  </span>
                </div>
              </div>

              {/* GROSS PROFIT HIGHLIGHT */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 flex justify-between items-center">
                <div>
                  <span className="font-black text-sm text-amber-900 block">مجمل الربح التجاري (Gross Profit)</span>
                  <span className="text-[11px] text-amber-700 font-bold">هامش مجمل الربح: 29.0%</span>
                </div>
                <span className="font-mono font-black text-xl text-amber-800">
                  {Math.round(convertAmount(1338400)).toLocaleString()} {currencySymbol}
                </span>
              </div>

              {/* SECTION 3: OPERATING EXPENSES (OPEX) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2">
                  <span>3. المصروفات التشغيلية والإدارية (OPEX)</span>
                  <span className="font-mono text-rose-700 text-base">
                    ({Math.round(convertAmount(200000)).toLocaleString()} {currencySymbol})
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pr-4">
                  <span>• وقود وصيانة أسطول سيارات التوزيع وتغيير الزيت</span>
                  <span className="font-mono">
                    {Math.round(convertAmount(85000)).toLocaleString()} {currencySymbol}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pr-4">
                  <span>• رواتب وأجور السائقين والموظفين والبدلات</span>
                  <span className="font-mono">
                    {Math.round(convertAmount(95000)).toLocaleString()} {currencySymbol}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pr-4">
                  <span>• مصاريف إدارية وبنكية وعمولات تحويل LC/TT</span>
                  <span className="font-mono">
                    {Math.round(convertAmount(20000)).toLocaleString()} {currencySymbol}
                  </span>
                </div>
              </div>

              {/* NET PROFIT FINAL ROW */}
              <div className="bg-emerald-50 p-5 rounded-2xl border-2 border-emerald-300 flex justify-between items-center shadow-sm">
                <div>
                  <span className="font-black text-base text-emerald-900 block">
                    صافي الأرباح الصافية القابلة للتوزيع (Net Profit)
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">
                    هامش صافي الربح الحقيقي: 24.7%
                  </span>
                </div>
                <span className="font-mono font-black text-2xl text-emerald-700">
                  {Math.round(convertAmount(1138400)).toLocaleString()} {currencySymbol}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCT PROFITABILITY MATRIX */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="glass-panel p-4 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Boxes className="text-amber-600" />
                  مصفوفة تحليل ربحية الأصناف وتكلفة الكيلو والطن واصل
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  حساب سعر الواصل الحقيقي لكل صنف، سعر البيع المحقق، وصافي هامش الربح
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {productsProfitability.map((p) => (
                <div key={p.id} className="glass-panel p-5 space-y-3 border-slate-200 glass-panel-hover">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold">المنشأ: {p.origin}</span>
                      <h4 className="font-black text-sm text-slate-900 mt-0.5">{p.name}</h4>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-black">
                      +{p.marginPercent}% هامش
                    </span>
                  </div>

                  <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">الكمية المباعة:</span>
                      <span className="font-mono font-bold text-slate-800">{p.soldQty} {p.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">التكلفة الواصلة للوحدة:</span>
                      <span className="font-mono font-bold text-rose-600">
                        {Math.round(convertAmount(p.landedCostEGP)).toLocaleString()} {currencySymbol} / {p.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">متوسط سعر البيع للوحدة:</span>
                      <span className="font-mono font-bold text-sky-700">
                        {Math.round(convertAmount(p.avgSellingPriceEGP)).toLocaleString()} {currencySymbol} / {p.unit}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                      <span className="text-slate-700">ربح الوحدة الواحدة:</span>
                      <span className="font-mono text-emerald-700 font-extrabold">
                        +{Math.round(convertAmount(p.unitProfitEGP)).toLocaleString()} {currencySymbol} / {p.unit}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">إجمالي أرباح الصنف:</span>
                    <span className="font-mono font-black text-base text-emerald-700">
                      {Math.round(convertAmount(p.totalProfitEGP)).toLocaleString()} {currencySymbol}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* PRODUCT CONTRIBUTION TABLE */}
            <div className="glass-panel overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h4 className="font-extrabold text-xs text-slate-800">
                  جدول المساهمة النسبية في إجمالي الأرباح التجارية:
                </h4>
              </div>
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3.5">اسم الصنف</th>
                    <th className="p-3.5">إجمالي المبيعات</th>
                    <th className="p-3.5">التكلفة الواصلة</th>
                    <th className="p-3.5">صافي الأرباح</th>
                    <th className="p-3.5">نسبة المساهمة في الأرباح</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productsProfitability.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{p.name}</td>
                      <td className="p-3.5 font-mono text-slate-800">
                        {Math.round(convertAmount(p.totalSalesEGP)).toLocaleString()} {currencySymbol}
                      </td>
                      <td className="p-3.5 font-mono text-rose-600">
                        {Math.round(convertAmount(p.totalSalesEGP - p.totalProfitEGP)).toLocaleString()} {currencySymbol}
                      </td>
                      <td className="p-3.5 font-mono font-extrabold text-emerald-700 text-sm">
                        +{Math.round(convertAmount(p.totalProfitEGP)).toLocaleString()} {currencySymbol}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{ width: `${p.profitContribution}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-700 w-10 text-left">
                            {p.profitContribution}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CONTAINER YIELD & ROI */}
        {activeTab === 'containers' && (
          <div className="space-y-6">
            <div className="glass-panel p-4">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Ship className="text-amber-600" />
                تحليل أداء وعائد الحاويات المستوردة (Container ROI & Yield)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تتبع ربحية كل بوليصة شحن مستوردة من فيتنام وإندونيسيا من تاريخ فتح الاعتماد حتى البيع النهائي
              </p>
            </div>

            <div className="space-y-4">
              {containerPerformance.map((c, idx) => (
                <div key={idx} className="glass-panel p-5 space-y-4 border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                        {c.origin}
                      </span>
                      <h4 className="font-mono font-black text-base text-amber-700 mt-1">
                        {c.containerCode}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{c.itemsCount}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <span className="text-[11px] text-slate-400 block">العائد على الاستثمار:</span>
                        <span className="font-mono font-black text-emerald-700 text-lg">
                          +{c.roiPercent}% ROI
                        </span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold">
                        {c.status}
                      </span>
                    </div>
                  </div>

                  {/* FINANCIAL METRICS GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-500 block">استغلال حجم الحاوية:</span>
                      <span className="font-mono font-bold text-sky-700 text-sm">{c.volumeUsed}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">التكلفة الواصلة الكلية:</span>
                      <span className="font-mono font-bold text-rose-600 text-sm">
                        {Math.round(convertAmount(c.totalLandedCostEGP)).toLocaleString()} {currencySymbol}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">إجمالي إيراد المبيعات:</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {Math.round(convertAmount(c.realizedSalesEGP)).toLocaleString()} {currencySymbol}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">صافي ربح الحاوية:</span>
                      <span className="font-mono font-black text-emerald-700 text-base">
                        +{Math.round(convertAmount(c.netProfitEGP)).toLocaleString()} {currencySymbol}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DEBT AGING & CASH FLOW */}
        {activeTab === 'aging' && (
          <div className="space-y-6">
            <div className="glass-panel p-4">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Clock className="text-amber-600" />
                تحليل أعمار ديون العملاء والتدفقات النقدية المتوقعة
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                توزيع المستحقات المالية حسب فترات التأخير لضمان السيولة النقدية وسداد التزامات الموردين بالخارج
              </p>
            </div>

            {/* AGING BUCKETS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {debtAgingData.map((d, i) => (
                <div
                  key={i}
                  className="glass-panel p-5 space-y-2 border-slate-200"
                  style={{ borderTop: `4px solid ${d.color}` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-700">{d.category}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                      {d.count} عملاء
                    </span>
                  </div>
                  <div className="text-2xl font-black font-mono mt-2" style={{ color: d.color }}>
                    {Math.round(convertAmount(d.amountEGP)).toLocaleString()} {currencySymbol}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    مستحقات للتحصيل في هذه الشريحة الزمنية
                  </p>
                </div>
              ))}
            </div>

            {/* CASH FLOW PROJECTION CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-5 space-y-3 border-emerald-200 bg-emerald-50/20">
                <h4 className="font-extrabold text-sm text-emerald-900 flex items-center gap-2 border-b border-emerald-200 pb-2">
                  <ArrowDownLeft className="text-emerald-600" size={18} />
                  التدفقات النقدية المتوقعة للداخل (Inflows - 30 يوم)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">شيكات بنكية مستحقة القبض:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {Math.round(convertAmount(48000)).toLocaleString()} {currencySymbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">أقساط عملاء مستحقة التحصيل:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {Math.round(convertAmount(85000)).toLocaleString()} {currencySymbol}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-emerald-200 font-extrabold text-sm">
                    <span className="text-emerald-900">إجمالي السيولة الداخلة:</span>
                    <span className="font-mono text-emerald-700">
                      {Math.round(convertAmount(133000)).toLocaleString()} {currencySymbol}
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-5 space-y-3 border-rose-200 bg-rose-50/20">
                <h4 className="font-extrabold text-sm text-rose-900 flex items-center gap-2 border-b border-rose-200 pb-2">
                  <ArrowUpRight className="text-rose-600" size={18} />
                  الالتزامات النقدية المتوقعة للخارج (Outflows - 30 يوم)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">تحويلات بنكية دولية للموردين (LC/TT):</span>
                    <span className="font-mono font-bold text-rose-600">
                      {Math.round(convertAmount(727500)).toLocaleString()} {currencySymbol} ($15,000)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">رواتب الموظفين والسائقين:</span>
                    <span className="font-mono font-bold text-rose-600">
                      {Math.round(convertAmount(60000)).toLocaleString()} {currencySymbol}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-rose-200 font-extrabold text-sm">
                    <span className="text-rose-900">إجمالي الالتزامات الواجبة:</span>
                    <span className="font-mono text-rose-700">
                      {Math.round(convertAmount(787500)).toLocaleString()} {currencySymbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
