"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { TwoFactorSetup } from "@/components/two-factor-setup";
import { Shield, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-12">
        <header className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-purple-400 mb-2 shadow-sm border border-primary/10"
          >
            <Settings className="w-6 h-6" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-foreground">Configurações</h1>
          <p className="text-muted-foreground font-label text-lg">Gerencie a segurança e preferências da sua conta.</p>
        </header>

        <section className="space-y-8">
          <div className="flex items-center gap-2 text-primary dark:text-purple-400">
            <Shield className="w-5 h-5 font-bold" />
            <h2 className="text-xl font-headline font-extrabold uppercase tracking-widest text-sm">Segurança da Conta</h2>
          </div>
          
          <TwoFactorSetup />
        </section>

        {/* Account Info Placeholder */}
        <section className="bg-zinc-50 dark:bg-zinc-900 border border-border p-8 rounded-[2.5rem] opacity-50 grayscale pointer-events-none">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-1">
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-48 bg-zinc-100 dark:bg-zinc-700 rounded" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest pl-2 mb-2 italic">Em desenvolvimento...</p>
        </section>
      </div>
    </DashboardLayout>
  );
}
