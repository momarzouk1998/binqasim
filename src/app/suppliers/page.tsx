'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Factory,
  CreditCard,
  FileCheck,
  Plus,
  Search,
  ArrowUpRight,
  Globe2,
  DollarSign
} from 'lucide-react';

const TABS = [
  { key: 'suppliers', label: 'دليل الموردين', icon: Factory },
  { key: 'payments', label: 'السداد والتحويلات البنكية', icon: CreditCard },
  { key: 'checks', label: 'حركة الشيكات والمستندات', icon: FileCheck },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function SuppliersPage() {
  const [tab, setTab] = useState<TabKey>('suppliers');
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [suppliers, setSuppliers] = useState([
    {
      id: 'sup-1',
      name: 'PT Nusantara Charcoal & Spices',
      country: 'إندونيسيا (Indonesia)',
      countryCode: 'ID',
      phone: '+62 812 9876 5432',
      email: 'sales@nusantara-export.co.id',
      balanceUSD: 22000,
      notes: 'مورد الفحم الطبيعي الفاخر للشيشة والشواء',
    },
    {
      id: 'sup-2',
      name: 'Vietnam Agri-Export Corporation',
      country: 'فيتنام (Vietnam)',
      countryCode: 'VN',
      phone: '+84 90 123 4567',
      email: 'export@vietnamagri.com',
      balanceUSD: 14500,
      notes: 'مورد التوابل والفلفل الأسود والبصل الفاخر',
    },
    {
      id: 'sup-3',
      name: 'شركة النيل للكرتون والتغليف (القاهرة)',
      phone: '01055544332',
      country: 'مصر (Egypt)',
      countryCode: 'EG',
      email: 'info@nilepack.com',
      balanceUSD: 0,
      balanceEGP: 38000,
      notes: 'مورد كراتين التعبئة والتغليف للصادر والوارد',
    },
  ]);

  const [payments, setPayments] = useState([
    {
      id: 'pay-sup-1',
      supplierName: 'PT Nusantara Charcoal & Spices',
      date: '2026-08-25',
      amountUSD: 15000,
      paymentMethod: 'تحويل بنكي دولي (LC / TT)',
      bankName: 'البنك الأهلي المصري - فرع الدولار',
      notes: 'دفعة سداد فاتورة الحاوية CONT-68M3-INDO-2026',
    },
    {
      id: 'pay-sup-2',
      supplierName: 'Vietnam Agri-Export Corporation',
      date: '2026-08-20',
      amountUSD: 8000,
      paymentMethod: 'تحويل بنكي دولي (TT)',
      bankName: 'بنك مسقط (Muscat Bank)',
      notes: 'تحويل دولار من حساب عمان',
    },
  ]);

  const [checks] = useState([
    {
      id: 'chk-1',
      supplierName: 'شركة النيل للكرتون والتغليف',
      checkNumber: 'CHK-908123',
      bankName: 'CIB - البنك التجاري الدولي',
      amount: 38000,
      currency: 'EGP',
      issueDate: '2026-08-15',
      dueDate: '2026-09-15',
      status: 'PENDING',
    },
    {
      id: 'chk-2',
      supplierName: 'PT Nusantara Charcoal & Spices',
      checkNumber: 'LC-BANK-7721',
      bankName: 'بنك قطر الوطني QNB',
      amount: 10000,
      currency: 'USD',
      issueDate: '2026-08-10',
      dueDate: '2026-08-30',
      status: 'CLEARED',
    },
  ]);

  const [newSupName, setNewSupName] = useState('');
  const [newSupCountry, setNewSupCountry] = useState('إندونيسيا');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupEmail, setNewSupEmail] = useState('');

  const [paySupName, setPaySupName] = useState('');
  const [payAmountUSD, setPayAmountUSD] = useState('');
  const [payBank, setPayBank] = useState('');
  const [payNotes, setPayNotes] = useState('');

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.country.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = countryFilter === 'all' || s.countryCode === countryFilter;
    return matchesSearch && matchesCountry;
  });

  const totalOwedUSD = filteredSuppliers.reduce((sum, s) => sum + (s.balanceUSD || 0), 0);

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName) return;
    const newSup = {
      id: 'sup-' + Date.now(),
      name: newSupName,
      country: newSupCountry,
      countryCode: newSupCountry.includes('مصر') ? 'EG' : newSupCountry.includes('فيتنام') ? 'VN' : 'ID',
      phone: newSupPhone || '—',
      email: newSupEmail || '—',
      balanceUSD: 0,
      notes: 'مورد جديد',
    };
    setSuppliers([newSup, ...suppliers]);
    setNewSupName('');
    setNewSupPhone('');
    setNewSupEmail('');
    setShowAddModal(false);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paySupName || !payAmountUSD) return;
    const newPay = {
      id: 'pay-sup-' + Date.now(),
      supplierName: paySupName,
      date: new Date().toISOString().split('T')[0],
      amountUSD: parseFloat(payAmountUSD),
      paymentMethod: 'تحويل بنكي (TT)',
      bankName: payBank || 'البنك الأهلي المصري',
      notes: payNotes || 'سداد مستحقات استيراد',
    };
    setPayments([newPay, ...payments]);
    setPaySupName('');
    setPayAmountUSD('');
    setPayBank('');
    setPayNotes('');
    setShowPaymentModal(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Factory className="text-amber-600" />
              إدارة الموردين والتحويلات الدولية للشحن
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              متابعة حسابات الموردين في (فيتنام، إندونيسيا، ومصر)، تحويلات العملة الصعبة (USD)، والشيكات البنكية.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow"
            >
              <ArrowUpRight size={16} />
              + تحويل / سداد للمورد
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow"
            >
              <Plus size={16} />
              إضافة مورد جديد
            </button>
          </div>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-2 border-b-2 -mb-[5px] ${
                  isActive
                    ? 'border-amber-500 text-amber-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: SUPPLIERS DIRECTORY */}
        {tab === 'suppliers' && (
          <div className="space-y-6">
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="glass-panel p-4 border-amber-200 bg-amber-50/30">
                <div className="text-xs font-bold text-slate-500">إجمالي مستحقات الموردين بالدولار</div>
                <div className="text-2xl font-black text-amber-700 font-mono mt-1">
                  ${totalOwedUSD.toLocaleString()} USD
                </div>
                <div className="text-[11px] text-amber-600 mt-1">مطلوب تحويلها للموردين بالخارج</div>
              </div>

              <div className="glass-panel p-4">
                <div className="text-xs font-bold text-slate-500">عدد الموردين المسجلين</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{filteredSuppliers.length} مورد</div>
                <div className="text-[11px] text-slate-400 mt-1">فيتنام، إندونيسيا، ومصر</div>
              </div>

              <div className="glass-panel p-4 border-emerald-200 bg-emerald-50/30">
                <div className="text-xs font-bold text-slate-500">آخر تحويل بنكي دولي</div>
                <div className="text-2xl font-black text-emerald-700 font-mono mt-1">$15,000 USD</div>
                <div className="text-[11px] text-emerald-600 mt-1">تحويل سداد شحنة الفحم</div>
              </div>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="glass-panel p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute right-3 top-3 text-slate-400" />
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
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-amber-500"
              >
                <option value="all">جميع الدول</option>
                <option value="ID">🇮🇩 إندونيسيا</option>
                <option value="VN">🇻🇳 فيتنام</option>
                <option value="EG">🇪🇬 مصر</option>
              </select>
            </div>

            {/* SUPPLIERS LIST */}
            <div className="glass-panel overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3.5">اسم المورد والتخصص</th>
                    <th className="p-3.5">الدولة</th>
                    <th className="p-3.5">بيانات الاتصال</th>
                    <th className="p-3.5">الرصيد المتبقي (علينا)</th>
                    <th className="p-3.5">ملاحظات والتصنيف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSuppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-extrabold text-slate-900">{s.name}</td>
                      <td className="p-3.5 text-slate-700 flex items-center gap-1.5">
                        <Globe2 size={14} className="text-amber-600" />
                        {s.country}
                      </td>
                      <td className="p-3.5">
                        <p className="font-mono text-slate-800">{s.phone}</p>
                        <p className="text-[10px] text-slate-400">{s.email}</p>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-sm">
                        {s.balanceUSD ? (
                          <span className="text-rose-600">${s.balanceUSD.toLocaleString()} USD</span>
                        ) : (
                          <span className="text-amber-700">{s.balanceEGP?.toLocaleString()} EGP</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-500">{s.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PAYMENTS */}
        {tab === 'payments' && (
          <div className="space-y-6">
            <div className="glass-panel p-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">سجل التحويلات والسداد البنكي للموردين</h3>
                <p className="text-xs text-slate-500">سجل التحويلات البنكية بالدولار والعملات المحلية لموردي الاستيراد</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl shadow"
              >
                + سداد جديد
              </button>
            </div>

            <div className="glass-panel overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3.5">المورد</th>
                    <th className="p-3.5">تاريخ التحويل</th>
                    <th className="p-3.5">المبلغ المحول</th>
                    <th className="p-3.5">وسيلة التحويل</th>
                    <th className="p-3.5">البنك / المرجع</th>
                    <th className="p-3.5">ملاحظات الشحنة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-800">{p.supplierName}</td>
                      <td className="p-3.5 font-mono text-slate-500">{p.date}</td>
                      <td className="p-3.5 font-mono font-bold text-emerald-700 text-sm">
                        ${p.amountUSD.toLocaleString()} USD
                      </td>
                      <td className="p-3.5 text-slate-700">{p.paymentMethod}</td>
                      <td className="p-3.5 text-slate-500">{p.bankName}</td>
                      <td className="p-3.5 text-slate-500">{p.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CHECKS */}
        {tab === 'checks' && (
          <div className="space-y-6">
            <div className="glass-panel p-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FileCheck className="text-amber-600" size={18} />
                سجل الشيكات والاعتمادات المستندية
              </h3>
              <p className="text-xs text-slate-500 mt-1">متابعة الشيكات الصادرة والواردة وتواريخ الاستحقاق البنكي</p>
            </div>

            <div className="glass-panel overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3.5">رقم الشيك / الاعتماد</th>
                    <th className="p-3.5">اسم المورد</th>
                    <th className="p-3.5">البنك الصادر</th>
                    <th className="p-3.5">قيمة الشيك</th>
                    <th className="p-3.5">تاريخ الإصدار</th>
                    <th className="p-3.5">تاريخ الاستحقاق</th>
                    <th className="p-3.5 text-center">حالة الصرف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {checks.map((chk) => (
                    <tr key={chk.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-mono font-bold text-amber-700">{chk.checkNumber}</td>
                      <td className="p-3.5 font-bold text-slate-800">{chk.supplierName}</td>
                      <td className="p-3.5 text-slate-700">{chk.bankName}</td>
                      <td className="p-3.5 font-mono font-bold text-emerald-700 text-sm">
                        {chk.amount.toLocaleString()} {chk.currency}
                      </td>
                      <td className="p-3.5 font-mono text-slate-500">{chk.issueDate}</td>
                      <td className="p-3.5 font-mono text-slate-500">{chk.dueDate}</td>
                      <td className="p-3.5 text-center">
                        {chk.status === 'CLEARED' ? (
                          <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            تم الصرف
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
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
        )}
      </div>

      {/* MODAL: ADD SUPPLIER */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="font-black text-lg text-slate-900">إضافة مورد جديد</h3>
            <form onSubmit={handleAddSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">اسم المورد / الشركة *</label>
                <input
                  type="text"
                  required
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                  placeholder="مثال: PT Nusantara Export"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">دولة المورد</label>
                <select
                  value={newSupCountry}
                  onChange={(e) => setNewSupCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="إندونيسيا">🇮🇩 إندونيسيا (Indonesia)</option>
                  <option value="فيتنام">🇻🇳 فيتنام (Vietnam)</option>
                  <option value="مصر">🇪🇬 مصر (Egypt)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">رقم الهاتف الدولي</label>
                <input
                  type="text"
                  value={newSupPhone}
                  onChange={(e) => setNewSupPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                  placeholder="+62 812..."
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={newSupEmail}
                  onChange={(e) => setNewSupEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                  placeholder="export@supplier.com"
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
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white font-extrabold hover:bg-amber-600 shadow"
                >
                  حفظ المورد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SUPPLIER PAYMENT */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="font-black text-lg text-emerald-700">سداد تحويل دولي لمورد</h3>
            <form onSubmit={handleAddPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">اسم المورد *</label>
                <select
                  value={paySupName}
                  onChange={(e) => setPaySupName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  required
                >
                  <option value="">اختر المورد...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.country})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">المبلغ المحول ($ USD) *</label>
                <input
                  type="number"
                  required
                  value={payAmountUSD}
                  onChange={(e) => setPayAmountUSD(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  placeholder="0.00 $"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">البنك الصادر والفرع</label>
                <input
                  type="text"
                  value={payBank}
                  onChange={(e) => setPayBank(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  placeholder="مثال: البنك الأهلي المصري - حساب الدولار"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">ملاحظات التحويل</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  placeholder="رقم الشحنة / الـ LC..."
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 shadow"
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
