'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { Vehicle } from '@/data/mockData';
import {
  Truck,
  AlertTriangle,
  Wrench,
  Gauge,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Fuel,
  MapPin,
  X,
  Phone
} from 'lucide-react';

export default function FleetPage() {
  const {
    vehicles,
    tripLogs,
    maintenanceLogs,
    addTripLog,
    registerOilChange,
    addVehicle,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'vehicles' | 'trips' | 'maintenance'>('vehicles');
  const [search, setSearch] = useState('');

  // Modals
  const [showTripModal, setShowTripModal] = useState(false);
  const [showOilChangeModal, setShowOilChangeModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [selectedVehicleForOil, setSelectedVehicleForOil] = useState<Vehicle | null>(null);

  // New Trip Log Form state
  const [tripVehicleId, setTripVehicleId] = useState(vehicles[0]?.id || '');
  const [tripDriver, setTripDriver] = useState('');
  const [tripStartKm, setTripStartKm] = useState<number>(0);
  const [tripEndKm, setTripEndKm] = useState<number>(0);
  const [tripFuelCost, setTripFuelCost] = useState<number>(0);
  const [tripDestination, setTripDestination] = useState('');
  const [tripCargo, setTripCargo] = useState('');

  // Oil Change Form state
  const [oilCost, setOilCost] = useState<number>(1850);
  const [oilCenter, setOilCenter] = useState('مركز شل للصيانة والزيوت');
  const [oilNotes, setOilNotes] = useState('تغيير زيت شل 10,000 كم + فلتر زيت وفلتر هواء');

  // Add Vehicle Form state
  const [newPlate, setNewPlate] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newBranch, setNewBranch] = useState<'EGY' | 'OMN'>('EGY');
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newCurrentKm, setNewCurrentKm] = useState<number>(10000);

  // Handle open trip modal and pre-fill odometer
  const handleOpenTripModal = (veh?: Vehicle) => {
    const target = veh || vehicles[0];
    if (target) {
      setTripVehicleId(target.id);
      setTripDriver(target.driverName);
      setTripStartKm(target.lastOdometerKm);
      setTripEndKm(target.lastOdometerKm + 150);
      setTripFuelCost(target.branch === 'EGY' ? 850 : 7.5);
      setTripDestination(target.branch === 'EGY' ? 'خط توزيع القاهرة الكبرى' : 'خط توزيع محافظة مسقط');
      setTripCargo('5 طن فحم طبيعي فاخر للمطاعم');
    }
    setShowTripModal(true);
  };

  // Submit Trip
  const handleAddTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVeh = vehicles.find((v) => v.id === tripVehicleId);
    if (!targetVeh) return;

    const dist = Math.max(0, tripEndKm - tripStartKm);
    const costPerKm = dist > 0 ? tripFuelCost / dist : 0;

    addTripLog({
      vehicleId: targetVeh.id,
      plateNumber: targetVeh.plateNumber,
      driverName: tripDriver || targetVeh.driverName,
      date: new Date().toISOString().split('T')[0],
      destination: tripDestination || 'خط توزيع منتظم',
      startKm: tripStartKm,
      endKm: tripEndKm,
      distanceKm: dist,
      fuelCost: tripFuelCost,
      costPerKm: costPerKm,
      deliveredCargo: tripCargo || 'بضائع فحم وتعبئة',
    });

    setShowTripModal(false);
  };

  // Open Oil change modal for a vehicle
  const handleOpenOilModal = (veh: Vehicle) => {
    setSelectedVehicleForOil(veh);
    setShowOilChangeModal(true);
  };

  const handleOilChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleForOil) return;

    registerOilChange(selectedVehicleForOil.id, oilCost, oilCenter, oilNotes);
    setShowOilChangeModal(false);
  };

  // Add Vehicle Submit
  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate || !newModel) return;

    const newVeh: Vehicle = {
      id: 'veh-' + Date.now(),
      plateNumber: newPlate,
      model: newModel,
      branch: newBranch,
      driverName: newDriverName || 'سائق جديد',
      driverPhone: newDriverPhone || '—',
      lastOdometerKm: newCurrentKm,
      lastOilChangeKm: newCurrentKm,
      nextOilChangeAlertKm: newCurrentKm + 1500,
      fuelTankCapacityLiters: 90,
      avgCostPerKm: newBranch === 'EGY' ? 4.8 : 0.045,
      status: 'ACTIVE',
    };

    addVehicle(newVeh);
    setShowAddVehicleModal(false);

    setNewPlate('');
    setNewModel('');
    setNewDriverName('');
    setNewDriverPhone('');
  };

  // Filtered vehicles
  const filteredVehicles = vehicles.filter(
    (v) =>
      v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.driverName.toLowerCase().includes(search.toLowerCase())
  );

  const urgentVehiclesCount = vehicles.filter(
    (v) => v.lastOdometerKm - v.lastOilChangeKm >= 1500
  ).length;

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 sm:pb-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Truck className="text-amber-600 flex-shrink-0" size={24} />
              <span>إدارة أسطول سيارات التوزيع وتكلفة الكيلومتر</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              متابعة قراءات عداد الخروج والرجوع، استهلاك الوقود، ونظام إنذار تغيير الزيت التلقائي كل 1500 كم.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => handleOpenTripModal()}
              className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-md shadow-amber-500/20"
            >
              <Gauge size={16} />
              + تسجيل رحلة
            </button>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-1 shadow-sm transition"
            >
              <Plus size={16} />
              إضافة سيارة
            </button>
          </div>
        </div>

        {/* OIL CHANGE ALARM BANNER (CRITICAL 1500 KM ALARM) */}
        {urgentVehiclesCount > 0 && (
          <div className="glass-panel p-3.5 sm:p-4 border-rose-300 bg-rose-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse shadow-sm">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-rose-100 text-rose-700 border border-rose-200 flex-shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-rose-800">
                  تنبيه عاجل: {urgentVehiclesCount} سيارة تجاوزت 1,500 كم وبحاجة لتغيير الزيت فوراً!
                </h4>
                <p className="text-[11px] sm:text-xs text-rose-600 mt-0.5">
                  تجاوز المسافة يؤثر على المحرك، يرجى تغيير الزيت وتصفير العداد.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-3 sm:px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 -mb-[5px] whitespace-nowrap ${
              activeTab === 'vehicles'
                ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Truck size={15} />
            الأسطول ({vehicles.length})
          </button>

          <button
            onClick={() => setActiveTab('trips')}
            className={`px-3 sm:px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 -mb-[5px] whitespace-nowrap ${
              activeTab === 'trips'
                ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Gauge size={15} />
            سجل الرحلات ({tripLogs.length})
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-3 sm:px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 -mb-[5px] whitespace-nowrap ${
              activeTab === 'maintenance'
                ? 'border-amber-500 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wrench size={15} />
            سجل الصيانة ({maintenanceLogs.length})
          </button>
        </div>

        {/* TAB 1: VEHICLES CARDS GRID */}
        {activeTab === 'vehicles' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredVehicles.map((v) => {
                const drivenSinceOil = v.lastOdometerKm - v.lastOilChangeKm;
                const isAlert = drivenSinceOil >= 1500;
                const progressPercent = Math.min(100, Math.round((drivenSinceOil / 1500) * 100));

                return (
                  <div
                    key={v.id}
                    className={`glass-panel p-4 sm:p-5 space-y-3 relative overflow-hidden transition-all duration-200 ${
                      isAlert
                        ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400'
                        : 'border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    {/* CARD HEADER */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          {v.branch === 'EGY' ? '🇪🇬 مصر' : '🇴🇲 عمان'}
                        </span>
                        <h3 className="font-black text-sm sm:text-base text-slate-900 mt-0.5">{v.model}</h3>
                        <p className="text-xs font-mono font-extrabold text-amber-700 mt-0.5">
                          {v.plateNumber}
                        </p>
                      </div>

                      {isAlert ? (
                        <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 animate-pulse flex-shrink-0">
                          <AlertTriangle size={11} />
                          تغيير زيت!
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0">
                          جاهزة للعمل
                        </span>
                      )}
                    </div>

                    {/* VEHICLE SPECS & ODOMETER */}
                    <div className="space-y-1.5 sm:space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between">
                        <span className="text-slate-500">السائق:</span>
                        <span className="font-bold text-slate-800">{v.driverName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">العداد:</span>
                        <span className="font-mono font-bold text-sky-700">
                          {v.lastOdometerKm.toLocaleString()} كم
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">المقطوع منذ الصيانة:</span>
                        <span
                          className={`font-mono font-black ${
                            isAlert ? 'text-rose-600' : 'text-amber-700'
                          }`}
                        >
                          {drivenSinceOil.toLocaleString()} / 1,500 كم
                        </span>
                      </div>

                      {/* PROGRESS BAR TO 1500 KM */}
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isAlert
                              ? 'bg-rose-600'
                              : progressPercent > 70
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* CARD ACTIONS */}
                    <div className="pt-1 flex items-center gap-2">
                      {isAlert ? (
                        <button
                          onClick={() => handleOpenOilModal(v)}
                          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition shadow"
                        >
                          <Wrench size={14} />
                          تغيير زيت وتصفير العداد
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenTripModal(v)}
                            className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1"
                          >
                            <Gauge size={13} />
                            تسجيل رحلة
                          </button>
                          <button
                            onClick={() => handleOpenOilModal(v)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="صيانة وقائية"
                          >
                            <Wrench size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: TRIP & ODOMETER LOGS */}
        {activeTab === 'trips' && (
          <div className="space-y-4">
            <div className="glass-panel p-3.5 sm:p-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <Gauge className="text-amber-600" size={17} />
                  سجل قراءات عداد الخروج والرجوع والوقود
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  حساب تكلفة الكيلو متر تلقائياً لكل رحلة
                </p>
              </div>
            </div>

            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs min-w-[600px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">السيارة والسائق</th>
                      <th className="p-3">خط السير والوجهة</th>
                      <th className="p-3">التاريخ</th>
                      <th className="p-3">عداد البداية</th>
                      <th className="p-3">عداد النهاية</th>
                      <th className="p-3">المسافة</th>
                      <th className="p-3">تكلفة الوقود</th>
                      <th className="p-3 font-bold text-amber-700">تكلفة الكيلو</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tripLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">
                          <p className="font-mono text-slate-900">{log.plateNumber}</p>
                          <p className="text-[10px] text-slate-500">{log.driverName}</p>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">{log.destination}</td>
                        <td className="p-3 font-mono text-slate-500">{log.date}</td>
                        <td className="p-3 font-mono text-slate-700">{log.startKm.toLocaleString()} كم</td>
                        <td className="p-3 font-mono text-slate-700">{log.endKm.toLocaleString()} كم</td>
                        <td className="p-3 font-mono font-bold text-sky-700">{log.distanceKm} كم</td>
                        <td className="p-3 font-mono text-amber-700 font-bold">{log.fuelCost.toLocaleString()}</td>
                        <td className="p-3 font-mono font-black text-emerald-700 text-xs sm:text-sm">
                          {log.costPerKm.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MAINTENANCE LOGS */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <div className="glass-panel p-3.5 sm:p-4">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <Wrench className="text-amber-600" size={17} />
                سجل صيانة الزيوت والفلاتر وتصفير العداد
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                توثيق جميع عمليات الصيانة وتغيير الزيت
              </p>
            </div>

            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs min-w-[600px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">السيارة</th>
                      <th className="p-3">نوع الصيانة</th>
                      <th className="p-3">قراءة العداد</th>
                      <th className="p-3">مركز الخدمة</th>
                      <th className="p-3">التكلفة</th>
                      <th className="p-3">التاريخ</th>
                      <th className="p-3">ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {maintenanceLogs.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-amber-700">{m.plateNumber}</td>
                        <td className="p-3 font-bold text-slate-800">{m.serviceType}</td>
                        <td className="p-3 font-mono text-sky-700">{m.serviceKm.toLocaleString()} كم</td>
                        <td className="p-3 text-slate-700">{m.centerName}</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">
                          {m.cost.toLocaleString()} ج.م
                        </td>
                        <td className="p-3 font-mono text-slate-500">{m.date}</td>
                        <td className="p-3 text-slate-500">{m.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD TRIP & ODOMETER LOG */}
      {showTripModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Gauge className="text-amber-600" />
              تسجيل رحلة وقراءة عداد جديدة
            </h3>

            <form onSubmit={handleAddTripSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">السيارة *</label>
                <select
                  value={tripVehicleId}
                  onChange={(e) => {
                    const veh = vehicles.find((v) => v.id === e.target.value);
                    if (veh) {
                      setTripVehicleId(veh.id);
                      setTripDriver(veh.driverName);
                      setTripStartKm(veh.lastOdometerKm);
                      setTripEndKm(veh.lastOdometerKm + 150);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.model} ({v.plateNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم السائق</label>
                <input
                  type="text"
                  value={tripDriver}
                  onChange={(e) => setTripDriver(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">خط السير / وجهة التوزيع</label>
                <input
                  type="text"
                  value={tripDestination}
                  onChange={(e) => setTripDestination(e.target.value)}
                  placeholder="مثال: خط القاهرة - طنطا"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">عداد البداية (كم) *</label>
                  <input
                    type="number"
                    required
                    value={tripStartKm}
                    onChange={(e) => setTripStartKm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-1.5 font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">عداد النهاية (كم) *</label>
                  <input
                    type="number"
                    required
                    value={tripEndKm}
                    onChange={(e) => setTripEndKm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-1.5 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">تكلفة الوقود *</label>
                <input
                  type="number"
                  required
                  value={tripFuelCost}
                  onChange={(e) => setTripFuelCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono font-bold text-emerald-700"
                  placeholder="850 ج.م"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTripModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow"
                >
                  حفظ قراءة العداد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER OIL CHANGE */}
      {showOilChangeModal && selectedVehicleForOil && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Wrench className="text-amber-600" />
              تسجيل تغيير زيت ({selectedVehicleForOil.plateNumber})
            </h3>
            <p className="text-xs text-slate-500">
              سيتم تصفير عداد الزيت وتحديث حالة السيارة إلى (جاهزة للعمل).
            </p>

            <form onSubmit={handleOilChangeSubmit} className="space-y-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500">قراءة العداد الحالية:</span>
                <span className="font-mono font-black text-sky-700">
                  {selectedVehicleForOil.lastOdometerKm.toLocaleString()} كم
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">تكلفة الصيانة والزيوت *</label>
                <input
                  type="number"
                  required
                  value={oilCost}
                  onChange={(e) => setOilCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">مركز الصيانة</label>
                <input
                  type="text"
                  value={oilCenter}
                  onChange={(e) => setOilCenter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">تفاصيل الصيانة</label>
                <input
                  type="text"
                  value={oilNotes}
                  onChange={(e) => setOilNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOilChangeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow"
                >
                  تأكيد تصفير الإنذار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD VEHICLE */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Truck className="text-amber-600" />
              إضافة سيارة جديدة
            </h3>

            <form onSubmit={handleAddVehicleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">رقم اللوحة المعدنية *</label>
                <input
                  type="text"
                  required
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  placeholder="مثال: أ ب ج 9876"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-amber-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">نوع وموديل السيارة *</label>
                <input
                  type="text"
                  required
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  placeholder="مثال: جامبو أيسوزو 5 طن"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الفرع</label>
                  <select
                    value={newBranch}
                    onChange={(e: any) => setNewBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-bold"
                  >
                    <option value="EGY">🇪🇬 مصر</option>
                    <option value="OMN">🇴🇲 عمان</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">عداد الكيلومتر</label>
                  <input
                    type="number"
                    value={newCurrentKm}
                    onChange={(e) => setNewCurrentKm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم السائق</label>
                <input
                  type="text"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  placeholder="اسم السائق..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow"
                >
                  حفظ السيارة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
