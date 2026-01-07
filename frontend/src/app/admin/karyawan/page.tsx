"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { UserPlus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';

export default function ManajemenKaryawan() {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    nama: '', 
    email: '', 
    password: '', 
    shift_id: '' 
  });

  const fetchData = async () => {
    try {
      const [uRes, sRes] = await Promise.all([
        api.get('/users'), 
        api.get('/shift')
      ]);
      setEmployees(uRes.data);
      setShifts(sRes.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      nama: formData.nama,
      email: formData.email,
      shift_id: formData.shift_id === "" ? null : formData.shift_id
    };

    try {
      if (editingId) {
        // Mode Edit
        const res = await api.put(`/users/${editingId}`, payload);
        alert(res.data.message);
      } else {
        // Mode Tambah
        await api.post('/users', { ...formData, role: 'karyawan' });
        alert("Karyawan baru berhasil ditambahkan!");
      }
      
      setIsModalOpen(false);
      setFormData({ nama: '', email: '', password: '', shift_id: '' });
      setEditingId(null);
      fetchData(); 
    } catch (err: any) {
      alert(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleEdit = (emp: any) => {
    setEditingId(emp.id);
    setFormData({ 
      nama: emp.nama, 
      email: emp.email, 
      password: '', 
      shift_id: emp.shift_id || '' 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchData();
      } catch (err) {
        alert("Gagal menghapus data");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Karyawan</h1>
          <p className="text-slate-500 font-medium">Kelola staff dan penugasan shift</p>
        </div>
        <button 
          onClick={() => { 
            setEditingId(null); 
            setFormData({ nama: '', email: '', password: '', shift_id: '' });
            setIsModalOpen(true); 
          }} 
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
        >
          <UserPlus size={20}/> Tambah Karyawan
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em]">
            <tr>
              <th className="p-6">Informasi Karyawan</th>
              <th className="p-6">Shift Kerja</th>
              <th className="p-6">Role</th>
              <th className="p-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {employees.map((emp: any) => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <p className="font-bold text-slate-800">{emp.nama}</p>
                  <p className="text-sm text-slate-400 font-medium">{emp.email}</p>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                    emp.nama_shift 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    {emp.nama_shift || 'Belum diatur'}
                  </span>
                </td>
                <td className="p-6 font-bold text-slate-500 capitalize text-sm">{emp.role}</td>
                <td className="p-6">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(emp)} className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition">
                      <Pencil size={18}/>
                    </button>
                    <button onClick={() => handleDelete(emp.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800">{editingId ? 'Edit Data Karyawan' : 'Daftar Karyawan Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition"><X/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 text-black font-bold outline-none transition" 
                  value={formData.nama} 
                  onChange={(e) => setFormData({...formData, nama: e.target.value})} 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                <input 
                  type="email" 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 text-black font-bold outline-none transition" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>

              {!editingId && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <input 
                    type="password" 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 text-black font-bold outline-none transition" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    required 
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pilih Shift</label>
                <select 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 text-black font-bold outline-none transition cursor-pointer appearance-none" 
                  value={formData.shift_id} 
                  onChange={(e) => setFormData({...formData, shift_id: e.target.value})}
                >
                  <option value="">-- Tanpa Shift --</option>
                  {shifts.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.nama_shift}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-indigo-600 transition shadow-xl uppercase tracking-widest text-xs mt-4">
                {editingId ? 'Simpan Perubahan' : 'Daftarkan Sekarang'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}