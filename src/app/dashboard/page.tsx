"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { Plus, QrCode, TrendingUp, Key } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const stats = [
    { label: "Chaves Ativas", value: "2", icon: Key, color: "bg-blue-500" },
    { label: "Total Gerado", value: "R$ 4.250,00", icon: TrendingUp, color: "bg-emerald-500" },
    { label: "Cobranças", value: "12", icon: QrCode, color: "bg-purple-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12">
        <header className="flex flex-col gap-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-headline font-extrabold tracking-tight text-foreground"
          >
            Olá, <span className="text-primary dark:text-purple-400">{user?.displayName || "Usuário"}</span> 👋
          </motion.h1>
          <p className="text-muted-foreground font-label text-lg">
            Tenha o controle total das suas cobranças instantâneas.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-50 dark:bg-zinc-900 border border-border p-6 rounded-[2rem] flex items-center gap-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center shadow-lg text-white`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-label text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-headline font-extrabold text-foreground">{stat.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="primary-gradient p-1 rounded-[2.5rem] shadow-xl group"
          >
            <div className="bg-white dark:bg-zinc-950 p-10 rounded-[2.3rem] flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl primary-gradient flex items-center justify-center mb-6 shadow-lg">
                <QrCode className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-headline font-extrabold text-foreground mb-4">Gerar Novo PIX</h3>
              <p className="text-muted-foreground font-label mb-10 flex-1">
                Crie um QRCode com valor e chave personalizada instantaneamente para seus clientes.
              </p>
              <Link 
                href="/dashboard/generate"
                className="w-full primary-gradient text-white py-5 px-6 rounded-full font-bold text-center shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all duration-200"
              >
                Gerar Agora
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-secondary p-1 rounded-[2.5rem] shadow-xl"
          >
            <div className="bg-white dark:bg-zinc-950 p-10 rounded-[2.3rem] flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 shadow-lg">
                <Plus className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-headline font-extrabold text-foreground mb-4">Adicionar Chave</h3>
              <p className="text-muted-foreground font-label mb-10 flex-1">
                Cadastre suas chaves PIX para que você possa utilizá-las rapidamente em suas cobranças.
              </p>
              <Link 
                href="/dashboard/keys"
                className="w-full bg-secondary text-white py-5 px-6 rounded-full font-bold text-center shadow-lg shadow-secondary/20 hover:shadow-secondary/40 active:scale-95 transition-all duration-200"
              >
                Gerenciar Chaves
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
