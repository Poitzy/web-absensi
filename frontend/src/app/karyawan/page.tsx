"use client";
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { LogIn, LogOut, MapPin, Calendar, Clock } from 'lucide-react';

export default function KaryawanDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [statusAbsen, setStatusAbsen] = useState(null);

  const fetchTodayStatus = useCallback(async () => {
    try {
      const res = await api.get(`/absensi/me?t=${new Date().getTime()}`);
      const activeSession = res.data.find((a) => a.jam_keluar === null);
      const lastSession = res.data[0]; 
      
      setStatusAbsen(activeSession || null); 
    } catch (err) {
      console.error("Gagal memuat status:", err);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchTodayStatus();
    return () => clearInterval(timer);
  }, [fetchTodayStatus]);

  const handleAction = async (type) => {
    setLoading(true);
    try {
      if (type === 'masuk') {
        await api.post('/absensi');
      } else {
        await api.put('/absensi/pulang');
      }
      alert(`Berhasil absen ${type}!`);
      fetchTodayStatus();
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center space-y-2">
        <h2 className="text-5xl font-black text-slate-800 tracking-tighter">
          {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
          <Calendar size={16}/> {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button 
          disabled={loading || !!statusAbsen}
          onClick={() => handleAction('masuk')}
          className={`group p-10 rounded-[3rem] shadow-xl transition-all flex flex-col items-center justify-center gap-4 border-4 ${
            !!statusAbsen 
            ? 'bg-slate-50 border-slate-100 grayscale' 
            : 'bg-green-500 border-green-400 hover:bg-green-600 text-white active:scale-95'
          }`}
        >
          <div className={`p-5 rounded-3xl ${!!statusAbsen ? 'bg-slate-200' : 'bg-white/20'}`}>
            <LogIn size={48} />
          </div>
          <div className="text-center">
            <span className="text-2xl font-black">Absen Masuk</span>
            <p className="text-sm font-medium opacity-80 mt-1">
              {!!statusAbsen ? `Sudah masuk jam ${statusAbsen.jam_masuk}` : 'Klik untuk masuk kerja'}
            </p>
          </div>
        </button>

        <button 
          disabled={loading || !statusAbsen}
          onClick={() => handleAction('pulang')}
          className={`group p-10 rounded-[3rem] shadow-xl transition-all flex flex-col items-center justify-center gap-4 border-4 ${
            !statusAbsen
            ? 'bg-slate-50 border-slate-100 grayscale' 
            : 'bg-orange-500 border-orange-400 hover:bg-orange-600 text-white active:scale-95'
          }`}
        >
          <div className={`p-5 rounded-3xl ${!statusAbsen ? 'bg-slate-200' : 'bg-white/20'}`}>
            <LogOut size={48} />
          </div>
          <div className="text-center">
            <span className="text-2xl font-black">Absen Pulang</span>
            <p className="text-sm font-medium opacity-80 mt-1">
              {!statusAbsen ? 'Selesaikan masuk dulu' : 'Klik saat selesai kerja'}
            </p>
          </div>
        </button>
      </div>

      <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl shadow-indigo-200">
        <div className="flex items-center gap-5">
          <div className="bg-white/10 p-4 rounded-2xl"><MapPin size={32}/></div>
          <div>
            <p className="text-indigo-200 font-bold text-sm uppercase">Lokasi Kerja</p>
            <p className="text-xl font-black">28 Coffee Godean</p>
          </div>
        </div>
        <div className="h-12 w-px bg-white/10 hidden md:block"></div>
        <div className="flex items-center gap-5">
          <div className="bg-white/10 p-4 rounded-2xl"><Clock size={32}/></div>
          <div>
            <p className="text-indigo-200 font-bold text-sm uppercase">Status Shift</p>
            <p className="text-xl font-black">{statusAbsen?.nama_shift || 'Belum Absen'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}