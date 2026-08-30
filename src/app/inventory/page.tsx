'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Boxes, DollarSign, Search, Plus, TrendingUp, AlertTriangle } from 'lucide-react';

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [items] = useState([
    {
      id: 'item-1',
      nameAr: 'فحم طبيعي للشيشة والشواء (درجة أولى)',
      nameEn: 'Premium Charcoal',
      category: 'فحم',
      unit: 'TON',
      basePriceUSD: 450,
      priceEGP: 26500,
      priceOMR: 195,
      stockQuantity: 120,
    },
    {
      id: 'item-2',
      nameAr: 'بصل أحمر درجة أولى للتصدير',
      nameEn: 'Red Onions Export Grade',
      category: 'خضروات مصدّرة',
      unit: 'TON',
      basePriceUSD: 380,
      priceEGP: 22000,
      priceOMR: 160,
      stockQuantity: 85,
    },
    {
      id: 'item-3',
      nameAr: 'توابل وفلفل أسود فاخر (فيتنامي)',
      nameEn: 'Vietnamese Black Pepper',
      category: 'توابل واستيراد',
      unit: 'KG',
      basePriceUSD: 4.8,
      priceEGP: 280,
      priceOMR: 2.1,
      stockQuantity: 4500,
    },
  ]);

  const filteredItems = items.filter(
    (i) =>
      (i.nameAr.includes(search) || i.nameEn.toLowerCase().includes(search.toLowerCase())) &&
      (categoryFilter === 'all' || i.category === categoryFilter)
  );

  const totalValueUSD = filteredItems.reduce(
    (sum, i) => sum + i.stockQuantity * i.basePriceUSD,
    0
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-amber-400 flex items-center gap-2">
              <Boxes className="text-amber-500" />
              إدارة المخزون وتقييم العملات الأجنبية
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              تسعير البضائع بالدولار ($ USD)، الجنيه المصري (EGP)، والريال العماني (OMR).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition">
              <Plus size={16} />
              إضافة صنف جديد
            </button>
          </div>
        </div>

        {/* KPI STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="glass-panel p-4">
            <div className="text-xs font-semibold text-slate-400">إجمالي قيمة المخزون الحاكم (USD)</div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">
              ${totalValueUSD.toLocaleString()} USD
            </div>
            <div className="text-[11px] text-slate-500 mt-1">مقيمة بالعملة الأجنبية الحاكمة</div>
          </div>

          <div className="glass-panel p-4 border-emerald-500/30">
            <div className="text-xs font-semibold text-slate-400">القيمة بالجنيه المصري (EGP)</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              {(totalValueUSD * 48.5).toLocaleString()} ج.م
            </div>
            <div className="text-[11px] text-emerald-500/80 mt-1">معامل التحويل: 48.5 ج.م</div>
          </div>

          <div className="glass-panel p-4 border-sky-500/30">
            <div className="text-xs font-semibold text-slate-400">القيمة بالريال العماني (OMR)</div>
            <div className="text-2xl font-black text-sky-400 font-mono mt-1">
              {(totalValueUSD * 0.385).toLocaleString()} ر.ع
            </div>
            <div className="text-[11px] text-sky-500/80 mt-1">معامل التحويل: 0.385 ر.ع</div>
          </div>
        </div>

        {/* ITEMS CATALOG TABLE */}
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">اسم الصنف والتصنيف</th>
                <th className="p-3.5">الوحدة</th>
                <th className="p-3.5">الرصيد المتاح</th>
                <th className="p-3.5">السعر الأساسي ($ USD)</th>
                <th className="p-3.5">سعر مصر (EGP)</th>
                <th className="p-3.5">سعر عمان (OMR)</th>
                <th className="p-3.5">إجمالي القيمة ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-100">
                    <p className="font-extrabold">{item.nameAr}</p>
                    <p className="text-[10px] text-slate-400">{item.nameEn}</p>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">{item.unit}</td>
                  <td className="p-3.5 font-mono font-bold text-amber-400 text-sm">
                    {item.stockQuantity.toLocaleString()} {item.unit}
                  </td>
                  <td className="p-3.5 font-mono text-slate-200">${item.basePriceUSD}</td>
                  <td className="p-3.5 font-mono text-emerald-400">{item.priceEGP.toLocaleString()} ج.م</td>
                  <td className="p-3.5 font-mono text-sky-400">{item.priceOMR.toLocaleString()} ر.ع</td>
                  <td className="p-3.5 font-mono font-bold text-amber-400">
                    ${(item.stockQuantity * item.basePriceUSD).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
