"use client";

import { useRouter } from "next/navigation";

function BlurredDashboard() {
  return (
    <div style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none", padding: "20px 16px 0" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["Ingresos", "Egresos y gastos", "Balance", ""].map((tab, i) => (
          <div key={i} style={{ height: 30, borderRadius: 20, background: i === 3 ? "#F07B1F" : "#E2EBFF", width: i === 3 ? 60 : tab.length * 7 + 20, flexShrink: 0 }} />
        ))}
      </div>
      {/* Metric row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Ventas del mes", value: "S/ 5,200", sub: "↑ 12% vs mes anterior" },
          { label: "Transacciones", value: "7", sub: "últ. 30 días" },
        ].map(({ label, value, sub }) => (
          <div key={label} style={{ background: "#F4F6FB", borderRadius: 14, padding: "14px 12px" }}>
            <p style={{ fontSize: 11, color: "#9AAABF", marginBottom: 6 }}>{label}</p>
            <p style={{ fontFamily: "'Flexo', sans-serif", fontSize: 20, fontWeight: 700, color: "#1A2240", marginBottom: 3 }}>{value}</p>
            <p style={{ fontSize: 11, color: "#7AAABF" }}>{sub}</p>
          </div>
        ))}
      </div>
      {/* Chart placeholder */}
      <div style={{ background: "#F4F6FB", borderRadius: 14, padding: "14px 12px", marginBottom: 14 }}>
        <p style={{ fontSize: 11, color: "#9AAABF", marginBottom: 12 }}>Flujo semanal</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
          {[40, 65, 50, 80, 45, 90, 70].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 4, background: i === 5 ? "#003DA5" : "#C8D8F5" }} />
          ))}
        </div>
      </div>
      {/* Row */}
      <div style={{ background: "#F4F6FB", borderRadius: 14, padding: "14px 12px" }}>
        <div style={{ height: 12, width: "60%", background: "#D0DBEF", borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 10, width: "40%", background: "#E2E8F4", borderRadius: 4 }} />
      </div>
    </div>
  );
}

export default function EspejoPage() {
  const router = useRouter();

  return (
    <>
      <style>{`
        body { background: #001A60 !important; background-image: none !important; }
        @media (min-width: 768px) {
          body { background: #0D1535 !important; }
          .bcp-frame { width: 100% !important; max-width: 960px !important; margin: 40px auto !important; border-radius: 32px !important; box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07) !important; overflow: hidden !important; min-height: 780px !important; }
          .bcp-px { padding-left: 56px !important; padding-right: 56px !important; }
        }
      `}</style>

      <div className="bcp-frame" style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", height: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div className="bcp-px" style={{ background: "#001A60", padding: "52px 24px 28px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <h1 style={{ fontFamily: "'Flexo', sans-serif", fontSize: 28, fontWeight: 700, color: "white", lineHeight: 1.2 }}>
              Tu espejo está listo
            </h1>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1 5.5L5 9.5 13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "rgba(168,194,236,0.85)" }}>Esto es lo que encontramos en tu negocio</p>
        </div>

        {/* Blurred preview card */}
        <div style={{ flex: 1, background: "white", borderRadius: "24px 24px 0 0", marginTop: -16, overflow: "hidden", position: "relative", minHeight: 0 }}>
          <BlurredDashboard />
          {/* Fade to white at bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 220, background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 60%)" }} />
        </div>

        {/* Pricing bottom sheet — in flow, not fixed */}
        <div className="bcp-px" style={{ background: "white", borderRadius: "24px 24px 0 0", padding: "28px 20px 40px", boxShadow: "0 -8px 40px rgba(0,26,96,0.12)", flexShrink: 0 }}>
          <h2 style={{ fontFamily: "'Flexo', sans-serif", fontSize: 20, fontWeight: 700, color: "#1A2240", textAlign: "center", marginBottom: 20 }}>
            Activa Mi Familia para ver todo
          </h2>

          {/* Plan cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {/* Free */}
            <div style={{ border: "1.5px solid #E2E8F4", borderRadius: 16, padding: "16px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
              <p style={{ fontFamily: "'Flexo', sans-serif", fontSize: 16, fontWeight: 700, color: "#1A2240" }}>Gratis</p>
              <p style={{ fontSize: 12.5, color: "#7A8EAE", lineHeight: 1.5 }}>Vista general del negocio</p>
              <p style={{ fontSize: 12, color: "#C8D2E6", lineHeight: 1.5, marginTop: 4 }}>Sin metas ni asesor</p>
            </div>
            {/* Plus — recommended */}
            <div style={{ position: "relative", border: "2px solid #F07B1F", borderRadius: 16, padding: "16px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
              {/* Badge */}
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#F07B1F", borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap" }}>
                <span style={{ fontSize: 9.5, fontWeight: 800, color: "white", letterSpacing: "1px" }}>RECOMENDADO</span>
              </div>
              <p style={{ fontFamily: "'Flexo', sans-serif", fontSize: 14, fontWeight: 700, color: "#F07B1F" }}>Mi Familia Plus</p>
              <p style={{ fontFamily: "'Flexo', sans-serif", fontSize: 16, fontWeight: 700, color: "#1A2240" }}>S/ 15 / mes</p>
              {["Espejo completo — 6 meses", "Metas desbloqueables", "Asesor familiar BCP"].map((f) => (
                <p key={f} style={{ fontSize: 12, color: "#5A6A92", lineHeight: 1.5 }}>{f}</p>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push("/proyectos/familias-bcp")}
            style={{ width: "100%", background: "#F07B1F", color: "white", border: "none", borderRadius: 16, padding: "18px", fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 17, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(240,123,31,0.3)", marginBottom: 12 }}
          >
            Activar Mi Familia Plus
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: "#C8D2E6" }}>Cancela cuando quieras · Sin permanencia</p>
        </div>

      </div>
    </>
  );
}
