'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { User, Lock, Phone, Save, CheckCircle2, AlertCircle, Sparkles, Building2 } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, setCurrentUser, selectedBranch } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  const [phone, setPhone] = useState(currentUser.phone);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setName(currentUser.name);
    setTitle(currentUser.title);
    setPhone(currentUser.phone);
  }, [currentUser]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setCurrentUser({
      ...currentUser,
      name,
      title,
      phone,
    });

    setProfileMessage({ type: 'success', text: 'تم تحديث بيانات الملف الشخصي بنجاح!' });
    setTimeout(() => setProfileMessage(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!newPassword || newPassword.length < 3) {
      setPasswordMessage({ type: 'error', text: 'كلمة المرور الجديدة يجب أن تكون 3 أحرف/أرقام على الأقل' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'كلمة المرور التأكيدية غير متطابقة' });
      return;
    }

    setPasswordMessage({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح إلى: ' + newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMessage(null), 4000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <User className="text-amber-600" />
            الملف الشخصي وإعدادات الحساب
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            بيانات المستخدِم الشخصية، الصلاحيات الإدارية وتغيير كلمة السر.
          </p>
        </div>

        {/* USER PROFILE INFO CARD */}
        <div className="glass-panel p-6 space-y-4 border-amber-200 bg-gradient-to-r from-amber-500/10 via-white to-amber-500/5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                {currentUser.name.startsWith('و') ? 'و' : 'O'}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                  {currentUser.name}
                  <Sparkles size={16} className="text-amber-500" />
                </h2>
                <p className="text-xs font-bold text-amber-700 mt-0.5">{currentUser.title}</p>
                <p className="text-xs font-mono text-slate-600 mt-1 flex items-center gap-1">
                  <Phone size={12} className="text-slate-400" />
                  {currentUser.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-white text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 font-bold shadow-sm flex items-center gap-1">
                <Building2 size={13} className="text-amber-600" />
                {selectedBranch === 'EGY' ? 'فرع مصر' : selectedBranch === 'OMN' ? 'فرع عمان' : 'المجمع'}
              </span>
              <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl font-black border border-amber-300 shadow-sm">
                صلاحية: مدير عام
              </span>
            </div>
          </div>
        </div>

        {/* EDIT PROFILE FORM */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="text-amber-600" size={18} />
            تعديل بيانات المستخدم
          </h3>

          {profileMessage && (
            <div className="p-3.5 rounded-xl text-xs flex items-center gap-2 font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={16} />
              {profileMessage.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">الاسم بالكامل *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">المسمى والصفة الإدارية</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">رقم الهاتف المسجل للنظام</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 font-bold"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow"
              >
                <Save size={15} />
                حفظ التعديلات
              </button>
            </div>
          </form>
        </div>

        {/* CHANGE PASSWORD FORM */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="text-amber-600" size={18} />
            تغيير كلمة المرور (الرمز السري)
          </h3>

          {passwordMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 font-bold ${
                passwordMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {passwordMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {passwordMessage.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">كلمة المرور الحالية</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الحالية..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">كلمة المرور الجديدة *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="كلمة المرور الجديدة..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">تأكيد كلمة المرور الجديدة *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="تأكيد كلمة المرور..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center gap-2 transition shadow"
              >
                <Save size={16} />
                حفظ كلمة المرور الجديدة
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
