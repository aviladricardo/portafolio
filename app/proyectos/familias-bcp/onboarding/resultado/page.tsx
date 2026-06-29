"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SESSION_KEY = "bcp_onboarding";

const BUSINESS_PROFILES: Record<string, {
  emoji: string;
  label: string;
  tag: string;
  costos: string;
  ingresos: string;
  neto: string;
  tips: string[];
}> = {
  bodega: {
    emoji: "🛒", tag: "Bodega o tienda",
    label: "Una bodega con flujo constante de clientes",
    costos: "S/ 4,000 – 7,000 /mes", ingresos: "S/ 9,000 – 15,000 /mes", neto: "S/ 2,000 – 5,000 /mes",
    tips: ["Registrar ingresos diarios (hoy lo hacen de memoria)", "Separar costos fijos de variables", "Obtén tu primer capital de trabajo a tasa especial"],
  },
  taller: {
    emoji: "🔧", tag: "Taller o servicio",
    label: "Un taller con servicios regulares",
    costos: "S/ 3,000 – 6,000 /mes", ingresos: "S/ 8,000 – 14,000 /mes", neto: "S/ 2,500 – 6,000 /mes",
    tips: ["Presupuestar cada trabajo antes de empezarlo", "Separar costos de materiales y mano de obra", "Emitir comprobantes para acceder a crédito"],
  },
  comida: {
    emoji: "🍽️", tag: "Negocio de comida",
    label: "Un restaurante con ~100 clientes a la semana",
    costos: "S/ 8,000 – 12,000 /mes", ingresos: "S/ 15,000 – 22,000 /mes", neto: "S/ 3,000 – 7,000 /mes",
    tips: ["Registrar ingresos diarios (hoy lo hacen de memoria)", "Separar costos fijos de variables", "Obtén tu primer capital de trabajo a tasa especial"],
  },
  comercio: {
    emoji: "👕", tag: "Comercio o reventa",
    label: "Un negocio de reventa con rotación semanal",
    costos: "S/ 5,000 – 9,000 /mes", ingresos: "S/ 10,000 – 18,000 /mes", neto: "S/ 2,000 – 6,000 /mes",
    tips: ["Llevar control de inventario y merma", "Identificar los productos con mayor margen", "Formalizar para acceder a mejores proveedores"],
  },
};

const PROVEEDOR_LABELS: Record<string, string> = {
  "1a3": "1 a 3 proveedores", "4a10": "4 a 10 proveedores",
  "mas10": "Más de 10 proveedores", "ninguno": "Sin proveedores fijos",
};
const VENTAS_LABELS: Record<string, string> = {
  "menos20": "Menos de 20 servicios / semana", "20a100": "Entre 20 y 100 servicios / semana",
  "mas100": "Más de 100 servicios / semana", "irregular": "Ventas irregulares",
};
const NECESIDAD_LABELS: Record<string, string> = {
  "ingresos": "Entender ingresos y gastos", "credito": "Acceder a un crédito",
  "formalizar": "Formalizar el negocio", "jubilacion": "Asegurar jubilación",
};
const BUSINESS_NAME_PLACEHOLDER: Record<string, string> = {
  "bodega": "Ej: Bodega El Porvenir",
  "taller": "Ej: Taller Mecánico Rodríguez",
  "comida": "Ej: Cevichería La Punta",
  "comercio": "Ej: Comercial Los Andes",
};

const DEFAULT_PROFILE = BUSINESS_PROFILES.comida;

const TRANSACTIONS = [
  { date: "28 jun", desc: "Cobro venta local",           type: "ingreso", origin: "Yape", amount: 340 },
  { date: "28 jun", desc: "Pago mercadería ABC",          type: "egreso",  origin: "Yape", amount: 180 },
  { date: "27 jun", desc: "Cobro cliente",               type: "ingreso", origin: "Yape", amount: 95  },
  { date: "27 jun", desc: "Pago luz y agua",              type: "egreso",  origin: "Yape", amount: 62  },
  { date: "26 jun", desc: "Cobro venta mayor",           type: "ingreso", origin: "Yape", amount: 820 },
  { date: "26 jun", desc: "Pago transporte",              type: "egreso",  origin: "Yape", amount: 45  },
  { date: "25 jun", desc: "Cobro venta local",           type: "ingreso", origin: "Yape", amount: 270 },
  { date: "25 jun", desc: "Pago empaques y bolsas",       type: "egreso",  origin: "Yape", amount: 38  },
  { date: "24 jun", desc: "Cobro cliente frecuente",     type: "ingreso", origin: "Yape", amount: 150 },
  { date: "24 jun", desc: "Pago alquiler local",          type: "egreso",  origin: "Yape", amount: 500 },
  { date: "23 jun", desc: "Cobro venta domingo",         type: "ingreso", origin: "Yape", amount: 410 },
  { date: "22 jun", desc: "Cobro venta sábado",          type: "ingreso", origin: "Yape", amount: 380 },
  { date: "21 jun", desc: "Pago Distribuidora Norte",     type: "egreso",  origin: "Yape", amount: 220 },
  { date: "21 jun", desc: "Cobro pedido",                type: "ingreso", origin: "Yape", amount: 130 },
  { date: "20 jun", desc: "Cobro venta local",           type: "ingreso", origin: "Yape", amount: 295 },
  { date: "20 jun", desc: "Pago internet y teléfono",     type: "egreso",  origin: "Yape", amount: 89  },
  { date: "19 jun", desc: "Cobro delivery",              type: "ingreso", origin: "Yape", amount: 175 },
  { date: "18 jun", desc: "Pago insumos varios",          type: "egreso",  origin: "Yape", amount: 142 },
  { date: "17 jun", desc: "Cobro cliente nuevo",         type: "ingreso", origin: "Yape", amount: 85  },
  { date: "17 jun", desc: "Cobro venta local",           type: "ingreso", origin: "Yape", amount: 310 },
  { date: "16 jun", desc: "Pago contador",                type: "egreso",  origin: "Yape", amount: 150 },
  { date: "15 jun", desc: "Cobro venta mayorista",       type: "ingreso", origin: "Yape", amount: 960 },
  { date: "14 jun", desc: "Pago mercadería urgente",      type: "egreso",  origin: "Yape", amount: 310 },
  { date: "13 jun", desc: "Cobro evento",                type: "ingreso", origin: "Yape", amount: 220 },
  { date: "12 jun", desc: "Cobro venta local",           type: "ingreso", origin: "Yape", amount: 285 },
  { date: "12 jun", desc: "Pago delivery externo",        type: "egreso",  origin: "Yape", amount: 55  },
  { date: "11 jun", desc: "Pago Proveedor ABC",           type: "egreso",  origin: "Yape", amount: 195 },
  { date: "10 jun", desc: "Cobro venta local",           type: "ingreso", origin: "Yape", amount: 330 },
  { date: "09 jun", desc: "Cobro pedido grupal",         type: "ingreso", origin: "Yape", amount: 420 },
  { date: "09 jun", desc: "Pago luz",                     type: "egreso",  origin: "Yape", amount: 48  },
  { date: "08 jun", desc: "Cobro venta domingo",         type: "ingreso", origin: "Yape", amount: 370 },
  { date: "07 jun", desc: "Pago mercadería semanal",      type: "egreso",  origin: "Yape", amount: 260 },
  { date: "06 jun", desc: "Cobro cliente habitual",      type: "ingreso", origin: "Yape", amount: 110 },
  { date: "05 jun", desc: "Cobro venta local",           type: "ingreso", origin: "Yape", amount: 245 },
  { date: "05 jun", desc: "Pago limpieza y mant.",        type: "egreso",  origin: "Yape", amount: 35  },
  { date: "04 jun", desc: "Cobro venta sábado",          type: "ingreso", origin: "Yape", amount: 395 },
  { date: "03 jun", desc: "Pago alquiler almacén",        type: "egreso",  origin: "Yape", amount: 200 },
  { date: "02 jun", desc: "Cobro pedido especial",       type: "ingreso", origin: "Yape", amount: 530 },
  { date: "01 jun", desc: "Cobro venta local",           type: "ingreso", origin: "Yape", amount: 260 },
  { date: "31 may", desc: "Pago Distribuidora Sur",       type: "egreso",  origin: "Yape", amount: 340 },
  { date: "30 may", desc: "Cobro venta fin de mes",      type: "ingreso", origin: "Yape", amount: 480 },
  { date: "29 may", desc: "Cobro cliente",               type: "ingreso", origin: "Yape", amount: 95  },
  { date: "28 may", desc: "Pago seguros",                 type: "egreso",  origin: "Yape", amount: 120 },
  { date: "27 may", desc: "Cobro venta local",           type: "ingreso", origin: "Yape", amount: 305 },
  { date: "26 may", desc: "Pago mercadería especial",     type: "egreso",  origin: "Yape", amount: 175 },
  { date: "25 may", desc: "Cobro evento feriado",        type: "ingreso", origin: "Yape", amount: 680 },
  { date: "24 may", desc: "Cobro venta sábado",          type: "ingreso", origin: "Yape", amount: 350 },
  { date: "23 may", desc: "Pago luz y agua",              type: "egreso",  origin: "Yape", amount: 70  },
  { date: "22 may", desc: "Cobro pedido grupal",         type: "ingreso", origin: "Yape", amount: 290 },
  { date: "21 may", desc: "Cobro venta local",           type: "ingreso", origin: "Yape", amount: 215 },
];

