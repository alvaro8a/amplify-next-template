"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
      console.log("Authorization code recibido:", code);

      localStorage.setItem("cognito_code", code);

      // Limpia la URL (quita ?code=...)
      window.history.replaceState({}, document.title, "/");

      // Redirige a welcome
      router.push("/welcome");
    }
  }, [router]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #6b46c1, #4c1d95)",
        color: "white",
        fontSize: "2rem",
        fontWeight: 700,
      }}
    >
      Quantum Nexus
    </main>
  );
}
