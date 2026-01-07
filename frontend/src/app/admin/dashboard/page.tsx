"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Check, X, Bell } from 'lucide-react';

export default function ApprovalShiftAdmin() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await api.get('/api/request-shift/admin/list');
    setRequests(res.data);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: number, status: string) => {
    try {
      await api.put(`/api/request-shift/admin/action/${id}`, { status });
      alert(`Request telah di-${status}`);
      fetchRequests();
    } catch (err) {
      alert("Gagal memproses request");
    }
  };

  if (requests.length === 0) return null; 

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
        <Bell className="text-amber-500 animate-bounce" size={20}/> Request Shift Perlu Persetujuan
      </h3>
      <div className="grid gap-4">
        {requests.map((r: any) => (
          <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-800">{r.nama} <span className="text-slate-400 font-medium">ingin pindah ke</span> {r.nama_shift}</p>
              <p className="text-sm text-slate-500 italic">"{r.keterangan || 'Tanpa keterangan'}"</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleAction(r.id, 'approved')} className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition">
                <Check size={20}/>
              </button>
              <button onClick={() => handleAction(r.id, 'rejected')} className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition">
                <X size={20}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}