"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, Coffee } from 'lucide-react';

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => { setIsClient(true); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      router.push(res.data.role === 'admin' ? '/admin' : '/karyawan');
    } catch (err: any) {
      alert(err.response?.data?.message || "Login Gagal");
    } finally { setLoading(false); }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Coffee className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">28 HUB</h2>
          <p className="text-slate-400 mt-2 font-medium">Admin & Staff Portal</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                type="email" required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-black font-semibold" 
                placeholder="name@mail.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                type="password" required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-black font-semibold" 
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}