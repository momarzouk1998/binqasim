'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Truck,
  AlertTriangle,
  Wrench,
  Gauge
} from 'lucide-react';

export default function FleetPage() {
  const [showLogModal, setShowLogModal] = useState(false);

  const [vehicles, setVehicles] = useState([
    {
      id: 'v1',
      plateNumber: 'أ ب ج 1234',
      model: 'جامبو أيسوزو 4 طن (مصر)',
      branch: 'EGY',
      driverName: 'أسامة السيد',
      lastOdometerKm: 42500,
      lastOilChangeKm: 41200,
      status: 'ACTIVE',
    },
    {
      id: 'v2',
      plateNumber: 'س ص ع 5678',
      model: 'تويوتا دينا 5 طن (مصر)',
      branch: 'EGY',
      driverName: 'إبراهيم علي',
      lastOdometerKm: 68100,
      lastOilChangeKm: 66400,
      status: 'MAINTENANCE_REQUIRED',
    },
    {
      id: 'v3',
      plateNumber: 'OMN-88219',
      model: 'نيسان نيفارا نقل (مسقط)',
      branch: 'OMN',
      driverName: 'سالم المعمري',
      lastOdometerKm: 19800,
      lastOilChangeKm: 19000,
      status: 'ACTIVE',
    },
  ]);

  const [tripLogs, setTripLogs] = useState([
    {
      id: 'log-1',
      plateNumber: 'س ص ع 5678',
      driverName: 'إبراهيم علي',
      date: '2026-08-29',
      startKm: 67900,
      endKm: 68100,
      distanceKm: 200,
      fuelCost: 950,
      costPerKm: 4.75,
    },
    {
      id: 'log-2',
      plateNumber: 'أ ب ج 1234',
      driverName: 'أسامة السيد',
      date: '2026-08-28',
      startKm: 42250,
      endKm: 42500,
      distanceKm: 250,
      fuelCost: 1200,
      costPerKm: 4.8,
    },
  ]);

  const [logPlate, setLogPlate] = useState('س ص ع 5678');
  const [logDriver, setLogDriver] = useState('');
  const [logStartKm, setLogStartKm] = useState('');
  const [logEndKm, setLogEndKm] = useState('');
  const [logFuelCost, setLogFuelCost] = useState('');

  const handleAddTripLog = (e: React.FormEvent) => {
    e.preventDefault();
    const start = parseFloat(logStartKm) || 0;
    const end = parseFloat(logEndKm) || 0;
    const fuel = parseFloat(logFuelCost) || 0;
    const distance = Math.max(0, end - start);
    const costPerKm = distance > 0 ? fuel / distance : 0;

    const newLog = {
      id: 'log-' + Date.now(),
      plateNumber: logPlate,
      driverName: logDriver || 'سائق التوزيع',
      date: new Date().toISOString().split('T')[0],
      startKm: start,
      endKm: end,
      distanceKm: distance,
      fuelCost: fuel,
      costPerKm: costPerKm,
    };

    setTripLogs([newLog, ...tripLogs]);

    setVehicles(
      vehicles.map((v) => {
        if (v.plateNumber === logPlate) {
          const newOdo = Math.max(v.lastOdometerKm, end);
          const drivenSinceOil = newOdo - v.lastOilChangeKm;
          return {
            ...v,
            lastOdometerKm: newOdo,
            status: drivenSinceOil >= 1500 ? 'MAINTENANCE_REQUIRED' : 'ACTIVE',
          };
        }
        return v;
      })
    );

    setShowLogModal(false);
  };

  const handleRegisterOilChange = (vehicleId: string) => {
    setVehicles(
      vehicles.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            lastOilChangeKm: v.lastOdometerKm,
            status: 'ACTIVE',
          };
        }
        return v;
      })
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Truck className="text-amber-600" />
              إدارة حركة السيارات وحساب تكلفة الكيلومتر
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              متابعة عداد الخروج والرجوع، استهلاك الوقود، ونظام إنذار تغيير الزيت التلقائي كل 1500 كم.
            </p>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow"
          >
            <Gauge size={16} />
            + تسجيل حركة عداد جديدة
          </button>
        </div>

        {/* OIL CHANGE ALERT BANNER */}
        {vehicles.some((v) => v.lastOdometerKm - v.lastOilChangeKm >= 1500) && (
          <div className="glass-panel p-4 border-rose-300 bg-rose-50/60 flex items-center justify-between flex-wrap gap-3 animate-pulse shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-rose-600" size={24} />
              <div>
                <h4 className="font-extrabold text-sm text-rose-800">
                  تنبيه هائم: سيارة تجاوزت 1,500 كم وبحاجة لتغيير الزيت فوراً!
                </h4>
                <p className="text-xs text-rose-600 mt-0.5">
                  يرجى تغيير زيت الفلتر والمحرك للحفاظ على كفاءة سيارات التوزيع.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VEHICLE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicles.map((v) => {
            const drivenSinceOil = v.lastOdometerKm - v.lastOilChangeKm;
            const isAlert = drivenSinceOil >= 1500;
            return (
              <div
                key={v.id}
                className={`glass-panel p-5 space-y-3 relative overflow-hidden ${
                  isAlert ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-mono">{v.branch === 'EGY' ? '🇪🇬 فرع مصر' : '🇴🇲 عمان'}</span>
                    <h3 className="font-black text-base text-slate-900 mt-0.5">{v.model}</h3>
                    <p className="text-xs font-mono font-bold text-amber-700 mt-0.5">{v.plateNumber}</p>
                  </div>
                  {isAlert ? (
                    <span className="bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle size={12} />
                      تغيير زيت فوراً!
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                      حالة ممتازة
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">السائق المسند:</span>
                    <span className="font-bold text-slate-800">{v.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">قراءة العداد الحالية:</span>
                    <span className="font-mono font-bold text-sky-700">{v.lastOdometerKm.toLocaleString()} كم</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">المقطوع منذ آخر زيت:</span>
                    <span className={`font-mono font-bold ${isAlert ? 'text-rose-700 font-black' : 'text-amber-700'}`}>
                      {drivenSinceOil.toLocaleString()} / 1,500 كم
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {isAlert ? (
                    <button
                      onClick={() => handleRegisterOilChange(v.id)}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <Wrench size={14} />
                      تسجيل تغيير زيت الآن (تصفير التنبيه)
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">متبقي على التغيير: {1500 - drivenSinceOil} كم</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* RECENT TRIP ODOMETER LOGS TABLE */}
        <div className="glass-panel overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Gauge className="text-amber-600" size={18} />
              سجل قراءات العداد والوقود وتكلفة الكيلومتر
            </h3>
            <button
              onClick={() => setShowLogModal(true)}
              className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-lg font-bold"
            >
              + إضافة رحلة
            </button>
          </div>

          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3.5">السيارة والسائق</th>
                <th className="p-3.5">التاريخ</th>
                <th className="p-3.5">عداد الخروج</th>
                <th className="p-3.5">عداد العودة</th>
                <th className="p-3.5">المسافة (كم)</th>
                <th className="p-3.5">تكلفة الوقود</th>
                <th className="p-3.5 font-bold text-amber-700">تكلفة الكيلو الواحدة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tripLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-800">
                    <p>{log.plateNumber}</p>
                    <p className="text-[10px] text-slate-500">{log.driverName}</p>
                  </td>
                  <td className="p-3.5 font-mono text-slate-500">{log.date}</td>
                  <td className="p-3.5 font-mono text-slate-700">{log.startKm.toLocaleString()} كم</td>
                  <td className="p-3.5 font-mono text-slate-700">{log.endKm.toLocaleString()} كم</td>
                  <td className="p-3.5 font-mono font-bold text-sky-700">{log.distanceKm} كم</td>
                  <td className="p-3.5 font-mono text-amber-700">{log.fuelCost.toLocaleString()} ج.م</td>
                  <td className="p-3.5 font-mono font-extrabold text-emerald-700 text-sm">
                    {log.costPerKm.toFixed(2)} ج.م / كم
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD TRIP LOG */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="font-black text-lg text-slate-900">تسجيل رحلة وقراءة عداد جديدة</h3>
            <form onSubmit={handleAddTripLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">السيارة *</label>
                <select
                  value={logPlate}
                  onChange={(e) => setLogPlate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.plateNumber}>
                      {v.model} ({v.plateNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">اسم السائق</label>
                <input
                  type="text"
                  value={logDriver}
                  onChange={(e) => setLogDriver(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                  placeholder="اسم السائق..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">عداد الخروج (كم) *</label>
                  <input
                    type="number"
                    required
                    value={logStartKm}
                    onChange={(e) => setLogStartKm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="67900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">عداد العودة (كم) *</label>
                  <input
                    type="number"
                    required
                    value={logEndKm}
                    onChange={(e) => setLogEndKm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="68100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">تكلفة الوقود *</label>
                <input
                  type="number"
                  required
                  value={logFuelCost}
                  onChange={(e) => setLogFuelCost(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500"
                  placeholder="950 ج.م"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white font-extrabold hover:bg-amber-600 shadow"
                >
                  حفظ الحركة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
