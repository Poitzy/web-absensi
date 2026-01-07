"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Calendar as CalIcon, Clock, CheckCircle } from 'lucide-react';

export default function RiwayatPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/absensi/me').then(res => setHistory(res.data)); //
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-slate-800">Riwayat Kehadiran</h1>
      
      <div className="grid gap-4">
        {history.map((item: any, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-slate-100 p-3 rounded-2xl text-slate-600"><CalIcon size={24}/></div>
              <div>
                <p className="font-black text-slate-800">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">{item.nama_shift || 'Shift Luar'}</p>
              </div>
            </div>
            
            <div className="flex gap-8 w-full md:w-auto justify-between md:justify-end">
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase">Masuk</p>
                <p className="font-black text-green-600">{item.jam_masuk}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase">Pulang</p>
                <p className="font-black text-orange-600">{item.jam_keluar || '--:--'}</p>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                <CheckCircle size={16} className="text-green-500"/>
                <span className="text-sm font-black text-green-700 uppercase">{item.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}