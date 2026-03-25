"use client";

import { useAuth } from "@/contexts/auth-context";
import { LogOut, LayoutDashboard, Key, QrCode, User, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Painel", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Minhas Chaves", icon: Key, href: "/dashboard/keys" },
    { label: "Gerar PIX", icon: QrCode, href: "/dashboard/generate" },
    { label: "Configurações", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface dark:bg-zinc-950 font-manrope">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-border md:fixed md:h-screen z-40 transition-colors">
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center shadow-lg">
              <QrCode className="text-white w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl text-primary dark:text-purple-400">Pix Flow</span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-primary dark:group-hover:text-purple-400"}`} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-border mt-auto">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <User className="w-5 h-5 text-zinc-500" />
              </div>
              <div className="flex-1 truncate">
                <p className="text-xs text-muted-foreground">Logado como</p>
                <p className="font-bold text-sm truncate text-foreground">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between px-2">
              <ThemeToggle />
              <button 
                onClick={logout}
                className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-border text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 group"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 transition-colors">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
