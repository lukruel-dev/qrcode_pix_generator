"use client";

import { useAuth } from "@/contexts/auth-context";
import { Mail, Lock, Info, Wallet, ShieldCheck, Check } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { verifySync } from "otplib";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { googleProvider } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [show2FA, setShow2FA] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [tempUser, setTempUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await handlePostLogin(result.user);
    } catch (err: any) {
      setError("Email ou senha inválidos.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleMfaVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const userRef = doc(db, "users", tempUser.uid);
    const userDoc = await getDoc(userRef);
    const secret = userDoc.data()?.twoFactorSecret;
    
    if (verifySync({ token: mfaCode, secret, strategy: "totp" })) {
      router.push("/dashboard");
    } else {
      setError("Código de verificação inválido.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handlePostLogin = async (user: any) => {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists() && userDoc.data().twoFactorEnabled) {
      setTempUser(user);
      setShow2FA(true);
    } else {
      router.push("/dashboard");
    }
  };

  const onGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handlePostLogin(result.user);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8 bg-surface dark:bg-zinc-950 transition-colors duration-300 relative overflow-hidden">
      
      {/* Theme Toggle */}
      <div className="absolute top-8 right-8 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl primary-gradient flex items-center justify-center mb-6 shadow-xl">
            <Wallet className="text-white w-10 h-10" />
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary dark:text-purple-400">
            Pix Flow
          </h1>
          <p className="mt-2 text-muted-foreground text-sm font-label">
            Sua cobrança instantânea em um toque.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {!show2FA ? (
            <>
              {/* Google Social Login */}
              <button 
                onClick={onGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-zinc-900 border border-border rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-200 active:scale-95 group shadow-sm"
              >
                <Image 
                  alt="Google Logo" 
                  width={20} 
                  height={20} 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZjMORgCQyGQ5OCNj8EEHIn219vfvleMFIGgvEU4hdKoeNrrvoC-a5ov5V-gIKQ7n9T-ozZmrVD9MGqAf0CKqr3BJySXtIHndKFdJRQqlle3gfkzNOMxHMCQBcQ0L3iy_jGiPzNKAIiVlvFJF8yTORNg6sg1ejzxG25lDg-cKJxAuxuCJnSxgAXFtd2b1qoQdkQGy_60Wh8DscCpaYsz43yEhxmcIrxCuukPqkgK2OEaKCii1MxBm8LAOaO3vDYAuA5x4OdywjF_-Y"
                />
                <span className="font-label font-semibold text-foreground">Continuar com Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-4 text-xs font-label uppercase tracking-[0.2em] text-muted-foreground">ou</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              {/* Login Form Placeholder */}
              <form className="space-y-5" onSubmit={handleEmailLogin}>
                <div className="space-y-4">
                  {/* Email Input */}
                  <div className="relative group">
                    <label className="block text-xs font-label font-bold text-muted-foreground uppercase tracking-wider ml-4 mb-1" htmlFor="email">
                      E-mail
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary dark:group-focus-within:text-purple-400 transition-colors" />
                      <input 
                        autoComplete="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-100 dark:bg-zinc-900/50 border-none rounded-2xl font-label text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50" 
                        id="email" 
                        placeholder="exemplo@email.com" 
                        required 
                        type="email"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="relative group">
                    <label className="block text-xs font-label font-bold text-muted-foreground uppercase tracking-wider ml-4 mb-1" htmlFor="password">
                      Senha
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary dark:group-focus-within:text-purple-400 transition-colors" />
                      <input 
                        autoComplete="current-password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-100 dark:bg-zinc-900/50 border-none rounded-2xl font-label text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50" 
                        id="password" 
                        placeholder="••••••••" 
                        required 
                        type="password"
                      />
                    </div>
                  </div>
                </div>
                
                {error && !show2FA && (
                  <p className="text-red-500 text-xs font-bold text-center">{error}</p>
                )}

                {/* Security Note */}
                <div className="flex items-start gap-2 px-4 py-3 bg-primary/5 dark:bg-purple-900/20 rounded-xl">
                  <Info className="text-primary dark:text-purple-400 w-4 h-4 mt-0.5" />
                  <p className="text-[11px] font-label text-primary/80 dark:text-purple-300 leading-relaxed">
                    Para sua segurança, após clicar em Entrar, um código de verificação temporário será solicitado via 2FA se habilitado.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-2">
                  <button className="w-full primary-gradient text-white py-4 px-6 rounded-full font-headline font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200" type="submit">
                    Entrar
                  </button>
                  <div className="flex items-center justify-between px-2">
                    <button type="button" className="text-xs font-label font-semibold text-primary dark:text-purple-400 hover:text-primary/70 dark:hover:text-purple-300 transition-colors">
                      Esqueci minha senha
                    </button>
                    <button type="button" className="text-xs font-label font-semibold text-secondary hover:underline underline-offset-4">
                      Criar conta
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg text-white">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-headline font-extrabold">Verificação 2FA</h2>
                <p className="text-muted-foreground text-sm font-label">Digite o código de 6 dígitos gerado pelo seu Google Authenticator.</p>
              </div>

              <form onSubmit={handleMfaVerification} className="space-y-6">
                <input 
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={e => setMfaCode(e.target.value)}
                  placeholder="000000"
                  className="w-full px-6 py-5 bg-white dark:bg-zinc-950 border border-border rounded-2xl font-mono text-center text-3xl tracking-[1em] focus:ring-2 focus:ring-primary/20 outline-none"
                />
                
                {error && (
                  <p className="text-red-500 text-sm font-bold text-center animate-bounce">{error}</p>
                )}

                <button 
                  type="submit"
                  disabled={mfaCode.length !== 6}
                  className="w-full primary-gradient text-white py-4 rounded-full font-bold text-lg shadow-lg disabled:opacity-50"
                >
                  Verificar e Entrar
                </button>
                
                <button 
                  type="button"
                  onClick={() => setShow2FA(false)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors font-semibold"
                >
                  Voltar para o Login
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-full opacity-10 pointer-events-none overflow-hidden blur-3xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary"></div>
        <div className="absolute top-1/2 -right-48 w-80 h-80 rounded-full bg-primary"></div>
      </div>
      <div className="fixed bottom-0 left-0 -z-10 w-1/3 h-full opacity-5 pointer-events-none overflow-hidden blur-3xl">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary-container"></div>
      </div>

      {/* Footer Copyright */}
      <div className="fixed bottom-8 w-full text-center px-6 pointer-events-none">
        <p className="text-[10px] font-label text-muted-foreground uppercase tracking-widest opacity-60">
          © 2024 Pix Charge Tecnologia S.A.
        </p>
      </div>
    </div>
  );
}
