'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { Supplier } from '@/data/mockData';
import {
  Factory,
  CreditCard,
  FileCheck,
  Plus,
  Search,
  ArrowUpRight,
  Globe2
} from 'lucide-react';

const TABS = [
  { key: 'suppliers', label: 'دليل الموردين', icon: Factory },
  { key: 'payments', label: 'التحويلات الدولية (LC / TT)', icon: CreditCard },
  { key: 'checks', label: 'الشيكات والاعتمادات', icon: FileCheck },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function SuppliersPage() {
  const { suppliers, addSupplier, addSupplierPayment, cheques } = useApp();

  const [tab, setTab] = useState<TabKey>('suppliers');
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // New Supplier Form
  const [newSupName, setNewSupName] = useState('');
  const [newSupCountry, setNewSupCountry] = useState('إندونيسيا');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupEmail, setNewSupEmail] = useState('');
  const [newSupSpecialty, setNewSupSpecialty] = useState('');
  const [newSupBank, setNewSupBank] = useState('');
  const [newSupNotes, setNewSupNotes] = useState('');

  // Payment Form
  const [paySupId, setPaySupId] = useState('');
  const [payAmountUSD, setPayAmountUSD] = useState<number>(0);
  const [payMethod, setPayMethod] = useState('تحويل بنكي دولي (TT)');
  const [payBank, setPayBank] = useState('البنك الأهلي المصري - حساب الدولار');
  const [payNotes, setPayNotes] = useState('');

  // International Payments List
  const [paymentsList, setPaymentsList] = useState([
    {
      id: 'pay-sup-1',
      supplierName: 'PT Nusantara Charcoal Export Indonesia',
      date: '2026-08-25',
      amountUSD: 15000,
      paymentMethod: 'تحويل بنكي دولي (LC / TT)',
      bankName: 'البنك الأهلي المصري - فرع العملات الأجنبية',
      notes: 'دفعة سداد شحنة الحاوية CONT-68M3-INDO-2026',
    },
    {
      id: 'pay-sup-2',
      supplierName: 'Vietnam Charcoal & Briquette Export Corp',
      date: '2026-08-20',
      amountUSD: 8000,
      paymentMethod: 'تحويل برقي (Swift TT)',
      bankName: 'بنك مسقط (Muscat Bank)',
      notes: 'تحويل دولار لسداد شحنة الفحم النباتي المضغوط',
    },
    {
      id: 'pay-sup-3',
      supplierName: 'PT Nusantara Charcoal Export Indonesia',
      date: '2026-08-10',
      amountUSD: 10000,
      paymentMethod: 'اعتماد مستندي (LC)',
      bankName: 'بنك قطر الوطني QNB',
      notes: 'دفعة مقدمة لفتح الحاوية CONT-40HQ',
    },
  ]);

  // Filtering
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.country.toLowerCase().includes(search.toLowerCase()) ||
      s.specialty?.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = countryFilter === 'all' || s.countryCode === countryFilter;
    return matchesSearch && matchesCountry;
  });

  const totalOwedUSD = suppliers.reduce((sum, s) => sum + (s.balanceUSD || 0), 0);
  const totalOwedEGP = suppliers.reduce((sum, s) => sum + (s.balanceEGP || 0), 0);

  // Add Supplier Submit
  const handleAddSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName) return;

    const newSup: Supplier = {
      id: 'sup-' + Date.now(),
      name: newSupName,
      country: newSupCountry,
      countryCode: newSupCountry.includes('مصر')
        ? 'EG'
        : newSupCountry.includes('فيتنام')
        ? 'VN'
        : newSupCountry.includes('عمان')
        ? 'OM'
        : 'ID',
      phone: newSupPhone || '—',
      email: newSupEmail || '—',
      balanceUSD: 0,
      balanceEGP: 0,
      bankAccount: newSupBank || '—',
      specialty: newSupSpecialty || 'توريد فحم وتعبئة',
      notes: newSupNotes || 'مورد معتمد في النظام',
    };

    addSupplier(newSup);
    setShowAddModal(false);

    setNewSupName('');
    setNewSupPhone('');
    setNewSupEmail('');
    setNewSupSpecialty('');
  };

  // Add Payment Submit
  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === paySupId);
    if (!sup || payAmountUSD <= 0) return;

    addSupplierPayment(sup.id, payAmountUSD, payMethod, payBank, payNotes);

    const newPay = {
      id: 'pay-sup-' + Date.now(),
      supplierName: sup.name,
      date: new Date().toISOString().split('T')[0],
      amountUSD: payAmountUSD,
      paymentMethod: payMethod,
      bankName: payBank,
      notes: payNotes || 'سداد مستحقات شحن واستيراد',
    };

    setPaymentsList([newPay, ...paymentsList]);
    setShowPaymentModal(false);
    setPayAmountUSD(0);
    setPayNotes('');
  };

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 sm:pb-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Factory className="text-amber-600 flex-shrink-0" size={24} />
              <span>إدارة الموردين والتحويلات الدولية</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              متابعة حسابات الموردين في (فيتنام، إندونيسيا، ومصر)، تحويلات الدولار ($ USD)، والاعتمادات المستندية.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-600/20"
            >
              <ArrowUpRight size={16} />
              + تسجيل تحويل دولي
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-md shadow-amber-500/20"
            >
              <Plus size={16} />
              إضافة مورد
            </button>
          </div>
        </div>

        {/* 3 SUMMARY KPIS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          <div className="glass-panel p-4 sm:p-5 border-amber-200 bg-amber-50/20">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">مستحقات الموردين بالدولار ($ USD)</div>
            <div className="text-xl sm:text-2xl font-black text-amber-700 font-mono mt-1 sm:mt-2">
              ${totalOwedUSD.toLocaleString()} USD
            </div>
            <div className="text-[10px] sm:text-[11px] text-amber-600 font-bold mt-0.5">فيتنام وإندونيسيا</div>
          </div>

          <div className="glass-panel p-4 sm:p-5 border-sky-200 bg-sky-50/20">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">مستحقات الموردين المحليين (EGP)</div>
            <div className="text-xl sm:text-2xl font-black text-sky-800 font-mono mt-1 sm:mt-2">
              {totalOwedEGP.toLocaleString()} ج.م
            </div>
            <div className="text-[10px] sm:text-[11px] text-sky-600 font-bold mt-0.5">مصانع الكرتون والتعبئة</div>
          </div>

          <div className="glass-panel p-4 sm:p-5 border-emerald-200 bg-emerald-50/20">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">عدد الموردين المسجلين</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 sm:mt-2">{suppliers.length} موردين</div>
            <div className="text-[10px] sm:text-[11px] text-emerald-600 font-bold mt-0.5">شركات تصدير وشحن دولي</div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 sm:px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 -mb-[5px] whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: SUPPLIERS DIRECTORY */}
        {tab === 'suppliers' && (
          <div className="space-y-4">
            {/* SEARCH & FILTERS */}
            <div className="glass-panel p-3 flex flex-col md:flex-row items-center justify-between gap-2.5">
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث باسم المورد أو الدولة..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full md:w-auto bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-amber-500"
              >
                <option value="all">جميع الدول</option>
                <option value="ID">🇮🇩 إندونيسيا (Indonesia)</option>
                <option value="VN">🇻🇳 فيتنام (Vietnam)</option>
                <option value="EG">🇪🇬 مصر (Egypt)</option>
                <option value="OM">🇴🇲 سلطنة عمان (Oman)</option>
              </select>
            </div>

            {/* SUPPLIERS TABLE */}
            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs min-w-[650px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">اسم المورد</th>
                      <th className="p-3">الدولة</th>
                      <th className="p-3">التخصص التجاري</th>
                      <th className="p-3">بيانات الاتصال</th>
                      <th className="p-3">الحساب البنكي</th>
                      <th className="p-3">الرصيد المتبقي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSuppliers.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-800">
                          <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{s.name}</p>
                          <p className="text-[10px] text-slate-500 max-w-xs truncate">{s.notes}</p>
                        </td>
                        <td className="p-3">
                          <span className="flex items-center gap-1 font-bold text-slate-700">
                            <Globe2 size={13} className="text-amber-600" />
                            {s.country}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 font-medium max-w-xs">{s.specialty}</td>
                        <td className="p-3">
                          <p className="font-mono text-slate-900 font-bold">{s.phone}</p>
                          <p className="text-[10px] text-slate-400">{s.email}</p>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                          {s.bankAccount}
                        </td>
                        <td className="p-3 font-mono font-black text-xs sm:text-sm">
                          {s.balanceUSD ? (
                            <span className="text-rose-600">${s.balanceUSD.toLocaleString()} USD</span>
                          ) : s.balanceEGP ? (
                            <span className="text-amber-700">{s.balanceEGP.toLocaleString()} EGP</span>
                          ) : (
                            <span className="text-emerald-600">خالص 0.00</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAYMENTS */}
        {tab === 'payments' && (
          <div className="space-y-4">
            <div className="glass-panel p-3.5 sm:p-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <CreditCard className="text-amber-600" size={17} />
                  سجل التحويلات والسداد البنكي الدولي
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  توثيق التحويلات البرقية (Swift TT) والاعتمادات (LC)
                </p>
              </div>
            </div>

            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs min-w-[600px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">المورد</th>
                      <th className="p-3">التاريخ</th>
                      <th className="p-3">المبلغ ($ USD)</th>
                      <th className="p-3">وسيلة السداد</th>
                      <th className="p-3">البنك الصادر</th>
                      <th className="p-3">ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paymentsList.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{p.supplierName}</td>
                        <td className="p-3 font-mono text-slate-500">{p.date}</td>
                        <td className="p-3 font-mono font-black text-emerald-700 text-xs sm:text-sm">
                          ${p.amountUSD.toLocaleString()} USD
                        </td>
                        <td className="p-3 text-slate-700 font-bold">{p.paymentMethod}</td>
                        <td className="p-3 text-slate-600">{p.bankName}</td>
                        <td className="p-3 text-slate-500">{p.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CHEQUES */}
        {tab === 'checks' && (
          <div className="space-y-4">
            <div className="glass-panel p-3.5 sm:p-4">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <FileCheck className="text-amber-600" size={17} />
                سجل الشيكات الصادرة للموردين
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                متابعة الشيكات البنكية الصادرة وتواريخ استحقاقها
              </p>
            </div>

            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs min-w-[600px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">رقم الشيك</th>
                      <th className="p-3">المستفيد</th>
                      <th className="p-3">البنك</th>
                      <th className="p-3">القيمة</th>
                      <th className="p-3">تاريخ الإصدار</th>
                      <th className="p-3">تاريخ الاستحقاق</th>
                      <th className="p-3 text-center">حالة الصرف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cheques.map((chk) => (
                      <tr key={chk.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-extrabold text-amber-700">{chk.chequeNumber}</td>
                        <td className="p-3 font-bold text-slate-900">{chk.recipientName}</td>
                        <td className="p-3 text-slate-700">{chk.bankName}</td>
                        <td className="p-3 font-mono font-black text-emerald-700 text-xs sm:text-sm">
                          {chk.amount.toLocaleString()} {chk.currency}
                        </td>
                        <td className="p-3 font-mono text-slate-500">{chk.issueDate}</td>
                        <td className="p-3 font-mono text-slate-500">{chk.dueDate}</td>
                        <td className="p-3 text-center">
                          {chk.status === 'CLEARED' ? (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              تم الصرف
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              مستحق الصرف
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD SUPPLIER */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-black text-base sm:text-lg text-slate-900">إضافة مورد جديد</h3>

            <form onSubmit={handleAddSupplierSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم المورد / الشركة *</label>
                <input
                  type="text"
                  required
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  placeholder="مثال: PT Nusantara Charcoal"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">دولة المورد *</label>
                <select
                  value={newSupCountry}
                  onChange={(e) => setNewSupCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-bold"
                >
                  <option value="إندونيسيا">🇮🇩 إندونيسيا</option>
                  <option value="فيتنام">🇻🇳 فيتنام</option>
                  <option value="مصر">🇪🇬 مصر</option>
                  <option value="سلطنة عمان">🇴🇲 عمان</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">التخصص والمنتجات</label>
                <input
                  type="text"
                  value={newSupSpecialty}
                  onChange={(e) => setNewSupSpecialty(e.target.value)}
                  placeholder="مثال: فحم طبيعي + قوالب فحم"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم الهاتف الدولي</label>
                  <input
                    type="text"
                    value={newSupPhone}
                    onChange={(e) => setNewSupPhone(e.target.value)}
                    placeholder="+62 812..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={newSupEmail}
                    onChange={(e) => setNewSupEmail(e.target.value)}
                    placeholder="export@supplier.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الحساب البنكي (IBAN / Swift)</label>
                <input
                  type="text"
                  value={newSupBank}
                  onChange={(e) => setNewSupBank(e.target.value)}
                  placeholder="Bank Name & Swift Code..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow"
                >
                  حفظ المورد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD PAYMENT */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-black text-base sm:text-lg text-emerald-700 flex items-center gap-2">
              <ArrowUpRight />
              سداد تحويل دولي ($ USD)
            </h3>

            <form onSubmit={handleAddPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم المورد *</label>
                <select
                  required
                  value={paySupId}
                  onChange={(e) => setPaySupId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="">اختر المورد...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.country}) - ${s.balanceUSD?.toLocaleString()} USD
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">المبلغ المحول ($ USD) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={payAmountUSD || ''}
                  onChange={(e) => setPayAmountUSD(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-mono font-bold text-sm"
                  placeholder="0.00 $"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">البنك وطريقة التحويل</label>
                <input
                  type="text"
                  value={payBank}
                  onChange={(e) => setPayBank(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ملاحظات / رقم الحاوية</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="سداد شحنة الحاوية..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow"
                >
                  تأكيد التحويل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
