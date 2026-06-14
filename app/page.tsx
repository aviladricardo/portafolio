const mono = "var(--font-geist-mono), monospace";
const serif = "var(--font-newsreader), Georgia, serif";

const skills = [
  "Estrategia de innovación",
  "Prototipado y experimentación",
  "Product discovery",
  "Gestión de productos",
  "Liderazgo multidisciplinario",
  "Análisis de data",
  "Gestión de stakeholders",
];

const techStack = ["VS Code", "Vercel", "Supabase", "GitHub", "Figma"];

const otros = [
  { title: "Hyper Island", year: "'26", desc: "AI Acceleration Program · CMOs Intercorp" },
  { title: "UTEC + Empathy", year: "'24", desc: "Planificación Estratégica basada en escenarios futuros" },
  { title: "Design3", year: "'24", desc: "AI Product Management" },
  { title: "Colectivo 23 · IDEO", year: "'19", desc: "Liderazgo de Productos Digitales" },
  { title: "Comunidad Andina", year: "'16", desc: "Premio a innovación en biomedicina" },
  { title: "U. Politécnica de Cataluña", year: "'12", desc: "Beca de intercambio" },
];

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#DEE0E5",
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "28px",
      }}
    >
      <div
        style={{
          width: "920px",
          maxWidth: "100%",
          backgroundColor: "#F6F5F1",
          backgroundImage:
            "radial-gradient(120% 68% at 100% 0%, rgba(42,71,196,0.09), transparent 55%), radial-gradient(circle, rgba(42,71,196,0.15) 1px, transparent 1.4px)",
          backgroundSize: "auto, 22px 22px",
          color: "#15171C",
          boxShadow: "0 24px 60px -24px rgba(20,30,60,0.32)",
          padding: "64px 72px 56px",
        }}
      >
        {/* MASTHEAD */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "40px",
            paddingBottom: "26px",
            borderBottom: "1px solid #e2e1dc",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: mono,
                fontSize: "11px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#2A47C4",
                marginBottom: "16px",
              }}
            >
              Product · Innovación · Diseño estratégico
            </div>
            <h1
              style={{
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "60px",
                lineHeight: 0.98,
                letterSpacing: "-0.015em",
                margin: 0,
              }}
            >
              Ricardo Avila
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "5px",
              fontFamily: mono,
              fontSize: "12px",
              color: "#6B6F76",
              letterSpacing: "0.01em",
              textAlign: "right",
              paddingBottom: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <span>(+51) 936 025 637</span>
            <span>ricardo.avila@pucp.pe</span>
            <span>linkedin.com/in/ravilade</span>
          </div>
        </header>

        {/* LEAD */}
        <p
          className="cv-pretty"
          style={{
            fontFamily: serif,
            fontWeight: 300,
            fontSize: "21px",
            lineHeight: 1.5,
            color: "#33363d",
            margin: "32px 0 0",
            maxWidth: "74ch",
          }}
        >
          Lidero estrategia de producto desde una mirada de{" "}
          <em style={{ fontStyle: "italic", color: "#15171C" }}>
            innovación centrada en las personas
          </em>{" "}
          con visión de negocio. Combino exploración anticipatoria con ejecución
          end-to-end: identifico señales tempranas y construyo experimentos que
          escalan a pilotos en producción. Mi fluidez tecnológica abarca IA,
          herramientas no-code y prototipado digital y físico para validar
          rápido antes de escalar.
        </p>

        {/* ESPECIALIZACIONES */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px 16px",
            marginTop: "20px",
            fontFamily: mono,
            fontSize: "11px",
            letterSpacing: "0.02em",
          }}
        >
          <span>
            <span style={{ color: "#15171C", fontWeight: 500 }}>Hyper Island</span>{" "}
            <span style={{ color: "#888c93" }}>AI Acceleration Program</span>
          </span>
          <span style={{ color: "#c7c9cf" }}>·</span>
          <span>
            <span style={{ color: "#15171C", fontWeight: 500 }}>Empathy</span>{" "}
            <span style={{ color: "#888c93" }}>Strategic Foresight</span>
          </span>
          <span style={{ color: "#c7c9cf" }}>·</span>
          <span>
            <span style={{ color: "#15171C", fontWeight: 500 }}>MIT</span>{" "}
            <span style={{ color: "#888c93" }}>Innovation Leadership</span>
          </span>
        </div>

        {/* META: competencias + tech */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            marginTop: "40px",
            paddingTop: "30px",
            borderTop: "1px solid #e2e1dc",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: mono,
                fontSize: "10.5px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#888c93",
                marginBottom: "16px",
              }}
            >
              Competencias
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {skills.map((s) => (
                <span
                  key={s}
                  style={{
                    border: "1px solid #d3d4d9",
                    padding: "5px 11px",
                    fontSize: "12px",
                    color: "#41454d",
                    borderRadius: "2px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: mono,
                fontSize: "10.5px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#888c93",
                marginBottom: "16px",
              }}
            >
              Tech stack
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {techStack.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: mono,
                    background: "#15171C",
                    color: "#F6F5F1",
                    padding: "5px 11px",
                    fontSize: "11.5px",
                    borderRadius: "2px",
                  }}
                >
                  {t}
                </span>
              ))}
              <span
                style={{
                  fontFamily: mono,
                  background: "#2A47C4",
                  color: "#F6F5F1",
                  padding: "5px 11px",
                  fontSize: "11.5px",
                  borderRadius: "2px",
                }}
              >
                Claude
              </span>
            </div>

            <div
              style={{
                fontFamily: mono,
                fontSize: "10.5px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#888c93",
                margin: "26px 0 13px",
              }}
            >
              Educación
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 500, color: "#15171C" }}>
                  MIT{" "}
                  <span style={{ fontFamily: mono, fontSize: "11px", color: "#888c93", fontWeight: 400 }}>
                    &apos;22
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#6B6F76", marginTop: "2px" }}>
                  Entrepreneurship &amp; Innovation Leadership
                </div>
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 500, color: "#15171C" }}>
                  PUCP{" "}
                  <span style={{ fontFamily: mono, fontSize: "11px", color: "#888c93", fontWeight: 400 }}>
                    &apos;15
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#6B6F76", marginTop: "2px" }}>
                  Ingeniería Electrónica
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EXPERIENCIA */}
        <section style={{ marginTop: "44px" }}>
          <div className="cv-section-grid">
            <div>
              <div style={{ fontFamily: mono, fontSize: "11px", color: "#2A47C4", letterSpacing: "0.1em" }}>
                01
              </div>
              <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "26px", margin: "6px 0 0", lineHeight: 1.1 }}>
                Experiencia
              </h2>
            </div>
            <div>
              <article style={{ marginBottom: "26px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
                  <div style={{ fontSize: "16px" }}>
                    <strong style={{ fontWeight: 600 }}>Interseguro</strong>{" "}
                    <span style={{ color: "#6B6F76" }}>· Design Manager</span>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: "11.5px", color: "#888c93", whiteSpace: "nowrap" }}>
                    2024 — Actualidad
                  </div>
                </div>
                <p className="cv-pretty" style={{ fontSize: "13.5px", lineHeight: 1.62, color: "#2f323a", margin: "8px 0 0" }}>
                  Gerencio el equipo de diseño estratégico (Research, Product, Service, Growth &amp; Experimentación),
                  reportando directamente a la VP Digital y definiendo la estrategia de producto transversal de la
                  compañía. Lideré las iniciativas de adquisición que mejoraron{" "}
                  <span className="cv-metric">+20%</span> la efectividad de cierre de ventas y{" "}
                  <span className="cv-metric">+10%</span> la usabilidad de los flujos clave, contribuyendo a la meta
                  de <span className="cv-metric">+10% PNA YoY</span>. Desplegué{" "}
                  <strong style={{ fontWeight: 500 }}>IDIS</strong> (Interseguro Design System) como librería
                  transversal cross-tecnología, y construí dos productos internos: uno para la gestión estratégica de
                  innovación incremental y otro para versionar propuestas de producto digital. Todo a la par de la
                  habilitación de nuevos productos de Vida, Inversiones y Rentas.
                </p>
              </article>

              <article style={{ marginBottom: "26px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
                  <div style={{ fontSize: "16px" }}>
                    <strong style={{ fontWeight: 600 }}>Scotiabank</strong>{" "}
                    <span style={{ color: "#6B6F76" }}>· Product Design Lead</span>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: "11.5px", color: "#888c93", whiteSpace: "nowrap" }}>
                    2020 — 2024
                  </div>
                </div>
                <p className="cv-pretty" style={{ fontSize: "13.5px", lineHeight: 1.62, color: "#2f323a", margin: "8px 0 0" }}>
                  Lideré el equipo de diseño de canales digitales (Research y Product Design), entregando la
                  interoperabilidad con <strong style={{ fontWeight: 500 }}>Plin</strong>{" "}
                  (<span className="cv-metric">+1.2M usuarios</span>), tarjetas de crédito y débito digitales,
                  préstamos 100% digitales y el programa de lealtad Scotiapuntos. Antes, en Banca Negocios y
                  Empresas, construí <strong style={{ fontWeight: 500 }}>Scotia Negocios</strong> y{" "}
                  <strong style={{ fontWeight: 500 }}>Telebanking</strong>, con flujos de adquisición 100% digital
                  que hoy generan gran parte del revenue por productos digitales del banco.
                </p>
              </article>

              <article style={{ marginBottom: "26px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
                  <div style={{ fontSize: "16px" }}>
                    <strong style={{ fontWeight: 600 }}>Seek Design &amp; Innovation</strong>{" "}
                    <span style={{ color: "#6B6F76" }}>· Digital Product Lead</span>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: "11.5px", color: "#888c93", whiteSpace: "nowrap" }}>
                    2019 — 2020
                  </div>
                </div>
                <p className="cv-pretty" style={{ fontSize: "13.5px", lineHeight: 1.62, color: "#2f323a", margin: "8px 0 0" }}>
                  Lideré la transformación de Seek hacia un laboratorio de innovación digital: diseñé el modelo de
                  servicio, construí los procesos y formé al equipo para co-crear, prototipar y lanzar. Entregué{" "}
                  <span className="cv-metric">6 productos digitales</span> para Intercorp, Ferreycorp, ISIL,
                  Intralot, CIVA y Makro — entre ellos Ferreyros app, ISIL Go, Intralot app, e-commerce CIVA, Mass
                  y Economax.
                </p>
              </article>

              <article>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
                  <div style={{ fontSize: "16px" }}>
                    <strong style={{ fontWeight: 600 }}>Anda Technologies</strong>{" "}
                    <span style={{ color: "#6B6F76" }}>· R&amp;D Product Manager</span>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: "11.5px", color: "#888c93", whiteSpace: "nowrap" }}>
                    2015 — 2019
                  </div>
                </div>
                <p className="cv-pretty" style={{ fontSize: "13.5px", lineHeight: 1.62, color: "#2f323a", margin: "8px 0 0" }}>
                  Lideré el E2E del ciclo de vida de creación de un producto físico-digital: el primer wearable con
                  conectividad celular para niños —{" "}
                  <span className="cv-metric">
                    de la concepción y los primeros prototipos en laboratorio hasta la producción en masa y
                    distribución comercial
                  </span>
                  . Atravesé cada ciclo de discovery, ingeniería y diseño, creciendo de Product Engineer a liderazgo
                  general del producto. Distribuimos vía{" "}
                  <strong style={{ fontWeight: 500 }}>América Móvil</strong> (México y Latam) y{" "}
                  <strong style={{ fontWeight: 500 }}>AT&amp;T</strong> (EE.UU.), con alianza con{" "}
                  <strong style={{ fontWeight: 500 }}>Qualcomm</strong> para ser pioneros en 4G LTE en wearables,
                  nexos con UTEC y PUCP, y una patente obtenida.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* PROYECTOS */}
        <section style={{ marginTop: "40px" }}>
          <div className="cv-section-grid">
            <div>
              <div style={{ fontFamily: mono, fontSize: "11px", color: "#2A47C4", letterSpacing: "0.1em" }}>
                02
              </div>
              <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "26px", margin: "6px 0 0", lineHeight: 1.1 }}>
                Proyectos y sociedades
              </h2>
            </div>
            <div>
              <article style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
                  <div style={{ fontSize: "16px" }}>
                    <strong style={{ fontWeight: 600 }}>Director, Techplay</strong>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: "11.5px", color: "#888c93", whiteSpace: "nowrap" }}>
                    Desde 2024
                  </div>
                </div>
                <p className="cv-pretty" style={{ fontSize: "13.5px", lineHeight: 1.62, color: "#2f323a", margin: "8px 0 0" }}>
                  Laboratorio digital itinerante donde profesionales creativos exploran nuevas tecnologías de forma
                  aplicada. Convenios con{" "}
                  <strong style={{ fontWeight: 500 }}>Figma, Webflow, PUCP y MIT</strong>. Espacio de vibecodeo,
                  prototipado rápido y experimentación con herramientas emergentes.
                </p>
              </article>

              <article style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
                  <div style={{ fontSize: "16px" }}>
                    <strong style={{ fontWeight: 600 }}>Advisor, La Victoria Lab</strong>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: "11.5px", color: "#888c93", whiteSpace: "nowrap" }}>
                    2019
                  </div>
                </div>
                <p className="cv-pretty" style={{ fontSize: "13.5px", lineHeight: 1.62, color: "#2f323a", margin: "8px 0 0" }}>
                  Creative Technologist para NFI (New Frontiers Initiative), exploración temprana de servicios con
                  tecnologías emergentes para Latinoamérica. Participante de Impact Design Sprint.
                </p>
              </article>

              <article>
                <div className="cv-pretty" style={{ fontSize: "13.5px", lineHeight: 1.62, color: "#2f323a" }}>
                  <strong style={{ fontWeight: 500 }}>Comunidades:</strong> Figma Perú, Webflow Perú, Service Design
                  Lima — miembro activo, conector e impulsor de iniciativas entre comunidades de innovación y diseño.
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* OTROS */}
        <section style={{ marginTop: "40px" }}>
          <div className="cv-section-grid">
            <div>
              <div style={{ fontFamily: mono, fontSize: "11px", color: "#2A47C4", letterSpacing: "0.1em" }}>
                03
              </div>
              <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "26px", margin: "6px 0 0", lineHeight: 1.1 }}>
                Otros
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 32px" }}>
              {otros.map((item) => (
                <div key={item.title}>
                  <div style={{ fontSize: "15.5px", fontWeight: 500 }}>
                    {item.title}{" "}
                    <span style={{ fontFamily: mono, fontSize: "11px", color: "#888c93", fontWeight: 400 }}>
                      {item.year}
                    </span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#6B6F76", marginTop: "2px" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            marginTop: "44px",
            paddingTop: "16px",
            borderTop: "1px solid #e2e1dc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: mono,
            fontSize: "10.5px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#9a9ca2",
          }}
        >
          <span>Ricardo Avila · CV 2026</span>
          <span>Lima, Perú</span>
        </footer>
      </div>
    </div>
  );
}
