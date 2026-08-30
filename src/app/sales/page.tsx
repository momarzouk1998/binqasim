'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Receipt, Plus } from 'lucide-react';

export default function SalesPage() {
  const [invoices] = useState([
    {
      id: 'inv-101',
      invoiceNumber: 'INV-EGY-2026-081',
      customerName: 'شركة الوادي للتوزيع والشحن',
      branch: 'EGY',
      currency: 'EGP',
      paymentType: 'CREDIT',
      totalAmount: 145000,
      paidAmount: 45000,
      remainingAmount: 100000,
      date: '2026-08-25',
    },
    {
      id: 'inv-102',
      invoiceNumber: 'INV-OMN-2026-014',
      customerName: 'مؤسسة الخليج للتجارة واستيراد',
      branch: 'OMN',
      currency: 'OMR',
      paymentType: 'CHEQUE',
      totalAmount: 2850,
      paidAmount: 1200,
      remainingAmount: 1650,
      date: '2026-08-22',
    },
  ]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Receipt className="text-amber-600" />
              إدارة المبيعات وفواتير العملاء والأقساط
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              فواتير فرع مصر (EGP) وفرع عمان (OMR)، الشيكات، الأقساط والدفع النقدي/الآجل.
            </p>
          </div>

          <button className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow">
            <Plus size={16} />
            + فاتورة مبيعات جديدة
          </button>
        </div>

        {/* INVOICES TABLE */}
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3.5">رقم الفاتورة</th>
                <th className="p-3.5">العميل والفرع</th>
                <th className="p-3.5">طريقة الدفع</th>
                <th className="p-3.5">الإجمالي</th>
                <th className="p-3.5">المسدد</th>
                <th className="p-3.5">المتبقي (آجل)</th>
                <th className="p-3.5">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-amber-700">{inv.invoiceNumber}</td>
                  <td className="p-3.5 font-bold text-slate-800">
                    <p>{inv.customerName}</p>
                    <p className="text-[10px] text-slate-500">{inv.branch === 'EGY' ? 'فرع مصر' : 'فرع عمان'}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] border border-slate-200">
                      {inv.paymentType === 'CREDIT' ? 'آجل' : 'شيك بنكي'}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    {inv.totalAmount.toLocaleString()} {inv.currency}
                  </td>
                  <td className="p-3.5 font-mono text-emerald-700 font-bold">
                    {inv.paidAmount.toLocaleString()} {inv.currency}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-rose-600">
                    {inv.remainingAmount.toLocaleString()} {inv.currency}
                  </td>
                  <td className="p-3.5 font-mono text-slate-500">{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
