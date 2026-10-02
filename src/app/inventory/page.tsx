'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { ProductItem } from '@/data/mockData';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  ArrowUpDown,
  Edit3,
  CheckCircle2,
  X,
  PackagePlus,
  Scale
} from 'lucide-react';

export default function InventoryPage() {
  const {
    products,
    addProduct,
    updateProduct,
    adjustStock,
    usdToEgpRate,
    usdToOmrRate,
    selectedBranch,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<ProductItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<'ADD' | 'SUBTRACT'>('ADD');
  const [adjustReason, setAdjustReason] = useState('توريد شحنة جديدة');

  // New Product State
  const [newNameAr, setNewNameAr] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newCategory, setNewCategory] = useState<ProductItem['category']>('فحم طبيعي');
  const [newUnit, setNewUnit] = useState<ProductItem['unit']>('TON');
  const [newBasePriceUSD, setNewBasePriceUSD] = useState<number>(450);
  const [newPriceEGP, setNewPriceEGP] = useState<number>(27000);
  const [newPriceOMR, setNewPriceOMR] = useState<number>(195);
  const [newStockQty, setNewStockQty] = useState<number>(50);
  const [newMinLimit, setNewMinLimit] = useState<number>(10);
  const [newOrigin, setNewOrigin] = useState('إندونيسيا');
  const [newDescription, setNewDescription] = useState('');

  const categories = [
    { key: 'ALL', label: 'جميع الأصناف' },
    { key: 'فحم طبيعي', label: 'فحم طبيعي للشواء' },
    { key: 'فحم مضغوط', label: 'فحم مضغوط ونشارة' },
    { key: 'فحم شيشة', label: 'فحم شيشة ومكعبات' },
    { key: 'تعبئة وتغليف', label: 'شكاير وكراتين تعبئة' },
  ];

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      p.originCountry.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const isLow = p.stockQuantity <= p.minAlertLimit;
    const matchesStock =
      stockStatusFilter === 'ALL' ||
      (stockStatusFilter === 'LOW' && isLow) ||
      (stockStatusFilter === 'AVAILABLE' && !isLow);

    return matchesSearch && matchesCat && matchesStock;
  });

  // KPI Calculations
  const totalStockValueUSD = products.reduce(
    (sum, p) => sum + p.stockQuantity * p.basePriceUSD,
    0
  );
  const totalStockValueEGP = totalStockValueUSD * usdToEgpRate;
  const totalStockValueOMR = totalStockValueUSD * usdToOmrRate;
  const lowStockCount = products.filter((p) => p.stockQuantity <= p.minAlertLimit).length;

  // Handle Add Product
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameAr) return;

    const newProd: ProductItem = {
      id: 'prod-' + Date.now(),
      nameAr: newNameAr,
      nameEn: newNameEn || newNameAr,
      category: newCategory,
      unit: newUnit,
      weightPerUnitKg: newUnit === 'TON' ? 1000 : newUnit === 'CARTON' ? 10 : 1,
      volumePerUnitM3: newUnit === 'TON' ? 1.6 : 0.02,
      basePriceUSD: newBasePriceUSD,
      priceEGP: newPriceEGP,
      priceOMR: newPriceOMR,
      landedCostUSD: Math.round(newBasePriceUSD * 1.3),
      landedCostEGP: Math.round(newBasePriceUSD * 1.3 * usdToEgpRate),
      stockQuantity: newStockQty,
      minAlertLimit: newMinLimit,
      originCountry: newOrigin,
      description: newDescription || 'صنف فحم مسجل في النظام',
    };

    addProduct(newProd);
    setShowAddModal(false);

    // Reset Form
    setNewNameAr('');
    setNewNameEn('');
    setNewBasePriceUSD(450);
    setNewPriceEGP(27000);
    setNewStockQty(50);
  };

  // Handle Stock Adjust
  const handleStockAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct || adjustQty <= 0) return;

    const delta = adjustType === 'ADD' ? adjustQty : -adjustQty;
    adjustStock(adjustingProduct.id, delta, adjustReason);
    setAdjustingProduct(null);
    setAdjustQty(0);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Boxes className="text-amber-600" />
              إدارة المخزون وتقييم العملات والأسعار
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              تسعير الأصناف بالدولار ($ USD)، الجنيه المصري (EGP)، والريال العماني (OMR) مع متابعة حدود إعادة الطلب.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-md shadow-amber-500/20"
          >
            <Plus size={16} />
            + إضافة صنف جديد
          </button>
        </div>

        {/* 3 VALUATION KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-5 border-amber-200 bg-amber-50/20">
            <div className="text-xs font-bold text-slate-500">إجمالي قيمة المخزون الحاكم ($ USD)</div>
            <div className="text-2xl font-black text-amber-700 font-mono mt-2">
              ${Math.round(totalStockValueUSD).toLocaleString()} USD
            </div>
            <div className="text-[11px] text-amber-600 font-bold mt-1">التقييم بالعملة الأجنبية الحاكمة</div>
          </div>

          <div className="glass-panel p-5 border-emerald-200 bg-emerald-50/20">
            <div className="text-xs font-bold text-slate-500">القيمة الإجمالية بمصر (EGP)</div>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-2">
              {Math.round(totalStockValueEGP).toLocaleString()} ج.م
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">بسعر الصرف: $1 = {usdToEgpRate} ج.م</div>
          </div>

          <div className="glass-panel p-5 border-sky-200 bg-sky-50/20">
            <div className="text-xs font-bold text-slate-500">القيمة الإجمالية بسلطنة عمان (OMR)</div>
            <div className="text-2xl font-black text-sky-700 font-mono mt-2">
              {Math.round(totalStockValueOMR).toLocaleString()} ر.ع
            </div>
            <div className="text-[11px] text-sky-600 font-bold mt-1">بسعر الصرف: $1 = {usdToOmrRate} ر.ع</div>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 -mb-[5px] whitespace-nowrap ${
                selectedCategory === cat.key
                  ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="glass-panel p-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute right-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم الصنف أو بلد المنشأ..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">جميع الأرصدة</option>
              <option value="AVAILABLE">متوفر بكميات جيدة</option>
              <option value="LOW">نواقص (قريب من حد الطلب)</option>
            </select>
          </div>
        </div>

        {/* PRODUCTS CATALOG TABLE */}
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">اسم الصنف والتصنيف</th>
                  <th className="p-3.5">بلد المنشأ</th>
                  <th className="p-3.5">الوحدة</th>
                  <th className="p-3.5">الرصيد المتاح بالمخزن</th>
                  <th className="p-3.5">سعر الأساس ($ USD)</th>
                  <th className="p-3.5">سعر بيع مصر (EGP)</th>
                  <th className="p-3.5">سعر بيع عمان (OMR)</th>
                  <th className="p-3.5">إجمالي قيمة المخزون</th>
                  <th className="p-3.5 text-center">حالة الرصيد</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLow = p.stockQuantity <= p.minAlertLimit;
                  const itemTotalUSD = p.stockQuantity * p.basePriceUSD;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-bold text-slate-800">
                        <p className="font-extrabold text-slate-900">{p.nameAr}</p>
                        <p className="text-[10px] text-slate-500">{p.nameEn}</p>
                      </td>
                      <td className="p-3.5 text-slate-600">{p.originCountry}</td>
                      <td className="p-3.5 font-mono text-slate-700 font-bold">
                        {p.unit === 'TON' ? 'طن' : p.unit === 'CARTON' ? 'كرتونة' : 'شيكارة'}
                      </td>
                      <td className="p-3.5 font-mono font-black text-sm text-slate-900">
                        {p.stockQuantity.toLocaleString()} {p.unit === 'TON' ? 'طن' : 'وحدة'}
                      </td>
                      <td className="p-3.5 font-mono text-slate-800 font-bold">${p.basePriceUSD}</td>
                      <td className="p-3.5 font-mono font-bold text-emerald-700">
                        {p.priceEGP.toLocaleString()} ج.م
                      </td>
                      <td className="p-3.5 font-mono font-bold text-sky-700">
                        {p.priceOMR.toLocaleString()} ر.ع
                      </td>
                      <td className="p-3.5 font-mono font-extrabold text-amber-700 text-sm">
                        ${Math.round(itemTotalUSD).toLocaleString()} USD
                      </td>
                      <td className="p-3.5 text-center">
                        {isLow ? (
                          <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center justify-center gap-1">
                            <AlertTriangle size={11} />
                            طلب توريد
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            متوفر
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setAdjustingProduct(p)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg font-bold text-[11px] shadow-sm transition"
                        >
                          تعديل الرصيد
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD PRODUCT */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Boxes className="text-amber-600" />
                إضافة صنف فحم / بضاعة جديدة
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">اسم الصنف بالعربي *</label>
                  <input
                    type="text"
                    required
                    value={newNameAr}
                    onChange={(e) => setNewNameAr(e.target.value)}
                    placeholder="مثال: فحم برتقال طبيعي نخب أول"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    value={newNameEn}
                    onChange={(e) => setNewNameEn(e.target.value)}
                    placeholder="Premium Orange Charcoal"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">التصنيف *</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="فحم طبيعي">فحم طبيعي</option>
                    <option value="فحم مضغوط">فحم مضغوط</option>
                    <option value="فحم شيشة">فحم شيشة</option>
                    <option value="تعبئة وتغليف">تعبئة وتغليف</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">الوحدة *</label>
                  <select
                    value={newUnit}
                    onChange={(e: any) => setNewUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="TON">طن (TON)</option>
                    <option value="KG">كيلو (KG)</option>
                    <option value="BAG">شيكارة (BAG)</option>
                    <option value="CARTON">كرتونة (CARTON)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">بلد المنشأ</label>
                  <select
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="إندونيسيا">🇮🇩 إندونيسيا</option>
                    <option value="فيتنام">🇻🇳 فيتنام</option>
                    <option value="مصر">🇪🇬 مصر</option>
                    <option value="سلطنة عمان">🇴🇲 سلطنة عمان</option>
                  </select>
                </div>
              </div>

              {/* PRICING & MULTI-CURRENCY INPUTS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-amber-50/40 p-4 rounded-xl border border-amber-200">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">السعر الأساسي بالدولار ($ USD) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newBasePriceUSD}
                    onChange={(e) => {
                      const usd = parseFloat(e.target.value) || 0;
                      setNewBasePriceUSD(usd);
                      setNewPriceEGP(Math.round(usd * usdToEgpRate * 1.35));
                      setNewPriceOMR(Math.round(usd * usdToOmrRate * 1.35));
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono text-amber-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">سعر البيع بمصر (EGP)</label>
                  <input
                    type="number"
                    step="any"
                    value={newPriceEGP}
                    onChange={(e) => setNewPriceEGP(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono text-emerald-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">سعر البيع بعمان (OMR)</label>
                  <input
                    type="number"
                    step="any"
                    value={newPriceOMR}
                    onChange={(e) => setNewPriceOMR(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono text-sky-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الرصيد الافتتاحي بالمخزن</label>
                  <input
                    type="number"
                    value={newStockQty}
                    onChange={(e) => setNewStockQty(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">حد إنذار النواقص (Reorder Limit)</label>
                  <input
                    type="number"
                    value={newMinLimit}
                    onChange={(e) => setNewMinLimit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-md"
                >
                  حفظ الصنف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADJUST STOCK */}
      {adjustingProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-black text-lg text-slate-900">
              تسوية وتعديل رصيد: {adjustingProduct.nameAr}
            </h3>

            <form onSubmit={handleStockAdjustSubmit} className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500">الرصيد الحالي بالمخزن:</span>
                <span className="font-mono font-black text-amber-700 text-sm">
                  {adjustingProduct.stockQuantity} {adjustingProduct.unit}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">نوع الحركة *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('ADD')}
                    className={`py-2 rounded-xl font-bold transition ${
                      adjustType === 'ADD'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    + إضافة رصيد (توريد / إنتاج)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('SUBTRACT')}
                    className={`py-2 rounded-xl font-bold transition ${
                      adjustType === 'SUBTRACT'
                        ? 'bg-rose-600 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    - خصم رصيد (صرف / هالك)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الكمية المراد تعديلها *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={adjustQty || ''}
                  onChange={(e) => setAdjustQty(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 font-bold text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">سبب التسوية / رقم الإذن</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  placeholder="مثال: توريد حاوية CONT-68M3"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow"
                >
                  تأكيد التسوية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
