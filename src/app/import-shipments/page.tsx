'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Ship,
  Calculator,
  Plus,
  Trash2,
  DollarSign,
  Boxes
} from 'lucide-react';

export default function ImportShipmentsPage() {
  const [containerNo, setContainerNo] = useState('CONT-68M3-INDO-2026');
  const [originCountry, setOriginCountry] = useState('إندونيسيا');
  const [totalVolumeM3, setTotalVolumeM3] = useState<number>(68);
  const [totalFreightUSD, setTotalFreightUSD] = useState<number>(3200);
  const [salesTaxPercent, setSalesTaxPercent] = useState<number>(14);
  const [usdToEgpRate, setUsdToEgpRate] = useState<number>(48.5);

  const [items, setItems] = useState([
    {
      id: 1,
      name: 'فحم طبيعي فاخر والشواء',
      quantityTons: 25,
      volumeM3: 50,
      purchasePriceUSDPerTon: 420,
      customsTariffPerKgEGP: 10,
    },
    {
      id: 2,
      name: 'قوالب فحم جوز الهند المضغوط (إندونيسي)',
      quantityTons: 12,
      volumeM3: 18,
      purchasePriceUSDPerTon: 520,
      customsTariffPerKgEGP: 12,
    },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemVol, setNewItemVol] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemTariff, setNewItemTariff] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemQty) return;
    const newItem = {
      id: Date.now(),
      name: newItemName,
      quantityTons: parseFloat(newItemQty) || 1,
      volumeM3: parseFloat(newItemVol) || 5,
      purchasePriceUSDPerTon: parseFloat(newItemPrice) || 300,
      customsTariffPerKgEGP: parseFloat(newItemTariff) || 10,
    };
    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemQty('');
    setNewItemVol('');
    setNewItemPrice('');
    setNewItemTariff('');
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const totalAllocatedVolumeM3 = items.reduce((sum, i) => sum + i.volumeM3, 0);
  const totalDirectPurchaseUSD = items.reduce(
    (sum, i) => sum + i.quantityTons * i.purchasePriceUSDPerTon,
    0
  );

  const calculatedItems = items.map((item) => {
    const itemDirectUSD = item.quantityTons * item.purchasePriceUSDPerTon;
    const volumeRatio = totalAllocatedVolumeM3 > 0 ? item.volumeM3 / totalAllocatedVolumeM3 : 0;
    const itemFreightUSD = totalFreightUSD * volumeRatio;

    const quantityKg = item.quantityTons * 1000;
    const itemCustomsEGP = quantityKg * item.customsTariffPerKgEGP;
    const itemCustomsUSD = itemCustomsEGP / usdToEgpRate;

    const itemSubtotalEGP = (itemDirectUSD + itemFreightUSD) * usdToEgpRate + itemCustomsEGP;
    const itemVatEGP = itemSubtotalEGP * (salesTaxPercent / 100);
    const itemVatUSD = itemVatEGP / usdToEgpRate;

    const totalIndirectUSD = itemFreightUSD + itemCustomsUSD + itemVatUSD;
    const totalLandedUSD = itemDirectUSD + totalIndirectUSD;
    const totalLandedEGP = totalLandedUSD * usdToEgpRate;

    const unitLandedUSDPerTon = item.quantityTons > 0 ? totalLandedUSD / item.quantityTons : 0;
    const unitLandedEGPPerTon = item.quantityTons > 0 ? totalLandedEGP / item.quantityTons : 0;
    const unitLandedEGPPerKg = unitLandedEGPPerTon / 1000;

    return {
      ...item,
      itemDirectUSD,
      itemFreightUSD,
      itemCustomsEGP,
      itemVatEGP,
      totalIndirectUSD,
      totalLandedUSD,
      totalLandedEGP,
      unitLandedUSDPerTon,
      unitLandedEGPPerTon,
      unitLandedEGPPerKg,
    };
  });

  const grandTotalLandedUSD = calculatedItems.reduce((sum, i) => sum + i.totalLandedUSD, 0);
  const grandTotalLandedEGP = calculatedItems.reduce((sum, i) => sum + i.totalLandedEGP, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Ship className="text-amber-600" />
              حاسبة تكاليف الاستيراد وتوزيع الشحن والحاوية
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              توزيع النولي بالحجم (m³)، الجمرك بـ Tariff الكيلو، وضريبة المبيعات 14%.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-white border border-slate-200 text-amber-700 font-mono px-3 py-1.5 rounded-xl font-bold shadow-sm">
              $1 = {usdToEgpRate} EGP
            </span>
          </div>
        </div>

        {/* PARAMETERS PANEL */}
        <div className="glass-panel p-5 space-y-4 border-amber-200 bg-amber-50/20">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Calculator className="text-amber-600" size={18} />
            بيانات الحاوية والشحن الإجمالية
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-bold">رقم الحاوية / البوليصة</label>
              <input
                type="text"
                value={containerNo}
                onChange={(e) => setContainerNo(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-amber-700 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">بلد الاستيراد (المصدر)</label>
              <select
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="إندونيسيا">🇮🇩 إندونيسيا (Indonesia)</option>
                <option value="فيتنام">🇻🇳 فيتنام (Vietnam)</option>
                <option value="مصر">🇪🇬 مصر (Egypt)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">حجم الحاوية الإجمالي (متر مكعب m³)</label>
              <input
                type="number"
                value={totalVolumeM3}
                onChange={(e) => setTotalVolumeM3(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sky-700 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">تكلفة الشحن النولي ($)</label>
              <input
                type="number"
                value={totalFreightUSD}
                onChange={(e) => setTotalFreightUSD(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-emerald-700 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">ضريبة المبيعات</label>
              <select
                value={salesTaxPercent}
                onChange={(e) => setSalesTaxPercent(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-purple-700 font-mono font-bold focus:outline-none focus:border-amber-500"
              >
                <option value={14}>14% (مصر - القيمة المضافة)</option>
                <option value={5}>5% (عمان - ضريبة المبيعات)</option>
                <option value={0}>0% (معفى من الضريبة)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ADD ITEM FORM */}
        <div className="glass-panel p-4">
          <h4 className="font-bold text-xs text-slate-700 mb-3 flex items-center gap-1.5">
            <Plus size={16} className="text-amber-600" />
            إضافة صنف مشحون إلى الحاوية:
          </h4>

          <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 text-xs">
            <div className="md:col-span-2">
              <input
                type="text"
                required
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="اسم صنف الفحم (مثال: فحم نباتي مضغوط)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <input
                type="number"
                required
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
                placeholder="الوزن بالطن..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <input
                type="number"
                required
                value={newItemVol}
                onChange={(e) => setNewItemVol(e.target.value)}
                placeholder="الحجم بالـ m³..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <input
                type="number"
                required
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="السعر للشراء $..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <input
                type="number"
                required
                value={newItemTariff}
                onChange={(e) => setNewItemTariff(e.target.value)}
                placeholder="جمرك للكيلو (ج.م)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-6 flex justify-end">
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow"
              >
                + إدراج الصنف للحاوية
              </button>
            </div>
          </form>
        </div>

        {/* CALCULATION RESULTS TABLE */}
        <div className="glass-panel overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Boxes className="text-amber-600" size={18} />
              نتائج توزيع التكاليف وسعر الواصل النهائي لكل صنف
            </h3>
            <span className="text-xs text-slate-600 font-mono font-bold">
              إجمالي حجم الحاوية المستغل: {totalAllocatedVolumeM3} / {totalVolumeM3} m³
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">اسم الصنف</th>
                  <th className="p-3.5">الوزن (طن)</th>
                  <th className="p-3.5">الحجم (m³)</th>
                  <th className="p-3.5">سعر الشراء</th>
                  <th className="p-3.5">نولي الشحن</th>
                  <th className="p-3.5">الجمرك (ج.م)</th>
                  <th className="p-3.5">الضريبة 14%</th>
                  <th className="p-3.5 font-bold text-amber-700">التكلفة للطن ($)</th>
                  <th className="p-3.5 font-bold text-emerald-700">الواصل للطن (ج.م)</th>
                  <th className="p-3.5 text-center font-bold text-sky-700">الكيلو واصل</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-extrabold text-slate-900">{item.name}</td>
                    <td className="p-3.5 font-mono text-slate-700">{item.quantityTons} طن</td>
                    <td className="p-3.5 font-mono text-sky-700">{item.volumeM3} m³</td>
                    <td className="p-3.5 font-mono text-slate-700">${item.purchasePriceUSDPerTon} / طن</td>
                    <td className="p-3.5 font-mono text-sky-700 font-bold">
                      ${Math.round(item.itemFreightUSD).toLocaleString()} USD
                    </td>
                    <td className="p-3.5 font-mono text-amber-700">
                      {item.itemCustomsEGP.toLocaleString()} ج.م
                    </td>
                    <td className="p-3.5 font-mono text-purple-700">
                      {Math.round(item.itemVatEGP).toLocaleString()} ج.م
                    </td>
                    <td className="p-3.5 font-mono font-extrabold text-amber-700 text-sm">
                      ${Math.round(item.unitLandedUSDPerTon).toLocaleString()} / طن
                    </td>
                    <td className="p-3.5 font-mono font-extrabold text-emerald-700 text-sm">
                      {Math.round(item.unitLandedEGPPerTon).toLocaleString()} ج.م / طن
                    </td>
                    <td className="p-3.5 font-mono font-extrabold text-sky-700 text-center text-sm">
                      {item.unitLandedEGPPerKg.toFixed(2)} ج.م / كم
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">إجمالي الشراء المباشر:</span>
              <span className="font-mono font-bold text-slate-800 text-base">
                ${totalDirectPurchaseUSD.toLocaleString()} USD
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">التكلفة الكلية للحاوية كاملة (واصل بالدولار):</span>
              <span className="font-mono font-black text-amber-700 text-base">
                ${Math.round(grandTotalLandedUSD).toLocaleString()} USD
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">التكلفة الكلية للحاوية كاملة (واصل بالمصري):</span>
              <span className="font-mono font-black text-emerald-700 text-base">
                {Math.round(grandTotalLandedEGP).toLocaleString()} ج.م
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
