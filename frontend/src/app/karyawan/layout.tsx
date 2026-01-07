"use client";
import { LayoutDashboard, Send, History, LogOut, Coffee } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function KaryawanLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/karyawan' },
    { name: 'Request Shift', icon: Send, path: '/karyawan/request' },
    { name: 'Riwayat Absen', icon: History, path: '/karyawan/riwayat' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-72 bg-white border-r border-slate-200 fixed h-full z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-orange-500 p-2.5 rounded-2xl text-white shadow-lg shadow-orange-100">
            <Coffee size={24}/>
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-800">28 HUB</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all cursor-pointer ${
                pathname === item.path ? 'bg-orange-50 text-orange-600' : 'text-slate-400 hover:bg-slate-50'
              }`}>
                <item.icon size={20} />
                {item.name}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <button onClick={() => { localStorage.clear(); router.push('/'); }} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-10">
        {children}
      </main>
    </div>
  );
}