"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Send, Clock, Calendar } from 'lucide-react';

export default function RequestShiftKaryawan() {
  const [shifts, setShifts] = useState([]);
  const [formData, setFormData] = useState({ 
    shift_id: '', 
    tanggal_request: '', 
    keterangan: '' 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await api.get('/shift');
        setShifts(res.data);
      } catch (err) {
        console.error("Gagal memuat shift", err);
      }
    };
    fetchShifts();
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/request-shift/request', formData);
      alert(res.data.message);
      setFormData({ shift_id: '', tanggal_request: '', keterangan: '' });
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengirim request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 shadow-indigo-100/50">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
            <Clock size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Request Tukar Shift</h2>
            <p className="text-slate-400 text-sm font-medium">Ajukan perubahan jadwal kerja ke Admin</p>
          </div>
        </div>

        <form onSubmit={handleRequest} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Tanggal Perubahan</label>
            <div className="relative">
              <input 
                type="date" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all cursor-pointer" 
                value={formData.tanggal_request}
                onChange={(e) => setFormData({...formData, tanggal_request: e.target.value})}
                required
                min={new Date().toISOString().split('T')[0]} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Shift Tujuan</label>
            <select 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all appearance-none cursor-pointer"
              value={formData.shift_id}
              onChange={(e) => setFormData({...formData, shift_id: e.target.value})}
              required
            >
              <option value="">-- Pilih Shift Baru --</option>
              {shifts.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.nama_shift}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Alasan Penukaran</label>
            <textarea 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 placeholder:text-slate-300 transition-all"
              rows={4}
              placeholder="Jelaskan alasan Anda atau dengan siapa Anda bertukar..."
              value={formData.keterangan}
              onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex justify-center items-center gap-3 shadow-xl transition-all ${
              loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-200'
            }`}
          >
            {loading ? 'Mengirim...' : (
              <>
                <Send size={18}/> Kirim Permohonan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}