'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { Customer } from '@/data/mockData';
import {
  Users,
  CreditCard,
  MapPin,
  Plus,
  Search,
  ArrowDownLeft,
  Printer,
  FileText
} from 'lucide-react';

const TABS = [
  { key: 'customers', label: 'دليل العملاء', icon: Users },
  { key: 'collections', label: 'التحصيلات', icon: CreditCard },
  { key: 'route', label: 'خط السير', icon: MapPin },
] as const;

type TabKey = typeof TABS[number]['key'];

const DAYS = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
const METHODS = ['نقدي كاش', 'تحويل بنكي', 'إنستاباي (InstaPay)', 'فودافون كاش', 'شيك بنكي'];

export default function CustomersPage() {
  const { customers, addCustomer, addCustomerPayment, invoices } = useApp();

  const [tab, setTab] = useState<TabKey>('customers');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState<'ALL' | 'EGY' | 'OMN'>('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [statementCustomer, setStatementCustomer] = useState<Customer | null>(null);

  // Add Customer Form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustBranch, setNewCustBranch] = useState<'EGY' | 'OMN'>('EGY');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustCreditLimit, setNewCustCreditLimit] = useState<number>(100000);
  const [newCustRouteDay, setNewCustRouteDay] = useState('السبت');

  // Payment Form state
  const [payCustId, setPayCustId] = useState('');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState('تحويل بنكي');
  const [payNotes, setPayNotes] = useState('');

  // Collections State
  const [collectionsList, setCollectionsList] = useState([
    {
      id: 'col-01',
      customerName: 'شركة الوادي للتجارة والتوزيع (القاهرة)',
      date: '2026-08-28',
      amount: 45000,
      currency: 'EGP',
      method: 'تحويل بنكي (الأهلي)',
      reference: 'TR-982103',
      notes: 'دفعة سداد من فاتورة INV-EGY-2026-081',
    },
    {
      id: 'col-02',
      customerName: 'مؤسسة الخليج للتجارة والاستيراد (مسقط)',
      date: '2026-08-26',
      amount: 1200,
      currency: 'OMR',
      method: 'شيك بنكي (مسقط)',
      reference: 'CHK-7712',
      notes: 'دفعة حساب مسقط',
    },
    {
      id: 'col-03',
      customerName: 'سلسلة مطاعم قصر المشويات (الإسكندرية)',
      date: '2026-08-20',
      amount: 20500,
      currency: 'EGP',
      method: 'إنستاباي (InstaPay)',
      reference: 'INSTA-881920',
      notes: 'الدفعة الأولى من فاتورة توريد الفحم',
    },
  ]);

  // Filtering
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.address.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = branchFilter === 'ALL' || c.branch === branchFilter;
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

  // Add Customer Submit
  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName) return;

    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      name: newCustName,
      phone: newCustPhone || '—',
      branch: newCustBranch,
      currency: newCustBranch === 'EGY' ? 'EGP' : 'OMR',
      balance: 0,
      creditLimit: newCustCreditLimit,
      address: newCustAddress || 'غير محدد',
      routeDays: [newCustRouteDay],
      totalPurchases: 0,
      status: 'ACTIVE',
    };

    addCustomer(newCust);
    setShowAddModal(false);

    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
  };

  // Add Payment Submit
  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === payCustId);
    if (!cust || payAmount <= 0) return;

    addCustomerPayment(cust.id, payAmount, payMethod, payNotes);

    const newCol = {
      id: 'col-' + Date.now(),
      customerName: cust.name,
      date: new Date().toISOString().split('T')[0],
      amount: payAmount,
      currency: cust.currency,
      method: payMethod,
      reference: 'TR-' + Math.floor(100000 + Math.random() * 900000),
      notes: payNotes || 'تحصيل مالي على الحساب',
    };

    setCollectionsList([newCol, ...collectionsList]);
    setShowPaymentModal(false);
    setPayAmount(0);
    setPayNotes('');
  };

  // Invoices for statement modal
  const customerInvoices = statementCustomer
    ? invoices.filter((inv) => inv.customerId === statementCustomer.id)
    : [];

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 sm:pb-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Users className="text-amber-600 flex-shrink-0" size={24} />
              <span>إدارة العملاء والتحصيلات وخطوط السير</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              متابعة حسابات العملاء لفروع مصر (EGP) وسلطنة عمان (OMR)، كشوف الحساب، والتحصيلات.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-600/20"
            >
              <ArrowDownLeft size={16} />
              + تسجيل تحصيل
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-md shadow-amber-500/20"
            >
              <Plus size={16} />
              إضافة عميل
            </button>
          </div>
        </div>

        {/* 4 SUMMARY STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="glass-panel p-3.5 sm:p-4">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">عدد العملاء</div>
            <div className="text-lg sm:text-2xl font-black text-slate-900 mt-1">{filteredCustomers.length} عميل</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-bold mt-0.5">مصر وعمان</div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 border-rose-200 bg-rose-50/20">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">ديون مصر (لينا)</div>
            <div className="text-lg sm:text-2xl font-black text-rose-600 font-mono mt-1">
              {totalDebtsEGP.toLocaleString()} ج.م
            </div>
            <div className="text-[10px] sm:text-[11px] text-rose-500 font-bold mt-0.5">مستحق التحصيل</div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 border-sky-200 bg-sky-50/20">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">ديون عمان (لينا)</div>
            <div className="text-lg sm:text-2xl font-black text-sky-700 font-mono mt-1">
              {totalDebtsOMR.toLocaleString()} ر.ع
            </div>
            <div className="text-[10px] sm:text-[11px] text-sky-600 font-bold mt-0.5">فرع عمان</div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 border-emerald-200 bg-emerald-50/20">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">سداد مقدم (دائن)</div>
            <div className="text-lg sm:text-2xl font-black text-emerald-700 font-mono mt-1">
              450 ر.ع
            </div>
            <div className="text-[10px] sm:text-[11px] text-emerald-600 font-bold mt-0.5">أرصدة لصالحهم</div>
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

        {/* TAB 1: CUSTOMERS DIRECTORY */}
        {tab === 'customers' && (
          <div className="space-y-4">
            {/* SEARCH & FILTERS */}
            <div className="glass-panel p-3 flex flex-col md:flex-row gap-2.5 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث باسم العميل أو الهاتف..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={branchFilter}
                  onChange={(e: any) => setBranchFilter(e.target.value)}
                  className="flex-1 md:flex-none bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">جميع الفروع</option>
                  <option value="EGY">🇪🇬 مصر (EGP)</option>
                  <option value="OMN">🇴🇲 عمان (OMR)</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 md:flex-none bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="unpaid">عليهم ديون</option>
                  <option value="overpaid">دائن</option>
                  <option value="cleared">خالص</option>
                </select>
              </div>
            </div>

            {/* CUSTOMERS TABLE */}
            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs min-w-[650px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">اسم العميل</th>
                      <th className="p-3">الفرع</th>
                      <th className="p-3">الهاتف</th>
                      <th className="p-3">العنوان</th>
                      <th className="p-3">خط السير</th>
                      <th className="p-3">الرصيد المالي</th>
                      <th className="p-3 text-center">كشف الحساب</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-800">
                          <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{c.name}</p>
                          <span className="text-[10px] text-slate-500">
                            حد الائتمان: {c.creditLimit?.toLocaleString()} {c.currency}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] border border-slate-200 font-bold">
                            {c.branch === 'EGY' ? '🇪🇬 مصر' : '🇴🇲 عمان'}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-700 font-bold">{c.phone}</td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">{c.address}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {c.routeDays?.map((d) => (
                              <span
                                key={d}
                                className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-bold"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 font-mono font-black text-xs sm:text-sm">
                          {c.balance > 0 ? (
                            <span className="text-rose-600">
                              +{c.balance.toLocaleString()} {c.currency}
                            </span>
                          ) : c.balance < 0 ? (
                            <span className="text-emerald-600">
                              {c.balance.toLocaleString()} {c.currency}
                            </span>
                          ) : (
                            <span className="text-slate-400">0.00</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setStatementCustomer(c)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 mx-auto transition shadow-sm"
                          >
                            <FileText size={13} />
                            كشف حساب
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COLLECTIONS */}
        {tab === 'collections' && (
          <div className="space-y-4">
            <div className="glass-panel p-3.5 sm:p-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <CreditCard className="text-amber-600" size={17} />
                  سجل التحصيلات المالية
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  توثيق المقبوضات النقدية والبنكية
                </p>
              </div>
            </div>

            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs min-w-[600px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">المرجع</th>
                      <th className="p-3">اسم العميل</th>
                      <th className="p-3">التاريخ</th>
                      <th className="p-3">المبلغ</th>
                      <th className="p-3">وسيلة السداد</th>
                      <th className="p-3">ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {collectionsList.map((col) => (
                      <tr key={col.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-amber-700 font-bold">{col.reference}</td>
                        <td className="p-3 font-bold text-slate-900">{col.customerName}</td>
                        <td className="p-3 font-mono text-slate-500">{col.date}</td>
                        <td className="p-3 font-mono font-black text-emerald-700 text-xs sm:text-sm">
                          {col.amount.toLocaleString()} {col.currency}
                        </td>
                        <td className="p-3 text-slate-700 font-bold">{col.method}</td>
                        <td className="p-3 text-slate-500">{col.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ROUTE DAYS */}
        {tab === 'route' && (
          <div className="space-y-4">
            <div className="glass-panel p-3.5 sm:p-4">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="text-amber-600" size={17} />
                جدول خطوط السير والتوزيع الأسبوعي
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                توزيع مواعيد التسليم والزيارات الميدانية لسائقي الأسطول
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {DAYS.map((day) => {
                const dayCusts = customers.filter((c) => c.routeDays?.includes(day));
                return (
                  <div key={day} className="glass-panel p-3.5 sm:p-4 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-black text-sm text-amber-700">{day}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                        {dayCusts.length} عملاء
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dayCusts.map((c) => (
                        <div
                          key={c.id}
                          className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-slate-800">{c.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{c.address}</p>
                          </div>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                            {c.branch === 'EGY' ? 'مصر' : 'عمان'}
                          </span>
                        </div>
                      ))}
                      {dayCusts.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-3">
                          لا يوجد عملاء مخصصين
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD CUSTOMER */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-black text-base sm:text-lg text-slate-900">إضافة عميل جديد</h3>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم العميل / الشركة *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="مثال: شركة النصر للتوزيع"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">رقم الهاتف *</label>
                <input
                  type="text"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="010xxxxxxx"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الفرع</label>
                  <select
                    value={newCustBranch}
                    onChange={(e: any) => setNewCustBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-bold"
                  >
                    <option value="EGY">🇪🇬 مصر (EGP)</option>
                    <option value="OMN">🇴🇲 عمان (OMR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">يوم خط السير</label>
                  <select
                    value={newCustRouteDay}
                    onChange={(e) => setNewCustRouteDay(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-bold"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">العنوان</label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="المدينة، الشارع..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
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
                  حفظ العميل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD PAYMENT COLLECTION */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-black text-base sm:text-lg text-emerald-700 flex items-center gap-2">
              <ArrowDownLeft />
              تسجيل تحصيل مالي
            </h3>

            <form onSubmit={handleAddPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم العميل *</label>
                <select
                  required
                  value={payCustId}
                  onChange={(e) => setPayCustId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="">اختر العميل...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.balance.toLocaleString()} {c.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">المبلغ المحصل *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={payAmount || ''}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-mono font-bold text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">طريقة السداد</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-bold"
                >
                  {METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ملاحظات / رقم العملية</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="رقم التحويل أو الشيك..."
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
                  تأكيد التحصيل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CUSTOMER STATEMENT */}
      {statementCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-4 sm:p-8 space-y-4 sm:space-y-5 shadow-2xl border border-slate-200 print:m-0 print:p-0 print:border-none max-h-[90vh] overflow-y-auto">
            {/* STATEMENT HEADER */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 sm:pb-4 gap-2">
              <div>
                <h2 className="text-base sm:text-xl font-black text-slate-900">شركة بي قاسم للاستيراد والتصدير</h2>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">كشف حساب تفصيلي للعميل وحركة المديونية</p>
              </div>

              <div className="text-left font-mono flex-shrink-0">
                <span className="text-[10px] sm:text-xs bg-amber-100 text-amber-900 font-black px-2.5 py-1 rounded-md">
                  كشف حساب
                </span>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1.5">
                  {new Date().toISOString().split('T')[0]}
                </p>
              </div>
            </div>

            {/* CUSTOMER SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">اسم العميل:</span>
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">{statementCustomer.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">الهاتف:</span>
                <span className="font-mono font-bold text-slate-800">{statementCustomer.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">الرصيد المالي:</span>
                <span className="font-mono font-black text-sm sm:text-base text-rose-600">
                  {statementCustomer.balance.toLocaleString()} {statementCustomer.currency}
                </span>
              </div>
            </div>

            {/* TRANSACTIONS TABLE */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-800">حركة الفواتير والمسحوبات:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs min-w-[450px]">
                  <thead className="bg-slate-100 text-slate-700 font-extrabold border-y border-slate-200">
                    <tr>
                      <th className="p-2">رقم الفاتورة</th>
                      <th className="p-2">التاريخ</th>
                      <th className="p-2">القيمة</th>
                      <th className="p-2">المسدد</th>
                      <th className="p-2 text-left">المتبقي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customerInvoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="p-2 font-mono font-bold text-amber-700">{inv.invoiceNumber}</td>
                        <td className="p-2 font-mono text-slate-500">{inv.date}</td>
                        <td className="p-2 font-mono font-bold text-slate-900">
                          {inv.totalAmount.toLocaleString()} {inv.currency}
                        </td>
                        <td className="p-2 font-mono text-emerald-700 font-bold">
                          {inv.paidAmount.toLocaleString()} {inv.currency}
                        </td>
                        <td className="p-2 font-mono font-black text-rose-600 text-left">
                          {inv.remainingAmount.toLocaleString()} {inv.currency}
                        </td>
                      </tr>
                    ))}
                    {customerInvoices.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-slate-400">
                          لا توجد فواتير مسجلة لهذا العميل حتى الآن.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* STATEMENT FOOTER & PRINT */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="text-[11px] text-slate-400">
                <span>توقيع المحاسب: ....................</span>
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
                  onClick={() => setStatementCustomer(null)}
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