type RangeField = { min: number; max: number };
type EditValues = { costos: RangeField; ingresos: RangeField; neto: RangeField };

const SLIDER_BOUNDS: Record<keyof EditValues, { absMin: number; absMax: number; step: number }> = {
  costos:   { absMin: 0, absMax: 30000, step: 500 },
  ingresos: { absMin: 0, absMax: 60000, step: 500 },
  neto:     { absMin: 0, absMax: 25000, step: 500 },
};

function parseRange(str: string): RangeField {
  const nums = str.replace(/[^0-9–\-]/g, "").split(/[–\-]/);
  return { min: Number((nums[0] || "0").replace(/\D/g, "")), max: Number((nums[1] || "0").replace(/\D/g, "")) };
}
function formatRange(field: RangeField): string {
  const f = (n: number) => n.toLocaleString("es-PE");
  return `S/ ${f(field.min)} – ${f(field.max)} /mes`;
}
function fmt(n: number) { return n.toLocaleString("es-PE"); }

function InlineNumber({ value, onCommit }: { value: number; onCommit: (v: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const start = () => { setDraft(String(value)); setEditing(true); };
  const commit = () => {
    const v = Number(draft.replace(/\D/g, ""));
    if (!isNaN(v) && v > 0) onCommit(v);
    setEditing(false);
  };
  if (editing) return (
    <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
      onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
      style={{ width: `${Math.max(draft.length, 4) + 1}ch`, border: "none", outline: "none", borderBottom: "2px solid #003DA5", background: "transparent", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 16, fontWeight: 700, color: "#003DA5", padding: "0 2px", textAlign: "center" }} />
  );
  return (
    <span onClick={start} title="Toca para editar"
      style={{ cursor: "text", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 16, fontWeight: 700, color: "#1A2240", borderBottom: "1.5px dashed #C8D2E6", paddingBottom: 1 }}>
      {fmt(value)}
    </span>
  );
}

function DualSlider({ label, field, bounds, onChange }: {
  label: string; field: RangeField;
  bounds: typeof SLIDER_BOUNDS[keyof EditValues];
  onChange: (f: RangeField) => void;
}) {
  const pct = (v: number) => ((v - bounds.absMin) / (bounds.absMax - bounds.absMin)) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", color: "#9AAABF" }}>{label.toUpperCase()}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 15, color: "#9AAABF" }}>S/</span>
          <InlineNumber value={field.min} onCommit={(v) => { if (v < field.max) onChange({ ...field, min: Math.max(bounds.absMin, v) }); }} />
          <span style={{ fontSize: 15, color: "#C8D2E6", margin: "0 2px" }}>–</span>
          <InlineNumber value={field.max} onCommit={(v) => { if (v > field.min) onChange({ ...field, max: Math.min(bounds.absMax, v) }); }} />
        </div>
      </div>
      <div style={{ position: "relative", height: 36, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 4, background: "#E2E8F4", borderRadius: 4 }} />
        <div style={{ position: "absolute", left: `${pct(field.min)}%`, width: `${pct(field.max) - pct(field.min)}%`, height: 4, background: "#003DA5", borderRadius: 4 }} />
        <input type="range" min={bounds.absMin} max={bounds.absMax} step={bounds.step} value={field.min}
          onChange={(e) => { const v = Number(e.target.value); if (v < field.max) onChange({ ...field, min: v }); }}
          style={{ position: "absolute", width: "100%", appearance: "none", WebkitAppearance: "none", background: "transparent", pointerEvents: "none", zIndex: field.min > bounds.absMax - bounds.step ? 5 : 3 } as React.CSSProperties}
          className="bcp-slider-thumb" />
        <input type="range" min={bounds.absMin} max={bounds.absMax} step={bounds.step} value={field.max}
          onChange={(e) => { const v = Number(e.target.value); if (v > field.min) onChange({ ...field, max: v }); }}
          style={{ position: "absolute", width: "100%", appearance: "none", WebkitAppearance: "none", background: "transparent", pointerEvents: "none", zIndex: 4 } as React.CSSProperties}
          className="bcp-slider-thumb" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "#C8D2E6", fontFamily: "var(--font-nunito,'Nunito',sans-serif)" }}>S/ {fmt(bounds.absMin)}</span>
        <span style={{ fontSize: 11, color: "#C8D2E6", fontFamily: "var(--font-nunito,'Nunito',sans-serif)" }}>S/ {fmt(bounds.absMax)}</span>
      </div>
    </div>
  );
}

