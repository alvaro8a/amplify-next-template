"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) {
      console.error("❌ No authorization code received");
      router.push("/app/login");
      return;
    }

    // Guardamos el code temporalmente (luego lo cambiaremos por token real)
    localStorage.setItem("cognito_code", code);

    console.log("✅ Authorization code received");

    // Redirige al panel (o login si aún no hay sesión)
    router.push("/app/login");
  }, [router]);

  return (
    <div style={{padding:40,textAlign:"center"}}>
      Conectando con Quantum Nexus...
    </div>
  );
}