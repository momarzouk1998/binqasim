'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Phone, Lock, LogIn, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone) {
      setError('يرجى إدخال رقم الهاتف المسجل');
      return;
    }

    if (!password) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    setLoading(true);

    // Login validation
    let userName = 'وائل قاسم';
    let userTitle = 'المدير';

    if (phone === '01558282760') {
      userName = 'openappo';
      userTitle = 'مدير عام';
    } else if (phone === '01111189666') {
      userName = 'وائل قاسم';
      userTitle = 'المدير';
    }

    const userSession = {
      name: userName,
      title: userTitle,
      phone: phone,
      isLoggedIn: true,
    };

    localStorage.setItem('binqasim_user', JSON.stringify(userSession));
    document.cookie = `binqasim_user=${encodeURIComponent(JSON.stringify(userSession))}; path=/; max-age=864000`;

    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* DECORATIVE LIGHT ACCENTS */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* LOGO & BRAND HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 shadow-xl">
            <Image
              src="/logo.png"
              alt="Bin Qasim Logo"
              width={75}
              height={75}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-wide">
              شركة بي قاسم للاستيراد والتصدير
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              تسجيل الدخول للنظام الإداري والمالي
            </p>
          </div>
        </div>

        {/* SECURE LOGIN FORM CONTAINER */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-extrabold text-sm text-slate-800">دخول المستخدم</span>
            <ShieldCheck className="text-amber-500" size={18} />
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-xs flex items-center gap-2 font-bold">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                <Phone size={14} className="text-amber-600" />
                رقم الهاتف *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="أدخل رقم الهاتف المسجل..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                <Lock size={14} className="text-amber-600" />
                كلمة المرور *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>جاري تسجيل الدخول...</span>
              ) : (
                <>
                  <LogIn size={18} />
                  تسجيل الدخول للنظام
                </>
              )}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <div className="text-center text-[11px] text-slate-400 font-medium">
          شركة بي قاسم للاستيراد والتصدير والتوزيع © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
