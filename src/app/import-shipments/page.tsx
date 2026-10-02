'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { ImportShipment } from '@/data/mockData';
import {
  Ship,
  Calculator,
  Plus,
  Trash2,
  DollarSign,
  Boxes,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  X
} from 'lucide-react';

export default function ImportShipmentsPage() {
  const { shipments, usdToEgpRate } = useApp();

  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(
    shipments[0]?.id || 'ship-01'
  );

  const selectedShipment = shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  // Dynamic Calculator state initialized with selected shipment
  const [containerNo, setContainerNo] = useState(selectedShipment?.containerNo || 'CONT-68M3-INDO-2026');
  const [originCountry, setOriginCountry] = useState(selectedShipment?.originCountry || 'إندونيسيا');
  const [totalVolumeM3, setTotalVolumeM3] = useState<number>(selectedShipment?.totalVolumeM3 || 68);
  const [totalFreightUSD, setTotalFreightUSD] = useState<number>(selectedShipment?.totalFreightCostUSD || 3200);
  const [salesTaxPercent, setSalesTaxPercent] = useState<number>(selectedShipment?.salesTaxPercent || 14);
  const [calcExchangeRate, setCalcExchangeRate] = useState<number>(usdToEgpRate || 48.5);

  const [calcItems, setCalcItems] = useState(
    selectedShipment?.items.map((i, idx) => ({
      id: idx + 1,
      name: i.itemName,
      quantityTons: i.quantityTons,
      volumeM3: i.volumeM3,
      purchasePriceUSDPerTon: i.purchasePriceUSDPerTon,
      customsTariffPerKgEGP: i.customsTariffPerKgEGP,
    })) || []
  );

  // New Item inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemVol, setNewItemVol] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemTariff, setNewItemTariff] = useState('');

  // Modals
  const [showPrintSheetModal, setShowPrintSheetModal] = useState(false);

  // Switch Container
  const handleSelectContainer = (ship: ImportShipment) => {
    setSelectedShipmentId(ship.id);
    setContainerNo(ship.containerNo);
    setOriginCountry(ship.originCountry);
    setTotalVolumeM3(ship.totalVolumeM3);
    setTotalFreightUSD(ship.totalFreightCostUSD);
    setSalesTaxPercent(ship.salesTaxPercent);
    setCalcExchangeRate(ship.exchangeRateUSDToEGP || 48.5);
    setCalcItems(
      ship.items.map((i, idx) => ({
        id: idx + 1,
        name: i.itemName,
        quantityTons: i.quantityTons,
        volumeM3: i.volumeM3,
        purchasePriceUSDPerTon: i.purchasePriceUSDPerTon,
        customsTariffPerKgEGP: i.customsTariffPerKgEGP,
      }))
    );
  };

  // Add Item to calculation table
  const handleAddItemToCalc = (e: React.FormEvent) => {
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
    setCalcItems([...calcItems, newItem]);
    setNewItemName('');
    setNewItemQty('');
    setNewItemVol('');
    setNewItemPrice('');
    setNewItemTariff('');
  };

  const handleRemoveCalcItem = (id: number) => {
    setCalcItems(calcItems.filter((i) => i.id !== id));
  };

  // Calculations
  const totalAllocatedVolumeM3 = calcItems.reduce((sum, i) => sum + i.volumeM3, 0);
  const totalDirectPurchaseUSD = calcItems.reduce(
    (sum, i) => sum + i.quantityTons * i.purchasePriceUSDPerTon,
    0
  );

  const calculatedItems = calcItems.map((item) => {
    const itemDirectUSD = item.quantityTons * item.purchasePriceUSDPerTon;
    const volumeRatio = totalAllocatedVolumeM3 > 0 ? item.volumeM3 / totalAllocatedVolumeM3 : 0;
    const itemFreightUSD = totalFreightUSD * volumeRatio;

    const quantityKg = item.quantityTons * 1000;
    const itemCustomsEGP = quantityKg * item.customsTariffPerKgEGP;
    const itemCustomsUSD = itemCustomsEGP / calcExchangeRate;

    const itemSubtotalEGP = (itemDirectUSD + itemFreightUSD) * calcExchangeRate + itemCustomsEGP;
    const itemVatEGP = itemSubtotalEGP * (salesTaxPercent / 100);
    const itemVatUSD = itemVatEGP / calcExchangeRate;

    const totalIndirectUSD = itemFreightUSD + itemCustomsUSD + itemVatUSD;
    const totalLandedUSD = itemDirectUSD + totalIndirectUSD;
    const totalLandedEGP = totalLandedUSD * calcExchangeRate;

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
  const totalCustomsEGP = calculatedItems.reduce((sum, i) => sum + i.itemCustomsEGP, 0);
  const totalVatEGP = calculatedItems.reduce((sum, i) => sum + i.itemVatEGP, 0);

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 sm:pb-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Ship className="text-amber-600 flex-shrink-0" size={24} />
              <span>حاسبة تكاليف الاستيراد ونولون الحاويات</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              توزيع نولي الشحن بالحجم (m³)، الجمارك بـ Tariff الكيلو، ضريبة القيمة المضافة، وسعر الواصل الحقيقي.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintSheetModal(true)}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Printer size={15} className="text-amber-600" />
              طباعة بيان تكلفة الحاوية
            </button>
          </div>
        </div>

        {/* CONTAINER SELECTOR TABS */}
        <div className="glass-panel p-3.5 sm:p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
            <span className="font-extrabold text-xs text-slate-800">بوالص وحاويات الاستيراد:</span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">
              اضغط على الحاوية لتحميل بياناتها
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {shipments.map((s) => {
              const isSelected = s.id === selectedShipmentId;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectContainer(s)}
                  className={`p-3 rounded-xl border text-right transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-50/90 border-amber-400 shadow-md ring-1 ring-amber-400'
                      : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between w-full gap-2">
                    <div className="min-w-0">
                      <span className="font-mono font-black text-xs text-slate-900 block truncate">
                        {s.containerNo}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
                        {s.originCountry} ➔ {s.destinationPort.split('-')[0]}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${
                        s.status === 'IN_WAREHOUSE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.status === 'IN_TRANSIT'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.status === 'IN_WAREHOUSE'
                        ? 'بالمخزن'
                        : s.status === 'IN_TRANSIT'
                        ? 'في البحر'
                        : 'مطلوبة'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200/60 text-[11px] font-bold">
                    <span className="text-slate-500">الحجم: {s.totalVolumeM3} m³</span>
                    <span className="font-mono text-emerald-700">
                      ${s.grandTotalLandedUSD.toLocaleString()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTAINER PARAMETERS CONTROLS */}
        <div className="glass-panel p-3.5 sm:p-5 space-y-3 sm:space-y-4 border-amber-200 bg-amber-50/20">
          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Calculator className="text-amber-600 flex-shrink-0" size={17} />
            معاملات الحاوية: {containerNo}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-3 text-xs">
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
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none focus:border-amber-500"
              >
                <option value="إندونيسيا">🇮🇩 إندونيسيا (Indonesia)</option>
                <option value="فيتنام">🇻🇳 فيتنام (Vietnam)</option>
                <option value="مصر">🇪🇬 مصر (Egypt)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">سعة الحاوية (متر مكعب m³)</label>
              <input
                type="number"
                value={totalVolumeM3}
                onChange={(e) => setTotalVolumeM3(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sky-700 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">تكلفة نولي الشحن ($ USD)</label>
              <input
                type="number"
                value={totalFreightUSD}
                onChange={(e) => setTotalFreightUSD(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-emerald-700 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">ضريبة القيمة المضافة</label>
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
        <div className="glass-panel p-3.5 sm:p-4">
          <h4 className="font-bold text-xs text-slate-700 mb-3 flex items-center gap-1.5">
            <Plus size={16} className="text-amber-600" />
            إضافة صنف مشحون إلى الحاوية:
          </h4>

          <form onSubmit={handleAddItemToCalc} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 text-xs">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="اسم صنف الفحم..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <input
                type="number"
                step="any"
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
                step="any"
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
                step="any"
                required
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="الشراء $/طن..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <input
                type="number"
                step="any"
                required
                value={newItemTariff}
                onChange={(e) => setNewItemTariff(e.target.value)}
                placeholder="جمرك للكيلو (ج.م)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-6 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow"
              >
                + إدراج الصنف للحاوية
              </button>
            </div>
          </form>
        </div>

        {/* CALCULATION RESULTS TABLE */}
        <div className="glass-panel overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
              <Boxes className="text-amber-600 flex-shrink-0" size={17} />
              جدول نتائج توزيع التكاليف وسعر الواصل الحقيقي
            </h3>
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-mono font-bold self-start sm:self-auto">
              استغلال الحاوية: {totalAllocatedVolumeM3} / {totalVolumeM3} m³
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs min-w-[700px]">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">اسم الصنف</th>
                  <th className="p-3">الوزن (طن)</th>
                  <th className="p-3">الحجم (m³)</th>
                  <th className="p-3">شراء مباشر</th>
                  <th className="p-3">نولي شحن ($)</th>
                  <th className="p-3">الجمارك (ج.م)</th>
                  <th className="p-3">ضريبة {salesTaxPercent}%</th>
                  <th className="p-3 font-bold text-amber-700">التكلفة للطن ($)</th>
                  <th className="p-3 font-bold text-emerald-700">الواصل للطن (ج.م)</th>
                  <th className="p-3 text-center font-bold text-sky-700">الكيلو واصل</th>
                  <th className="p-3 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-3 font-black text-slate-900">{item.name}</td>
                    <td className="p-3 font-mono text-slate-800 font-bold">{item.quantityTons} طن</td>
                    <td className="p-3 font-mono text-sky-700 font-bold">{item.volumeM3} m³</td>
                    <td className="p-3 font-mono text-slate-700">${item.purchasePriceUSDPerTon}</td>
                    <td className="p-3 font-mono text-sky-700 font-bold">
                      ${Math.round(item.itemFreightUSD).toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-amber-700">
                      {item.itemCustomsEGP.toLocaleString()} ج.م
                    </td>
                    <td className="p-3 font-mono text-purple-700">
                      {Math.round(item.itemVatEGP).toLocaleString()} ج.م
                    </td>
                    <td className="p-3 font-mono font-black text-amber-700 text-xs sm:text-sm">
                      ${Math.round(item.unitLandedUSDPerTon).toLocaleString()} / طن
                    </td>
                    <td className="p-3 font-mono font-black text-emerald-700 text-xs sm:text-sm">
                      {Math.round(item.unitLandedEGPPerTon).toLocaleString()} ج.م
                    </td>
                    <td className="p-3 font-mono font-black text-sky-700 text-center text-xs sm:text-sm">
                      {item.unitLandedEGPPerKg.toFixed(2)} ج.م
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleRemoveCalcItem(item.id)}
                        className="p-1.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS SUMMARY STRIP */}
          <div className="bg-slate-50 p-3.5 sm:p-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
            <div>
              <span className="text-slate-500 block font-normal text-[11px]">الشراء المباشر:</span>
              <span className="font-mono font-bold text-slate-800 text-sm sm:text-base">
                ${totalDirectPurchaseUSD.toLocaleString()} USD
              </span>
            </div>

            <div>
              <span className="text-slate-500 block font-normal text-[11px]">الرسوم الجمركية:</span>
              <span className="font-mono font-bold text-amber-700 text-sm sm:text-base">
                {totalCustomsEGP.toLocaleString()} ج.م
              </span>
            </div>

            <div>
              <span className="text-slate-500 block font-normal text-[11px]">الواصل ($ USD):</span>
              <span className="font-mono font-black text-amber-700 text-sm sm:text-base">
                ${Math.round(grandTotalLandedUSD).toLocaleString()}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block font-normal text-[11px]">الواصل بالمصري:</span>
              <span className="font-mono font-black text-emerald-700 text-sm sm:text-base">
                {Math.round(grandTotalLandedEGP).toLocaleString()} ج.م
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: PRINTABLE CONTAINER COSTING SHEET */}
      {showPrintSheetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-2xl border border-slate-200 print:m-0 print:p-0 print:border-none max-h-[90vh] overflow-y-auto">
            {/* SHEET HEADER */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 sm:pb-4 gap-2">
              <div>
                <h2 className="text-base sm:text-xl font-black text-slate-900">شركة بي قاسم للاستيراد والتصدير</h2>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">بيان احتساب التكاليف الواصلة للحاويات والشحنات الدولية</p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-mono mt-1">بوليصة: {containerNo} | المنشأ: {originCountry}</p>
              </div>

              <div className="text-left font-mono flex-shrink-0">
                <span className="text-[10px] sm:text-xs bg-amber-100 text-amber-900 font-black px-2.5 py-1 rounded-md">
                  بيان تكلفة واصل
                </span>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1.5">التاريخ: {new Date().toISOString().split('T')[0]}</p>
                <p className="text-[10px] sm:text-xs text-slate-500">سعر الصرف: $1 = {calcExchangeRate} ج.م</p>
              </div>
            </div>

            {/* CONTAINER SPECS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">حجم الحاوية:</span>
                <span className="font-mono font-bold text-slate-900">{totalVolumeM3} متر مكعب (m³)</span>
              </div>
              <div>
                <span className="text-slate-500 block">نولي الشحن البحري:</span>
                <span className="font-mono font-bold text-sky-700">${totalFreightUSD.toLocaleString()} USD</span>
              </div>
              <div>
                <span className="text-slate-500 block">ضريبة القيمة المضافة:</span>
                <span className="font-mono font-bold text-purple-700">{salesTaxPercent}%</span>
              </div>
            </div>

            {/* ITEMIZED COST TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs min-w-[550px]">
                <thead className="bg-slate-100 text-slate-800 font-extrabold border-y border-slate-200">
                  <tr>
                    <th className="p-2">بيان الصنف</th>
                    <th className="p-2">الوزن</th>
                    <th className="p-2">الشراء ($)</th>
                    <th className="p-2">النولي ($)</th>
                    <th className="p-2">الجمارك</th>
                    <th className="p-2">الواصل للطن ($)</th>
                    <th className="p-2">الواصل للطن (ج.م)</th>
                    <th className="p-2 text-left font-black text-sky-700">الكيلو واصل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {calculatedItems.map((i, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-bold text-slate-900">{i.name}</td>
                      <td className="p-2 font-mono">{i.quantityTons} طن</td>
                      <td className="p-2 font-mono">${i.purchasePriceUSDPerTon}</td>
                      <td className="p-2 font-mono">${Math.round(i.itemFreightUSD)}</td>
                      <td className="p-2 font-mono">{i.itemCustomsEGP.toLocaleString()}</td>
                      <td className="p-2 font-mono font-bold text-amber-700">${Math.round(i.unitLandedUSDPerTon)}</td>
                      <td className="p-2 font-mono font-bold text-emerald-700">{Math.round(i.unitLandedEGPPerTon).toLocaleString()}</td>
                      <td className="p-2 font-mono font-black text-sky-700 text-left">{i.unitLandedEGPPerKg.toFixed(2)} ج.م</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TOTALS */}
            <div className="border-t-2 border-slate-900 pt-3 space-y-1 text-xs text-left font-bold">
              <div className="flex justify-between">
                <span className="text-slate-600">التكلفة الكلية للحاوية كاملة ($ USD):</span>
                <span className="font-mono text-slate-900 font-black text-sm sm:text-base">
                  ${Math.round(grandTotalLandedUSD).toLocaleString()} USD
                </span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>التكلفة الكلية للحاوية كاملة (EGP):</span>
                <span className="font-mono text-sm sm:text-base font-black">
                  {Math.round(grandTotalLandedEGP).toLocaleString()} ج.م
                </span>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="text-[11px] text-slate-400">
                <span>اعتماد الإدارة والمدير المالي</span>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Printer size={14} />
                  طباعة
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintSheetModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
