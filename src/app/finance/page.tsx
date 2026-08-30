'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PieChart } from 'lucide-react';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'income' | 'balance' | 'cashflow'>('income');

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <PieChart className="text-amber-600" />
              التقارير المالية والتحليلات الإدارية
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              قائمة الدخل (Profit & Loss)، ميزان المراجعة، والتدفقات النقدية لحساب أرباح شركة بي قاسم.
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <button
            onClick={() => setActiveTab('income')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 -mb-[5px] ${
              activeTab === 'income'
                ? 'border-amber-500 text-amber-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            📊 قائمة الدخل (الأرباح والخسائر)
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 -mb-[5px] ${
              activeTab === 'balance'
                ? 'border-amber-500 text-amber-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            🏛️ ميزان المراجعة
          </button>
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 -mb-[5px] ${
              activeTab === 'cashflow'
                ? 'border-amber-500 text-amber-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            💸 التدفقات النقدية (Cash Flow)
          </button>
        </div>

        {/* INCOME STATEMENT */}
        {activeTab === 'income' && (
          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              قائمة الدخل التقديرية (ملخص نشاط الاستيراد والتوزيع)
            </h3>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-2">
                <span className="font-bold text-slate-800">إجمالي إيرادات المبيعات (مصر وعمان)</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">4,250,000 ج.م</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-slate-500">تكلفة البضاعة المبيعة (شراء + نولي شحن + جمرك + ضريبة)</span>
                <span className="font-mono text-rose-600 font-bold">(3,120,000 ج.م)</span>
              </div>

              <div className="flex justify-between py-3 font-bold bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                <span className="text-amber-800">مجمل الربح الإجمالي (Gross Profit)</span>
                <span className="font-mono text-amber-700 text-base font-extrabold">1,130,000 ج.م</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-slate-500">مصروفات النقل والوقود وصيانة السيارات</span>
                <span className="font-mono text-rose-600 font-bold">(85,000 ج.م)</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-slate-500">الرواتب والأجور والبدلات</span>
                <span className="font-mono text-rose-600 font-bold">(60,000 ج.م)</span>
              </div>

              <div className="flex justify-between py-3 font-extrabold bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-sm">
                <span className="text-emerald-800">صافي الربح النهائي (Net Profit)</span>
                <span className="font-mono text-emerald-700 text-lg font-black">985,000 ج.م</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
