"use client";

import { useState, useEffect } from "react";
import { authenticator } from "otplib";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, ShieldAlert, Key, CheckCircle2, Copy } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export function TwoFactorSetup() {
  const { user } = useAuth();
  const [secret, setSecret] = useState("");
  const [otpUrl, setOtpUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");

  useEffect(() => {
    if (!user) return;
    
    const fetch2FAStatus = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().twoFactorEnabled) {
        setIsEnabled(true);
      } else {
        const newSecret = authenticator.generateSecret();
        const url = authenticator.keyuri(user.email!, "Pix Flow", newSecret);
        setSecret(newSecret);
        setOtpUrl(url);
      }
      setLoading(false);
    };

    fetch2FAStatus();
  }, [user]);

  const verifyAndEnable = async () => {
    setStatus("verifying");
    const isValid = authenticator.check(verificationCode, secret);

    if (isValid) {
      await updateDoc(doc(db, "users", user!.uid), {
        twoFactorEnabled: true,
        twoFactorSecret: secret
      });
      setIsEnabled(true);
      setStatus("success");
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const disable2FA = async () => {
    if (confirm("Deseja realmente desativar o 2FA? Isso reduzirá a segurança da sua conta.")) {
      await updateDoc(doc(db, "users", user!.uid), {
        twoFactorEnabled: false,
        twoFactorSecret: null
      });
      setIsEnabled(false);
      const newSecret = authenticator.generateSecret();
      setSecret(newSecret);
      setOtpUrl(authenticator.keyuri(user!.email!, "Pix Flow", newSecret));
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Carregando segurança...</div>;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-border p-8 rounded-[2.5rem] shadow-sm max-w-2xl mx-auto overflow-hidden relative">
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isEnabled ? "bg-emerald-500" : "bg-zinc-100 dark:bg-zinc-800"}`}>
          <ShieldCheck className={`w-8 h-8 ${isEnabled ? "text-white" : "text-muted-foreground"}`} />
        </div>
        <div>
          <h3 className="text-2xl font-headline font-extrabold text-foreground">Verificação em 2 Etapas</h3>
          <p className="text-muted-foreground font-label text-sm">Proteja sua conta com Google Authenticator.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isEnabled ? (
          <motion.div 
            key="enabled"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center text-center p-6 space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <p className="font-bold text-xl text-foreground">O 2FA está ativo!</p>
              <p className="text-muted-foreground font-label">Sua conta está protegida por uma camada adicional de segurança.</p>
            </div>
            <button 
              onClick={disable2FA}
              className="px-8 py-3 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all text-sm border border-red-200 dark:border-red-900"
            >
              Desativar 2FA
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-3xl border border-border">
              <div className="flex flex-col items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                <div className="bg-white p-2 rounded-xl">
                  <QRCodeSVG value={otpUrl} size={150} />
                </div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Escaneie o QR Code</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Configuração Manual</p>
                  <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { navigator.clipboard.writeText(secret); alert("Chave copiada!"); }}>
                    <code className="bg-zinc-200 dark:bg-zinc-800 px-3 py-2 rounded-lg font-mono text-sm flex-1 truncate">{secret}</code>
                    <Copy className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground font-label">
                  1. Abra o Google Authenticator.<br />
                  2. Toque no ícone '+' e escolha 'Ler código QR'.<br />
                  3. Escaneie a imagem ao lado ou insira a chave manual.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-2">Código de Verificação</label>
                <input 
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  placeholder="000000"
                  className="w-full px-6 py-5 bg-zinc-50 dark:bg-zinc-950 border border-border rounded-2xl font-mono text-center text-3xl tracking-[1em] focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-zinc-300"
                />
              </div>
              <button 
                onClick={verifyAndEnable}
                disabled={verificationCode.length !== 6 || status === "verifying"}
                className={`w-full py-5 rounded-full font-bold text-lg shadow-xl transition-all active:scale-[0.98] ${
                  status === "error" ? "bg-red-500 text-white" : "primary-gradient text-white shadow-primary/20"
                }`}
              >
                {status === "verifying" ? "Verificando..." : status === "error" ? "Código Inválido" : "Ativar Segurança"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
