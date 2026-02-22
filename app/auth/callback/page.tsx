"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Callback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      console.error("❌ Cognito error:", error, errorDescription);
      router.replace("/?authError=1");
      return;
    }

    if (!code) {
      console.error("❌ No authorization code received");
      router.replace("/?noCode=1");
      return;
    }

    console.log("✅ Authorization code received:", code);

    // Guarda code (temporal)
    localStorage.setItem("cognito_code", code);

    // ✅ IMPORTANTÍSIMO: NO VAYAS A /app/login (te da 404).
    // Entra a una ruta que SÍ exista:
    router.replace("/welcome");
  }, [params, router]);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      Conectando con Quantum Nexus…
    </div>
  );
}