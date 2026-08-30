'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Users, Plus } from 'lucide-react';

export default function HrPage() {
  const [employees] = useState([
    {
      id: 'emp-1',
      name: 'محمود زويل',
      branch: 'EGY',
      jobTitle: 'المدير العام والتنفيذي',
      baseSalary: 35000,
      currency: 'EGP',
    },
    {
      id: 'emp-2',
      name: 'محمد مرزوق',
      branch: 'EGY',
      jobTitle: 'رئيس الحسابات والمالية',
      baseSalary: 25000,
      currency: 'EGP',
    },
    {
      id: 'emp-3',
      name: 'سالم المعمري',
      branch: 'OMN',
      jobTitle: 'سائق توزيع ومدير فرع مسقط',
      baseSalary: 450,
      currency: 'OMR',
    },
  ]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Users className="text-amber-600" />
              الموارد البشرية والرواتب والبدلات
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              سجل الموظفين والسائقين لفروع مصر وسلطنة عمان، المسحوبات، والبدلات.
            </p>
          </div>

          <button className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow">
            <Plus size={16} />
            + إضافة موظف جديد
          </button>
        </div>

        {/* EMPLOYEES TABLE */}
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3.5">اسم الموظف</th>
                <th className="p-3.5">الفرع</th>
                <th className="p-3.5">المسمى الوظيفي</th>
                <th className="p-3.5">الراتب الأساسي</th>
                <th className="p-3.5">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-800">{emp.name}</td>
                  <td className="p-3.5 text-slate-700">
                    {emp.branch === 'EGY' ? '🇪🇬 فرع مصر' : '🇴🇲 فرع عمان'}
                  </td>
                  <td className="p-3.5 text-amber-700 font-bold">{emp.jobTitle}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700">
                    {emp.baseSalary.toLocaleString()} {emp.currency}
                  </td>
                  <td className="p-3.5">
                    <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      نشط
                    </span>
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
