'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import {
  Settings,
  DollarSign,
  Building2,
  Database,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  Server,
  Globe,
  Lock,
  Sparkles
} from 'lucide-react';

export default function SettingsPage() {
  const {
    usdToEgpRate,
    setUsdToEgpRate,
    usdToOmrRate,
    setUsdToOmrRate,
    selectedBranch,
    setSelectedBranch,
    resetAllData,
  } = useApp();

  const [egpRateInput, setEgpRateInput] = useState(usdToEgpRate.toString());
  const [omrRateInput, setOmrRateInput] = useState(usdToOmrRate.toString());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    const egp = parseFloat(egpRateInput) || 48.5;
    const omr = parseFloat(omrRateInput) || 0.385;

    setUsdToEgpRate(egp);
    setUsdToOmrRate(omr);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* PAGE HEADER */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="text-amber-600" />
            إعدادات النظام وأسعار الصرف وقاعدة البيانات
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة أسعار العملات الحاكمة ($ USD / EGP / OMR)، الفروع، وبيانات السيرفر على ديجيتال أوشن (DigitalOcean).
          </p>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 size={18} />
            تم حفظ وتحديث أسعار الصرف وإعدادات الفروع بنجاح وتطبيقها فورياً على كل شاشات وحسابات النظام!
          </div>
        )}

        {/* SECTION 1: LIVE EXCHANGE RATES */}
        <div className="glass-panel p-6 space-y-4 border-amber-200 bg-amber-50/20">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <DollarSign className="text-amber-600" size={18} />
                معاملات تحويل العملات الأجنبية الحاكمة
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تُستخدم هذه المعاملات في تقييم المخزون، حساب نولي الشحن، وتسعير الفواتير
              </p>
            </div>
            <span className="text-xs bg-amber-500 text-white font-extrabold px-3 py-1 rounded-full shadow-sm">
              تحديث فوري
            </span>
          </div>

          <form onSubmit={handleSaveRates} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <label className="block text-slate-700 font-extrabold">
                  🇪🇬 سعر صرف الدولار الأمريكي مقابل الجنيه المصري (USD / EGP)
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-500 text-sm">$1 =</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={egpRateInput}
                    onChange={(e) => setEgpRateInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono font-black text-emerald-700 text-base focus:outline-none focus:border-amber-500"
                  />
                  <span className="font-bold text-slate-600">ج.م</span>
                </div>
                <p className="text-[11px] text-slate-400">السعر المعتمد لفرع جمهورية مصر العربية</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <label className="block text-slate-700 font-extrabold">
                  🇴🇲 سعر صرف الدولار الأمريكي مقابل الريال العماني (USD / OMR)
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-500 text-sm">$1 =</span>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={omrRateInput}
                    onChange={(e) => setOmrRateInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono font-black text-sky-700 text-base focus:outline-none focus:border-amber-500"
                  />
                  <span className="font-bold text-slate-600">ر.ع</span>
                </div>
                <p className="text-[11px] text-slate-400">السعر المعتمد لفرع سلطنة عمان</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl flex items-center gap-2 transition shadow-md shadow-amber-500/20"
              >
                <Save size={16} />
                حفظ وتطبيق أسعار الصرف
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 2: DIGITALOCEAN INFRASTRUCTURE STATUS */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Server className="text-amber-600" size={18} />
            حالة السيرفر وقاعدة البيانات (DigitalOcean Droplet & PostgreSQL)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block">عنوان السيرفر (Droplet IP):</span>
              <span className="font-mono font-black text-slate-900 text-sm">64.226.118.40</span>
              <span className="text-[10px] text-emerald-600 font-bold block flex items-center gap-1">
                <CheckCircle2 size={11} /> متصل ونشط
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block">محرك قاعدة البيانات:</span>
              <span className="font-mono font-black text-slate-900 text-sm">PostgreSQL 16 (DB)</span>
              <span className="text-[10px] text-slate-500 font-bold block">
                binqasim@localhost:5432
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block">النطاق والشهادة الأمنية:</span>
              <span className="font-mono font-black text-slate-900 text-sm">binqasim.openappo.com</span>
              <span className="text-[10px] text-emerald-600 font-bold block flex items-center gap-1">
                <ShieldCheck size={11} /> SSL Let's Encrypt
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: DEMO DATA RESTORE */}
        <div className="glass-panel p-6 space-y-3 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <RotateCcw className="text-amber-600" size={18} />
                تحديث واستعادة البيانات النموذجية (Demo Mode)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                إعادة ضبط كافة أقسام النظام ببيانات واقعية شاملة (فحم، شحنات، فواتير، أسطول) لتصوير وعرض الفيديو التوضيحي.
              </p>
            </div>

            <button
              onClick={() => setShowResetModal(true)}
              className="bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-300 hover:border-amber-400 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              استعادة البيانات الآن
            </button>
          </div>
        </div>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-black text-base text-slate-900">تأكيد استعادة البيانات النموذجية؟</h3>
            <p className="text-xs text-slate-600">
              سيتم إعادة تحميل وتحديث كافة الجداول ببيانات شركة بي قاسم للتصوير والعرض.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setShowResetModal(false);
                  window.location.reload();
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow"
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
