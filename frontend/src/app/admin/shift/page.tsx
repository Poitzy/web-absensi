"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Clock, Plus, Trash2, Calendar } from 'lucide-react';

export default function PengaturanShift() {
  const [shifts, setShifts] = useState([]);
  const [newShift, setNewShift] = useState({ nama_shift: '', jam_mulai: '', jam_selesai: '' });

  const fetchShift = async () => {
    const res = await api.get('/shift');
    setShifts(res.data);
  };

  useEffect(() => { fetchShift(); }, []);

  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/shift', newShift);
    setNewShift({ nama_shift: '', jam_mulai: '', jam_selesai: '' });
    fetchShift();
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Pengaturan Shift Cafe</h1>
        <p className="text-slate-500 font-medium">Tentukan jadwal jam kerja untuk deteksi otomatis absensi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-fit">
          <h3 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-2"><Plus className="text-indigo-600"/> Buat Shift Baru</h3>
          <form onSubmit={handleAddShift} className="space-y-4">
            <input type="text" placeholder="Nama Shift (Misal: Pagi)" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 text-black font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={newShift.nama_shift} onChange={e => setNewShift({...newShift, nama_shift: e.target.value})} required />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 ml-1">Jam Mulai</label>
                <input type="time" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 text-black font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={newShift.jam_mulai} onChange={e => setNewShift({...newShift, jam_mulai: e.target.value})} required />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 ml-1">Jam Selesai</label>
                <input type="time" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 text-black font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={newShift.jam_selesai} onChange={e => setNewShift({...newShift, jam_selesai: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition shadow-xl uppercase tracking-widest text-sm">Tambahkan Shift</button>
          </form>
        </div>

        {/* List Shift */}
        <div className="space-y-4">
          {shifts.map((s: any) => (
            <div key={s.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl"><Clock size={20}/></div>
                <div>
                  <p className="font-black text-slate-800">{s.nama_shift}</p>
                  <p className="text-xs font-bold text-slate-400">{s.jam_mulai} - {s.jam_selesai}</p>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-100"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}