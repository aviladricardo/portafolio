"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BUSINESS_TYPES = [
  { id: "bodega", emoji: "🛒", title: "Bodega o tienda", desc: "Vende productos del día a día" },
  { id: "taller", emoji: "🔧", title: "Taller o servicio", desc: "Cobra por trabajos o reparaciones" },
  { id: "comida", emoji: "🍽️", title: "Negocio de comida", desc: "Menú, cevichería o similar" },
  { id: "comercio", emoji: "👕", title: "Comercio o reventa", desc: "Compra y vende ropa u otros" },
];

const PROVIDER_OPTIONS = [
  { id: "1a3", label: "1 a 3" },
  { id: "4a10", label: "4 a 10" },
  { id: "mas10", label: "Más de 10" },
  { id: "ninguno", label: "No tiene proveedores fijos" },
];

export default function FamiliasBCPPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "" });

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({ nombre: "", email: "", telefono: "" });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.telefono) return;
    sessionStorage.setItem("bcp_lead", JSON.stringify(formData));
    setModalOpen(false);
    router.push("/proyectos/legado/onboarding/1");
  };

  useEffect(() => {
    const items = document.querySelectorAll(".bcp-reveal");
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("bcp-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -44px 0px" }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .bcp-page *,.bcp-page *::before, .bcp-page *::after { box-sizing: border-box; }
        .bcp-page { font-family: var(--font-nunito, 'Nunito', sans-serif); background: #FDF9F4; color: #1A2240; -webkit-font-smoothing: antialiased; min-height: 100vh; }
        .bcp-reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .bcp-reveal.bcp-in { opacity: 1; transform: none; }
        .bcp-reveal.d1 { transition-delay: 0.1s; }
        .bcp-reveal.d2 { transition-delay: 0.2s; }
        .bcp-reveal.d3 { transition-delay: 0.32s; }
        .bcp-reveal.d4 { transition-delay: 0.44s; }
        @keyframes bcp-pulse-dot { 0%, 100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.25); } }
        .bcp-pulse { animation: bcp-pulse-dot 2.6s ease infinite; }
        .bcp-nav-cta:hover { background: #D96C10 !important; box-shadow: 0 6px 22px rgba(240,123,31,0.55) !important; }
        @keyframes tweet-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .bcp-tweet-track { display: flex; gap: 16px; width: max-content; animation: tweet-scroll 18s linear infinite; }
        .bcp-tweet-track:hover { animation-play-state: paused; }
        .bcp-hero-cta:hover { background: #D96C10 !important; transform: translateY(-2px); box-shadow: 0 14px 40px rgba(240,123,31,0.56) !important; }
        .bcp-final-cta:hover { background: #D96C10 !important; transform: translateY(-3px); box-shadow: 0 18px 50px rgba(240,123,31,0.52) !important; }
        .bcp-hero-mobile-img-wrap { display: none; }
        @media (max-width: 860px) {
          .bcp-hero-desktop-only { display: none !important; }
          .bcp-hero-mobile-img-wrap { display: block; }
          .bcp-hero-wave { display: none !important; }
          .bcp-hero-section { min-height: 0 !important; height: calc(100vh - 64px); height: calc(100svh - 64px); }
          .bcp-hero-text { padding: 40px 0 28px !important; }
          .bcp-hero-outer { padding-left: 20px !important; padding-right: 20px !important; align-items: flex-start !important; flex: 0 0 auto !important; position: relative !important; z-index: 2 !important; }
          .bcp-hero-mobile-img-wrap { position: absolute !important; bottom: 0 !important; left: 0 !important; right: 0 !important; flex: none !important; z-index: 1; }
          .bcp-h1-hero { font-size: 30px !important; line-height: 1.22 !important; }
          .bcp-steps-row { flex-direction: column !important; align-items: center !important; gap: 32px !important; }
          .bcp-step-item { width: 100% !important; max-width: 320px !important; }
          .bcp-step-arrow { display: none !important; }
          .bcp-benefits-grid { grid-template-columns: 1fr !important; }
          .bcp-trust-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .bcp-stat-row { gap: 24px !important; }
          .bcp-s-h2 { font-size: 26px !important; }
          .bcp-trust-h2 { font-size: 28px !important; }
        }
        @media (max-width: 480px) {
          .bcp-h1-hero { font-size: 30px !important; }
          .bcp-s-h2 { font-size: 23px !important; }
          .bcp-hero-badge-row { flex-direction: column !important; gap: 10px !important; }
          .bcp-stat-row { flex-wrap: wrap !important; }
        }
      `}</style>

      <div className="bcp-page">

        {/* NAV */}
        <nav style={{ position: "sticky", top: 0, zIndex: 200, background: "rgba(0,32,110,0.96)", backdropFilter: "blur(18px) saturate(160%)", WebkitBackdropFilter: "blur(18px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ background: "#003DA5", border: "1.5px solid rgba(255,255,255,0.25)", color: "white", fontFamily: "'Flexo', sans-serif", fontWeight: 700, fontSize: 12, padding: "5px 9px", borderRadius: 5, letterSpacing: "1.2px", lineHeight: 1 }}>BCP</div>
              <span style={{ color: "white", fontFamily: "'Flexo', sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: "0.2px" }}>Legado</span>
            </div>
            <a href="#" onClick={openModal} className="bcp-nav-cta" style={{ background: "#F07B1F", color: "white", fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 14, fontWeight: 700, padding: "10px 22px", borderRadius: 8, textDecoration: "none", letterSpacing: "0.3px", boxShadow: "0 4px 14px rgba(240,123,31,0.38)", transition: "background 0.2s, box-shadow 0.2s" }}>Empieza gratis</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="bcp-hero-section" style={{ position: "relative", overflow: "hidden", minHeight: "92vh", display: "flex", flexDirection: "column", background: "#001A60" }}>
          <Image className="bcp-hero-desktop-only" src="/hero_desktop.png" alt="" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
          <div className="bcp-hero-desktop-only" aria-hidden="true" style={{ position: "absolute", inset: 0, background: "#001A60", zIndex: 1, opacity: 0.45 }} />
          <div className="bcp-hero-desktop-only" aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(100deg, rgba(0,26,96,0.97) 0%, rgba(0,26,96,0.93) 38%, rgba(0,26,96,0.72) 58%, rgba(0,26,96,0.18) 78%, rgba(0,26,96,0.04) 100%)" }} />
          <div className="bcp-hero-desktop-only" aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, zIndex: 2, background: "linear-gradient(to top,rgba(0,26,96,0.55) 0%,transparent 100%)" }} />

          <div className="bcp-hero-outer" style={{ position: "relative", zIndex: 3, flex: 1, display: "flex", alignItems: "center", maxWidth: 1120, width: "100%", margin: "0 auto", padding: "0 28px" }}>
            <div className="bcp-hero-text" style={{ padding: "100px 0 80px", maxWidth: 580 }}>
              <h1 className="bcp-h1-hero" style={{ fontFamily: "'Flexo', sans-serif", fontSize: 54, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.16, marginBottom: 22 }}>
                Ayúdalos a crecer<br />lo que <span style={{ color: "#F9B370", fontStyle: "normal", fontWeight: 600 }}>construyeron para ti.</span>
              </h1>

              <p style={{ fontSize: 18, color: "rgba(200,218,248,0.92)", lineHeight: 1.74, marginBottom: 40, maxWidth: 440, fontFamily: "var(--font-nunito, 'Nunito', sans-serif)" }}>
                Con Legado BCP podrás entender mejor el negocio familiar y acompañarlos a crecer, a su ritmo.
              </p>

              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 44 }}>
                <a href="#" onClick={openModal} className="bcp-hero-cta" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#F07B1F", color: "white", fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 17, fontWeight: 800, padding: "16px 36px", borderRadius: 12, textDecoration: "none", boxShadow: "0 10px 30px rgba(240,123,31,0.44)", transition: "background 0.2s, box-shadow 0.2s, transform 0.2s" }}>
                  Empieza gratis
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true"><path d="M3.5 8.5h10M8.5 3.5l5 5-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
                <span style={{ color: "rgba(168,194,236,0.75)", fontSize: 13.5, fontFamily: "var(--font-nunito, 'Nunito', sans-serif)" }}>Sin costo · Sin compromisos</span>
              </div>

              <div className="bcp-hero-badge-row" style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
                {[
                  "Ellos controlan lo que comparten",
                  "100% seguro con BCP",
                  "Gratis para empezar",
                ].map((label) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="7.5" stroke="#F07B1F" strokeWidth="1.4" /><path d="M5 8.5L7 10.5L12 5.5" stroke="#F07B1F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ color: "rgba(168,194,236,0.82)", fontSize: 13, fontFamily: "var(--font-nunito, 'Nunito', sans-serif)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile image */}
          <div className="bcp-hero-mobile-img-wrap" style={{ width: "100%", lineHeight: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero_mobile.png" alt="" style={{ display: "block", width: "100%", height: "auto" }} />
          </div>

          <div className="bcp-hero-wave" style={{ overflow: "hidden", height: 58, position: "relative", zIndex: 3, marginTop: -1 }}>
            <svg viewBox="0 0 1440 58" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 58 }} xmlns="http://www.w3.org/2000/svg">
              <path d="M0 32 Q360 60 720 28 Q1080 0 1440 38 L1440 58 L0 58 Z" fill="#FDF9F4" />
            </svg>
          </div>
        </section>

        {/* SECCIÓN 2: EL CAMBIO */}
        <section style={{ background: "#FDF9F4", padding: "90px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p className="bcp-reveal" style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 11.5, fontWeight: 700, letterSpacing: "2.8px", textTransform: "uppercase", color: "#F07B1F", marginBottom: 16 }}>Lo que cambia con Legado</p>

            <h2 className="bcp-s-h2 bcp-reveal d1" style={{ fontFamily: "'Flexo', sans-serif", fontSize: 36, fontWeight: 700, color: "#1A2240", lineHeight: 1.28, marginBottom: 28 }}>
              ¿Llevas años sin saber<br />cómo funciona el negocio familiar?<br />
              <span style={{ color: "#003DA5" }}>Tranquilo.<br />Legado es la solución.</span>
            </h2>

            <p className="bcp-reveal d2" style={{ fontSize: 18, color: "#3A4A72", lineHeight: 1.74, fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", marginBottom: 52 }}>
              LEGADO es la herramienta que te ayuda a entender el negocio de tu papá y te empuja a hacerlo crecer.
            </p>

            {/* Tweet carousel */}
            <div className="bcp-reveal d3" style={{ marginTop: 8, overflow: "hidden", marginLeft: -24, marginRight: -24 }}>
              <div className="bcp-tweet-track">
                {[
                  { initial: "N", grad: "linear-gradient(135deg,#003DA5,#F07B1F)", name: "Nicolás A.", handle: "@nico_avila", text: '15 años sin saber cómo gana papá. 5 minutos con Legado y todo cambió. No fue "debes formalizarte". Fue "mira esto". Y él vio.', tags: "#Legado #MiPapá", time: "9:41 AM · 28 jun 2025", views: "2.4K", stats: ["847","1.2K","312"] },
                  { initial: "V", grad: "linear-gradient(135deg,#7C3AED,#F07B1F)", name: "Valeria M.", handle: "@vale_mendo", text: "Descargué esto para ayudar a mi mamá. Me ayudó primero a entender que no sé nada de su negocio. Ahora sé. Y ella también.", tags: "#Legado #MiMamá", time: "11:23 AM · 14 jun 2025", views: "5.1K", stats: ["1.4K","2.8K","891"] },
                  { initial: "C", grad: "linear-gradient(135deg,#059669,#003DA5)", name: "Carlos R.", handle: "@carlos_r_pe", text: "Mi viejo tiene 30 años de negocio y nunca supo cuánto ganaba exactamente. Legado le mostró el número. Se quedó callado 3 minutos.", tags: "#Legado #NegocioFamiliar", time: "3:17 PM · 2 jun 2025", views: "8.9K", stats: ["2.1K","4.3K","1.6K"] },
                ].concat([
                  { initial: "N", grad: "linear-gradient(135deg,#003DA5,#F07B1F)", name: "Nicolás A.", handle: "@nico_avila", text: '15 años sin saber cómo gana papá. 5 minutos con Legado y todo cambió. No fue "debes formalizarte". Fue "mira esto". Y él vio.', tags: "#Legado #MiPapá", time: "9:41 AM · 28 jun 2025", views: "2.4K", stats: ["847","1.2K","312"] },
                  { initial: "V", grad: "linear-gradient(135deg,#7C3AED,#F07B1F)", name: "Valeria M.", handle: "@vale_mendo", text: "Descargué esto para ayudar a mi mamá. Me ayudó primero a entender que no sé nada de su negocio. Ahora sé. Y ella también.", tags: "#Legado #MiMamá", time: "11:23 AM · 14 jun 2025", views: "5.1K", stats: ["1.4K","2.8K","891"] },
                  { initial: "C", grad: "linear-gradient(135deg,#059669,#003DA5)", name: "Carlos R.", handle: "@carlos_r_pe", text: "Mi viejo tiene 30 años de negocio y nunca supo cuánto ganaba exactamente. Legado le mostró el número. Se quedó callado 3 minutos.", tags: "#Legado #NegocioFamiliar", time: "3:17 PM · 2 jun 2025", views: "8.9K", stats: ["2.1K","4.3K","1.6K"] },
                ]).map((t, i) => (
                  <div key={i} style={{ width: 360, flexShrink: 0, background: "white", border: "1px solid #E2E8F0", borderRadius: 16, padding: "20px 20px 16px", boxShadow: "0 2px 12px rgba(0,26,96,0.07)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.grad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: "white", fontFamily: "var(--font-nunito,'Nunito',sans-serif)" }}>{t.initial}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#0F1419", margin: 0, fontFamily: "var(--font-nunito,'Nunito',sans-serif)" }}>{t.name}</p>
                          <p style={{ fontSize: 13, color: "#536471", margin: 0, fontFamily: "var(--font-nunito,'Nunito',sans-serif)" }}>{t.handle}</p>
                        </div>
                      </div>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#0F1419" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </div>
                    <p style={{ fontSize: 14.5, color: "#0F1419", lineHeight: 1.6, margin: "0 0 10px", fontFamily: "var(--font-nunito,'Nunito',sans-serif)" }}>{t.text}</p>
                    <p style={{ fontSize: 14, color: "#003DA5", margin: "0 0 12px", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontWeight: 600 }}>{t.tags}</p>
                    <p style={{ fontSize: 12.5, color: "#536471", margin: "0 0 10px", fontFamily: "var(--font-nunito,'Nunito',sans-serif)" }}>{t.time} · <span style={{ fontWeight: 700, color: "#0F1419" }}>{t.views}</span> views</p>
                    <div style={{ borderTop: "1px solid #EFF3F4", paddingTop: 10, display: "flex", gap: 20 }}>
                      {[
                        { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 7.879 3.77 7.879 8.05 0 4.42-3.58 8.05-8 8.05h-4c-4.419 0-8.25-3.63-8.25-8.1zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.1 6.25 6.1h4c3.311 0 6-2.68 6-6.05 0-3.32-2.663-6.05-5.879-6.05H9.756z" fill="#536471"/><path d="M6 14.5c0 .83.672 1.5 1.5 1.5h9c.828 0 1.5-.67 1.5-1.5S17.328 13 16.5 13h-9C6.672 13 6 13.67 6 14.5z" fill="#536471"/></svg>, count: t.stats[0] },
                        { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V19.5H7.75C5.681 19.5 4 17.819 4 15.75V8.38L2.353 9.91.647 8.09l4.103-3.3zm11.5 2.71H11V4h5.25c2.07 0 3.75 1.68 3.75 3.75v7.37l1.647-1.53 1.706 1.82-4.103 3.3-4.603-4.3 1.706-1.82L18 13.62V6.25c0-.97-.784-1.75-1.75-1.75z" fill="#536471"/></svg>, count: t.stats[1] },
                        { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" fill="#536471"/></svg>, count: t.stats[2] },
                      ].map(({ icon, count }, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", gap: 5, color: "#536471", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 12.5 }}>
                          {icon}{count}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bcp-steps-row bcp-reveal d4" style={{ display: "flex", alignItems: "flex-start", gap: 0, marginTop: 52, paddingTop: 44, borderTop: "1px solid rgba(0,61,165,0.08)" }}>
              {[
                {
                  icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M3.5 11L20 3.5 13 20 10.5 13 3.5 11Z" stroke="#003DA5" strokeWidth="1.5" strokeLinejoin="round" fill="none" /><path d="M10.5 13L20 3.5" stroke="#003DA5" strokeWidth="1.5" strokeLinecap="round" /></svg>,
                  title: "Invitas a tu papá",
                  desc: "Él decide si entra. Todo desde su decisión.",
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M2.5 11C2.5 11 6 5.5 11 5.5 16 5.5 19.5 11 19.5 11 19.5 11 16 16.5 11 16.5 6 16.5 2.5 11 2.5 11Z" stroke="#003DA5" strokeWidth="1.5" fill="none" /><circle cx="11" cy="11" r="3" stroke="#003DA5" strokeWidth="1.5" fill="none" /></svg>,
                  title: "Su negocio, claro",
                  desc: "Él controla qué comparte. Sin juicios.",
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="8" cy="11" r="5" stroke="#003DA5" strokeWidth="1.5" fill="none" /><circle cx="14" cy="11" r="5" stroke="#003DA5" strokeWidth="1.5" fill="none" /></svg>,
                  title: "Juntos descubren qué le conviene",
                  desc: "A su ritmo. Tú acompañas, él decide.",
                },
              ].map((step, i) => (
                <Fragment key={step.title}>
                  <div className="bcp-step-item" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12, padding: "0 16px" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: "#EEF4FF", border: "1px solid rgba(0,61,165,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {step.icon}
                    </div>
                    <p style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 15, fontWeight: 700, color: "#1A2240", lineHeight: 1.3 }}>{step.title}</p>
                    <p style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 13.5, color: "#7A8EAE", lineHeight: 1.55 }}>{step.desc}</p>
                  </div>
                  {i < 2 && (
                    <div className="bcp-step-arrow" style={{ flex: "0 0 28px", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 22 }}>
                      <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true"><path d="M1 6h14" stroke="#C4D4EE" strokeWidth="1.6" strokeLinecap="round" /><path d="M11 2l4 4-4 4" stroke="#C4D4EE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: LO QUE PUEDEN LOGRAR JUNTOS */}
        <section style={{ background: "#ffffff", padding: "90px 24px" }}>
          <div style={{ maxWidth: 1060, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 58 }}>
              <p className="bcp-reveal" style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 11.5, fontWeight: 700, letterSpacing: "2.8px", textTransform: "uppercase", color: "#F07B1F", marginBottom: 16 }}>Lo que pueden lograr juntos</p>
              <h2 className="bcp-s-h2 bcp-reveal d1" style={{ fontFamily: "'Flexo', sans-serif", fontSize: 36, fontWeight: 700, color: "#1A2240", lineHeight: 1.28 }}>
                De negocio informal a negocio con futuro.<br /><span style={{ color: "#003DA5" }}>Paso a paso, a su ritmo.</span>
              </h2>
            </div>

            <div className="bcp-steps-row" style={{ display: "flex", alignItems: "stretch", gap: 1, marginBottom: 52 }}>
              <div className="bcp-reveal" style={{ flex: 1, padding: "36px 32px", borderRight: "1px solid rgba(0,61,165,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="#003DA5" strokeWidth="1.3" fill="none" /><path d="M8 5v3.5l2 1.5" stroke="#003DA5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <span style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 11, fontWeight: 800, letterSpacing: "2.2px", textTransform: "uppercase", color: "#003DA5" }}>Configuras</span>
                </div>
                <p className="flexo-heavy" style={{ fontFamily: "'Flexo', sans-serif", fontSize: 19, fontWeight: 700, color: "#1A2240", lineHeight: 1.35, marginBottom: 12 }}>El familiar arma su negocio solo, en minutos.</p>
                <p style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 14, color: "#7A8EAE", lineHeight: 1.6 }}>Sin papeleos, sin asesor.</p>
              </div>

              <div className="bcp-reveal d1" style={{ flex: 1, padding: "36px 32px", borderRight: "1px solid rgba(0,61,165,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 12V5.5L8 3l6 2.5V12" stroke="#003DA5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M5.5 12V8.5h5V12" stroke="#003DA5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <span style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 11, fontWeight: 800, letterSpacing: "2.2px", textTransform: "uppercase", color: "#003DA5" }}>Entiendes</span>
                </div>
                <p className="flexo-heavy" style={{ fontFamily: "'Flexo', sans-serif", fontSize: 19, fontWeight: 700, color: "#1A2240", lineHeight: 1.35, marginBottom: 12 }}>Ve sus números claros por primera vez.</p>
                <p style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 14, color: "#7A8EAE", lineHeight: 1.6 }}>Ingresos, gastos, tendencias.</p>
              </div>

              <div className="bcp-reveal d2" style={{ flex: 1, padding: "36px 32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "#FFF0E5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 12L6 7l3.5 3L13 4" stroke="#F07B1F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M11 4h2v2" stroke="#F07B1F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <span style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 11, fontWeight: 800, letterSpacing: "2.2px", textTransform: "uppercase", color: "#F07B1F" }}>Creces</span>
                </div>
                <p className="flexo-heavy" style={{ fontFamily: "'Flexo', sans-serif", fontSize: 19, fontWeight: 700, color: "#1A2240", lineHeight: 1.35, marginBottom: 16 }}>Desbloquean metas reales juntos.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {[
                    { label: "Primera cuenta activa", orange: false },
                    { label: "Primer pago a proveedor", orange: false },
                    { label: "Negocio formalizado", orange: false },
                    { label: "Línea de crédito a costo cero", orange: true },
                    { label: "Primer aporte a jubilación", orange: true },
                  ].map(({ label, orange }) => (
                    <div key={label} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: orange ? "#FFF0E5" : "#EEF4FF", border: `1px solid ${orange ? "rgba(240,123,31,0.2)" : "rgba(0,61,165,0.12)"}`, borderRadius: 100, padding: "7px 14px", width: "fit-content" }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: orange ? "#F07B1F" : "#003DA5", flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 13, fontWeight: 600, color: "#1A2240" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bcp-reveal d3" style={{ textAlign: "center", paddingTop: 40, borderTop: "1px solid rgba(0,61,165,0.08)" }}>
              <p style={{ fontFamily: "'Flexo', sans-serif", fontSize: 18, fontStyle: "italic", fontWeight: 600, color: "#5A6A92", lineHeight: 1.55 }}>Tú los acompañas. Ellos deciden. Cada meta, a su ritmo.</p>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: QUÉ GANA CADA UNO */}
        <section style={{ background: "#ffffff", padding: "90px 24px" }}>
          <div style={{ maxWidth: 1060, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 58 }}>
              <p className="bcp-reveal" style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 11.5, fontWeight: 700, letterSpacing: "2.8px", textTransform: "uppercase", color: "#F07B1F", marginBottom: 14 }}>Ganar en familia</p>
              <h2 className="bcp-s-h2 bcp-reveal d1" style={{ fontFamily: "'Flexo', sans-serif", fontSize: 36, fontWeight: 700, color: "#1A2240", lineHeight: 1.24 }}>Bien para ellos. Tranquilidad para ti.</h2>
            </div>

            <div className="bcp-benefits-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              {/* Papá */}
              <div className="bcp-reveal" style={{ background: "#00206E", borderRadius: 24, padding: "44px 40px", color: "white", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", top: -40, right: -40, width: 190, height: 190, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
                <div aria-hidden="true" style={{ position: "absolute", bottom: -60, left: -20, width: 200, height: 200, borderRadius: "50%", background: "rgba(240,123,31,0.07)", pointerEvents: "none" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30, position: "relative", zIndex: 1 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(240,123,31,0.2)", border: "1px solid rgba(240,123,31,0.32)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M11 3.5L3.5 9.5V19h5v-5h5v5h5V9.5L11 3.5z" stroke="#F9B370" strokeWidth="1.5" strokeLinejoin="round" fill="none" /></svg>
                  </div>
                  <h3 className="flexo-heavy" style={{ fontFamily: "'Flexo', sans-serif", fontSize: 22, fontWeight: 700, color: "white" }}>Para tus padres con negocio</h3>
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 20, position: "relative", zIndex: 1, margin: 0, padding: 0 }}>
                  {[
                    "Ven su negocio claro, por primera vez, sin juicios.",
                    "Saben que lo comparten solo contigo y con nadie más.",
                    "Ya no están solos — pero tampoco presionados.",
                    "Acceden a créditos y ofertas especiales respaldados por ti.",
                  ].map((text) => (
                    <li key={text} style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(240,123,31,0.22)", border: "1.5px solid rgba(240,123,31,0.48)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true"><path d="M1 3.5L3.2 5.8 8 1" stroke="#F9B370" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <p style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 15.5, color: "rgba(220,232,255,0.95)", lineHeight: 1.55 }}>{text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Para ti (hijo) */}
              <div className="bcp-reveal d1" style={{ background: "#FDF9F4", border: "1.5px solid rgba(0,61,165,0.1)", borderRadius: 24, padding: "44px 40px", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", top: -40, right: -40, width: 190, height: 190, borderRadius: "50%", background: "rgba(240,123,31,0.05)", pointerEvents: "none" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30, position: "relative", zIndex: 1 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: "#EEF4FF", border: "1px solid rgba(0,61,165,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M11 19C11 19 3 13.5 3 7.8 3 5.7 4.8 4 7 4c1.4 0 2.7.8 4 2.2C12.3 4.8 13.6 4 15 4c2.2 0 4 1.7 4 3.8C19 13.5 11 19 11 19z" stroke="#003DA5" strokeWidth="1.5" strokeLinejoin="round" fill="none" /></svg>
                  </div>
                  <h3 className="flexo-heavy" style={{ fontFamily: "'Flexo', sans-serif", fontSize: 22, fontWeight: 700, color: "#1A2240" }}>Para ti</h3>
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 20, position: "relative", zIndex: 1, margin: 0, padding: 0 }}>
                  {[
                    "Puedes aconsejarlos sin ser experto en negocios.",
                    "Cuidas su futuro sin quitarles lo que los hace sentirse capaces.",
                    "Los impulsas con información real — sin necesitar ser el experto.",
                    "Adiós conversaciones difíciles — por fin tienen por dónde empezar.",
                  ].map((text) => (
                    <li key={text} style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#EEF4FF", border: "1.5px solid rgba(0,61,165,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true"><path d="M1 3.5L3.2 5.8 8 1" stroke="#003DA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <p style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 15.5, color: "#3A4A72", lineHeight: 1.55 }}>{text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 5: CONFIANZA BCP */}
        <section style={{ background: "#001A60", padding: "90px 24px", position: "relative", overflow: "hidden" }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: 0.038, pointerEvents: "none" }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="dots2" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="18" cy="18" r="1.1" fill="white" /></pattern></defs>
              <rect width="100%" height="100%" fill="url(#dots2)" />
            </svg>
          </div>
          <div aria-hidden="true" style={{ position: "absolute", top: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(240,123,31,0.08)", pointerEvents: "none" }} />
          <div aria-hidden="true" style={{ position: "absolute", bottom: -80, right: -40, width: 340, height: 340, borderRadius: "50%", background: "rgba(168,192,232,0.05)", pointerEvents: "none" }} />

          <div className="bcp-trust-grid" style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", position: "relative", zIndex: 1 }}>
            <div>
              <p className="bcp-reveal" style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 11.5, fontWeight: 700, letterSpacing: "2.8px", textTransform: "uppercase", color: "#F9B370", marginBottom: 16 }}>Respaldo de siempre</p>
              <h2 className="bcp-trust-h2 bcp-reveal d1" style={{ fontFamily: "'Flexo', sans-serif", fontSize: 38, fontWeight: 700, color: "white", lineHeight: 1.22, marginBottom: 24 }}>
                Es BCP. El banco en el<br />que <span style={{ color: "#F9B370" }}>tu familia ya confía.</span>
              </h2>
              <p className="bcp-reveal d2" style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 17, color: "#A8C2EC", lineHeight: 1.74, marginBottom: 44 }}>
                Con más de 130 años acompañando a familias peruanas, BCP nació de ese mismo compromiso: cuidar a los que más quieres. Legado no es un trámite — es una extensión de esa confianza de siempre, pensada para este momento de tu vida.
              </p>
              <div className="bcp-stat-row bcp-reveal d3" style={{ display: "flex", gap: 36, alignItems: "flex-start" }}>
                {[
                  { value: "130+", label: "años en Perú" },
                  { value: "11M+", label: "clientes en todo el país" },
                  { value: "100%", label: "digital y seguro" },
                ].map(({ value, label }, i) => (
                  <Fragment key={value}>
                    {i > 0 && <div style={{ width: 1, background: "rgba(255,255,255,0.1)", alignSelf: "stretch" }} />}
                    <div>
                      <p style={{ fontFamily: "'Flexo', sans-serif", fontSize: 34, fontWeight: 700, color: "#F9B370", lineHeight: 1, marginBottom: 5 }}>{value}</p>
                      <p style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 13, color: "#7A9DC8", lineHeight: 1.4 }}>{label}</p>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="bcp-reveal d2" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
              <div style={{ width: 130, height: 130, borderRadius: 30, background: "rgba(255,255,255,0.07)", border: "2px solid rgba(255,255,255,0.12)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 7 }}>
                <span style={{ fontFamily: "'Flexo', sans-serif", fontSize: 30, fontWeight: 700, color: "white", letterSpacing: "2.5px", lineHeight: 1 }}>BCP</span>
                <div style={{ width: 36, height: 2.5, background: "#F07B1F", borderRadius: 2 }} />
                <span style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 8.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#A8C2EC" }}>Banco de Crédito</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: "22px 30px", textAlign: "center", width: "100%", maxWidth: 280 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "#F07B1F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 1.5L2 5.5v4c0 3.5 3 6.7 7 7.5 4-.8 7-4 7-7.5v-4L9 1.5z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" fill="none" /></svg>
                  </div>
                  <span style={{ fontFamily: "'Flexo', sans-serif", fontSize: 17, fontWeight: 700, color: "white" }}>Legado</span>
                </div>
                <p style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 13, color: "#7A9DC8", lineHeight: 1.55 }}>Un producto de BCP para cuidar el sostén de tu familia</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1L1.5 4v3.5c0 2.8 2.3 5.2 5.5 5.9 3.2-.7 5.5-3.1 5.5-5.9V4L7 1z" stroke="#7A9DC8" strokeWidth="1.2" strokeLinejoin="round" fill="none" /></svg>
                <p style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 12.5, color: "#7A9DC8" }}>Tus datos protegidos por los estándares BCP</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 6: CTA FINAL */}
        <section id="registro" style={{ background: "#FDF9F4", padding: "100px 24px 110px" }}>
          <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
            <div className="bcp-reveal" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(240,123,31,0.1)", border: "1px solid rgba(240,123,31,0.24)", borderRadius: 100, padding: "7px 16px", marginBottom: 28 }}>
              <div className="bcp-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#F07B1F" }} />
              <span style={{ color: "#F07B1F", fontSize: 12, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", fontFamily: "var(--font-nunito, 'Nunito', sans-serif)" }}>Empieza hoy</span>
            </div>
            <h2 className="bcp-s-h2 bcp-reveal d1" style={{ fontFamily: "'Flexo', sans-serif", fontSize: 42, fontWeight: 700, color: "#1A2240", lineHeight: 1.22, marginBottom: 20 }}>Da el primer paso hoy.</h2>
            <p className="bcp-reveal d2" style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 18, color: "#5A6A92", lineHeight: 1.74, marginBottom: 44 }}>
              Ellos merecen un futuro tranquilo. Ahora ayudarlos es mucho más fácil. Empieza gratis y ve hasta dónde pueden llegar juntos.
            </p>
            <div className="bcp-reveal d3">
              <a href="#" onClick={openModal} className="bcp-final-cta" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#F07B1F", color: "white", fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 19, fontWeight: 800, padding: "18px 46px", borderRadius: 14, textDecoration: "none", boxShadow: "0 12px 38px rgba(240,123,31,0.42)", letterSpacing: "0.3px", transition: "background 0.2s, box-shadow 0.2s, transform 0.2s" }}>
                Empieza gratis
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12M10 4l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </div>
            <p className="bcp-reveal d4" style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 13, color: "#8A9DC0", marginTop: 20, letterSpacing: "0.3px" }}>Sin costo · Sin compromisos</p>
          </div>
        </section>

        {/* MODAL: FORMULARIO DE ENTRADA */}
      {modalOpen && (
        <div
          onClick={closeModal}
          style={{ position: "fixed", inset: 0, background: "rgba(0,26,96,0.72)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(4px)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "white", borderRadius: 24, padding: "36px 32px 32px", width: "100%", maxWidth: 480, position: "relative", boxShadow: "0 24px 60px rgba(0,26,96,0.28)" }}
          >
            <button
              onClick={closeModal}
              style={{ position: "absolute", top: 16, right: 16, width: 34, height: 34, borderRadius: "50%", background: "#F0F2F7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#5A6A92", fontSize: 16, fontWeight: 600 }}
            >×</button>

            <h3 className="flexo-heavy" style={{ fontFamily: "'Flexo', sans-serif", fontSize: 24, fontWeight: 700, color: "#1A2240", lineHeight: 1.3, marginBottom: 28 }}>
              Empieza gratis ahora
            </h3>

            <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { key: "nombre", label: "NOMBRE COMPLETO", placeholder: "Tu nombre completo", type: "text" },
                { key: "email", label: "EMAIL", placeholder: "tu@email.com", type: "email" },
                { key: "telefono", label: "TELÉFONO", placeholder: "+51 9XX XXX XXX", type: "tel" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "#7A8EAE" }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={formData[key as keyof typeof formData]}
                    onChange={(e) => setFormData((p) => ({ ...p, [key]: e.target.value }))}
                    style={{ border: "1.5px solid #E2E8F4", borderRadius: 12, padding: "14px 16px", fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 15, color: "#1A2240", outline: "none", background: "white" }}
                    onFocus={(e) => (e.target.style.borderColor = "#003DA5")}
                    onBlur={(e) => (e.target.style.borderColor = "#E2E8F4")}
                  />
                </div>
              ))}

              <button
                type="submit"
                style={{ marginTop: 8, background: "#F07B1F", color: "white", border: "none", borderRadius: 14, padding: "16px 24px", fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 17, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 8px 28px rgba(240,123,31,0.38)", opacity: (!formData.nombre || !formData.email || !formData.telefono) ? 0.5 : 1 }}
              >
                Configurar el negocio
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12M10 4l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>

              <p style={{ textAlign: "center", fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 12.5, color: "#8A9DC0", letterSpacing: "0.3px" }}>100% seguro con BCP · Sin compromisos</p>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
        <footer style={{ background: "#00206E", padding: "36px 24px" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", color: "white", fontFamily: "'Flexo', sans-serif", fontWeight: 700, fontSize: 11.5, padding: "4px 9px", borderRadius: 5, letterSpacing: "1.2px", lineHeight: 1 }}>BCP</div>
              <span style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 14 }}>Legado · Banco de Crédito del Perú</span>
            </div>
            <p style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>© 2026 Banco de Crédito del Perú. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
