'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { Employee, PayrollRecord } from '@/data/mockData';
import {
  Users,
  Plus,
  Search,
  DollarSign,
  Award,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  X,
  Phone,
  Briefcase,
  HeartPulse
} from 'lucide-react';

const TABS = [
  { key: 'employees', label: 'دليل الموظفين والسائقين', icon: Users },
  { key: 'payroll', label: 'مسير الرواتب والبدلات', icon: DollarSign },
  { key: 'bonuses', label: 'بدل النقلات ومكافآت السائقين', icon: Award },
  { key: 'medical', label: 'الفحوصات الطبية والإجازات', icon: HeartPulse },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function HrPage() {
  const { employees, payrolls, addEmployee, addPayroll, addTripBonus } = useApp();

  const [tab, setTab] = useState<TabKey>('employees');
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState<'ALL' | 'EGY' | 'OMN'>('ALL');

  // Modals
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddBonusModal, setShowAddBonusModal] = useState(false);
  const [showPaySlipModal, setShowPaySlipModal] = useState<PayrollRecord | null>(null);

  // New Employee Form state
  const [newName, setNewName] = useState('');
  const [newBranch, setNewBranch] = useState<'EGY' | 'OMN'>('EGY');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBaseSalary, setNewBaseSalary] = useState<number>(10000);

  // Add Bonus Form state
  const [bonusEmpId, setBonusEmpId] = useState('');
  const [bonusAmount, setBonusAmount] = useState<number>(500);
  const [bonusNotes, setBonusNotes] = useState('بدل نقلة خط الإسكندرية');

  // Filtering
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      emp.phone.includes(search);
    const matchesBranch = branchFilter === 'ALL' || emp.branch === branchFilter;
    return matchesSearch && matchesBranch;
  });

  // KPI calculations
  const totalBaseSalariesEGP = employees
    .filter((e) => e.currency === 'EGP')
    .reduce((sum, e) => sum + e.baseSalary, 0);

  const totalBonusesEGP = employees
    .filter((e) => e.currency === 'EGP')
    .reduce((sum, e) => sum + (e.tripBonusesThisMonth || 0), 0);

  const driversCount = employees.filter((e) => e.jobTitle.includes('سائق')).length;

  // Add Employee Submit
  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newJobTitle) return;

    const newEmp: Employee = {
      id: 'emp-' + Date.now(),
      name: newName,
      branch: newBranch,
      jobTitle: newJobTitle,
      phone: newPhone || '—',
      baseSalary: newBaseSalary,
      currency: newBranch === 'EGY' ? 'EGP' : 'OMR',
      hireDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      tripBonusesThisMonth: 0,
      deductionsThisMonth: 0,
      medicalCheckStatus: 'VALID',
      lastMedicalCheckDate: new Date().toISOString().split('T')[0],
    };

    addEmployee(newEmp);
    setShowAddEmployeeModal(false);

    setNewName('');
    setNewJobTitle('');
    setNewPhone('');
  };

  // Add Bonus Submit
  const handleAddBonusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bonusEmpId || bonusAmount <= 0) return;

    addTripBonus(bonusEmpId, bonusAmount, bonusNotes);
    setShowAddBonusModal(false);
    setBonusAmount(500);
    setBonusNotes('');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Users className="text-amber-600" />
              الموارد البشرية وشؤون السائقين والرواتب
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              إدارة كادر العمل وسائقي أسطول التوزيع، مسير الرواتب، بدل النقلات والمسافات، والفحوصات الطبية.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddBonusModal(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-md shadow-sky-600/20"
            >
              <Award size={16} />
              + تسجيل بدل نقلة لسائق
            </button>
            <button
              onClick={() => setShowAddEmployeeModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-md shadow-amber-500/20"
            >
              <Plus size={16} />
              + إضافة موظف / سائق
            </button>
          </div>
        </div>

        {/* 4 SUMMARY STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-panel p-4">
            <div className="text-xs font-bold text-slate-500">إجمالي فريق العمل</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{employees.length} موظفاً</div>
            <div className="text-[11px] text-slate-400 font-bold mt-1">مصر وعمان</div>
          </div>

          <div className="glass-panel p-4 border-amber-200 bg-amber-50/20">
            <div className="text-xs font-bold text-slate-500">سائقين الأسطول النشطين</div>
            <div className="text-2xl font-black text-amber-700 mt-1">{driversCount} سائقين</div>
            <div className="text-[11px] text-amber-600 font-bold mt-1">سيارات التوزيع والشحن</div>
          </div>

          <div className="glass-panel p-4 border-emerald-200 bg-emerald-50/20">
            <div className="text-xs font-bold text-slate-500">إجمالي الرواتب الأساسية (EGP)</div>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
              {totalBaseSalariesEGP.toLocaleString()} ج.م
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">شهرياً بمصر</div>
          </div>

          <div className="glass-panel p-4 border-sky-200 bg-sky-50/20">
            <div className="text-xs font-bold text-slate-500">بدل النقلات هذا الشهر</div>
            <div className="text-2xl font-black text-sky-700 font-mono mt-1">
              +{totalBonusesEGP.toLocaleString()} ج.م
            </div>
            <div className="text-[11px] text-sky-600 font-bold mt-1">مكافآت مسافات للسائقين</div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-2 border-b-2 -mb-[5px] whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: EMPLOYEES DIRECTORY */}
        {tab === 'employees' && (
          <div className="space-y-4">
            {/* SEARCH & FILTERS */}
            <div className="glass-panel p-3 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث بالاسم أو المسمى الوظيفي أو الهاتف..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={branchFilter}
                onChange={(e: any) => setBranchFilter(e.target.value)}
                className="w-full md:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">جميع الفروع</option>
                <option value="EGY">🇪🇬 فرع مصر</option>
                <option value="OMN">🇴🇲 فرع عمان</option>
              </select>
            </div>

            {/* EMPLOYEES TABLE */}
            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">اسم الموظف / السائق</th>
                      <th className="p-3.5">الفرع</th>
                      <th className="p-3.5">المسمى الوظيفي</th>
                      <th className="p-3.5">رقم الهاتف</th>
                      <th className="p-3.5">الراتب الأساسي</th>
                      <th className="p-3.5">بدل النقلات</th>
                      <th className="p-3.5">تاريخ التعيين</th>
                      <th className="p-3.5 text-center">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 font-bold text-slate-800">
                          <p className="font-extrabold text-slate-900 text-sm">{emp.name}</p>
                        </td>
                        <td className="p-3.5">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] border border-slate-200 font-bold">
                            {emp.branch === 'EGY' ? '🇪🇬 مصر' : '🇴🇲 عمان'}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-amber-700">{emp.jobTitle}</td>
                        <td className="p-3.5 font-mono text-slate-700 font-bold">{emp.phone}</td>
                        <td className="p-3.5 font-mono font-black text-slate-900 text-sm">
                          {emp.baseSalary.toLocaleString()} {emp.currency}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-emerald-700">
                          +{emp.tripBonusesThisMonth?.toLocaleString() || 0} {emp.currency}
                        </td>
                        <td className="p-3.5 font-mono text-slate-500">{emp.hireDate}</td>
                        <td className="p-3.5 text-center">
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            على رأس العمل
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAYROLL */}
        {tab === 'payroll' && (
          <div className="space-y-4">
            <div className="glass-panel p-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <DollarSign className="text-amber-600" size={18} />
                  مسير الرواتب ومفردات المرتبات المعتمدة
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تفصيل الراتب الأساسي، بدل النقلات، البدلات الإضافية، والاستقطاعات
                </p>
              </div>
            </div>

            <div className="glass-panel overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">الموظف</th>
                    <th className="p-3.5">شهر الاستحقاق</th>
                    <th className="p-3.5">الأساسي</th>
                    <th className="p-3.5">بدل نقلات ومسافات</th>
                    <th className="p-3.5">بدلات أخرى</th>
                    <th className="p-3.5">استقطاعات</th>
                    <th className="p-3.5 font-bold text-emerald-700">صافي المستحق</th>
                    <th className="p-3.5 text-center">إيصال الراتب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payrolls.map((pr) => (
                    <tr key={pr.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-extrabold text-slate-900">{pr.employeeName}</td>
                      <td className="p-3.5 font-bold text-amber-700">
                        {pr.month} {pr.year}
                      </td>
                      <td className="p-3.5 font-mono text-slate-700">{pr.baseSalary.toLocaleString()} {pr.currency}</td>
                      <td className="p-3.5 font-mono text-sky-700 font-bold">
                        +{pr.tripBonuses.toLocaleString()} {pr.currency}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">+{pr.allowances.toLocaleString()} {pr.currency}</td>
                      <td className="p-3.5 font-mono text-rose-600">-{pr.deductions.toLocaleString()} {pr.currency}</td>
                      <td className="p-3.5 font-mono font-black text-emerald-700 text-sm">
                        {pr.netSalary.toLocaleString()} {pr.currency}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setShowPaySlipModal(pr)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg font-bold text-[11px] shadow-sm flex items-center gap-1 mx-auto"
                        >
                          <FileText size={13} />
                          مفردات مرتب
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DRIVER BONUSES */}
        {tab === 'bonuses' && (
          <div className="space-y-4">
            <div className="glass-panel p-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Award className="text-amber-600" size={18} />
                  سجل بدل النقلات والحوافز لسائقي الأسطول
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  حوافز المشاوير الطويلة وتوزيع البضائع في المحافظات
                </p>
              </div>
              <button
                onClick={() => setShowAddBonusModal(true)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow"
              >
                + صرف بدل نقلة
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {employees
                .filter((e) => e.jobTitle.includes('سائق'))
                .map((d) => (
                  <div key={d.id} className="glass-panel p-5 space-y-3 border-slate-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold">{d.branch === 'EGY' ? '🇪🇬 مصر' : '🇴🇲 عمان'}</span>
                        <h4 className="font-black text-base text-slate-900 mt-0.5">{d.name}</h4>
                        <p className="text-xs text-amber-700 font-bold mt-0.5">{d.jobTitle}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                        <Award size={20} />
                      </div>
                    </div>

                    <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between">
                        <span className="text-slate-500">الراتب الأساسي:</span>
                        <span className="font-mono font-bold text-slate-800">{d.baseSalary.toLocaleString()} {d.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">إجمالي بدل النقلات:</span>
                        <span className="font-mono font-black text-emerald-700 text-sm">
                          +{d.tripBonusesThisMonth.toLocaleString()} {d.currency}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setBonusEmpId(d.id);
                        setShowAddBonusModal(true);
                      }}
                      className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs transition"
                    >
                      + إضافة بدل نقلة جديدة
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: MEDICAL CHECKS & LEAVES */}
        {tab === 'medical' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <HeartPulse className="text-amber-600" size={18} />
                سجل الفحوصات الطبية الدورية وصلاحية رخص القيادة
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                متابعة الكشوفات الطبية الإلزامية لسائقي سيارات النقل الثقيل
              </p>
            </div>

            <div className="glass-panel overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">السائق</th>
                    <th className="p-3.5">المسمى الوظيفي</th>
                    <th className="p-3.5">تاريخ آخر كشف طبي</th>
                    <th className="p-3.5">الجهة الطبية المعتمدة</th>
                    <th className="p-3.5 text-center">حالة الفحص الطبي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees
                    .filter((e) => e.jobTitle.includes('سائق'))
                    .map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">{d.name}</td>
                        <td className="p-3.5 text-amber-700 font-medium">{d.jobTitle}</td>
                        <td className="p-3.5 font-mono text-slate-600">{d.lastMedicalCheckDate}</td>
                        <td className="p-3.5 text-slate-600">القومسيون الطبي العام</td>
                        <td className="p-3.5 text-center">
                          {d.medicalCheckStatus === 'VALID' ? (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                              لائق طبياً (ساري)
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold animate-pulse">
                              موعد الفحص القادم وشيك
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

      {/* MODAL 1: ADD EMPLOYEE */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-black text-lg text-slate-900">إضافة موظف / سائق جديد</h3>

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">الاسم بالكامل *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="اسم الموظف..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الفرع التابع له</label>
                  <select
                    value={newBranch}
                    onChange={(e: any) => setNewBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                  >
                    <option value="EGY">🇪🇬 فرع مصر</option>
                    <option value="OMN">🇴🇲 فرع عمان</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">الراتب الأساسي *</label>
                  <input
                    type="number"
                    required
                    value={newBaseSalary}
                    onChange={(e) => setNewBaseSalary(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">المسمى الوظيفي *</label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="مثال: سائق توزيع ثقيل (سيارة أيسوزو)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="010xxxxxxx"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow"
                >
                  حفظ الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD TRIP BONUS */}
      {showAddBonusModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-black text-lg text-sky-800 flex items-center gap-2">
              <Award className="text-amber-600" />
              تسجيل بدل نقلة ومكافأة مشوار لسائق
            </h3>

            <form onSubmit={handleAddBonusSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">السائق المستحق *</label>
                <select
                  required
                  value={bonusEmpId}
                  onChange={(e) => setBonusEmpId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                >
                  <option value="">اختر السائق...</option>
                  {employees
                    .filter((e) => e.jobTitle.includes('سائق'))
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.jobTitle})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">قيمة البدل / الحافز *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={bonusAmount || ''}
                  onChange={(e) => setBonusAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">سبب البدل / تفاصيل المشوار</label>
                <input
                  type="text"
                  value={bonusNotes}
                  onChange={(e) => setBonusNotes(e.target.value)}
                  placeholder="مثال: بدل نقلة خط الإسكندرية ومطروح"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBonusModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold shadow"
                >
                  تأكيد إضافة البدل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PAY SLIP PRINT VIEW */}
      {showPaySlipModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 print:m-0 print:p-0 print:border-none">
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">شركة بي قاسم للاستيراد والتصدير</h2>
                <p className="text-xs text-slate-600 mt-0.5">مفردات مرتب ومسير الراتب الشهري</p>
              </div>
              <div className="text-left font-mono">
                <span className="text-xs bg-amber-100 text-amber-900 font-black px-3 py-1 rounded-md">
                  مسير معتمد
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  {showPaySlipModal.month} {showPaySlipModal.year}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">اسم الموظف:</span>
                <span className="text-slate-900 text-sm font-black">{showPaySlipModal.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الراتب الأساسي:</span>
                <span className="font-mono font-bold text-slate-800">
                  {showPaySlipModal.baseSalary.toLocaleString()} {showPaySlipModal.currency}
                </span>
              </div>
              <div className="flex justify-between text-sky-700 font-bold">
                <span>بدل نقلات ومسافات:</span>
                <span className="font-mono">+{showPaySlipModal.tripBonuses.toLocaleString()} {showPaySlipModal.currency}</span>
              </div>
              <div className="flex justify-between text-slate-700 font-bold">
                <span>بدلات إضافية:</span>
                <span className="font-mono">+{showPaySlipModal.allowances.toLocaleString()} {showPaySlipModal.currency}</span>
              </div>
              <div className="flex justify-between text-rose-600 font-bold">
                <span>الاستقطاعات:</span>
                <span className="font-mono">-{showPaySlipModal.deductions.toLocaleString()} {showPaySlipModal.currency}</span>
              </div>
              <div className="border-t border-slate-300 pt-2 flex justify-between text-emerald-700 text-sm font-black">
                <span>صافي الراتب المحول:</span>
                <span className="font-mono text-base">{showPaySlipModal.netSalary.toLocaleString()} {showPaySlipModal.currency}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-400">
                <span>توقيع الموظف المستلم</span>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Printer size={15} />
                  طباعة
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaySlipModal(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl"
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
