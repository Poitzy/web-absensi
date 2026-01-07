"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Check, X, AlertCircle, Calendar } from 'lucide-react';

export default function PermintaanShiftAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/request-shift/admin/list');
      setRequests(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: number, status: string) => {
    if (!confirm(`Konfirmasi ${status === 'approved' ? 'SETUJU' : 'TOLAK'}?`)) return;
    try {
      await api.put(`/request-shift/admin/action/${id}`, { status });
      fetchRequests();
    } catch (err) { alert("Gagal memproses"); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Permintaan Perubahan Shift</h1>
      
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em]">
            <tr>
              <th className="p-6">Karyawan</th>
              <th className="p-6">Tanggal Pengajuan</th>
              <th className="p-6">Shift Baru</th>
              <th className="p-6">Keterangan</th>
              <th className="p-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!loading && requests.length > 0 ? requests.map((r: any) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition">
                <td className="p-6 font-bold text-slate-800">{r.nama}</td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                    <Calendar size={16} />
                    {new Date(r.tanggal_request).toLocaleDateString('id-ID', { 
                        day: '2-digit', month: 'long', year: 'numeric' 
                    })}
                  </div>
                </td>
                <td className="p-6">
                  <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-amber-100">
                    {r.nama_shift}
                  </span>
                </td>
                <td className="p-6 text-sm text-slate-500 italic">"{r.keterangan || '-'}"</td>
                <td className="p-6">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleAction(r.id, 'approved')} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition shadow-sm">
                      <Check size={18}/>
                    </button>
                    <button onClick={() => handleAction(r.id, 'rejected')} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm">
                      <X size={18}/>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="p-20 text-center text-slate-300 italic">
                  Tidak ada permintaan yang perlu diproses.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}