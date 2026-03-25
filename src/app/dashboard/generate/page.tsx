"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { QrCode, DollarSign, Wallet, Download, Share2, Printer, MapPin, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { PixKey, generatePixPayload } from "@/lib/pix-logic";
import { QRCodeSVG } from "qrcode.react";

export default function GeneratePage() {
  const { user } = useAuth();
  const [keys, setKeys] = useState<PixKey[]>([]);
  const [selectedKey, setSelectedKey] = useState<PixKey | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [txId, setTxId] = useState<string>("PIXFLOW");
  const [payload, setPayload] = useState<string>("");
  const [isGenerated, setIsGenerated] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "pix_keys"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const keysData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PixKey[];
      setKeys(keysData);
      if (keysData.length > 0) setSelectedKey(keysData[0]);
    });

    return () => unsubscribe();
  }, [user]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKey) return;

    const p = generatePixPayload(
      selectedKey.key,
      selectedKey.name,
      selectedKey.city,
      amount,
      txId
    );
    setPayload(p);
    setIsGenerated(true);
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 50, 900, 900);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `PIX-${selectedKey?.name}-${amount}.png`;
        downloadLink.click();
      }
    };
    img.src = url;
  };

  const copyPayload = () => {
    navigator.clipboard.writeText(payload);
    alert("Copia e cola copiado!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-extrabold text-foreground">Gerar Cobrança PIX</h1>
          <p className="text-muted-foreground font-label">Crie seu QRCode personalizado e receba pagamentos instantâneos.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-zinc-900 border border-border p-8 rounded-[2.5rem] shadow-sm space-y-8"
          >
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-2">Selecione a Chave</label>
                <div className="grid grid-cols-1 gap-3">
                  {keys.map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => setSelectedKey(k)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all duration-200 group text-left ${
                        selectedKey?.id === k.id 
                          ? "bg-primary/5 border-primary/40 dark:bg-purple-900/10 dark:border-purple-500/40" 
                          : "bg-zinc-50 dark:bg-zinc-950/50 border-border hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        selectedKey?.id === k.id ? "bg-primary text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                      }`}>
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{k.name}</p>
                        <p className="text-xs text-muted-foreground truncate font-mono">{k.key}</p>
                      </div>
                      {selectedKey?.id === k.id && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg animate-in zoom-in">
                          <Check className="text-white w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  ))}
                  {keys.length === 0 && (
                    <p className="text-sm text-red-500 p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                      Você precisa cadastrar uma chave primeiro.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-2">Valor (R$)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-5 font-bold text-primary dark:text-purple-400">R$</span>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={amount === 0 ? "" : amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full pl-12 pr-6 py-5 bg-zinc-50 dark:bg-zinc-950 border border-border rounded-2xl font-headline font-bold text-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-2">Identificador (Opcional)</label>
                <input 
                  value={txId}
                  onChange={e => setTxId(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-950 border border-border rounded-2xl font-label text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="EX: PIXFLOW-01"
                />
              </div>

              <button 
                type="submit" 
                disabled={!selectedKey}
                className="w-full primary-gradient text-white py-5 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
              >
                Gerar QR Code
              </button>
            </form>
          </motion.div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center space-y-8 bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-border rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isGenerated ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full flex flex-col items-center space-y-8"
                >
                  <div className="relative" ref={qrRef}>
                    <div className="absolute -inset-4 bg-white rounded-[2rem] shadow-2xl" />
                    <QRCodeSVG 
                      value={payload} 
                      size={280} 
                      level="H" 
                      className="relative z-10 p-2"
                      bgColor="transparent"
                      includeMargin={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none scale-150">
                      <QrCode className="w-full h-full text-primary dark:text-purple-400" />
                    </div>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="flex flex-col items-center text-center px-4">
                      <p className="text-2xl font-headline font-extrabold text-foreground">R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <p className="text-muted-foreground font-label text-sm uppercase tracking-widest">{selectedKey?.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={handleDownload}
                        className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-zinc-800 rounded-2xl font-bold shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors border border-border"
                      >
                        <Download className="w-5 h-5" /> PNG
                      </button>
                      <button 
                        onClick={copyPayload}
                        className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-zinc-800 rounded-2xl font-bold shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors border border-border"
                      >
                        <Share2 className="w-5 h-5" /> Copiar
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => setIsGenerated(false)}
                      className="w-full py-4 text-muted-foreground font-bold hover:text-foreground transition-colors hover:underline"
                    >
                      Criar Outro
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center space-y-4 px-12"
                >
                  <div className="w-20 h-20 rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground mb-4">
                    <QrCode className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-headline font-extrabold">Prévia do PIX</h3>
                  <p className="text-muted-foreground font-label">Preencha os dados ao lado para visualizar e gerar o seu código QR de cobrança.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
