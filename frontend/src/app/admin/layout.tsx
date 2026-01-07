"use client";
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  LogOut, 
  Coffee, 
  BellDot, 
  ClipboardCheck 
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Manajemen Karyawan', icon: Users, path: '/admin/karyawan' },
    { name: 'Kelola Shift', icon: Clock, path: '/admin/shift' },
    { name: 'Kelola Absensi', icon: ClipboardCheck, path: '/admin/absensi' }, 
    { name: 'Permintaan Shift', icon: BellDot, path: '/admin/permintaan' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-72 bg-white border-r border-slate-200 fixed h-full z-20 shadow-sm">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <Coffee size={24}/>
          </div>
          <div>
            <span className="font-black text-xl tracking-tighter text-slate-800 block leading-none uppercase">28 HUB</span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all cursor-pointer ${
                pathname === item.path 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}>
                <item.icon size={20} />
                <span className="text-sm">{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-10 min-h-screen">
        {children}
      </main>
    </div>
  );
}