function WeekCalendar() {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  const days = ["L", "M", "X", "J", "V", "S", "D"];
  const dates = Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
        {days.map((d) => <span key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#9AAABF", letterSpacing: "0.5px" }}>{d}</span>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {dates.map((d, i) => {
          const isToday = d.toDateString() === today.toDateString();
          const isPast = d < today && !isToday;
          const isFuture = d > today;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: isToday ? "#F07B1F" : isPast ? "#003DA5" : "transparent", color: isToday || isPast ? "white" : isFuture ? "#C8D2E6" : "#1A2240", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: isToday ? 800 : isPast ? 600 : 400, flexShrink: 0 }}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "inicio", label: "Inicio", icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 7.5L9 2l6 5.5V15a1 1 0 01-1 1H4a1 1 0 01-1-1V7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
  { id: "negocio", label: "Mi Negocio", icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="8" width="14" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 8l3-5h10l3 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 16v-4h4v4" stroke="currentColor" strokeWidth="1.5"/></svg> },
  { id: "metas", label: "Metas", icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="9" r="1" fill="currentColor"/></svg> },
  { id: "reportes", label: "Reportes", icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="10" width="3" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="7.5" y="6" width="3" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="2" width="3" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg> },
  { id: "config", label: "Configuración", icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.05 3.05l1.41 1.41M13.54 13.54l1.41 1.41M3.05 14.95l1.41-1.41M13.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
];

function ResultadoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [editOpen, setEditOpen] = useState(false);
  const [editValues, setEditValues] = useState<EditValues>({ costos: { min: 0, max: 0 }, ingresos: { min: 0, max: 0 }, neto: { min: 0, max: 0 } });
  const [displayValues, setDisplayValues] = useState<{ costos: string; ingresos: string; neto: string } | null>(null);
  const [savedValues, setSavedValues] = useState<{ costos: string; ingresos: string; neto: string } | null>(null);
  const [numbersTab, setNumbersTab] = useState<"sector" | "negocio">("sector");
  const [pendingTab, setPendingTab] = useState<"sector" | "negocio" | null>(null);
  const [conectarOpen, setConectarOpen] = useState(false);
  const [conectarSelected, setConectarSelected] = useState<string | null>(null);
  const toggleConectar = (id: string) => setConectarSelected(id);
  const [conectarStep, setConectarStep] = useState<"select" | "verify">("select");
  const [conectarYapePhone, setConectarYapePhone] = useState("");
  const [conectarYapePin, setConectarYapePin] = useState(["", "", "", "", "", ""]);
  const [conectarYapePinError, setConectarYapePinError] = useState("");
  const [conectarDone, setConectarDone] = useState(false);
  const [conectarVerifying, setConectarVerifying] = useState(false);
  const [conectarApproved, setConectarApproved] = useState(false);
  const [txProgress, setTxProgress] = useState(0);
  const [txVisible, setTxVisible] = useState(0);
  const [txExpanded, setTxExpanded] = useState(false);
  const [txSubOpen, setTxSubOpen] = useState(false);
  const [txSubStep, setTxSubStep] = useState<"confirm" | "paying" | "paid">("confirm");
  const [txExtra, setTxExtra] = useState(0);
  const yapePinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessNameDraft, setBusinessNameDraft] = useState("");
  const [verified, setVerified] = useState(false);
  const [verifyRelacion, setVerifyRelacion] = useState<"mio" | "padres" | null>(null);
  const [verifyBanco, setVerifyBanco] = useState<"bcp" | "otro" | null>(null);
  const [verifyCuentaBCP, setVerifyCuentaBCP] = useState<"si" | "no" | null>(null);
  const [verifyTipoDoc, setVerifyTipoDoc] = useState<"ruc20" | "ruc10" | "dni" | null>(null);
  const [verifyNumDoc, setVerifyNumDoc] = useState("");

  const requestTabChange = (tab: "sector" | "negocio") => {
    if (tab !== numbersTab && numbersTab === "negocio" && displayValues !== null) {
      setPendingTab(tab);
    } else {
      setNumbersTab(tab);
    }
  };
  const confirmTabChange = () => {
    if (pendingTab) { setNumbersTab(pendingTab); setDisplayValues(null); setSavedValues(null); }
    setPendingTab(null);
  };
  const cancelTabChange = () => setPendingTab(null);

  useEffect(() => {
    try {
      const a = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}");
      setAnswers(a);
      if (a[1] && BUSINESS_PROFILES[a[1]]) setProfile(BUSINESS_PROFILES[a[1]]);
    } catch { /* keep default */ }
  }, []);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      const name = searchParams.get("businessName") ?? "";
      if (name) { setBusinessName(name); setVerified(true); }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!conectarDone) return;
    setTxProgress(0);
    setTxVisible(0);
    const total = TRANSACTIONS.length;
    const duration = 3000;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      setTxProgress(Math.round(pct * 100));
      setTxVisible(Math.round(pct * total));
      if (pct < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [conectarDone]);

  const openEdit = () => {
    const base = displayValues ?? profile;
    setEditValues({ costos: parseRange(base.costos), ingresos: parseRange(base.ingresos), neto: parseRange(base.neto) });
    setEditOpen(true);
  };
  const saveEdit = () => {
    setDisplayValues({ costos: formatRange(editValues.costos), ingresos: formatRange(editValues.ingresos), neto: formatRange(editValues.neto) });
    setEditOpen(false);
  };

  const handleInlineCommit = (field: "costos" | "ingresos" | "neto", part: "min" | "max", newVal: number) => {
    const clampN = (v: number) => Math.max(0, Math.min(25000, v));
    const clampI = (v: number) => Math.max(0, Math.min(60000, v));
    const cur = { costos: parseRange(costos), ingresos: parseRange(ingresos), neto: parseRange(neto) };
    if (cur[field][part] === newVal) return;
    const updated = { costos: { ...cur.costos }, ingresos: { ...cur.ingresos }, neto: { ...cur.neto } };
    updated[field] = { ...updated[field], [part]: newVal };
    if (field === "costos" || field === "ingresos") {
      updated.neto = { min: clampN(updated.ingresos.min - updated.costos.min), max: clampN(updated.ingresos.max - updated.costos.max) };
    } else {
      updated.ingresos = { min: clampI(updated.neto.min + updated.costos.min), max: clampI(updated.neto.max + updated.costos.max) };
    }
    const next = { costos: formatRange(updated.costos), ingresos: formatRange(updated.ingresos), neto: formatRange(updated.neto) };
    const base = savedValues ?? { costos: profile.costos, ingresos: profile.ingresos, neto: profile.neto };
    if (next.costos === base.costos && next.ingresos === base.ingresos && next.neto === base.neto) return;
    setDisplayValues(next);
  };

  const costos = displayValues?.costos ?? savedValues?.costos ?? profile.costos;
  const ingresos = displayValues?.ingresos ?? savedValues?.ingresos ?? profile.ingresos;
  const neto = displayValues?.neto ?? savedValues?.neto ?? profile.neto;

  const saveInline = () => {
    if (displayValues) { setSavedValues(displayValues); setDisplayValues(null); }
  };

  const ingresosMax = parseRange(ingresos).max;
  const barPct = (str: string) => Math.round((parseRange(str).max / ingresosMax) * 100);
  const netoMax = parseRange(neto).max;
  const uplift = Math.max(500, Math.round((netoMax * 0.1) / 500) * 500);

  const bullets = [
    PROVEEDOR_LABELS[answers[2]] ?? null,
    VENTAS_LABELS[answers[3]] ?? null,
    NECESIDAD_LABELS[answers[4]] ?? null,
  ].filter(Boolean) as string[];

  const sectorRows = [
    { label: "Costos operativos", value: profile.costos, bar: barPct(profile.costos), color: "#B0BDDA", highlight: false },
    { label: "Ingresos brutos",   value: profile.ingresos, bar: 100, color: "#003DA5", highlight: false },
    { label: "Ingreso neto",      value: profile.neto, bar: barPct(profile.neto), color: "#F07B1F", highlight: true },
  ];
  const myRows = [
    { label: "Costos operativos", value: costos, bar: barPct(costos), color: "#B0BDDA", highlight: false },
    { label: "Ingresos brutos",   value: ingresos, bar: 100, color: "#003DA5", highlight: false },
    { label: "Ingreso neto",      value: neto, bar: barPct(neto), color: "#F07B1F", highlight: true },
  ];
  const tableRows = numbersTab === "sector" ? sectorRows : myRows;

  return (
    <>
      <style>{`
        @font-face { font-family: 'Flexo'; src: url('/fonts/Flexo.ttf') format('truetype'); font-weight: 600 700; font-style: normal; font-display: swap; }
        body { background: #001A60 !important; background-image: none !important; }
        .bcp-sidebar-item { display: flex; align-items: center; gap: 12px; padding: 11px 16px; border-radius: 12px; cursor: pointer; color: rgba(255,255,255,0.55); font-size: 14px; font-weight: 500; transition: background 0.15s, color 0.15s; }
        .bcp-sidebar-item:hover { background: rgba(255,255,255,0.08); color: white; }
        .bcp-sidebar-item.active { background: rgba(240,123,31,0.15); color: white; }
        .bcp-sidebar-item.active svg { color: #F07B1F; }
        @keyframes bcp-fade { from { opacity: 0; } to { opacity: 1; } }
        .bcp-sub-backdrop { position: fixed; inset: 0; background: rgba(0,10,40,0.45); z-index: 300; display: flex; align-items: flex-end; justify-content: center; animation: bcp-fade 0.2s ease; }
        .bcp-sub-sheet { background: white; border-radius: 24px 24px 0 0; width: 100%; max-width: 480px; padding: 32px 28px 48px; box-shadow: 0 -16px 48px rgba(0,0,0,0.18); }
        @media (min-width: 768px) {
          .bcp-sub-backdrop { align-items: center; justify-content: center; }
          .bcp-sub-sheet { border-radius: 24px; max-width: 420px; padding: 36px 36px 40px; }
        }
        @keyframes bcp-slide-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .bcp-edit-backdrop { display: none; position: fixed; inset: 0; background: rgba(0,10,40,0.35); z-index: 199; backdrop-filter: blur(2px); animation: bcp-fade 0.25s ease; }
        @media (min-width: 768px) {
          .bcp-edit-backdrop { display: block !important; }
          .bcp-edit-panel { left: auto !important; transform: none !important; right: 0 !important; width: 480px !important; box-shadow: -12px 0 48px rgba(0,0,40,0.18) !important; animation: bcp-slide-right 0.28s cubic-bezier(0.32,0,0.18,1) !important; }
          .bcp-mobile-header { display: none !important; }
          .bcp-sidebar { display: flex !important; }
          .bcp-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 767px) {
          .bcp-sidebar { display: none; }
          .bcp-grid { grid-template-columns: 1fr; }
        }
.bcp-slider-thumb { pointer-events: none; }
        .bcp-slider-thumb::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: white; border: 2.5px solid #003DA5; box-shadow: 0 2px 6px rgba(0,61,165,0.22); pointer-events: all; cursor: grab; }
        .bcp-slider-thumb::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: white; border: 2.5px solid #003DA5; box-shadow: 0 2px 6px rgba(0,61,165,0.22); pointer-events: all; cursor: grab; }
      `}</style>

      <div style={{ fontFamily: "var(--font-nunito,'Nunito',sans-serif)", minHeight: "100vh", display: "flex" }}>

        {/* Sidebar */}
        <div className="bcp-sidebar" style={{ width: 240, background: "#001A60", flexDirection: "column", padding: "28px 16px", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 8px", marginBottom: 36 }}>
            <div style={{ width: 38, height: 38, background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Flexo',sans-serif", fontSize: 13, fontWeight: 700, color: "white", letterSpacing: "1px" }}>BCP</span>
            </div>
            <span style={{ fontFamily: "'Flexo',sans-serif", fontSize: 16, fontWeight: 700, color: "white" }}>Mi Familia</span>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            {NAV_ITEMS.map(({ id, label, icon }) => (
              <div key={id} className={`bcp-sidebar-item${id === "negocio" ? " active" : ""}`}>
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </nav>

          {/* User */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F07B1F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>N</span>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 2 }}>Nicolás</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Acompañando a papá</p>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Mobile header */}
          <div className="bcp-mobile-header" style={{ background: "#001A60", padding: "20px 20px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span style={{ fontFamily: "'Flexo',sans-serif", fontSize: 16, fontWeight: 700, color: "white" }}>Mi Negocio</span>
          </div>

          {/* Top header */}
          <div style={{ background: "#001A60", padding: "36px 48px 32px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "rgba(168,194,236,0.6)", marginBottom: 8 }}>MI NEGOCIO</p>
            {verified ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <h1 style={{ fontFamily: "'Flexo',sans-serif", fontSize: 32, fontWeight: 700, color: "white", lineHeight: 1.2 }}>{businessName}</h1>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="14" cy="14" r="14" fill="#F07B1F"/>
                    <path d="M8 14.5l4 4 8-9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#F07B1F", background: "rgba(240,123,31,0.15)", borderRadius: 20, padding: "4px 12px", border: "1px solid rgba(240,123,31,0.3)" }}>
                  <svg width="10" height="10" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="#F07B1F"/><path d="M8 14.5l4 4 8-9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Verificado por BCP
                </span>
              </div>
            ) : (
              <div>
                <h1 style={{ fontFamily: "'Flexo',sans-serif", fontSize: 32, fontWeight: 700, color: "white", lineHeight: 1.2, marginBottom: 8 }}>Así se ve un negocio como el tuyo</h1>
                <p style={{ fontSize: 14, color: "rgba(168,194,236,0.75)" }}>Basado en negocios con perfil similar en Perú</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, background: "#F0F2F8", padding: "28px 48px 40px" }}>
            <div className="bcp-grid" style={{ display: "grid", gap: 20, marginBottom: 20 }}>

              {/* Business profile card */}
              <div style={{ background: "white", borderRadius: 20, padding: "24px", boxShadow: "0 1px 8px rgba(0,26,96,0.07)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>{profile.emoji}</span>
                  {verified ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: "#065F46", background: "#D1FAE5", borderRadius: 20, padding: "4px 10px" }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6.5L4.5 9 10 3" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Verificado por BCP
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: "#B45309", background: "#FEF3C7", borderRadius: 20, padding: "4px 10px" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F59E0B", flexShrink: 0 }} />
                      Pendiente de verificación
                    </span>
                  )}
                </div>
                <p className="flexo-heavy" style={{ fontFamily: "'Flexo',sans-serif", fontSize: 17, fontWeight: 700, color: "#1A2240", marginBottom: 10 }}>
                  {verified ? businessName : profile.label}
                </p>
                {verified && (
                  <p style={{ fontSize: 12.5, color: "#9AAABF", marginBottom: 10, lineHeight: 1.5 }}>
                    Hijo: Ricardo &nbsp;·&nbsp; Ingeniero &nbsp;·&nbsp; Cuenta Sueldo &nbsp;·&nbsp; Banca Exclusiva BCP
                  </p>
                )}
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: "#5A6A92", background: "#F0F2F8", borderRadius: 20, padding: "3px 12px" }}>{profile.tag}</span>
                </div>
                {bullets.length > 0 && (
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                    {bullets.map((b, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#5A6A92" }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: i === 0 ? "#F07B1F" : i === 1 ? "#003DA5" : "#1A2240", flexShrink: 0 }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                <div style={{ flex: 1 }} />
                {!verified && (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => { setBusinessNameDraft(businessName); setVerifyOpen(true); }} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, color: "#003DA5", fontSize: 13.5, fontWeight: 700, fontFamily: "var(--font-nunito,'Nunito',sans-serif)" }}>
                      Verificar negocio
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="#003DA5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Reference numbers card */}
              <div style={{ background: "white", borderRadius: 20, padding: "24px", boxShadow: "0 1px 8px rgba(0,26,96,0.07)", position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <p className="flexo-heavy" style={{ fontFamily: "'Flexo',sans-serif", fontSize: 16, fontWeight: 700, color: "#1A2240" }}>Números típicos del sector</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: "#B45309", background: "#FEF3C7", borderRadius: 20, padding: "4px 10px", flexShrink: 0 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F59E0B", flexShrink: 0 }} />
                    Pendiente completar
                  </span>
                </div>
                <div style={{ display: "flex", background: "#F0F2F8", borderRadius: 10, padding: 3, marginBottom: 20, gap: 2 }}>
                  {(["sector", "negocio"] as const).map((tab) => (
                    <button key={tab} onClick={() => requestTabChange(tab)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 13, fontWeight: 700, background: numbersTab === tab ? "white" : "transparent", color: numbersTab === tab ? "#1A2240" : "#9AAABF", boxShadow: numbersTab === tab ? "0 1px 4px rgba(0,26,96,0.1)" : "none", transition: "all 0.15s" }}>
                      {tab === "sector" ? "Promedio del sector" : "Mi negocio"}
                    </button>
                  ))}
                </div>
                {pendingTab !== null && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.88)", backdropFilter: "blur(4px)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 28, zIndex: 10 }}>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FFF0E0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 6v5M9 13v.5" stroke="#F07B1F" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="9" r="8" stroke="#F07B1F" strokeWidth="1.5"/></svg>
                      </div>
                      <p style={{ fontFamily: "'Flexo',sans-serif", fontSize: 17, fontWeight: 700, color: "#1A2240", margin: 0 }}>¿Descartar tus cambios?</p>
                      <p style={{ fontSize: 13, color: "#9AAABF", margin: 0, lineHeight: 1.55 }}>Si cambias de vista perderás los números que editaste.</p>
                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <button onClick={cancelTabChange} style={{ flex: 1, background: "#F0F2F8", border: "none", borderRadius: 10, padding: "11px 0", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 13, fontWeight: 700, color: "#5A6A92", cursor: "pointer" }}>Cancelar</button>
                        <button onClick={confirmTabChange} style={{ flex: 1, background: "#F07B1F", border: "none", borderRadius: 10, padding: "11px 0", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer" }}>Descartar</button>
                      </div>
                    </div>
                  </div>
                )}
                {(() => {
                  const isSector = numbersTab === "sector";
                  const hasMyValues = displayValues !== null || savedValues !== null;
                  const ZERO = "S/ 0 – 0 /mes";
                  const ing = isSector ? profile.ingresos : (hasMyValues ? ingresos : ZERO);
                  const cos = isSector ? profile.costos  : (hasMyValues ? costos  : ZERO);
                  const net = isSector ? profile.neto    : (hasMyValues ? neto    : ZERO);
                  const ingMax = parseRange(ing).max || 1;
                  const cosPct = Math.round((parseRange(cos).max / ingMax) * 100);
                  const netPct = Math.round((parseRange(net).max / ingMax) * 100);
                  return (
                    <>
                      {/* Stacked bar */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", height: 28, borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
                          <div style={{ width: `${cosPct}%`, background: "#B0BDDA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {cosPct > 12 && <span style={{ fontSize: 10, fontWeight: 700, color: "white" }}>{cosPct}%</span>}
                          </div>
                          <div style={{ width: `${netPct}%`, background: "#F07B1F", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {netPct > 12 && <span style={{ fontSize: 10, fontWeight: 700, color: "white" }}>{netPct}%</span>}
                          </div>
                          <div style={{ flex: 1, background: "#F0F2F8" }} />
                        </div>
                        <div style={{ display: "flex", gap: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ width: 10, height: 10, borderRadius: 3, background: "#B0BDDA", flexShrink: 0 }} />
                            <span style={{ fontSize: 11, color: "#9AAABF" }}>Costos</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ width: 10, height: 10, borderRadius: 3, background: "#F07B1F", flexShrink: 0 }} />
                            <span style={{ fontSize: 11, color: "#9AAABF" }}>Ingreso neto</span>
                          </div>
                        </div>
                      </div>
                      {/* Metric list */}
                      {([
                        { key: "ingresos" as const, label: "Ingresos brutos", value: ing, color: "#003DA5", accent: false },
                        { key: "costos" as const,   label: "Costos operativos", value: cos, color: "#5A6A92", accent: false },
                        { key: "neto" as const,     label: "Ingreso neto", value: net, color: "#F07B1F", accent: true },
                      ]).map(({ key, label, value, color, accent }) => {
                        const parsed = parseRange(value);
                        return (
                          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F0F2F8", background: accent ? "#FFF8F2" : "transparent", margin: accent ? "0 -24px" : "0", padding: accent ? "13px 24px" : "13px 0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              {accent && <span style={{ width: 3, height: 18, borderRadius: 2, background: "#F07B1F", flexShrink: 0 }} />}
                              <span style={{ fontSize: 13.5, color: accent ? "#F07B1F" : "#5A6A92", fontWeight: accent ? 700 : 400 }}>{label}</span>
                            </div>
                            {isSector ? (
                              <span style={{ fontSize: 13.5, fontWeight: 700, color, whiteSpace: "nowrap" }}>{value}</span>
                            ) : (
                              <span style={{ fontSize: 13.5, fontWeight: 700, color, display: "flex", alignItems: "center", gap: 3 }}>
                                <span style={{ color: accent ? "#F07B1F" : "#9AAABF" }}>S/</span>
                                <InlineNumber value={parsed.min} onCommit={(v) => handleInlineCommit(key, "min", v)} />
                                <span style={{ color: accent ? "#F07B1F" : "#C8D2E6", margin: "0 1px" }}>–</span>
                                <InlineNumber value={parsed.max} onCommit={(v) => handleInlineCommit(key, "max", v)} />
                                <span style={{ color: accent ? "#F07B1F" : "#9AAABF", fontSize: 12 }}>/mes</span>
                              </span>
                            )}
                          </div>
                        );
                      })}
                      {!isSector && displayValues !== null && (
                        <button onClick={saveInline} style={{ marginTop: 16, width: "100%", background: "#003DA5", border: "none", borderRadius: 10, padding: "11px", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <svg width="13" height="12" viewBox="0 0 13 12" fill="none"><path d="M1 6L4.5 10 12 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Guardar cambios
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Opportunity card */}
              <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,26,96,0.07)" }}>
                <div style={{ background: "white", padding: "24px", filter: savedValues ? "none" : "blur(4px)", userSelect: savedValues ? "auto" : "none", pointerEvents: savedValues ? "auto" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "#F07B1F", marginBottom: 6 }}>OPORTUNIDAD IDENTIFICADA</p>
                      <p className="flexo-heavy" style={{ fontFamily: "'Flexo',sans-serif", fontSize: 17, fontWeight: 700, color: "#1A2240", marginBottom: 4 }}>Podrías generar hasta</p>
                      <p style={{ fontFamily: "'Flexo',sans-serif", fontSize: 28, fontWeight: 700, color: "#F07B1F" }}>{`S/ ${uplift.toLocaleString("es-PE")} más`}</p>
                    </div>
                    <div style={{ background: "#FFF0E0", borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
                      <p style={{ fontSize: 11, fontWeight: 800, color: "#F07B1F" }}>AL MES</p>
                      <p style={{ fontSize: 10, color: "#F9B370" }}>estimado</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "#9AAABF", lineHeight: 1.55, marginBottom: 16 }}>Con estos 3 pasos, negocios como el tuyo optimizan recursos y venden más:</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {profile.tips.map((tip) => (
                      <div key={tip} style={{ display: "flex", alignItems: "center", gap: 12, background: "#F8F9FC", borderRadius: 12, padding: "12px 16px" }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1.5px solid #D0D8EC", flexShrink: 0 }} />
                        <span style={{ fontSize: 13.5, color: "#1A2240" }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {!savedValues && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(2px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 24 }}>
                    <svg width="18" height="20" viewBox="0 0 14 16" fill="none"><rect x="1" y="7" width="12" height="8.5" rx="2.5" stroke="#9AAABF" strokeWidth="1.5"/><path d="M4 7V4.5a3 3 0 016 0V7" stroke="#9AAABF" strokeWidth="1.5" strokeLinecap="round"/><circle cx="7" cy="11" r="1.2" fill="#9AAABF"/></svg>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#9AAABF", textAlign: "center" }}>Completa tus números para ver tu oportunidad</p>
                  </div>
                )}
              </div>

              {/* Daily income card */}
              <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,26,96,0.07)" }}>
                <div style={{ background: "white", padding: "24px", cursor: savedValues ? "pointer" : "default", filter: savedValues ? "none" : "blur(4px)", userSelect: savedValues ? "auto" : "none", pointerEvents: savedValues ? "auto" : "none" }} onClick={() => savedValues && setConectarOpen(true)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <p className="flexo-heavy" style={{ fontFamily: "'Flexo',sans-serif", fontSize: 17, fontWeight: 700, color: "#1A2240" }}>Registrar ingresos diarios</p>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect x="3" y="5" width="16" height="13" rx="2" stroke="#003DA5" strokeWidth="1.5"/><path d="M7 9h8M7 13h5" stroke="#003DA5" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 2v4M15 2v4" stroke="#003DA5" strokeWidth="1.3" strokeLinecap="round" opacity=".5"/></svg>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "#9AAABF", lineHeight: 1.5, marginBottom: 4 }}>Cárgalos manualmente o conecta tus cuentas BCP</p>
                  <WeekCalendar />
                </div>
                {!savedValues && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(2px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 24 }}>
                    <svg width="18" height="20" viewBox="0 0 14 16" fill="none"><rect x="1" y="7" width="12" height="8.5" rx="2.5" stroke="#9AAABF" strokeWidth="1.5"/><path d="M4 7V4.5a3 3 0 016 0V7" stroke="#9AAABF" strokeWidth="1.5" strokeLinecap="round"/><circle cx="7" cy="11" r="1.2" fill="#9AAABF"/></svg>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#9AAABF", textAlign: "center" }}>Completa tus números para registrar ingresos</p>
                  </div>
                )}
              </div>

            </div>

            {/* Transactions table */}
            {conectarDone && (
              <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,26,96,0.07)" }}>
                {/* Progress bar */}
                <div style={{ height: 3, background: "#F0F2F8" }}>
                  <div style={{ height: "100%", width: `${txProgress}%`, background: "linear-gradient(90deg, #003DA5, #F07B1F)", transition: "width 0.1s linear", borderRadius: "0 2px 2px 0" }} />
                </div>
                <div style={{ padding: "20px 24px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <p className="flexo-heavy" style={{ fontFamily: "'Flexo',sans-serif", fontSize: 16, fontWeight: 700, color: "#1A2240", marginBottom: 2 }}>Movimientos</p>
                      <p style={{ fontSize: 12, color: "#9AAABF" }}>
                        Últimos 6 meses ·{" "}
                        <span style={{ color: txProgress < 100 ? "#F07B1F" : "#059669", fontWeight: 600 }}>
                          {txProgress < 100 ? `Obteniendo ${txVisible} de ${TRANSACTIONS.length}…` : `${TRANSACTIONS.length} transacciones`}
                        </span>
                      </p>
                    </div>
                    {txProgress === 100 ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#065F46", background: "#D1FAE5", borderRadius: 20, padding: "4px 10px" }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5.5L3.5 7.5 8.5 2.5" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Conectado
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#F07B1F" }}>{txProgress}%</span>
                    )}
                  </div>
                  {/* Header row */}
                  <div style={{ display: "grid", gridTemplateColumns: "68px 1fr 100px 82px", gap: 8, padding: "6px 0", borderBottom: "1.5px solid #F0F2F8", marginBottom: 4 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "1px", color: "#9AAABF" }}>FECHA</span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "1px", color: "#9AAABF" }}>DESCRIPCIÓN</span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "1px", color: "#9AAABF" }}>ORIGEN</span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "1px", color: "#9AAABF", textAlign: "right" }}>MONTO</span>
                  </div>
                  <div style={{ position: "relative" }}>
                    {TRANSACTIONS.slice(0, txExpanded ? 15 + txExtra : Math.min(txVisible, 15)).map((tx, i) => {
                      const originStyle: Record<string, { bg: string; color: string }> = {
                        "Yape":          { bg: "#F3E8FF", color: "#7C3AED" },
                        "Transferencia": { bg: "#EEF4FF", color: "#003DA5" },
                        "Efectivo":      { bg: "#F0FDF4", color: "#059669" },
                      };
                      const os = originStyle[tx.origin] ?? { bg: "#F0F2F8", color: "#5A6A92" };
                      return (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "68px 1fr 100px 82px", gap: 8, padding: "9px 0", borderBottom: "1px solid #F8F9FC", alignItems: "center", animation: "bcp-fade-in 0.2s ease" }}>
                          <span style={{ fontSize: 12, color: "#9AAABF" }}>{tx.date}</span>
                          <span style={{ fontSize: 13, color: "#1A2240", lineHeight: 1.35 }}>{tx.desc}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: os.color, background: os.bg, borderRadius: 20, padding: "3px 9px", display: "inline-block" }}>{tx.origin}</span>
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: tx.type === "ingreso" ? "#059669" : "#EF4444", textAlign: "right" }}>
                            {tx.type === "ingreso" ? "+" : "-"}S/ {tx.amount}
                          </span>
                        </div>
                      );
                    })}

                    {/* Fade + Ver más */}
                    {txProgress === 100 && !txExpanded && (
                      <div style={{ position: "relative", marginTop: -40 }}>
                        <div style={{ height: 80, background: "linear-gradient(to bottom, transparent, white)", pointerEvents: "none" }} />
                        <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
                          <button onClick={() => setTxSubOpen(true)}
                            style={{ background: "#F07B1F", color: "white", border: "none", borderRadius: 12, padding: "10px 28px", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(240,123,31,0.3)" }}>
                            Ver más movimientos
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Subscription overlay */}
                    {txSubOpen && (
                      <div className="bcp-sub-backdrop" onClick={() => setTxSubOpen(false)}>
                        <div className="bcp-sub-sheet" onClick={(e) => e.stopPropagation()}>
                          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E2E8F4", margin: "0 auto 28px" }} />

                          {txSubStep === "confirm" && (<>
                            <div style={{ width: 52, height: 52, borderRadius: 16, background: "#F3E8FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                              <span style={{ fontSize: 26 }}>📱</span>
                            </div>
                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.4px", color: "#9AAABF", marginBottom: 6 }}>HISTORIAL COMPLETO</p>
                            <h3 className="flexo-heavy" style={{ fontFamily: "'Flexo',sans-serif", fontSize: 22, fontWeight: 700, color: "#1A2240", marginBottom: 8, lineHeight: 1.3 }}>
                              Accede a los {TRANSACTIONS.length} movimientos
                            </h3>
                            <p style={{ fontSize: 14, color: "#9AAABF", lineHeight: 1.6, marginBottom: 24 }}>
                              Desbloquea el historial completo de 6 meses para analizar tus ingresos y egresos con mayor precisión.
                            </p>
                            <div style={{ background: "#F8F9FC", borderRadius: 16, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <div>
                                <p style={{ fontFamily: "'Flexo',sans-serif", fontSize: 18, fontWeight: 700, color: "#1A2240" }}>S/ 15 <span style={{ fontSize: 13, fontWeight: 500, color: "#9AAABF" }}>/ mes</span></p>
                                <p style={{ fontSize: 12, color: "#9AAABF", marginTop: 3 }}>Debitado automáticamente por Yape</p>
                              </div>
                              <span style={{ fontSize: 24 }}>📱</span>
                            </div>
                            <button onClick={() => {
                              setTxSubStep("paying");
                              setTimeout(() => setTxSubStep("paid"), 2000);
                              setTimeout(() => {
                                setTxSubOpen(false);
                                setTxSubStep("confirm");
                                setTxExpanded(true);
                                // animate remaining rows
                                const remaining = TRANSACTIONS.length - 15;
                                const dur = 2500;
                                const start2 = performance.now();
                                const tick2 = (now: number) => {
                                  const pct = Math.min((now - start2) / dur, 1);
                                  setTxExtra(Math.round(pct * remaining));
                                  if (pct < 1) requestAnimationFrame(tick2);
                                };
                                requestAnimationFrame(tick2);
                              }, 3600);
                            }} style={{ width: "100%", background: "#7C3AED", color: "white", border: "none", borderRadius: 16, padding: "17px", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(124,58,237,0.3)", marginBottom: 12 }}>
                              Suscribirme · S/ 15 por Yape
                            </button>
                            <button onClick={() => setTxSubOpen(false)} style={{ width: "100%", background: "none", border: "none", fontSize: 13, color: "#9AAABF", cursor: "pointer", fontFamily: "var(--font-nunito,'Nunito',sans-serif)" }}>
                              Ahora no
                            </button>
                          </>)}

                          {txSubStep === "paying" && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0 16px", gap: 20 }}>
                              <div style={{ position: "relative", width: 64, height: 64 }}>
                                <svg width="64" height="64" viewBox="0 0 64 64" style={{ position: "absolute", inset: 0 }}>
                                  <circle cx="32" cy="32" r="28" fill="none" stroke="#F3E8FF" strokeWidth="4"/>
                                </svg>
                                <svg width="64" height="64" viewBox="0 0 64 64" className="bcp-spin" style={{ position: "absolute", inset: 0 }}>
                                  <circle cx="32" cy="32" r="28" fill="none" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" strokeDasharray="44 132"/>
                                </svg>
                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📱</div>
                              </div>
                              <div style={{ textAlign: "center" }}>
                                <p style={{ fontFamily: "'Flexo',sans-serif", fontSize: 18, fontWeight: 700, color: "#1A2240", marginBottom: 6 }}>Procesando pago…</p>
                                <p style={{ fontSize: 13, color: "#9AAABF" }}>Debitando S/ 15 de tu Yape</p>
                              </div>
                            </div>
                          )}

                          {txSubStep === "paid" && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0 16px", gap: 20, animation: "bcp-fade-in 0.3s ease" }}>
                              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M6 15.5L12 22 24 8" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </div>
                              <div style={{ textAlign: "center" }}>
                                <p style={{ fontFamily: "'Flexo',sans-serif", fontSize: 18, fontWeight: 700, color: "#1A2240", marginBottom: 6 }}>¡Pago exitoso!</p>
                                <p style={{ fontSize: 13, color: "#9AAABF", lineHeight: 1.55 }}>S/ 15 debitado de tu Yape.<br/>Cargando el historial completo…</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {txProgress === 100 && (
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1.5px solid #F0F2F8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontSize: 13, color: "#9AAABF" }}>¿Tienes más fuentes de ingresos o egresos?</p>
                      <button onClick={() => { setConectarSelected(null); setConectarStep("select"); setConectarOpen(true); }} style={{ background: "none", border: "2px solid #003DA5", borderRadius: 10, padding: "7px 16px", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 13, fontWeight: 700, color: "#003DA5", cursor: "pointer", whiteSpace: "nowrap" }}>
                        + Agregar fuente
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Business health locked */}
            <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,26,96,0.07)" }}>
              <div aria-hidden style={{ background: "white", padding: "22px 24px 80px", display: "flex", alignItems: "flex-start", gap: 16, filter: "blur(4px)", userSelect: "none", pointerEvents: "none" }}>
                <div style={{ flex: 1 }}>
                  <p className="flexo-heavy" style={{ fontFamily: "'Flexo',sans-serif", fontSize: 16, fontWeight: 700, color: "#1A2240", marginBottom: 5 }}>La salud del negocio</p>
                  <p style={{ fontSize: 13, color: "#7A8EAE", lineHeight: 1.5 }}>Conoce tus gastos fijos y variables para saber si el negocio es saludable</p>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: "#EEF4FF", flexShrink: 0 }} />
              </div>
              <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.86)", backdropFilter: "blur(2px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none"><rect x="1" y="7" width="12" height="8.5" rx="2.5" stroke="#F07B1F" strokeWidth="1.5"/><path d="M4 7V4.5a3 3 0 016 0V7" stroke="#F07B1F" strokeWidth="1.5" strokeLinecap="round"/><circle cx="7" cy="11" r="1.2" fill="#F07B1F"/></svg>
                  <p className="flexo-heavy" style={{ fontFamily: "'Flexo',sans-serif", fontSize: 15, fontWeight: 700, color: "#1A2240" }}>La salud del negocio</p>
                </div>
                <p style={{ fontSize: 12.5, color: "#9AAABF", textAlign: "center", lineHeight: 1.55, maxWidth: 280 }}>Registra tus primeros ingresos para desbloquear este análisis</p>
                <button onClick={() => setConectarOpen(true)} style={{ marginTop: 4, background: "#F07B1F", color: "white", border: "none", borderRadius: 10, padding: "11px 28px", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 13.5, fontWeight: 800, cursor: "pointer" }}>
                  Desbloquear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit drawer */}
      {editOpen && (
        <>
          <div className="bcp-edit-backdrop" onClick={() => setEditOpen(false)} />
          <div className="bcp-edit-panel" style={{ position: "fixed", top: 0, bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, zIndex: 200, background: "white", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 16px" }}>
              <button onClick={() => setEditOpen(false)} style={{ width: 38, height: 38, borderRadius: 12, background: "#F0F2F7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="#1A2240" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1.5px", color: "#7A8EAE" }}>BCP · MI FAMILIA</span>
              <div style={{ width: 38 }} />
            </div>
            <div style={{ flex: 1, padding: "8px 24px 0", display: "flex", flexDirection: "column", gap: 0 }}>
              <h2 style={{ fontFamily: "'Flexo',sans-serif", fontSize: 24, fontWeight: 700, color: "#1A2240", marginBottom: 6 }}>Ajusta los rangos</h2>
              <p style={{ fontSize: 13.5, color: "#9AAABF", marginBottom: 36 }}>Mueve los controles para personalizar la estimación</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                {(["costos", "ingresos", "neto"] as const).map((key) => {
                  const labels = { costos: "Costos operativos", ingresos: "Ingresos brutos", neto: "Ingreso neto" };
                  return (
                    <DualSlider key={key} label={labels[key]} field={editValues[key]} bounds={SLIDER_BOUNDS[key]}
                      onChange={(f) => setEditValues((prev) => {
                        const clampNeto = (v: number) => Math.max(0, Math.min(SLIDER_BOUNDS.neto.absMax, v));
                        const clampIngresos = (v: number) => Math.max(0, Math.min(SLIDER_BOUNDS.ingresos.absMax, v));
                        if (key === "costos") return { costos: f, ingresos: prev.ingresos, neto: { min: clampNeto(prev.ingresos.min - f.min), max: clampNeto(prev.ingresos.max - f.max) } };
                        if (key === "ingresos") return { costos: prev.costos, ingresos: f, neto: { min: clampNeto(f.min - prev.costos.min), max: clampNeto(f.max - prev.costos.max) } };
                        return { costos: prev.costos, neto: f, ingresos: { min: clampIngresos(f.min + prev.costos.min), max: clampIngresos(f.max + prev.costos.max) } };
                      })}
                    />
                  );
                })}
              </div>
            </div>
            <div style={{ padding: "24px 24px 40px" }}>
              <button onClick={saveEdit} style={{ width: "100%", background: "#003DA5", color: "white", border: "none", borderRadius: 16, padding: "18px", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(0,61,165,0.26)" }}>
                Guardar cambios
              </button>
            </div>
          </div>
        </>
      )}
      {/* Verify drawer */}
      {verifyOpen && (
        <>
          <div className="bcp-edit-backdrop" onClick={() => setVerifyOpen(false)} />
          <div className="bcp-edit-panel" style={{ position: "fixed", top: 0, bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, zIndex: 200, background: "white", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 16px" }}>
              <button onClick={() => setVerifyOpen(false)} style={{ width: 38, height: 38, borderRadius: 12, background: "#F0F2F7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="#1A2240" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1.5px", color: "#7A8EAE" }}>BCP · MI FAMILIA</span>
              <div style={{ width: 38 }} />
            </div>
            <div style={{ flex: 1, padding: "8px 24px 0", overflowY: "auto", display: "flex", flexDirection: "column", gap: 28 }}>
              <div>
                <h2 style={{ fontFamily: "'Flexo',sans-serif", fontSize: 26, fontWeight: 700, color: "#1A2240", marginBottom: 6 }}>Verifica tu negocio</h2>
                <p style={{ fontSize: 14, color: "#9AAABF", lineHeight: 1.55 }}>Ingresa el nombre oficial para obtener el sello verificado.</p>
              </div>

              {/* Nombre */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#9AAABF", display: "block", marginBottom: 8 }}>NOMBRE DEL NEGOCIO</label>
                <input autoFocus value={businessNameDraft} onChange={(e) => setBusinessNameDraft(e.target.value)} placeholder={BUSINESS_NAME_PLACEHOLDER[answers[1]] ?? "Ej: Negocio Los Andes"}
                  style={{ width: "100%", border: "2px solid #E2E8F4", borderRadius: 12, padding: "14px 16px", fontSize: 15, fontFamily: "var(--font-nunito,'Nunito',sans-serif)", color: "#1A2240", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = "#003DA5"} onBlur={(e) => e.target.style.borderColor = "#E2E8F4"} />
              </div>

              {/* Relación */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#9AAABF", display: "block", marginBottom: 10 }}>¿DE QUIÉN ES EL NEGOCIO?</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {([["mio", "Es mi negocio"], ["padres", "Es de mis padres"]] as const).map(([val, label]) => (
                    <button key={val} onClick={() => { setVerifyRelacion(val); setVerifyTipoDoc(null); setVerifyNumDoc(""); setVerifyBanco(null); setVerifyCuentaBCP(null); }} style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: `2px solid ${verifyRelacion === val ? "#003DA5" : "#E2E8F4"}`, background: verifyRelacion === val ? "#EEF4FF" : "white", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 13.5, fontWeight: verifyRelacion === val ? 700 : 400, color: verifyRelacion === val ? "#003DA5" : "#5A6A92", cursor: "pointer", transition: "all 0.15s" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de documento */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#9AAABF", display: "block", marginBottom: 10 }}>TIPO DE NEGOCIO</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {([
                    ["ruc20", "RUC 20"],
                    ["ruc10", "RUC 10"],
                    ["dni",   "Persona Natural (DNI)"],
                  ] as const).map(([val, title]) => (
                    <button key={val} onClick={() => { setVerifyTipoDoc(val); setVerifyNumDoc(""); setVerifyBanco(null); setVerifyCuentaBCP(null); }}
                      style={{ padding: "8px 16px", borderRadius: 100, border: `2px solid ${verifyTipoDoc === val ? "#003DA5" : "#E2E8F4"}`, background: verifyTipoDoc === val ? "#EEF4FF" : "white", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 13, fontWeight: verifyTipoDoc === val ? 700 : 500, color: verifyTipoDoc === val ? "#003DA5" : "#5A6A92", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                      {title}
                    </button>
                  ))}
                </div>
                {verifyTipoDoc && (
                  <div style={{ marginTop: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#9AAABF", display: "block", marginBottom: 8 }}>
                      {verifyTipoDoc === "dni" ? "NÚMERO DE DNI" : "NÚMERO DE RUC"}
                    </label>
                    <input
                      value={verifyNumDoc}
                      onChange={(e) => setVerifyNumDoc(e.target.value.replace(/\D/g, "").slice(0, verifyTipoDoc === "dni" ? 8 : 11))}
                      inputMode="numeric"
                      placeholder={verifyTipoDoc === "dni" ? "12345678" : "20123456789"}
                      style={{ width: "100%", border: "2px solid #E2E8F4", borderRadius: 12, padding: "13px 16px", fontSize: 15, fontFamily: "var(--font-nunito,'Nunito',sans-serif)", color: "#1A2240", outline: "none", boxSizing: "border-box" }}
                      onFocus={(e) => e.target.style.borderColor = "#003DA5"}
                      onBlur={(e) => e.target.style.borderColor = "#E2E8F4"}
                    />
                  </div>
                )}
              </div>

              {/* Lógica condicional según relación */}
              {verifyRelacion === "mio" && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#9AAABF", display: "block", marginBottom: 10 }}>¿ERES CLIENTE BCP?</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {([["bcp", "Sí"], ["otro", "No"]] as const).map(([val, label]) => (
                      <button key={val} onClick={() => { setVerifyBanco(val); setVerifyCuentaBCP(null); }} style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: `2px solid ${verifyBanco === val ? "#003DA5" : "#E2E8F4"}`, background: verifyBanco === val ? "#EEF4FF" : "white", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 13.5, fontWeight: verifyBanco === val ? 700 : 400, color: verifyBanco === val ? "#003DA5" : "#5A6A92", cursor: "pointer", transition: "all 0.15s" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Es mi negocio + No BCP → preguntar si negocio usa cuentas BCP */}
              {verifyRelacion === "mio" && verifyBanco === "otro" && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#9AAABF", display: "block", marginBottom: 10 }}>¿EL NEGOCIO SE MANEJA CON CUENTAS BCP?</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {([["si", "Sí"], ["no", "Aún no"]] as const).map(([val, label]) => (
                      <button key={val} onClick={() => { setVerifyCuentaBCP(val); setVerifyBanco(null); }} style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: `2px solid ${verifyCuentaBCP === val ? "#003DA5" : "#E2E8F4"}`, background: verifyCuentaBCP === val ? "#EEF4FF" : "white", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 13.5, fontWeight: verifyCuentaBCP === val ? 700 : 400, color: verifyCuentaBCP === val ? "#003DA5" : "#5A6A92", cursor: "pointer", transition: "all 0.15s" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Es de mis padres → primero cuentas BCP, luego si tú eres cliente BCP */}
              {verifyRelacion === "padres" && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#9AAABF", display: "block", marginBottom: 10 }}>¿EL NEGOCIO SE MANEJA CON CUENTAS BCP?</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {([["si", "Sí"], ["no", "Aún no"]] as const).map(([val, label]) => (
                      <button key={val} onClick={() => { setVerifyCuentaBCP(val); setVerifyBanco(null); }} style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: `2px solid ${verifyCuentaBCP === val ? "#003DA5" : "#E2E8F4"}`, background: verifyCuentaBCP === val ? "#EEF4FF" : "white", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 13.5, fontWeight: verifyCuentaBCP === val ? 700 : 400, color: verifyCuentaBCP === val ? "#003DA5" : "#5A6A92", cursor: "pointer", transition: "all 0.15s" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {verifyRelacion === "padres" && verifyCuentaBCP !== null && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#9AAABF", display: "block", marginBottom: 10 }}>¿TÚ ERES CLIENTE BCP?</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {([["bcp", "Sí"], ["otro", "No"]] as const).map(([val, label]) => (
                      <button key={val} onClick={() => setVerifyBanco(val)} style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: `2px solid ${verifyBanco === val ? "#003DA5" : "#E2E8F4"}`, background: verifyBanco === val ? "#EEF4FF" : "white", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 13.5, fontWeight: verifyBanco === val ? 700 : 400, color: verifyBanco === val ? "#003DA5" : "#5A6A92", cursor: "pointer", transition: "all 0.15s" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: "24px 24px 40px" }}>
              <button
                disabled={(() => {
                  const docLen = verifyTipoDoc === "dni" ? 8 : 11;
                  if (!businessNameDraft.trim() || !verifyTipoDoc || verifyNumDoc.length !== docLen) return true;
                  if (!verifyRelacion || !verifyBanco) return true;
                  if (verifyRelacion === "mio" && verifyBanco === "bcp") return false;
                  if (verifyRelacion === "mio" && verifyBanco === "otro") return !verifyCuentaBCP;
                  if (verifyRelacion === "padres") return !verifyCuentaBCP || !verifyBanco;
                  return true;
                })()}
                onClick={() => {
                  const name = businessNameDraft.trim();
                  if (verifyBanco === "bcp") {
                    setVerifyOpen(false);
                    router.push(`/proyectos/familias-bcp/onboarding/bcp-login?businessName=${encodeURIComponent(name)}&relacion=${encodeURIComponent(verifyRelacion ?? "")}`);
                  } else {
                    setBusinessName(name); setVerified(true); setVerifyOpen(false);
                  }
                }}
                style={{ width: "100%", background: "#F07B1F", color: "white", border: "none", borderRadius: 16, padding: "18px", fontFamily: "var(--font-nunito,'Nunito',sans-serif)", fontSize: 16, fontWeight: 800, cursor: "pointer", opacity: (() => { const docLen = verifyTipoDoc === "dni" ? 8 : 11; if (!businessNameDraft.trim() || !verifyTipoDoc || verifyNumDoc.length !== docLen || !verifyRelacion || !verifyBanco) return 0.4; if (verifyRelacion === "mio" && verifyBanco === "bcp") return 1; if (verifyRelacion === "mio" && verifyBanco === "otro" && verifyCuentaBCP) return 1; if (verifyRelacion === "padres" && verifyCuentaBCP && verifyBanco) return 1; return 0.4; })(), transition: "opacity 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none"><path d="M1 7L6 12 15 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Verificar negocio
              </button>
            </div>
          </div>
        </>
      )}

      {/* Conectar drawer */}
      {conectarOpen && (
        <>
          <div className="bcp-edit-backdrop" onClick={() => { setConectarOpen(false); setConectarStep("select"); }} />
          <div className="bcp-edit-panel" style={{ position: "fixed", top: 0, bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, zIndex: 200, background: "white", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 16px" }}>
              <button onClick={() => { if (conectarApproved || conectarVerifying) return; if (conectarStep === "verify") { setConectarStep("select"); setConectarYapePin(["","","","","",""]); setConectarYapePinError(""); } else { setConectarOpen(false); } }} style={{ width: 38, height: 38, borderRadius: 12, background: "#F0F2F7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="#1A2240" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1.5px", color: "#7A8EAE" }}>BCP · MI FAMILIA</span>
              <div style={{ width: 38 }} />
            </div>
            {conectarStep === "select" && (
              <>
                <div style={{ flex: 1, padding: "8px 24px 0", overflowY: "auto" }}>
                  <h2 style={{ fontFamily: "'Flexo',sans-serif", fontSize: 26, fontWeight: 700, color: "#1A2240", lineHeight: 1.25, marginBottom: 10 }}>Registra ingresos y egresos</h2>
                  <p style={{ fontSize: 14, color: "#003DA5", fontWeight: 600, lineHeight: 1.55, marginBottom: 28 }}>
                    De {businessName || "tu negocio"}, no de las tuyas como Ricardo.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { id: "yape",   emoji: "📱", title: "Yape",           desc: "Usaremos inteligencia para procesar los movimientos de los últimos 6 meses automáticamente.", badge: "Más usado" },
                      { id: "bcp",    emoji: "🏦", title: "Cuenta BCP",     desc: "Usaremos inteligencia para procesar los movimientos de los últimos 6 meses automáticamente.", badge: null },
                      { id: "manual", emoji: "📋", title: "Ingreso manual",  desc: "Sube una plantilla o ingresa uno a uno", badge: null },
                    ].map(({ id, emoji, title, desc, badge }) => {
                      const isSelected = conectarSelected === id;
                      return (
                        <button key={id} onClick={() => toggleConectar(id)} style={{ background: isSelected ? "#EEF4FF" : "white", border: `2px solid ${isSelected ? "#003DA5" : "#E2E8F4"}`, borderRadius: 16, padding: "16px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "border-color 0.15s, background 0.15s" }}>
                          <span style={{ fontSize: 26, flexShrink: 0 }}>{emoji}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                              <span style={{ fontFamily: "'Flexo',sans-serif", fontSize: 15, fontWeight: 700, color: isSelected ? "#003DA5" : "#1A2240" }}>{title}</span>
                              {badge && <span style={{ background: "#F07B1F", color: "white", fontSize: 10.5, fontWeight: 800, borderRadius: 20, padding: "2px 9px" }}>{badge}</span>}
                            </div>
                            <span style={{ fontSize: 13, color: isSelected ? "#5A7ABF" : "#9AAABF" }}>{desc}</span>
                          </div>
                          <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${isSelected ? "#003DA5" : "#C8D2E6"}`, background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                            {isSelected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#003DA5" }} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ padding: "20px 24px 40px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 14 }}>
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none"><rect x="1" y="7" width="12" height="8.5" rx="2.5" stroke="#9AAABF" strokeWidth="1.4"/><path d="M4 7V4.5a3 3 0 016 0V7" stroke="#9AAABF" strokeWidth="1.4" strokeLinecap="round"/><circle cx="7" cy="11" r="1.1" fill="#9AAABF"/></svg>
                    <span style={{ fontSize: 12.5, color: "#9AAABF" }}>Solo tú decides qué compartes. Nadie más tiene acceso.</span>
                  </div>
                  <button disabled={conectarSelected === null} onClick={() => {
                    if (conectarSelected === "yape") { setConectarStep("verify"); setTimeout(() => yapePinRefs.current[0]?.focus(), 100); }
                    else { setConectarOpen(false); setConectarDone(true); }
                  }} style={{ width: "100%", background: "#F07B1F", color: "white", border: "none", borderRadius: 16, padding: "18px", fontSize: 16, fontWeight: 800, cursor: conectarSelected !== null ? "pointer" : "default", opacity: conectarSelected !== null ? 1 : 0.4, fontFamily: "var(--font-nunito,'Nunito',sans-serif)", boxShadow: "0 8px 24px rgba(240,123,31,0.28)" }}>
                    Conectar y analizar
                  </button>
                  <p style={{ textAlign: "center", fontSize: 12, color: "#C8D2E6", marginTop: 10 }}>Puedes agregar más fuentes después desde tu perfil</p>
                </div>
              </>
            )}

            {conectarStep === "verify" && (
              <>
                <div style={{ flex: 1, padding: "8px 24px 0", overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: "#9AAABF", marginBottom: 8 }}>📱 YAPE</p>
                    <h2 style={{ fontFamily: "'Flexo',sans-serif", fontSize: 24, fontWeight: 700, color: "#1A2240", marginBottom: 6 }}>Conecta el Yape del negocio</h2>
                    <p style={{ fontSize: 13.5, color: "#9AAABF", lineHeight: 1.55 }}>Ingresa el número de Yape de <strong style={{ color: "#1A2240" }}>{businessName || "tu negocio"}</strong> para autorizar el acceso a sus movimientos.</p>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#9AAABF", display: "block", marginBottom: 8 }}>NÚMERO DE YAPE</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#9AAABF", pointerEvents: "none" }}>+51</span>
                      <input value={conectarYapePhone} onChange={(e) => setConectarYapePhone(e.target.value.replace(/\D/g, "").slice(0, 9))} inputMode="numeric" placeholder="987 654 321"
                        style={{ width: "100%", border: "2px solid #E2E8F4", borderRadius: 12, padding: "13px 16px 13px 52px", fontSize: 15, fontFamily: "var(--font-nunito,'Nunito',sans-serif)", color: "#1A2240", outline: "none", boxSizing: "border-box" }}
                        onFocus={(e) => e.target.style.borderColor = "#003DA5"} onBlur={(e) => e.target.style.borderColor = "#E2E8F4"} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#9AAABF", display: "block", marginBottom: 8 }}>CÓDIGO DE VERIFICACIÓN YAPE (6 DÍGITOS)</label>
                    <p style={{ fontSize: 12.5, color: "#9AAABF", marginBottom: 12 }}>Abre tu app de Yape → Perfil → Código de verificación.</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      {conectarYapePin.map((d, i) => (
                        <input key={i} ref={(el) => { yapePinRefs.current[i] = el; }}
                          value={d} inputMode="numeric" maxLength={1}
                          onChange={(e) => {
                            const digit = e.target.value.replace(/\D/g, "").slice(-1);
                            const next = [...conectarYapePin]; next[i] = digit; setConectarYapePin(next);
                            if (digit && i < 5) yapePinRefs.current[i + 1]?.focus();
                          }}
                          onKeyDown={(e) => { if (e.key === "Backspace" && !conectarYapePin[i] && i > 0) yapePinRefs.current[i - 1]?.focus(); }}
                          style={{ width: 44, height: 52, border: `2px solid ${d ? "#003DA5" : "#E2E8F4"}`, borderRadius: 12, textAlign: "center", fontSize: 22, fontWeight: 700, color: "#1A2240", background: d ? "#EEF4FF" : "white", outline: "none", fontFamily: "var(--font-nunito,'Nunito',sans-serif)" }} />
                      ))}
                    </div>
                    {conectarYapePinError && <p style={{ fontSize: 13, color: "#EF4444", marginTop: 10 }}>{conectarYapePinError}</p>}
                  </div>
                </div>
                <div style={{ padding: "20px 24px 40px" }}>
                  <button
                    disabled={conectarVerifying || conectarYapePhone.length !== 9 || !conectarYapePin.every(d => d !== "")}
                    onClick={() => {
                      if (conectarYapePin.join("") !== "556677") {
                        setConectarYapePinError("Código incorrecto. Intenta de nuevo.");
                        setConectarYapePin(["", "", "", "", "", ""]);
                        setTimeout(() => yapePinRefs.current[0]?.focus(), 50);
                        return;
                      }
                      setConectarVerifying(true);
                      setTimeout(() => { setConectarVerifying(false); setConectarApproved(true); }, 1800);
                      setTimeout(() => { setConectarApproved(false); setConectarOpen(false); setConectarDone(true); setConectarStep("select"); }, 3600);
                    }}
                    style={{ width: "100%", background: "#F07B1F", color: "white", border: "none", borderRadius: 16, padding: "18px", fontSize: 16, fontWeight: 800, fontFamily: "var(--font-nunito,'Nunito',sans-serif)", cursor: "pointer", opacity: !conectarVerifying && conectarYapePhone.length === 9 && conectarYapePin.every(d => d !== "") ? 1 : 0.4, transition: "opacity 0.2s", boxShadow: "0 8px 24px rgba(240,123,31,0.28)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    {conectarVerifying ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 18 18" className="bcp-spin" style={{ flexShrink: 0 }}><circle cx="9" cy="9" r="7" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/><path d="M9 2a7 7 0 017 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
                        Verificando…
                      </>
                    ) : "Autorizar acceso"}
                  </button>
                </div>
              </>
            )}

            {/* Approved overlay */}
            {conectarApproved && (
              <div style={{ position: "absolute", inset: 0, background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, zIndex: 10, padding: 40 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" style={{ animation: "bcp-fade-in 0.4s ease" }}><path d="M8 20L15 27 30 11" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "'Flexo',sans-serif", fontSize: 22, fontWeight: 700, color: "#1A2240", marginBottom: 8 }}>¡Yape conectado!</p>
                  <p style={{ fontSize: 14, color: "#9AAABF", lineHeight: 1.55 }}>Estamos procesando los movimientos de los últimos 6 meses de <strong style={{ color: "#1A2240" }}>{businessName || "tu negocio"}</strong>.</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense>
      <ResultadoContent />
    </Suspense>
  );
}
