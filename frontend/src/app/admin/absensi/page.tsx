"use client";
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Trash2, FileText, Search, Calendar, UserX, AlertCircle } from 'lucide-react';

export default function MonitoringAbsensiAdmin() {
  const getTodayWIB = () => {
    const now = new Date();
    const wibDate = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    return wibDate.toISOString().split('T')[0];
  };

  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(getTodayWIB());
  const [loading, setLoading] = useState(true);

  const fetchAbsensi = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/absensi?date=${filterDate}`);
      setLogs(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  }, [filterDate]);

  useEffect(() => {
    fetchAbsensi();
  }, [fetchAbsensi]);

  const filteredLogs = logs.filter((l: any) =>
    l.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3 uppercase">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
              <FileText size={20} />
            </div>
            Monitoring Kehadiran
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
          <div className="relative group">
            <Calendar className="absolute left-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white rounded-2xl border-none shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-black cursor-pointer appearance-none"
            />
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari Nama..." 
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-none shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black font-bold"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
            <tr>
              <th className="p-6">Karyawan</th>
              <th className="p-6 text-center">Shift</th>
              <th className="p-6 text-center">Masuk</th>
              <th className="p-6 text-center">Pulang</th>
              <th className="p-6 text-center">Status</th>
              <th className="p-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!loading && filteredLogs.length > 0 ? (
              filteredLogs.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-lg tracking-tight">{log.nama}</span>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{log.role}</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full uppercase border border-indigo-100">
                      {log.nama_shift}
                    </span>
                  </td>
                  <td className="p-6 text-center font-mono font-bold text-lg text-indigo-600">
                    {log.jam_masuk}
                  </td>
                  <td className="p-6 text-center font-mono font-bold text-lg text-red-500">
                    {log.jam_keluar || '--:--'}
                  </td>
                  <td className="p-6 text-center">
                    <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm tracking-widest">
                      {log.status}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <button 
                      onClick={() => api.delete(`/absensi/${log.id}`).then(fetchAbsensi)} 
                      className="p-3 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm border border-red-50"
                    >
                      <Trash2 size={20}/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-slate-50 p-6 rounded-full">
                      <UserX size={64} className="text-slate-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                        Tidak Ada Data Absensi
                      </p>
                      <p className="text-slate-400 font-medium text-sm">
                        Belum ada karyawan yang melakukan absen pada tanggal ini.
                      </p>
                    </div>
                    {searchTerm && (
                        <div className="flex items-center gap-2 text-indigo-500 bg-indigo-50 px-4 py-2 rounded-xl text-xs font-bold uppercase">
                            <AlertCircle size={14}/> Menampilkan hasil pencarian: "{searchTerm}"
                        </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}