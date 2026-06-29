"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SOURCES = [
  { id: "yape",   emoji: "📱", title: "Yape",          desc: "Pagos y cobros por Yape",                    badge: "Más usado", defaultChecked: true  },
  { id: "bcp",    emoji: "🏦", title: "Cuenta BCP",    desc: "Movimientos de tu cuenta BCP",               badge: null,        defaultChecked: true  },
  { id: "otro",   emoji: "🏛️", title: "Otro banco",    desc: "Interbank, BBVA, Scotiabank u otro",          badge: null,        defaultChecked: false },
  { id: "manual", emoji: "📋", title: "Ingreso manual", desc: "Sube una plantilla o ingresa uno a uno",     badge: null,        defaultChecked: false },
];

export default function ConectarPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(
    new Set(SOURCES.filter((s) => s.defaultChecked).map((s) => s.id))
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      <style>{`
        @font-face { font-family: 'Flexo'; src: url('/fonts/Flexo.ttf') format('truetype'); font-weight: 600 700; font-style: normal; font-display: swap; }
        body, html { background: white !important; background-image: none !important; }
        .bcp-bg { display: none; }
        @media (min-width: 768px) {
          .bcp-bg { display: block; position: fixed; inset: 0; background: #0D1535; z-index: 0; }
        }

        @keyframes bcp-slide-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes bcp-fade { from { opacity: 0; } to { opacity: 1; } }

        .bcp-conectar-backdrop { display: none !important; }
        .bcp-conectar-panel {
          font-family: var(--font-nunito,'Nunito',sans-serif);
          background: white;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          max-width: 480px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          body { background: #0D1535 !important; }
          html { background: #0D1535 !important; }

.bcp-conectar-panel {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            width: 480px;
            max-width: 480px;
            margin: 0;
            min-height: unset;
            z-index: 101;
            box-shadow: -16px 0 64px rgba(0,0,40,0.28);
            animation: bcp-slide-right 0.3s cubic-bezier(0.32,0,0.18,1);
            overflow-y: auto;
          }
        }
      `}</style>

      <div className="bcp-bg" />
      <div className="bcp-conectar-backdrop" onClick={() => router.back()} />

      <div className="bcp-conectar-panel">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 16px" }}>
          <button onClick={() => router.back()} style={{ width: 38, height: 38, borderRadius: 12, background: "#F0F2F7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="#1A2240" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1.5px", color: "#7A8EAE" }}>BCP · MI FAMILIA</span>
          <div style={{ width: 38 }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "8px 20px 0", display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontFamily: "'Flexo', sans-serif", fontSize: 28, fontWeight: 700, color: "#1A2240", lineHeight: 1.25, marginBottom: 12 }}>
            Registra ingresos y egresos
          </h2>
          <p style={{ fontSize: 14.5, color: "#003DA5", fontWeight: 600, lineHeight: 1.55, marginBottom: 28 }}>
            Usaremos inteligencia para procesar los movimientos de los últimos 6 meses automáticamente.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SOURCES.map(({ id, emoji, title, desc, badge }) => {
              const isSelected = selected.has(id);
              return (
                <button key={id} onClick={() => toggle(id)} style={{ background: isSelected ? "#EEF4FF" : "white", border: `2px solid ${isSelected ? "#003DA5" : "#E2E8F4"}`, borderRadius: 16, padding: "16px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "border-color 0.15s, background 0.15s" }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontFamily: "'Flexo', sans-serif", fontSize: 15, fontWeight: 700, color: isSelected ? "#003DA5" : "#1A2240" }}>{title}</span>
                      {badge && <span style={{ background: "#F07B1F", color: "white", fontSize: 10.5, fontWeight: 800, borderRadius: 20, padding: "2px 9px" }}>{badge}</span>}
                    </div>
                    <span style={{ fontSize: 13, color: isSelected ? "#5A7ABF" : "#9AAABF" }}>{desc}</span>
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isSelected ? "#003DA5" : "#C8D2E6"}`, background: isSelected ? "#003DA5" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                    {isSelected && <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4.5L4.2 8 11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "24px 20px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 16 }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <rect x="1" y="7" width="12" height="8.5" rx="2.5" stroke="#9AAABF" strokeWidth="1.4"/>
              <path d="M4 7V4.5a3 3 0 016 0V7" stroke="#9AAABF" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="7" cy="11" r="1.1" fill="#9AAABF"/>
            </svg>
            <span style={{ fontSize: 12.5, color: "#9AAABF" }}>Solo tú decides qué compartes. Nadie más tiene acceso.</span>
          </div>
          <button disabled={selected.size === 0} onClick={() => router.push("/proyectos/familias-bcp/onboarding/espejo")} style={{ width: "100%", background: "#F07B1F", color: "white", border: "none", borderRadius: 16, padding: "18px 24px", fontSize: 17, fontWeight: 800, cursor: selected.size > 0 ? "pointer" : "default", opacity: selected.size > 0 ? 1 : 0.4, transition: "opacity 0.2s", fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", boxShadow: "0 8px 24px rgba(240,123,31,0.28)" }}>
            Conectar y analizar
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: "#C8D2E6", marginTop: 12 }}>
            Puedes agregar más fuentes después desde tu perfil
          </p>
        </div>
      </div>
    </>
  );
}
