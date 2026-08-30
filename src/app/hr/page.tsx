'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Users, Plus, DollarSign, Briefcase } from 'lucide-react';

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-amber-400 flex items-center gap-2">
              <Users className="text-amber-500" />
              الموارد البشرية والرواتب والبدلات
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              سجل الموظفين والسائقين لفروع مصر وسلطنة عمان، المسحوبات، والبدلات.
            </p>
          </div>

          <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition">
            <Plus size={16} />
            + إضافة موظف جديد
          </button>
        </div>

        {/* EMPLOYEES TABLE */}
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">اسم الموظف</th>
                <th className="p-3.5">الفرع</th>
                <th className="p-3.5">المسمى الوظيفي</th>
                <th className="p-3.5">الراتب الأساسي</th>
                <th className="p-3.5">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-100">{emp.name}</td>
                  <td className="p-3.5 text-slate-300">
                    {emp.branch === 'EGY' ? '🇪🇬 فرع مصر' : '🇴🇲 فرع عمان'}
                  </td>
                  <td className="p-3.5 text-amber-400 font-semibold">{emp.jobTitle}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">
                    {emp.baseSalary.toLocaleString()} {emp.currency}
                  </td>
                  <td className="p-3.5">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
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
