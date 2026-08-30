'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { User, Lock, Phone, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'وائل قاسم',
    title: 'المدير',
    phone: '01111189666',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('binqasim_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setUser(parsed);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!newPassword || newPassword.length < 3) {
      setMessage({ type: 'error', text: 'كلمة المرور الجديدة يجب أن تكون 3 أحرف/أرقام على الأقل' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'كلمة المرور التأكيدية غير متطابقة' });
      return;
    }

    setMessage({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح إلى: ' + newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <User className="text-amber-600" />
            الصفحة الشخصية وإعدادات الحساب
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            بيانات المستخدِم الشخصية وتغيير كلمة السر الخاصة بالحساب.
          </p>
        </div>

        {/* USER PROFILE INFO CARD */}
        <div className="glass-panel p-6 space-y-4 border-amber-200 bg-amber-50/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white font-black text-2xl flex items-center justify-center shadow">
              {user.name.startsWith('و') ? 'و' : 'O'}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{user.name}</h2>
              <p className="text-xs font-bold text-amber-700 mt-0.5">{user.title}</p>
              <p className="text-xs font-mono text-slate-600 mt-1 flex items-center gap-1">
                <Phone size={12} className="text-slate-400" />
                {user.phone}
              </p>
            </div>
          </div>
        </div>

        {/* CHANGE PASSWORD FORM */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="text-amber-600" size={18} />
            تغيير كلمة المرور (الرمز السري)
          </h3>

          {message && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 font-bold ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message.text}
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
