'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Phone, Lock, LogIn, ShieldCheck, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('01111189666');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick Account Selectors
  const primaryAccounts = [
    {
      name: 'وائل قاسم',
      title: 'المدير',
      phone: '01111189666',
      badge: 'مدير النظام',
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-400',
    },
    {
      name: 'openappo',
      title: 'مدير عام',
      phone: '01558282760',
      badge: 'الحساب الرئيسي',
      color: 'from-sky-500/20 to-sky-600/10 border-sky-500/40 text-sky-400',
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone) {
      setError('يرجى إدخال رقم الهاتف المسجل');
      return;
    }

    setLoading(true);

    // Save session in localStorage & cookie
    const matchedAccount = primaryAccounts.find((a) => a.phone === phone);
    const userSession = {
      name: matchedAccount ? matchedAccount.name : 'مستخدم بن قاسم',
      title: matchedAccount ? matchedAccount.title : 'مستخدم الفرع',
      phone: phone,
      isLoggedIn: true,
    };

    localStorage.setItem('binqasim_user', JSON.stringify(userSession));
    document.cookie = `binqasim_user=${encodeURIComponent(JSON.stringify(userSession))}; path=/; max-age=864000`;

    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 600);
  };

  const selectAccount = (accPhone: string) => {
    setPhone(accPhone);
    setPassword('123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* LOGO & BRAND HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
            <Image
              src="/logo.png"
              alt="Bin Qasim Logo"
              width={70}
              height={70}
              className="object-contain rounded-xl"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-amber-400 tracking-wide">
              شركة بي قاسم للاستيراد والتصدير
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              تسجيل الدخول للنظام الإداري والمالي برقم الهاتف
            </p>
          </div>
        </div>

        {/* QUICK ACCOUNT SELECTOR CARDS FOR THE TWO MAIN USERS */}
        <div className="glass-panel p-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>الحسابات الرئيسية المسجلة للنظام:</span>
            <ShieldCheck size={14} className="text-amber-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {primaryAccounts.map((acc) => {
              const isSelected = phone === acc.phone;
              return (
                <button
                  key={acc.phone}
                  type="button"
                  onClick={() => selectAccount(acc.phone)}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between bg-gradient-to-br ${
                    acc.color
                  } ${
                    isSelected
                      ? 'ring-2 ring-amber-400 shadow-lg scale-[1.02]'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-sm text-slate-100">{acc.name}</span>
                    {isSelected && <CheckCircle2 size={16} className="text-amber-400" />}
                  </div>
                  <span className="text-xs font-bold text-slate-300">{acc.title}</span>
                  <span className="text-[11px] font-mono text-slate-400 mt-1 dir-ltr">{acc.phone}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* LOGIN FORM CONTAINER */}
        <div className="glass-panel p-6 space-y-4 border-slate-800 shadow-2xl">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Phone size={14} className="text-amber-400" />
                رقم الهاتف المسجل *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 font-mono font-bold text-sm focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Lock size={14} className="text-amber-400" />
                كلمة المرور / الرمز السرّي
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm py-3.5 rounded-xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>جاري تسجيل الدخول...</span>
              ) : (
                <>
                  <LogIn size={18} />
                  الدخول إلى نظام بي قاسم
                </>
              )}
            </button>
          </form>
        </div>

        {/* FOOTER INFO */}
        <div className="text-center text-[11px] text-slate-500">
          شركة بي قاسم للاستيراد والتصدير والتوزيع © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
