"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Plus, Trash2, Edit3, Key, Check, X, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { PixKey } from "@/lib/pix-logic";

export default function KeysPage() {
  const { user } = useAuth();
  const [keys, setKeys] = useState<PixKey[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<PixKey>({
    name: "",
    key: "",
    type: "EMAIL",
    city: ""
  });

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
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingId) {
        await updateDoc(doc(db, "pix_keys", editingId), { ...formData });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "pix_keys"), {
          ...formData,
          userId: user.uid,
          createdAt: new Date().toISOString()
        });
      }
      setIsAdding(false);
      resetForm();
    } catch (error) {
      console.error("Error saving key", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente excluir esta chave?")) {
      await deleteDoc(doc(db, "pix_keys", id));
    }
  };

  const handleEdit = (key: PixKey) => {
    setFormData(key);
    setEditingId(key.id!);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({ name: "", key: "", type: "EMAIL", city: "" });
    setEditingId(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-foreground">Minhas Chaves PIX</h1>
            <p className="text-muted-foreground font-label">Gerencie suas chaves para recebimento.</p>
          </div>
          <button 
            onClick={() => { setIsAdding(true); resetForm(); }}
            className={`flex items-center gap-2 px-6 py-4 rounded-full font-bold shadow-lg transition-all duration-200 active:scale-95 ${
              isAdding ? "bg-zinc-100 dark:bg-zinc-800 text-foreground" : "primary-gradient text-white shadow-primary/20"
            }`}
          >
            {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isAdding ? "Cancelar" : "Nova Chave"}
          </button>
        </header>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-zinc-50 dark:bg-zinc-900 border border-border rounded-3xl p-6 md:p-8"
            >
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-2">Nome do Beneficiário</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-white dark:bg-zinc-950 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="João Silva"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-2">Cidade</label>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-4 w-5 h-5 text-muted-foreground" />
                    <input 
                      required
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-12 pr-6 py-4 bg-white dark:bg-zinc-950 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="São Paulo"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-2">Tipo de Chave</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-6 py-4 bg-white dark:bg-zinc-950 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                  >
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Telefone</option>
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                    <option value="RANDOM">Aleatória</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-2">Chave PIX</label>
                  <input 
                    required
                    value={formData.key}
                    onChange={e => setFormData({ ...formData, key: e.target.value })}
                    className="w-full px-6 py-4 bg-white dark:bg-zinc-950 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="E-mail, CPF, ou Chave Aleatória"
                  />
                </div>
                <div className="md:col-span-2 pt-2">
                  <button type="submit" className="w-full primary-gradient text-white py-5 rounded-full font-bold shadow-lg shadow-primary/20">
                    {editingId ? "Salvar Alterações" : "Cadastrar Chave"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keys List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keys.map((k, i) => (
            <motion.div
              layout
              key={k.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-zinc-900/50 border border-border p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-purple-900/40 flex items-center justify-center text-primary dark:text-purple-400">
                  <Key className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate">{k.name}</p>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">{k.type}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 rounded-xl border border-border truncate">
                  <p className="text-xs text-muted-foreground mb-0.5">Chave</p>
                  <p className="font-mono text-sm font-medium">{k.key}</p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs px-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{k.city}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(k)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors font-semibold text-sm"
                >
                  <Edit3 className="w-4 h-4" /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(k.id!)}
                  className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-950/30 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
          
          {keys.length === 0 && !isAdding && (
            <div className="md:col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                <Key className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-label">Você ainda não possui chaves cadastradas.</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="text-primary dark:text-purple-400 font-bold hover:underline"
              >
                Cadastre sua primeira agora
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
