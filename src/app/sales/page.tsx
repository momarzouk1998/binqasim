'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { SalesInvoice, InvoiceItem } from '@/data/mockData';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Eye,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Building2,
  DollarSign,
  Trash2,
  X,
  CreditCard,
  User
} from 'lucide-react';

export default function SalesPage() {
  const {
    invoices,
    addInvoice,
    customers,
    products,
    installments,
    payInstallment,
    cheques,
    clearCheque,
    selectedBranch,
    usdToEgpRate,
    usdToOmrRate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'invoices' | 'installments' | 'cheques'>('invoices');
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState<'ALL' | 'EGY' | 'OMN'>('ALL');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('ALL');

  // Modals state
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<SalesInvoice | null>(null);

  // New Invoice Form state
  const [invCustomerId, setInvCustomerId] = useState('');
  const [invBranch, setInvBranch] = useState<'EGY' | 'OMN'>('EGY');
  const [invPaymentType, setInvPaymentType] = useState<'CASH' | 'CREDIT' | 'INSTALLMENT' | 'CHEQUE'>('CASH');
  const [invPaidAmount, setInvPaidAmount] = useState<number>(0);
  const [invDueDate, setInvDueDate] = useState('');
  const [invNotes, setInvNotes] = useState('');

  // Invoice Items Builder
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      id: 'item-' + Date.now(),
      itemId: products[0]?.id || 'prod-01',
      name: products[0]?.nameAr || 'فحم طبيعي فاخر',
      quantity: 1,
      unit: 'طن',
      unitPrice: products[0]?.priceEGP || 27500,
      unitLandedCost: products[0]?.landedCostEGP || 22000,
      totalPrice: products[0]?.priceEGP || 27500,
      totalCost: products[0]?.landedCostEGP || 22000,
      profit: (products[0]?.priceEGP || 27500) - (products[0]?.landedCostEGP || 22000),
    },
  ]);

  // Handle adding line item
  const handleAddLineItem = () => {
    const firstProd = products[0];
    const unitPrice = invBranch === 'EGY' ? firstProd.priceEGP : firstProd.priceOMR;
    const unitCost = invBranch === 'EGY' ? firstProd.landedCostEGP : (firstProd.landedCostUSD * usdToOmrRate);

    const newItem: InvoiceItem = {
      id: 'item-' + Date.now(),
      itemId: firstProd.id,
      name: firstProd.nameAr,
      quantity: 1,
      unit: firstProd.unit === 'TON' ? 'طن' : firstProd.unit === 'CARTON' ? 'كرتونة' : 'شيكارة',
      unitPrice: unitPrice,
      unitLandedCost: unitCost,
      totalPrice: unitPrice,
      totalCost: unitCost,
      profit: unitPrice - unitCost,
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const handleRemoveLineItem = (id: string) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((i) => i.id !== id));
    }
  };

  const handleItemChange = (index: number, itemId: string) => {
    const prod = products.find((p) => p.id === itemId);
    if (!prod) return;

    const unitPrice = invBranch === 'EGY' ? prod.priceEGP : prod.priceOMR;
    const unitCost = invBranch === 'EGY' ? prod.landedCostEGP : (prod.landedCostUSD * usdToOmrRate);

    const updated = [...invoiceItems];
    updated[index] = {
      ...updated[index],
      itemId: prod.id,
      name: prod.nameAr,
      unit: prod.unit === 'TON' ? 'طن' : prod.unit === 'CARTON' ? 'كرتونة' : 'شيكارة',
      unitPrice: unitPrice,
      unitLandedCost: unitCost,
      totalPrice: unitPrice * updated[index].quantity,
      totalCost: unitCost * updated[index].quantity,
      profit: (unitPrice - unitCost) * updated[index].quantity,
    };
    setInvoiceItems(updated);
  };

  const handleQuantityPriceChange = (index: number, qty: number, price: number) => {
    const updated = [...invoiceItems];
    const item = updated[index];
    const validQty = Math.max(0.1, qty);
    const validPrice = Math.max(0, price);

    updated[index] = {
      ...item,
      quantity: validQty,
      unitPrice: validPrice,
      totalPrice: validQty * validPrice,
      totalCost: validQty * item.unitLandedCost,
      profit: (validPrice - item.unitLandedCost) * validQty,
    };
    setInvoiceItems(updated);
  };

  // Calculations for new invoice
  const invTotalAmount = invoiceItems.reduce((sum, i) => sum + i.totalPrice, 0);
  const invTotalCost = invoiceItems.reduce((sum, i) => sum + i.totalCost, 0);
  const invNetProfit = invTotalAmount - invTotalCost;
  const calculatedRemaining = Math.max(0, invTotalAmount - (invPaymentType === 'CASH' ? invTotalAmount : invPaidAmount));

  // Submit New Invoice
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invCustomerId) return;

    const cust = customers.find((c) => c.id === invCustomerId);
    if (!cust) return;

    const invoiceNumber = `INV-${invBranch}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    addInvoice({
      invoiceNumber,
      customerId: cust.id,
      customerName: cust.name,
      branch: invBranch,
      currency: invBranch === 'EGY' ? 'EGP' : 'OMR',
      paymentType: invPaymentType,
      totalAmount: invTotalAmount,
      paidAmount: invPaymentType === 'CASH' ? invTotalAmount : invPaidAmount,
      remainingAmount: calculatedRemaining,
      taxAmount: 0,
      totalCost: invTotalCost,
      netProfit: invNetProfit,
      date: new Date().toISOString().split('T')[0],
      dueDate: invDueDate || undefined,
      notes: invNotes,
      items: invoiceItems,
    });

    setShowNewInvoiceModal(false);
    // Reset form
    setInvoiceItems([
      {
        id: 'item-' + Date.now(),
        itemId: products[0]?.id || 'prod-01',
        name: products[0]?.nameAr || 'فحم طبيعي فاخر',
        quantity: 1,
        unit: 'طن',
        unitPrice: products[0]?.priceEGP || 27500,
        unitLandedCost: products[0]?.landedCostEGP || 22000,
        totalPrice: products[0]?.priceEGP || 27500,
        totalCost: products[0]?.landedCostEGP || 22000,
        profit: (products[0]?.priceEGP || 27500) - (products[0]?.landedCostEGP || 22000),
      },
    ]);
  };

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = branchFilter === 'ALL' || inv.branch === branchFilter;
    const matchesType = paymentTypeFilter === 'ALL' || inv.paymentType === paymentTypeFilter;
    return matchesSearch && matchesBranch && matchesType;
  });

  // KPI calculations
  const totalSalesEGP = invoices
    .filter((i) => i.currency === 'EGP')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalCollectedEGP = invoices
    .filter((i) => i.currency === 'EGP')
    .reduce((sum, i) => sum + i.paidAmount, 0);

  const totalRemainingEGP = invoices
    .filter((i) => i.currency === 'EGP')
    .reduce((sum, i) => sum + i.remainingAmount, 0);

  const totalSalesOMR = invoices
    .filter((i) => i.currency === 'OMR')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 sm:pb-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Receipt className="text-amber-600 flex-shrink-0" size={24} />
              <span>إدارة المبيعات وفواتير العملاء والأقساط</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              إصدار فواتير المبيعات لفروع مصر (EGP) وعمان (OMR)، متابعة الدفع الآجل، الأقساط، وحافظة الشيكات.
            </p>
          </div>

          <button
            onClick={() => setShowNewInvoiceModal(true)}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-md shadow-amber-500/20"
          >
            <Plus size={16} />
            + إنشاء فاتورة جديدة
          </button>
        </div>

        {/* 4 SUMMARY STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="glass-panel p-3.5 sm:p-4 border-sky-200 bg-sky-50/20">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">مبيعات مصر (EGP)</div>
            <div className="text-lg sm:text-2xl font-black text-sky-800 font-mono mt-1">
              {totalSalesEGP.toLocaleString()} ج.م
            </div>
            <div className="text-[10px] sm:text-[11px] text-sky-600 font-bold mt-0.5">فواتير مسجلة</div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 border-emerald-200 bg-emerald-50/20">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">المبالغ المحصلة</div>
            <div className="text-lg sm:text-2xl font-black text-emerald-700 font-mono mt-1">
              {totalCollectedEGP.toLocaleString()} ج.م
            </div>
            <div className="text-[10px] sm:text-[11px] text-emerald-600 font-bold mt-0.5">سداد نقدي وبنكي</div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 border-rose-200 bg-rose-50/20">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">متبقي آجل وأقساط</div>
            <div className="text-lg sm:text-2xl font-black text-rose-600 font-mono mt-1">
              {totalRemainingEGP.toLocaleString()} ج.م
            </div>
            <div className="text-[10px] sm:text-[11px] text-rose-500 font-bold mt-0.5">مستحق التحصيل</div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 border-amber-200 bg-amber-50/20">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">مبيعات عمان (OMR)</div>
            <div className="text-lg sm:text-2xl font-black text-amber-700 font-mono mt-1">
              {totalSalesOMR.toLocaleString()} ر.ع
            </div>
            <div className="text-[10px] sm:text-[11px] text-amber-600 font-bold mt-0.5">سلطنة عمان</div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 sm:px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 -mb-[5px] whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Receipt size={15} />
            فواتير المبيعات ({invoices.length})
          </button>

          <button
            onClick={() => setActiveTab('installments')}
            className={`px-3 sm:px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 -mb-[5px] whitespace-nowrap ${
              activeTab === 'installments'
                ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar size={15} />
            أقساط العملاء ({installments.length})
          </button>

          <button
            onClick={() => setActiveTab('cheques')}
            className={`px-3 sm:px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 -mb-[5px] whitespace-nowrap ${
              activeTab === 'cheques'
                ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileCheck size={15} />
            حافظة الشيكات ({cheques.length})
          </button>
        </div>

        {/* TAB 1: INVOICES LIST */}
        {activeTab === 'invoices' && (
          <div className="space-y-3 sm:space-y-4">
            {/* SEARCH & FILTER BAR */}
            <div className="glass-panel p-3 flex flex-col md:flex-row items-center justify-between gap-2.5">
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث برقم الفاتورة أو العميل..."
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
                  value={paymentTypeFilter}
                  onChange={(e) => setPaymentTypeFilter(e.target.value)}
                  className="flex-1 md:flex-none bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">كل طرق الدفع</option>
                  <option value="CASH">نقدي</option>
                  <option value="CREDIT">آجل</option>
                  <option value="INSTALLMENT">تقسيط</option>
                  <option value="CHEQUE">شيك</option>
                </select>
              </div>
            </div>

            {/* INVOICES TABLE */}
            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs min-w-[650px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">رقم الفاتورة</th>
                      <th className="p-3">العميل والفرع</th>
                      <th className="p-3">طريقة الدفع</th>
                      <th className="p-3">الإجمالي</th>
                      <th className="p-3">المسدد</th>
                      <th className="p-3">المتبقي (آجل)</th>
                      <th className="p-3">الربح</th>
                      <th className="p-3">التاريخ</th>
                      <th className="p-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-extrabold text-amber-700 text-xs sm:text-sm">
                          {inv.invoiceNumber}
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          <p className="font-extrabold text-slate-900 truncate max-w-[140px]">{inv.customerName}</p>
                          <span className="text-[10px] text-slate-500 font-normal">
                            {inv.branch === 'EGY' ? '🇪🇬 مصر' : '🇴🇲 عمان'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                              inv.paymentType === 'CASH'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : inv.paymentType === 'CREDIT'
                                ? 'bg-rose-100 text-rose-800 border-rose-200'
                                : inv.paymentType === 'INSTALLMENT'
                                ? 'bg-sky-100 text-sky-800 border-sky-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                            }`}
                          >
                            {inv.paymentType === 'CASH'
                              ? 'نقدي'
                              : inv.paymentType === 'CREDIT'
                              ? 'آجل'
                              : inv.paymentType === 'INSTALLMENT'
                              ? 'تقسيط'
                              : 'شيك'}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-black text-slate-900 text-xs sm:text-sm">
                          {inv.totalAmount.toLocaleString()} {inv.currency}
                        </td>
                        <td className="p-3 font-mono text-emerald-700 font-bold">
                          {inv.paidAmount.toLocaleString()} {inv.currency}
                        </td>
                        <td className="p-3 font-mono font-bold">
                          {inv.remainingAmount > 0 ? (
                            <span className="text-rose-600">
                              {inv.remainingAmount.toLocaleString()} {inv.currency}
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-normal">خالص 0.00</span>
                          )}
                        </td>
                        <td className="p-3 font-mono font-extrabold text-emerald-700">
                          +{inv.netProfit.toLocaleString()} {inv.currency}
                        </td>
                        <td className="p-3 font-mono text-slate-500">{inv.date}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setViewingInvoice(inv)}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition shadow-sm font-bold flex items-center gap-1 mx-auto"
                            title="عرض وطباعة الفاتورة"
                          >
                            <Eye size={14} />
                            عرض
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

        {/* TAB 2: INSTALLMENTS SCHEDULE */}
        {activeTab === 'installments' && (
          <div className="space-y-4">
            <div className="glass-panel p-3.5 sm:p-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <Calendar className="text-amber-600" size={17} />
                  جدول متابعة الأقساط الشهرية المستحقة
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  تواريخ استحقاق الدفعات، الأقساط المسددة والمعلقة لكل عميل
                </p>
              </div>
            </div>

            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs min-w-[600px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">العميل</th>
                      <th className="p-3">رقم الفاتورة</th>
                      <th className="p-3">رقم القسط</th>
                      <th className="p-3">قيمة القسط</th>
                      <th className="p-3">تاريخ الاستحقاق</th>
                      <th className="p-3 text-center">الحالة</th>
                      <th className="p-3 text-center">إجراء السداد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {installments.map((inst) => (
                      <tr key={inst.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">{inst.customerName}</td>
                        <td className="p-3 font-mono text-amber-700 font-bold">{inst.invoiceNumber}</td>
                        <td className="p-3 font-bold text-slate-600">
                          القسط ({inst.installmentNo} من {inst.totalInstallments})
                        </td>
                        <td className="p-3 font-mono font-black text-xs sm:text-sm text-slate-900">
                          {inst.amount.toLocaleString()} {inst.currency}
                        </td>
                        <td className="p-3 font-mono text-slate-600">{inst.dueDate}</td>
                        <td className="p-3 text-center">
                          {inst.status === 'PAID' ? (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              تم السداد
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              مستحق السداد
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {inst.status === 'PENDING' ? (
                            <button
                              onClick={() => payInstallment(inst.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shadow transition"
                            >
                              تحصيل الآن
                            </button>
                          ) : (
                            <span className="text-slate-400 font-mono text-[10px]">
                              سُدد
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

        {/* TAB 3: CHEQUES PORTFOLIO */}
        {activeTab === 'cheques' && (
          <div className="space-y-4">
            <div className="glass-panel p-3.5 sm:p-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <FileCheck className="text-amber-600" size={17} />
                  حافظة الشيكات البنكية والكمبيالات
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  الشيكات الواردة من العملاء والشيكات الصادرة للموردين وتواريخ الصرف
                </p>
              </div>
            </div>

            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs min-w-[600px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">رقم الشيك</th>
                      <th className="p-3">النوع</th>
                      <th className="p-3">الساحب / المستفيد</th>
                      <th className="p-3">البنك</th>
                      <th className="p-3">مبلغ الشيك</th>
                      <th className="p-3">تاريخ الاستحقاق</th>
                      <th className="p-3 text-center">حالة الصرف</th>
                      <th className="p-3 text-center">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cheques.map((chk) => (
                      <tr key={chk.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-extrabold text-amber-700">{chk.chequeNumber}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              chk.type === 'INCOMING'
                                ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}
                          >
                            {chk.type === 'INCOMING' ? 'شيك وارد' : 'شيك صادر'}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          <p>{chk.issuerName}</p>
                          <p className="text-[10px] text-slate-500">إلى: {chk.recipientName}</p>
                        </td>
                        <td className="p-3 text-slate-700">{chk.bankName}</td>
                        <td className="p-3 font-mono font-black text-xs sm:text-sm text-slate-900">
                          {chk.amount.toLocaleString()} {chk.currency}
                        </td>
                        <td className="p-3 font-mono text-slate-600">{chk.dueDate}</td>
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
                        <td className="p-3 text-center">
                          {chk.status === 'PENDING' && (
                            <button
                              onClick={() => clearCheque(chk.id)}
                              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shadow"
                            >
                              إثبات الصرف
                            </button>
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

      {/* MODAL 1: CREATE NEW INVOICE */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-4 sm:p-7 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <Receipt className="text-amber-600" />
                إنشاء فاتورة مبيعات جديدة
              </h3>
              <button
                onClick={() => setShowNewInvoiceModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              {/* PRIMARY INVOICE DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">العميل المستلم *</label>
                  <select
                    required
                    value={invCustomerId}
                    onChange={(e) => setInvCustomerId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="">اختر العميل...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.branch === 'EGY' ? 'مصر' : 'عمان'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">فرع البيع والعملة</label>
                  <select
                    value={invBranch}
                    onChange={(e: any) => setInvBranch(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="EGY">🇪🇬 مصر (جنيه مصري EGP)</option>
                    <option value="OMN">🇴🇲 عمان (ريال عماني OMR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">طريقة الدفع *</label>
                  <select
                    value={invPaymentType}
                    onChange={(e: any) => setInvPaymentType(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="CASH">نقدي فوري (Cash)</option>
                    <option value="CREDIT">دفع آجل (Credit)</option>
                    <option value="INSTALLMENT">تقسيط (Installment)</option>
                    <option value="CHEQUE">شيك بنكي (Cheque)</option>
                  </select>
                </div>
              </div>

              {/* LINE ITEMS TABLE BUILDER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-800">أصناف الفاتورة:</h4>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs px-2.5 py-1 rounded-lg transition"
                  >
                    + إضافة صنف آخر
                  </button>
                </div>

                <div className="space-y-2">
                  {invoiceItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200 items-center"
                    >
                      <div className="col-span-12 sm:col-span-4">
                        <label className="block text-[10px] text-slate-500 mb-0.5">الصنف</label>
                        <select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(idx, e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-900 font-bold"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nameAr}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-5 sm:col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-0.5">الكمية ({item.unit})</label>
                        <input
                          type="number"
                          step="any"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityPriceChange(idx, parseFloat(e.target.value) || 0, item.unitPrice)
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-xs text-slate-900 font-bold"
                        />
                      </div>

                      <div className="col-span-5 sm:col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-0.5">سعر الوحدة</label>
                        <input
                          type="number"
                          step="any"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleQuantityPriceChange(idx, item.quantity, parseFloat(e.target.value) || 0)
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-xs text-slate-900 font-bold"
                        />
                      </div>

                      <div className="col-span-10 sm:col-span-3 text-left">
                        <span className="block text-[10px] text-slate-500">إجمالي البند</span>
                        <span className="font-mono font-black text-amber-700 text-xs sm:text-sm">
                          {item.totalPrice.toLocaleString()} {invBranch === 'EGY' ? 'ج.م' : 'ر.ع'}
                        </span>
                      </div>

                      <div className="col-span-2 sm:col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(item.id)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PAYMENT AMOUNTS BREAKDOWN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 bg-amber-50/50 p-3.5 sm:p-4 rounded-xl border border-amber-200">
                <div>
                  <span className="text-slate-600 block font-bold text-[11px]">إجمالي الفاتورة:</span>
                  <span className="font-mono font-black text-base sm:text-xl text-slate-900">
                    {invTotalAmount.toLocaleString()} {invBranch === 'EGY' ? 'ج.م' : 'ر.ع'}
                  </span>
                </div>

                {invPaymentType !== 'CASH' && (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">المسدد مقدماً</label>
                    <input
                      type="number"
                      value={invPaidAmount}
                      onChange={(e) => setInvPaidAmount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-1.5 font-mono text-xs font-bold text-emerald-700"
                      placeholder="0.00"
                    />
                  </div>
                )}

                <div>
                  <span className="text-slate-600 block font-bold text-[11px]">المتبقي الآجل:</span>
                  <span className="font-mono font-black text-base sm:text-xl text-rose-600">
                    {calculatedRemaining.toLocaleString()} {invBranch === 'EGY' ? 'ج.م' : 'ر.ع'}
                  </span>
                </div>
              </div>

              {/* DUE DATE & NOTES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">تاريخ استحقاق السداد</label>
                  <input
                    type="date"
                    value={invDueDate}
                    onChange={(e) => setInvDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">ملاحظات الفاتورة</label>
                  <input
                    type="text"
                    value={invNotes}
                    onChange={(e) => setInvNotes(e.target.value)}
                    placeholder="رقم أمر التوريد / السائق..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-md"
                >
                  حفظ وإصدار الفاتورة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW & PRINT INVOICE PREVIEW */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-2xl border border-slate-200 print:m-0 print:p-0 print:border-none max-h-[90vh] overflow-y-auto">
            {/* INVOICE HEADER */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 sm:pb-4 gap-2">
              <div>
                <h2 className="text-base sm:text-xl font-black text-slate-900">شركة بي قاسم للاستيراد والتصدير</h2>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">فحم طبيعي ومضغوط - تجارة وتوزيع وتصدير</p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-mono mt-1">س.ت: 882910 | ب.ض: 449-102</p>
              </div>

              <div className="text-left flex-shrink-0">
                <span className="text-[10px] sm:text-xs bg-amber-100 text-amber-900 font-extrabold px-2.5 py-1 rounded-md">
                  فاتورة ضريبية
                </span>
                <p className="font-mono font-black text-sm sm:text-base text-slate-900 mt-1.5">{viewingInvoice.invoiceNumber}</p>
                <p className="text-[11px] text-slate-500 font-mono">{viewingInvoice.date}</p>
              </div>
            </div>

            {/* CUSTOMER INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">السادة / العميل:</span>
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">{viewingInvoice.customerName}</span>
              </div>
              <div className="sm:text-left">
                <span className="text-slate-500 block">طريقة السداد:</span>
                <span className="font-bold text-amber-700">
                  {viewingInvoice.paymentType === 'CASH'
                    ? 'نقدي كاش'
                    : viewingInvoice.paymentType === 'CREDIT'
                    ? 'دفع آجل'
                    : viewingInvoice.paymentType === 'INSTALLMENT'
                    ? 'نظام أقساط'
                    : 'شيك بنكي'}
                </span>
              </div>
            </div>

            {/* ITEMS LIST */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs min-w-[450px]">
                <thead className="bg-slate-100 text-slate-700 font-extrabold border-y border-slate-200">
                  <tr>
                    <th className="p-2">م</th>
                    <th className="p-2">بيان الصنف</th>
                    <th className="p-2">الكمية</th>
                    <th className="p-2">سعر الوحدة</th>
                    <th className="p-2 text-left">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {viewingInvoice.items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2 font-mono">{i + 1}</td>
                      <td className="p-2 font-bold text-slate-800">{item.name}</td>
                      <td className="p-2 font-mono">{item.quantity} {item.unit}</td>
                      <td className="p-2 font-mono">{item.unitPrice.toLocaleString()} {viewingInvoice.currency}</td>
                      <td className="p-2 font-mono font-bold text-left">{item.totalPrice.toLocaleString()} {viewingInvoice.currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TOTALS SUMMARY */}
            <div className="border-t-2 border-slate-900 pt-3 space-y-1 text-xs text-left font-bold">
              <div className="flex justify-between">
                <span className="text-slate-600">إجمالي الفاتورة:</span>
                <span className="font-mono text-slate-900 font-black text-sm sm:text-base">
                  {viewingInvoice.totalAmount.toLocaleString()} {viewingInvoice.currency}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>المسدد نقداً / بنكياً:</span>
                <span className="font-mono">{viewingInvoice.paidAmount.toLocaleString()} {viewingInvoice.currency}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>المتبقي على الحساب:</span>
                <span className="font-mono font-black">{viewingInvoice.remainingAmount.toLocaleString()} {viewingInvoice.currency}</span>
              </div>
            </div>

            {/* SIGNATURE & CONTROLS */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="text-[11px] text-slate-400">
                <span>توقيع المستلم: ....................</span>
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
                  onClick={() => setViewingInvoice(null)}
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
