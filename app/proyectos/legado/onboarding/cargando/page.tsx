"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ITEMS = [
  "Identificando la estructura del negocio...",
  "Estimando el flujo de ingresos...",
  "Preparando tu espejo personalizado...",
];

export default function CargandoPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(0); // number of items checked

  useEffect(() => {
    const timers = [
      setTimeout(() => setChecked(1), 900),
      setTimeout(() => setChecked(2), 1900),
      setTimeout(() => setChecked(3), 2900),
      setTimeout(() => router.push("/proyectos/legado/onboarding/resultado"), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [router]);

  return (
    <>
      <style>{`
        body { background: #001A60 !important; background-image: none !important; }

        @keyframes bcp-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bcp-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
        .bcp-spinner {
          animation: bcp-spin 1.1s linear infinite;
        }
        .bcp-item-enter {
          animation: bcp-fade-in 0.35s ease forwards;
        }
      `}</style>

      <div style={{ background: "#001A60", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "0 32px" }}>

        {/* Decorative circles */}
        <div aria-hidden="true" style={{ position: "absolute", top: -100, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.045)" }} />
        <div aria-hidden="true" style={{ position: "absolute", bottom: -120, left: -60, width: 340, height: 340, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        {/* BCP Badge */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 44 }}>
          <div style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 16, padding: "12px 28px" }}>
            <span style={{ fontFamily: "'Flexo', sans-serif", fontSize: 28, fontWeight: 700, color: "white", letterSpacing: "3px" }}>BCP</span>
          </div>
          <span style={{ fontFamily: "'Flexo', sans-serif", fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,0.75)", letterSpacing: "0.3px" }}>Legado</span>
        </div>

        {/* Spinner */}
        <div style={{ position: "relative", width: 72, height: 72, marginBottom: 44 }}>
          {/* Track */}
          <svg width="72" height="72" viewBox="0 0 72 72" style={{ position: "absolute", inset: 0 }}>
            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
          </svg>
          {/* Arc */}
          <svg width="72" height="72" viewBox="0 0 72 72" className="bcp-spinner" style={{ position: "absolute", inset: 0 }}>
            <circle
              cx="36" cy="36" r="30"
              fill="none"
              stroke="#F07B1F"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="48 140"
            />
          </svg>
        </div>

        {/* Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%", maxWidth: 340 }}>
          {ITEMS.map((label, i) => {
            const done = i < checked;
            const active = i === checked;
            return (
              <div
                key={label}
                className={done ? "bcp-item-enter" : ""}
                style={{ display: "flex", alignItems: "center", gap: 14, opacity: active || done ? 1 : 0.35 }}
              >
                {/* Icon */}
                {done ? (
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#F07B1F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.2 8.5 11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                ) : (
                  <div style={{ width: 26, height: 26, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.25)", flexShrink: 0 }} />
                )}
                <span style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 15, color: done ? "white" : "rgba(255,255,255,0.5)", fontWeight: done ? 600 : 400, transition: "color 0.3s" }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
