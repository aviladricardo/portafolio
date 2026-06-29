"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const TOTAL_STEPS = 4;

const STEPS: Record<number, {
  question: string;
  subtitle: string;
  type: "grid" | "radio";
  options: { id: string; emoji?: string; title: string; desc?: string }[];
}> = {
  1: {
    question: "¿Qué tipo de negocio tiene tu familiar?",
    subtitle: "Escoge el que más se parezca",
    type: "grid",
    options: [
      { id: "bodega", emoji: "🛒", title: "Bodega o tienda", desc: "Vende productos del día a día" },
      { id: "taller", emoji: "🔧", title: "Taller o servicio", desc: "Cobra por trabajos o reparaciones" },
      { id: "comida", emoji: "🍽️", title: "Negocio de comida", desc: "Menú, cevichería o similar" },
      { id: "comercio", emoji: "👕", title: "Comercio o reventa", desc: "Compra y vende ropa u otros" },
    ],
  },
  2: {
    question: "¿Cuántos proveedores tiene aproximadamente?",
    subtitle: "Los que le venden mercadería o insumos",
    type: "radio",
    options: [
      { id: "1a3", title: "1 a 3" },
      { id: "4a10", title: "4 a 10" },
      { id: "mas10", title: "Más de 10" },
      { id: "ninguno", title: "No tiene proveedores fijos" },
    ],
  },
  3: {
    question: "¿Cuántas ventas hace en una semana normal?",
    subtitle: "",
    type: "radio",
    options: [
      { id: "menos20", title: "Menos de 20" },
      { id: "20a100", title: "Entre 20 y 100" },
      { id: "mas100", title: "Más de 100" },
      { id: "irregular", title: "Varía mucho, es irregular" },
    ],
  },
  4: {
    question: "¿Cuál es su principal necesidad ahora mismo?",
    subtitle: "Esto personaliza su espejo de negocio",
    type: "grid",
    options: [
      { id: "ingresos", emoji: "📊", title: "Entender mis ingresos y gastos" },
      { id: "credito", emoji: "💳", title: "Acceder a un crédito" },
      { id: "formalizar", emoji: "📋", title: "Formalizar el negocio" },
      { id: "jubilacion", emoji: "🏦", title: "Asegurar mi jubilación" },
    ],
  },
};

const SESSION_KEY = "bcp_onboarding";

function getAnswers(): Record<number, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAnswer(step: number, value: string) {
  const current = getAnswers();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...current, [step]: value }));
}

export default function OnboardingStep() {
  const params = useParams();
  const router = useRouter();
  const step = Number(params.step);
  const config = STEPS[step];

  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const answers = getAnswers();
    if (answers[step]) setSelected(answers[step]);
  }, [step]);

  if (!config) {
    router.replace("/proyectos/familias-bcp");
    return null;
  }

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const handleContinue = () => {
    if (!selected) return;
    saveAnswer(step, selected);
    if (step < TOTAL_STEPS) {
      router.push(`/proyectos/familias-bcp/onboarding/${step + 1}`);
    } else {
      router.push("/proyectos/familias-bcp/onboarding/cargando");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      router.push(`/proyectos/familias-bcp/onboarding/${step - 1}`);
    } else {
      router.push("/proyectos/familias-bcp");
    }
  };

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Flexo';
          src: url('/fonts/Flexo.ttf') format('truetype');
          font-weight: 600 700;
          font-style: normal;
          font-display: swap;
        }
        body { background: white !important; background-image: none !important; }
        @media (min-width: 768px) {
          body { background: #0D1535 !important; }
          .bcp-frame { width: 100% !important; max-width: 960px !important; margin: 40px auto !important; border-radius: 32px !important; box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07) !important; overflow: hidden !important; min-height: 780px !important; }
          .bcp-px { padding-left: 56px !important; padding-right: 56px !important; }
        }
      `}</style>

      <div className="bcp-frame" style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", background: "white", minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>

        {/* Header */}
        <div className="bcp-px" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 12px" }}>
          <button
            onClick={handleBack}
            style={{ width: 38, height: 38, borderRadius: 12, background: "#F0F2F7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="#1A2240" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1.5px", color: "#7A8EAE" }}>BCP · MI FAMILIA</span>
          <div style={{ width: 38 }} />
        </div>

        {/* Progress */}
        <div className="bcp-px" style={{ padding: "0 20px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#9AAABF" }}>Paso {step} de {TOTAL_STEPS}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F07B1F" }}>{progress}%</span>
          </div>
          <div style={{ height: 4, background: "#EEF0F5", borderRadius: 4 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "#F07B1F", borderRadius: 4, transition: "width 0.3s ease" }} />
          </div>
        </div>

        {/* Content */}
        <div className="bcp-px" style={{ flex: 1, padding: "0 20px", display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontFamily: "'Flexo', sans-serif", fontSize: 26, fontWeight: 700, color: "#1A2240", lineHeight: 1.3, marginBottom: 6 }}>
            {config.question}
          </h2>
          {config.subtitle && <p style={{ fontSize: 14, color: "#9AAABF", marginBottom: 28 }}>{config.subtitle}</p>}

          {config.type === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {config.options.map(({ id, emoji, title, desc }) => {
                const isSelected = selected === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSelected(id)}
                    style={{ background: isSelected ? "#EEF4FF" : "white", border: `2px solid ${isSelected ? "#003DA5" : "#E2E8F4"}`, borderRadius: 18, padding: "20px 16px", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 10, transition: "border-color 0.15s, background 0.15s" }}
                  >
                    <span style={{ fontSize: 28 }}>{emoji}</span>
                    <div>
                      <p style={{ fontFamily: "'Flexo', sans-serif", fontSize: 15, fontWeight: 700, color: isSelected ? "#003DA5" : "#1A2240", marginBottom: 4 }}>{title}</p>
                      {desc && <p style={{ fontSize: 12.5, color: "#9AAABF", lineHeight: 1.45 }}>{desc}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {config.options.map(({ id, title }) => {
                const isSelected = selected === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSelected(id)}
                    style={{ background: isSelected ? "#EEF4FF" : "white", border: `2px solid ${isSelected ? "#003DA5" : "#E2E8F4"}`, borderRadius: 14, padding: "16px 18px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "border-color 0.15s, background 0.15s" }}
                  >
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${isSelected ? "#003DA5" : "#C8D2E6"}`, background: isSelected ? "#003DA5" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                      {isSelected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                    </div>
                    <span style={{ fontFamily: isSelected ? "'Flexo', sans-serif" : "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 15, fontWeight: isSelected ? 700 : 400, color: isSelected ? "#003DA5" : "#1A2240" }}>{title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bcp-px" style={{ padding: "24px 20px 40px", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleContinue}
            disabled={!selected}
            style={{ background: "#F07B1F", color: "white", border: "none", borderRadius: 100, padding: "14px 14px 14px 28px", fontSize: 17, fontWeight: 800, cursor: selected ? "pointer" : "default", opacity: selected ? 1 : 0.35, transition: "opacity 0.2s", fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", display: "flex", alignItems: "center", gap: 16 }}
          >
            <span>{step < TOTAL_STEPS ? "Continuar" : "Ver mi organización"}</span>
            <span style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9h10M10 5l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
