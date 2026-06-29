"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function BcpLoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const businessName = params.get("businessName") ?? "";
  const relacion = params.get("relacion") ?? "";

  const [step, setStep] = useState<"datos" | "pin" | "verificando">("datos");
  const [dni, setDni] = useState("");
  const [celular, setCelular] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(0);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const canSend = dni.replace(/\D/g, "").length === 8 && celular.replace(/\D/g, "").length === 9;
  const pinComplete = pin.every((d) => d !== "");

  const handleSendPin = () => {
    if (!canSend) return;
    setError("");
    setStep("pin");
    setTimeout(() => pinRefs.current[0]?.focus(), 100);
  };

  const handlePinChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...pin];
    next[i] = digit;
    setPin(next);
    if (digit && i < 5) pinRefs.current[i + 1]?.focus();
  };

  const handlePinKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[i] && i > 0) {
      pinRefs.current[i - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (!pinComplete) return;
    if (pin.join("") !== "556677") {
      setError("PIN incorrecto. Intenta de nuevo.");
      setPin(["", "", "", "", "", ""]);
      setTimeout(() => pinRefs.current[0]?.focus(), 50);
      return;
    }
    setError("");
    setStep("verificando");
  };

  useEffect(() => {
    if (step !== "verificando") return;
    const t1 = setTimeout(() => setChecked(1), 700);
    const t2 = setTimeout(() => setChecked(2), 1500);
    const t3 = setTimeout(() => {
      router.replace(
        `/proyectos/familias-bcp/onboarding/resultado?verified=true&businessName=${encodeURIComponent(businessName)}&relacion=${encodeURIComponent(relacion)}`
      );
    }, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [step, businessName, relacion, router]);

  return (
    <>
      <style>{`
        @font-face { font-family: 'Flexo'; src: url('/fonts/Flexo.ttf') format('truetype'); font-weight: 600 700; font-style: normal; font-display: swap; }
        body { background: #001A60 !important; background-image: none !important; }
        @keyframes bcp-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .bcp-check-item { animation: bcp-fade-in 0.3s ease forwards; }
        @keyframes bcp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .bcp-spin { animation: bcp-spin 1s linear infinite; }
        .bcp-input:focus { border-color: #003DA5 !important; }
        .bcp-pin-input { width: 44px; height: 52px; border: 2px solid #E2E8F4; border-radius: 12px; text-align: center; font-size: 22px; font-weight: 700; color: #1A2240; font-family: var(--font-nunito,'Nunito',sans-serif); outline: none; transition: border-color 0.15s; }
        .bcp-pin-input:focus { border-color: #003DA5; }
        .bcp-pin-input.filled { border-color: #003DA5; background: #EEF4FF; }
      `}</style>

      <div style={{ background: "#001A60", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <div style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 14, padding: "10px 22px" }}>
            <span style={{ fontFamily: "'Flexo',sans-serif", fontSize: 24, fontWeight: 700, color: "white", letterSpacing: "3px" }}>BCP</span>
          </div>
          <span style={{ fontFamily: "'Flexo',sans-serif", fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Mi Familia</span>
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: "36px 32px 40px", width: "100%", maxWidth: 400, boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>

          {/* Step: datos */}
          {step === "datos" && (
            <>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: "#9AAABF", marginBottom: 8 }}>VERIFICACIÓN DE IDENTIDAD</p>
              <h2 style={{ fontFamily: "'Flexo',sans-serif", fontSize: 22, fontWeight: 700, color: "#1A2240", marginBottom: 6 }}>Confirma quién eres</h2>
              <p style={{ fontSize: 13.5, color: "#9AAABF", lineHeight: 1.55, marginBottom: 28 }}>
                Para verificar <strong style={{ color: "#1A2240" }}>{businessName || "tu negocio"}</strong> ingresa tu DNI y celular registrado.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#9AAABF", display: "block", marginBottom: 6 }}>DNI</label>
                  <input className="bcp-input" value={dni} onChange={(e) => setDni(e.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="12345678" inputMode="numeric"
                    style={{ width: "100%", border: "2px solid #E2E8F4", borderRadius: 12, padding: "13px 16px", fontSize: 15, fontFamily: "var(--font-nunito,'Nunito',sans-serif)", color: "#1A2240", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#9AAABF", display: "block", marginBottom: 6 }}>CELULAR</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#9AAABF", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", pointerEvents: "none" }}>+51</span>
                    <input className="bcp-input" value={celular} onChange={(e) => setCelular(e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="987 654 321" inputMode="numeric"
                      style={{ width: "100%", border: "2px solid #E2E8F4", borderRadius: 12, padding: "13px 16px 13px 52px", fontSize: 15, fontFamily: "var(--font-nunito,'Nunito',sans-serif)", color: "#1A2240", outline: "none", boxSizing: "border-box" }}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSendPin(); }} />
                  </div>
                </div>
              </div>

              {error && <p style={{ fontSize: 13, color: "#EF4444", marginTop: 12 }}>{error}</p>}

              <button onClick={handleSendPin} disabled={!canSend}
                style={{ marginTop: 28, width: "100%", background: "#F07B1F", color: "white", border: "none", borderRadius: 14, padding: "16px", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 16, fontWeight: 800, cursor: canSend ? "pointer" : "default", opacity: canSend ? 1 : 0.4, transition: "opacity 0.2s" }}>
                Enviar SMS con PIN
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 16 }}>
                <svg width="12" height="14" viewBox="0 0 14 16" fill="none"><rect x="1" y="7" width="12" height="8.5" rx="2.5" stroke="#C8D2E6" strokeWidth="1.4"/><path d="M4 7V4.5a3 3 0 016 0V7" stroke="#C8D2E6" strokeWidth="1.4" strokeLinecap="round"/></svg>
                <span style={{ fontSize: 12, color: "#C8D2E6" }}>Tus datos solo se usan para verificar tu identidad</span>
              </div>
            </>
          )}

          {/* Step: PIN */}
          {step === "pin" && (
            <>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#FFF0E0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="10" width="20" height="12" rx="3" stroke="#F07B1F" strokeWidth="1.8"/><path d="M7 10V7a5 5 0 0110 0v3" stroke="#F07B1F" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill="#F07B1F"/></svg>
              </div>
              <h2 style={{ fontFamily: "'Flexo',sans-serif", fontSize: 22, fontWeight: 700, color: "#1A2240", marginBottom: 6 }}>Ingresa el PIN</h2>
              <p style={{ fontSize: 13.5, color: "#9AAABF", lineHeight: 1.55, marginBottom: 28 }}>
                Te enviamos un SMS al <strong style={{ color: "#1A2240" }}>+51 {celular.slice(0,3)} {celular.slice(3,6)} {celular.slice(6)}</strong> con un código de 6 dígitos.
              </p>

              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
                {pin.map((d, i) => (
                  <input key={i} ref={(el) => { pinRefs.current[i] = el; }} className={`bcp-pin-input${d ? " filled" : ""}`}
                    value={d} inputMode="numeric" maxLength={1}
                    onChange={(e) => handlePinChange(i, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(i, e)} />
                ))}
              </div>

              {error && <p style={{ fontSize: 13, color: "#EF4444", textAlign: "center", marginBottom: 12 }}>{error}</p>}

              <button onClick={handleVerify} disabled={!pinComplete}
                style={{ width: "100%", background: "#F07B1F", color: "white", border: "none", borderRadius: 14, padding: "16px", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 16, fontWeight: 800, cursor: pinComplete ? "pointer" : "default", opacity: pinComplete ? 1 : 0.4, transition: "opacity 0.2s", marginBottom: 16 }}>
                Verificar PIN
              </button>

              <div style={{ textAlign: "center" }}>
                <button onClick={() => { setPin(["","","","","",""]); setStep("datos"); }} style={{ background: "none", border: "none", fontSize: 13, color: "#9AAABF", cursor: "pointer", fontFamily: "var(--font-nunito,'Nunito',sans-serif)" }}>
                  ¿No recibiste el SMS? Reintentar
                </button>
              </div>
            </>
          )}

          {/* Step: verificando */}
          {step === "verificando" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0" }}>
              <div style={{ position: "relative", width: 60, height: 60, marginBottom: 32 }}>
                <svg width="60" height="60" viewBox="0 0 60 60" style={{ position: "absolute", inset: 0 }}>
                  <circle cx="30" cy="30" r="26" fill="none" stroke="#F0F2F8" strokeWidth="4"/>
                </svg>
                <svg width="60" height="60" viewBox="0 0 60 60" className="bcp-spin" style={{ position: "absolute", inset: 0 }}>
                  <circle cx="30" cy="30" r="26" fill="none" stroke="#F07B1F" strokeWidth="4" strokeLinecap="round" strokeDasharray="40 122"/>
                </svg>
              </div>
              <p style={{ fontFamily: "'Flexo',sans-serif", fontSize: 18, fontWeight: 700, color: "#1A2240", marginBottom: 24, textAlign: "center" }}>Verificando identidad…</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
                {["Validando DNI y celular", "Confirmando titularidad del negocio"].map((label, i) => (
                  checked > i ? (
                    <div key={label} className="bcp-check-item" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#F07B1F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L3.8 8 10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span style={{ fontSize: 14, color: "#1A2240", fontWeight: 600 }}>{label}</span>
                    </div>
                  ) : (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.3 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid #C8D2E6", flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: "#9AAABF" }}>{label}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {step !== "verificando" && (
          <button onClick={() => router.back()} style={{ marginTop: 20, background: "none", border: "none", color: "rgba(255,255,255,0.45)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-nunito,'Nunito',sans-serif)" }}>
            Cancelar y volver
          </button>
        )}
      </div>
    </>
  );
}

export default function BcpLoginPage() {
  return (
    <Suspense>
      <BcpLoginContent />
    </Suspense>
  );
}
