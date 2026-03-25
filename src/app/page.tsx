"use client";

import { useEffect, useState } from "react";
import { SplashScreen } from "@/components/splash-screen";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!showSplash && !loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [showSplash, loading, user, router]);

  return (
    <main className="min-h-screen bg-background">
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
    </main>
  );
}
