'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Users,
  CreditCard,
  MapPin,
  Plus,
  Search,
  Filter,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Phone,
  Building,
  Check
} from 'lucide-react';

const TABS = [
  { key: 'customers', label: 'دليل العملاء', icon: Users },
  { key: 'collections', label: 'سجل التحصيلات والتحويلات', icon: CreditCard },
  { key: 'route', label: 'خط السير وأيام التوزيع', icon: MapPin },
] as const;

type TabKey = typeof TABS[number]['key'];

const DAYS = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
const METHODS = ['نقدي', 'تحويل بنكي', 'إنستاباي', 'فودافون كاش', 'شيك بنكي'];

export default function CustomersPage() {
  const [tab, setTab] = useState<TabKey>('customers');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock initial state for Customers
  const [customers, setCustomers] = useState([
    {
      id: 'c1',
      name: 'شركة الوادي للتوزيع والشحن (القاهرة)',
      phone: '01012345678',
      branch: 'EGY',
      currency: 'EGP',
      balance: 145000,
      address: 'مدينة نصر، القاهرة - مصر',
      routeDays: ['السبت', 'الثلاثاء'],
    },
    {
      id: 'c2',
      name: 'مؤسسة الخليج للتجارة والاستيراد (مسقط)',
      phone: '+968 9123 4567',
      branch: 'OMN',
      currency: 'OMR',
      balance: 2850,
      address: 'مطرح، مسقط - سلطنة عمان',
      routeDays: ['الأحد', 'الاربعاء'],
    },
    {
      id: 'c3',
      name: 'شركة الدلتا لتجارة الفحم والمواد الغذائية',
      phone: '01198765432',
      branch: 'EGY',
      currency: 'EGP',
      balance: 0,
      address: 'طنطا، الغربية - مصر',
      routeDays: ['الإثنين'],
    },
    {
      id: 'c4',
      name: 'مركز النور التجاري (صلالة)',
      phone: '+968 9876 1234',
      branch: 'OMN',
      currency: 'OMR',
      balance: -450, // Paid in advance
      address: 'صلالة - سلطنة عمان',
      routeDays: ['الخميس'],
    },
  ]);

  // Mock initial state for Collections/Payments
  const [collections, setCollections] = useState([
    {
      id: 'pay-101',
      customerName: 'شركة الوادي للتوزيع والشحن',
      date: '2026-08-28',
      amount: 45000,
      currency: 'EGP',
      method: 'تحويل بنكي',
      reference: 'TR-982103',
      notes: 'تحصيل جزء من الفاتورة INV-2026-08',
    },
    {
      id: 'pay-102',
      customerName: 'مؤسسة الخليج للتجارة والاستيراد',
      date: '2026-08-26',
      amount: 1200,
      currency: 'OMR',
      method: 'شيك بنكي',
      reference: 'CHK-7712',
      notes: 'دفعة حساب مسقط',
    },
  ]);

  // Form states
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustBranch, setNewCustBranch] = useState('EGY');
  const [newCustAddress, setNewCustAddress] = useState('');

  const [payCustName, setPayCustName] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('تحويل بنكي');
  const [payNotes, setPayNotes] = useState('');

  // Filtering
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesBranch = branchFilter === 'all' || c.branch === branchFilter;
    const isUnpaid = c.balance > 0.01;
    const isOverpaid = c.balance < -0.01;
    const isCleared = Math.abs(c.balance) <= 0.01;

    let matchesStatus = true;
    if (statusFilter === 'unpaid') matchesStatus = isUnpaid;
    if (statusFilter === 'overpaid') matchesStatus = isOverpaid;
    if (statusFilter === 'cleared') matchesStatus = isCleared;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const totalDebtsEGP = filteredCustomers
    .filter((c) => c.currency === 'EGP' && c.balance > 0)
    .reduce((sum, c) => sum + c.balance, 0);

  const totalDebtsOMR = filteredCustomers
    .filter((c) => c.currency === 'OMR' && c.balance > 0)
    .reduce((sum, c) => sum + c.balance, 0);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName) return;
    const newCust = {
      id: 'c-' + Date.now(),
      name: newCustName,
      phone: newCustPhone || '—',
      branch: newCustBranch,
      currency: newCustBranch === 'EGY' ? 'EGP' : 'OMR',
      balance: 0,
      address: newCustAddress || 'غير محدد',
      routeDays: ['السبت'],
    };
    setCustomers([newCust, ...customers]);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setShowAddModal(false);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payCustName || !payAmount) return;
    const newPay = {
      id: 'pay-' + Date.now(),
      customerName: payCustName,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(payAmount),
      currency: payCustName.includes('عمان') || payCustName.includes('مسقط') ? 'OMR' : 'EGP',
      method: payMethod,
      reference: 'REF-' + Math.floor(1000 + Math.random() * 9000),
      notes: payNotes || 'تحصيل نقدية',
    };
    setCollections([newPay, ...collections]);
    setPayCustName('');
    setPayAmount('');
    setPayNotes('');
    setShowPaymentModal(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-amber-400 flex items-center gap-2">
              <Users className="text-amber-500" />
              إدارة العملاء والحسابات والتحصيلات
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              متابعة حسابات العملاء لفروع مصر (EGP) وسلطنة عمان (OMR)، التحصيلات، وخطوط سير التوزيع.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/20"
            >
              <ArrowDownLeft size={16} />
              + تسجيل تحصيل جديد
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
            >
              <Plus size={16} />
              إضافة عميل جديد
            </button>
          </div>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-2 border-b-2 -mb-[5px] ${
                  isActive
                    ? 'border-amber-400 text-amber-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: CUSTOMERS DIRECTORY */}
        {tab === 'customers' && (
          <div className="space-y-6">
            {/* KPI STATS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="glass-panel p-4">
                <div className="text-xs font-semibold text-slate-400">إجمالي عدد العملاء</div>
                <div className="text-2xl font-black text-slate-100 mt-1">{filteredCustomers.length} عميل</div>
                <div className="text-[11px] text-slate-500 mt-1">موزعين على الفروع</div>
              </div>

              <div className="glass-panel p-4 border-rose-500/30">
                <div className="text-xs font-semibold text-slate-400">ديون عملاء مصر (لينا)</div>
                <div className="text-2xl font-black text-rose-400 font-mono mt-1">
                  {totalDebtsEGP.toLocaleString()} ج.م
                </div>
                <div className="text-[11px] text-rose-500/80 mt-1">مبالغ مستحقة للتحصيل</div>
              </div>

              <div className="glass-panel p-4 border-sky-500/30">
                <div className="text-xs font-semibold text-slate-400">ديون عملاء عمان (لينا)</div>
                <div className="text-2xl font-black text-sky-400 font-mono mt-1">
                  {totalDebtsOMR.toLocaleString()} ر.ع
                </div>
                <div className="text-[11px] text-sky-500/80 mt-1">فرع سلطنة عمان</div>
              </div>

              <div className="glass-panel p-4 border-emerald-500/30">
                <div className="text-xs font-semibold text-slate-400">مدفوعات مقدمة (علينا)</div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                  450 ر.ع / 0 ج.م
                </div>
                <div className="text-[11px] text-emerald-500/80 mt-1">أرصدة دائنة للعملاء</div>
              </div>
            </div>

            {/* SEARCH & FILTERS BAR */}
            <div className="glass-panel p-3 flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث باسم العميل أو رقم الهاتف..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">جميع الفروع</option>
                  <option value="EGY">🇪🇬 فرع مصر (EGP)</option>
                  <option value="OMN">🇴🇲 فرع عمان (OMR)</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="unpaid">عليها ديون (غير مسدد)</option>
                  <option value="overpaid">مدفوعات مقدمة (دائن)</option>
                  <option value="cleared">حساب خالص (صفر)</option>
                </select>
              </div>
            </div>

            {/* CUSTOMERS TABLE & CARDS (RESPONSIVE MOBILE FIRST) */}
            <div className="glass-panel overflow-hidden">
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">العميل والفرع</th>
                      <th className="p-3.5">رقم الهاتف والتواصل</th>
                      <th className="p-3.5">العنوان</th>
                      <th className="p-3.5">أيام التوزيع</th>
                      <th className="p-3.5">الرصيد المالي</th>
                      <th className="p-3.5 text-center">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3.5 font-bold text-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{c.branch === 'EGY' ? '🇪🇬' : '🇴🇲'}</span>
                            <div>
                              <p className="font-extrabold text-slate-100">{c.name}</p>
                              <span className="text-[10px] text-slate-400">
                                {c.branch === 'EGY' ? 'فرع مصر' : 'فرع عمان'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-slate-300">{c.phone}</td>
                        <td className="p-3.5 text-slate-400 max-w-xs truncate">{c.address}</td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1">
                            {c.routeDays.map((d) => (
                              <span
                                key={d}
                                className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-700"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-sm">
                          {c.balance > 0 ? (
                            <span className="text-rose-400">
                              +{c.balance.toLocaleString()} {c.currency} (مدين)
                            </span>
                          ) : c.balance < 0 ? (
                            <span className="text-emerald-400">
                              {c.balance.toLocaleString()} {c.currency} (دائن)
                            </span>
                          ) : (
                            <span className="text-slate-400">0.00 {c.currency} (خالص)</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          {c.balance > 0 ? (
                            <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">
                              مطلوب سداد
                            </span>
                          ) : c.balance < 0 ? (
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">
                              رصيد مقدم
                            </span>
                          ) : (
                            <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                              حساب خالص
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className="md:hidden divide-y divide-slate-800">
                {filteredCustomers.map((c) => (
                  <div key={c.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs">{c.branch === 'EGY' ? '🇪🇬' : '🇴🇲'}</span>
                        <h4 className="font-extrabold text-sm text-slate-100">{c.name}</h4>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">{c.phone}</p>
                      </div>
                      {c.balance > 0 ? (
                        <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          غير مسدد
                        </span>
                      ) : (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          خالص
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                      <span className="text-slate-400">الرصيد الحسابي:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {c.balance.toLocaleString()} {c.currency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COLLECTIONS & PAYMENTS */}
        {tab === 'collections' && (
          <div className="space-y-6">
            <div className="glass-panel p-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">سجل التحصيلات المالية الموردة</h3>
                <p className="text-xs text-slate-400">جميع مبالغ التحصيل النقدي والبنكي والشيكات المقبوضة من العملاء</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded-xl"
              >
                + تحصيل جديد
              </button>
            </div>

            <div className="glass-panel overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">المرجع</th>
                    <th className="p-3.5">اسم العميل</th>
                    <th className="p-3.5">التاريخ</th>
                    <th className="p-3.5">المبلغ المدفوع</th>
                    <th className="p-3.5">طريقة السداد</th>
                    <th className="p-3.5">ملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {collections.map((col) => (
                    <tr key={col.id} className="hover:bg-slate-800/30">
                      <td className="p-3.5 font-mono text-amber-400 font-bold">{col.reference}</td>
                      <td className="p-3.5 font-bold text-slate-200">{col.customerName}</td>
                      <td className="p-3.5 font-mono text-slate-400">{col.date}</td>
                      <td className="p-3.5 font-mono font-bold text-emerald-400 text-sm">
                        {col.amount.toLocaleString()} {col.currency}
                      </td>
                      <td className="p-3.5 text-slate-300 font-medium">{col.method}</td>
                      <td className="p-3.5 text-slate-400">{col.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ROUTE DAYS */}
        {tab === 'route' && (
          <div className="space-y-6">
            <div className="glass-panel p-4">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <MapPin className="text-amber-400" size={18} />
                جدول خطوط السير والتوزيع الأسبوعي
              </h3>
              <p className="text-xs text-slate-400 mt-1">توزيع العملاء على أيام الأسبوع لسيارات الشحن والتوزيع</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DAYS.map((day) => {
                const dayCusts = customers.filter((c) => c.routeDays.includes(day));
                return (
                  <div key={day} className="glass-panel p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-extrabold text-sm text-amber-400">{day}</span>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {dayCusts.length} عميل
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dayCusts.map((c) => (
                        <div
                          key={c.id}
                          className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-xs flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-slate-200">{c.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{c.address}</p>
                          </div>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {c.branch === 'EGY' ? 'مصر' : 'عمان'}
                          </span>
                        </div>
                      ))}
                      {dayCusts.length === 0 && (
                        <p className="text-xs text-slate-500 text-center py-4">لا يوجد عملاء مخصصين لهذا اليوم</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD CUSTOMER */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 space-y-4 border-amber-500/30">
            <h3 className="font-black text-lg text-amber-400">إضافة عميل جديد</h3>
            <form onSubmit={handleAddCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">اسم العميل / الشركة *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  placeholder="مثال: شركة النصر للتوزيع"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  placeholder="010xxxxxxx"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">الفرع التابع له</label>
                <select
                  value={newCustBranch}
                  onChange={(e) => setNewCustBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="EGY">🇪🇬 فرع مصر (EGP)</option>
                  <option value="OMN">🇴🇲 فرع عمان (OMR)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">العنوان</label>
                <textarea
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 h-20"
                  placeholder="العنوان التفصيلي..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold hover:bg-amber-400"
                >
                  حفظ العميل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD COLLECTION PAYMENT */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 space-y-4 border-emerald-500/30">
            <h3 className="font-black text-lg text-emerald-400">تسجيل تحصيل مالي من عميل</h3>
            <form onSubmit={handleAddPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">اسم العميل *</label>
                <select
                  value={payCustName}
                  onChange={(e) => setPayCustName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                >
                  <option value="">اختر العميل...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">المبلغ المحصّل *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">طريقة السداد</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ملاحظات / مرجع التحويل</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  placeholder="رقم العملية / اسم البنك..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-500"
                >
                  تأكيد التحصيل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
