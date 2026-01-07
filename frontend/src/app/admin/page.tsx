"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Users, UserCheck, Coffee, Activity } from 'lucide-react';

export default function AdminHome() {
  const [stats, setStats] = useState({ totalStaff: 0, presentToday: 0, activeShifts: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, absenRes, shiftRes] = await Promise.all([
          api.get('/users'),
          api.get('/absensi'),
          api.get('/shift')
        ]);

        const users = userRes.data;
        const allAbsensi = absenRes.data;
        const today = new Date().toISOString().split('T')[0];

        const totalStaff = users.filter((u: any) => u.role === 'karyawan').length;

        const presentToday = allAbsensi.filter((a: any) => 
          a.tanggal.includes(today) && a.jam_masuk !== null
        ).length;

        const activeShifts = shiftRes.data.length;

        setStats({ totalStaff, presentToday, activeShifts });
        setRecentLogs(allAbsensi.slice(0, 5));

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyData = days.map(day => {
          const count = allAbsensi.filter((a: any) => {
            const date = new Date(a.tanggal);
            return days[date.getDay()] === day;
          }).length;
          return { name: day, hadir: count };
        });
        
        const mondayFirst = [...weeklyData.slice(1), weeklyData[0]];
        setChartData(mondayFirst);

      } catch (err) {
        console.error("Gagal memuat data dashboard", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Ringkasan Hari Ini</h1>
        <p className="text-slate-500 font-medium">Laporan operasional cafe per tanggal {new Date().toLocaleDateString('id-ID')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-transform hover:scale-105">
          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Karyawan</p>
          <p className="text-4xl font-black text-slate-800 mt-1">{stats.totalStaff}</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-transform hover:scale-105">
          <div className="bg-green-100 text-green-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
            <UserCheck size={24} />
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Hadir Realtime</p>
          <p className="text-4xl font-black text-slate-800 mt-1">{stats.presentToday}</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-transform hover:scale-105">
          <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
            <Activity size={24} />
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Shift</p>
          <p className="text-4xl font-black text-slate-800 mt-1">{stats.activeShifts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl text-slate-800">Trend Kehadiran Mingguan</h3>
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase">Realtime Data</span>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar 
                  dataKey="hadir" 
                  fill="#4f46e5" 
                  radius={[12, 12, 0, 0]} 
                  barSize={45} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
          <h3 className="font-black text-xl text-slate-800 mb-8">Aktivitas Terkini</h3>
          <div className="space-y-7">
            {recentLogs.length > 0 ? recentLogs.map((log: any, i) => (
              <div key={i} className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  {log.nama?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 border-b border-slate-50 pb-2">
                  <p className="font-bold text-slate-800">{log.nama}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                      {log.nama_shift || 'Auto Shift'}
                    </p>
                    <p className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                      {log.jam_masuk}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-400 font-medium py-10">Belum ada absensi hari ini</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}