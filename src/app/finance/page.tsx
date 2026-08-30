'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PieChart, TrendingUp, DollarSign, FileText, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'income' | 'balance' | 'cashflow'>('income');

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-amber-400 flex items-center gap-2">
              <PieChart className="text-amber-500" />
              التقارير المالية والتحليلات الإدارية
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              قائمة الدخل (Profit & Loss)، ميزان المراجعة، والتدفقات النقدية لحساب أرباح شركة بي قاسم.
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
          <button
            onClick={() => setActiveTab('income')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 -mb-[5px] ${
              activeTab === 'income'
                ? 'border-amber-400 text-amber-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 قائمة الدخل (الأرباح والخسائر)
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 -mb-[5px] ${
              activeTab === 'balance'
                ? 'border-amber-400 text-amber-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🏛️ ميزان المراجعة
          </button>
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 -mb-[5px] ${
              activeTab === 'cashflow'
                ? 'border-amber-400 text-amber-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            💸 التدفقات النقدية (Cash Flow)
          </button>
        </div>

        {/* INCOME STATEMENT */}
        {activeTab === 'income' && (
          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-100 border-b border-slate-800 pb-3">
              قائمة الدخل التقديرية (ملخص نشاط الاستيراد والتوزيع)
            </h3>

            <div className="space-y-2 text-xs divide-y divide-slate-800">
              <div className="flex justify-between py-2">
                <span className="font-bold text-slate-200">إجمالي إيرادات المبيعات (مصر وعمان)</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">4,250,000 ج.م</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-slate-400">تكلفة البضاعة المبيعة (شراء + نولي شحن + جمرك + ضريبة)</span>
                <span className="font-mono text-rose-400">(3,120,000 ج.م)</span>
              </div>

              <div className="flex justify-between py-3 font-bold bg-slate-900/60 px-3 rounded-xl border border-slate-800">
                <span className="text-amber-400">مجمل الربح الإجمالي (Gross Profit)</span>
                <span className="font-mono text-amber-400 text-base font-extrabold">1,130,000 ج.م</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-slate-400">مصروفات النقل والوقود وصيانة السيارات</span>
                <span className="font-mono text-rose-400">(85,000 ج.م)</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-slate-400">الرواتب والأجور والبدلات</span>
                <span className="font-mono text-rose-400">(60,000 ج.م)</span>
              </div>

              <div className="flex justify-between py-3 font-extrabold bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/40 text-sm">
                <span className="text-emerald-300">صافي الربح النهائي (Net Profit)</span>
                <span className="font-mono text-emerald-400 text-lg font-black">985,000 ج.م</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
