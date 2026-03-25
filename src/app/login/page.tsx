"use client";

import { useAuth } from "@/contexts/auth-context";
import { Mail, Lock, Info, Eye, EyeOff, Wallet, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { verifySync } from "otplib";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await handlePostLogin(result.user);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await handlePostLogin(result.user);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/configuration-not-found") {
        setError("Erro: Login por Email/Senha não está ativado no Firebase Console.");
      } else {
        setError(isSignUp ? "Erro ao criar conta. Verifique os dados." : "Email ou senha inválidos.");
      }
      setTimeout(() => setError(""), 5000);
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
    } catch (err: any) {
      console.error("Google Login Error:", err);
      if (err.code === "auth/configuration-not-found") {
        alert("Erro: O provedor Google não está ativado no Firebase Console. Por favor, ative-o na aba Authentication > Sign-in method.");
      } else if (err.code !== "auth/popup-closed-by-user") {
        alert("Erro no login com Google: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8 bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      
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
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 active:scale-95 group shadow-sm mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-label font-bold text-zinc-900 dark:text-zinc-100">Continuar com Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-4 text-xs font-label uppercase tracking-[0.2em] text-muted-foreground">ou</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              {/* Login/Signup Form */}
              <form className="space-y-5" onSubmit={handleEmailAuth}>
                <div className="space-y-4">
                  {/* Email Input */}
                  <div className="relative group">
                    <label className="block text-[10px] font-label font-bold text-muted-foreground uppercase tracking-widest ml-4 mb-1" htmlFor="email">
                      E-mail
                    </label>
                    <div className="relative flex items-center shadow-sm rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                      <Mail className="absolute left-4 w-5 h-5 text-zinc-400" />
                      <input 
                        autoComplete="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-transparent border-none font-label text-zinc-900 dark:text-white focus:ring-0 outline-none transition-all placeholder:text-zinc-400" 
                        id="email" 
                        placeholder="exemplo@email.com" 
                        required 
                        type="email"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="relative group">
                    <label className="block text-[10px] font-label font-bold text-muted-foreground uppercase tracking-widest ml-4 mb-1" htmlFor="password">
                      Senha
                    </label>
                    <div className="relative flex items-center shadow-sm rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                      <Lock className="absolute left-4 w-5 h-5 text-zinc-400" />
                      <input 
                        autoComplete="current-password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-transparent border-none font-label text-zinc-900 dark:text-white focus:ring-0 outline-none transition-all placeholder:text-zinc-400" 
                        id="password" 
                        placeholder="••••••••" 
                        required 
                        type={showPassword ? "text" : "password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-zinc-400 hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                {error && !show2FA && (
                  <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-2 rounded-lg">{error}</p>
                )}

                {/* Security Note */}
                {!isSignUp && (
                  <div className="flex items-start gap-2 px-4 py-3 bg-primary/5 dark:bg-purple-900/10 rounded-xl">
                    <Info className="text-primary dark:text-purple-400 w-4 h-4 mt-0.5" />
                    <p className="text-[11px] font-label text-primary/80 dark:text-purple-300 leading-relaxed">
                      Para sua segurança, após clicar em Entrar, um código de verificação temporário será solicitado via 2FA se habilitado.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4 pt-2">
                  <button className="w-full primary-gradient text-white py-4 px-6 rounded-full font-headline font-bold text-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200" type="submit">
                    {isSignUp ? "Criar Conta" : "Entrar"}
                  </button>
                  <div className="flex items-center justify-between px-2">
                    {!isSignUp ? (
                      <button type="button" className="text-xs font-label font-semibold text-primary dark:text-purple-400 hover:text-primary/70 dark:hover:text-purple-300 transition-colors">
                        Esqueci minha senha
                      </button>
                    ) : <div></div>}
                    <button 
                      type="button" 
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-xs font-label font-bold text-secondary hover:underline underline-offset-4"
                    >
                      {isSignUp ? "Já tenho conta" : "Criar conta"}
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
                  className="w-full px-6 py-5 bg-muted/40 border border-border rounded-2xl font-mono text-center text-3xl tracking-[1em] focus:ring-2 focus:ring-primary/20 outline-none"
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
