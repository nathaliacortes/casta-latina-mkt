import { useState, useMemo, useEffect, useCallback, useRef } from "react";

// ─── SUPABASE CREDENTIALS ─────────────────────────────────────────────────────
const SB_URL = "https://trtfxsyetkebnqhwhowh.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydGZ4c3lldGtlYm5xaHdob3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4OTQ5OTAsImV4cCI6MjA4NzQ3MDk5MH0.61WRp3lpSylyF0Pt0Babp6BLittWR7IxQcvyTWknO7E";

// ─── RESPONSIVE HOOK ─────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return { w, isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024 };
}

const LOGO_URL = "https://castalatina.org/logo.png";

// ─── USUARIOS ────────────────────────────────────────────────────────────────
const USUARIOS = [
  { id:"director",  nombre:"Director de Marketing", rol:"director",  area:null,         avatar:"🔐", color:"#2B3A5C" },
  { id:"diseno",    nombre:"Diseño",                rol:"equipo",   area:"Diseño",    avatar:"🎨", color:"#E84B2C" },
  { id:"copy",      nombre:"Copy",                  rol:"equipo",   area:"Copy",      avatar:"✍️", color:"#3BAD6E" },
  { id:"video",     nombre:"Video",                 rol:"equipo",   area:"Video",     avatar:"🎬", color:"#4A90C4" },
  { id:"redes",     nombre:"Redes",                 rol:"equipo",   area:"Redes",     avatar:"📱", color:"#9B59B6" },
  { id:"web",       nombre:"Web",                   rol:"equipo",   area:"Web",       avatar:"🌐", color:"#F5A623" },
  { id:"data",      nombre:"Data",                  rol:"equipo",   area:"Data",      avatar:"📊", color:"#0EA5E9" },
];

// ─── EQUIPO INITIAL DATA ────────────────────────────────────────────────────
const EQUIPO_INICIAL = [
  { id:"tm1", nombre:"Sofía Reyes",    area:"Diseño", rol:"Diseñadora Gráfica",    activo:true,  avatar:"SR", color:"#E84B2C", email:"sofia.reyes@castalatinanetwork.ca" },
  { id:"tm2", nombre:"Camila Torres",  area:"Copy",   rol:"Redactora",             activo:true,  avatar:"CT", color:"#3BAD6E", email:"camila.torres@castalatinanetwork.ca" },
  { id:"tm3", nombre:"Mateo Ríos",     area:"Video",  rol:"Editor de Video",       activo:true,  avatar:"MR", color:"#4A90C4", email:"mateo.rios@castalatinanetwork.ca" },
  { id:"tm4", nombre:"Valeria Cruz",   area:"Redes",  rol:"Community Manager",     activo:true,  avatar:"VC", color:"#9B59B6", email:"valeria.cruz@castalatinanetwork.ca" },
  { id:"tm5", nombre:"Daniel Mora",    area:"Web",    rol:"Desarrollador Web",     activo:true,  avatar:"DM", color:"#F5A623", email:"daniel.mora@castalatinanetwork.ca" },
  { id:"tm6", nombre:"Ana Bermúdez",   area:"Diseño", rol:"Diseñadora UX/UI",      activo:false, avatar:"AB", color:"#E84B2C", email:"ana.bermudez@castalatinanetwork.ca" },
  { id:"tm7", nombre:"Lucas Paredes",  area:"Data",   rol:"Analista de Datos",     activo:true,  avatar:"LP", color:"#0EA5E9", email:"lucas.paredes@castalatinanetwork.ca" },
];


const AREA_CFG = {
  "Diseño": { color:"#E84B2C", bg:"#FEF3F0", border:"#F9C4B8", icon:"🎨" },
  "Copy":   { color:"#3BAD6E", bg:"#F0FDF4", border:"#6EE7B7", icon:"✍️" },
  "Video":  { color:"#4A90C4", bg:"#EFF6FF", border:"#93C5FD", icon:"🎬" },
  "Redes":  { color:"#9B59B6", bg:"#F5F0FB", border:"#D7BDE2", icon:"📱" },
  "Web":    { color:"#F5A623", bg:"#FFFBEB", border:"#FDE68A", icon:"🌐" },
  "Data":       { color:"#0EA5E9", bg:"#F0F9FF", border:"#BAE6FD", icon:"📊" },
  "Proyectos":  { color:"#10B981", bg:"#ECFDF5", border:"#6EE7B7", icon:"📋" },
  "Directivos": { color:"#6366F1", bg:"#EEF2FF", border:"#C7D2FE", icon:"👔" },
  "Lideres":    { color:"#D97706", bg:"#FFFBEB", border:"#FDE68A", icon:"⭐" },
};

const TIPO_CFG = {
  "Webinar":               { color:"#8B5CF6", bg:"#F5F3FF", border:"#C4B5FD", icon:"🎙️" },
  "Diseño Gráfico":        { color:"#E84B2C", bg:"#FEF3F0", border:"#F9C4B8", icon:"🎨" },
  "Video / Reel / Cápsula":{ color:"#4A90C4", bg:"#EFF6FF", border:"#93C5FD", icon:"🎬" },
  "Artículo / Blog":       { color:"#3BAD6E", bg:"#F0FDF4", border:"#6EE7B7", icon:"📝" },
  "Redes Sociales":        { color:"#9B59B6", bg:"#F5F0FB", border:"#D7BDE2", icon:"📱" },
  "Página Web":            { color:"#F5A623", bg:"#FFFBEB", border:"#FDE68A", icon:"🌐" },
  "Evento Presencial":     { color:"#E84B2C", bg:"#FEF3F0", border:"#F9C4B8", icon:"📍" },
  "Otras Solicitudes":     { color:"#64748B", bg:"#F8FAFC", border:"#CBD5E1", icon:"📋" },
};

// Estados del ciclo de vida — ahora incluye "Cambios Solicitados"
const ESTADO_CFG = {
  "Pendiente":           { color:"#94A3B8", bg:"#F8FAFC",  dot:"#94A3B8" },
  "En Producción":       { color:"#4A90C4", bg:"#EFF6FF",  dot:"#4A90C4" },
  "En Revisión":         { color:"#8B5CF6", bg:"#F5F3FF",  dot:"#8B5CF6" },
  "Cambios Solicitados": { color:"#F5A623", bg:"#FFFBEB",  dot:"#F5A623" },
  "Aprobada":            { color:"#3BAD6E", bg:"#F0FDF4",  dot:"#3BAD6E" },
  "Rechazada":           { color:"#EF4444", bg:"#FEF2F2",  dot:"#EF4444" },
  "Publicada":           { color:"#9B59B6", bg:"#F5F0FB",  dot:"#9B59B6" },
};

const PROYECTOS = [
  "Institucional Casta Latina","Mentaliza","Conciencia","Career Boost",
  "Pa'educarte","Conexiones Latinas","Atrévete a Emprender",
  "Abrigos de Esperanza","Sponsorships","Impacto Social",
];
const AREAS_EQUIPO = [
  "Presidencia / Vice Presidencia","Estrategia / Advisors","Marketing",
  "Comunicaciones","Fundraising","Finanzas","Eventos y Proyectos",
  "Administración Interna","Ejecutiva y Becas","Impacto Social y Apoyo Comunitario","Otro",
];
const AREAS_PROD = ["Diseño","Copy","Video","Redes","Web","Data","Proyectos","Directivos","Lideres"];
const TIPOS = Object.keys(TIPO_CFG);

const tc = t => TIPO_CFG[t] || TIPO_CFG["Otras Solicitudes"];
const ec = e => ESTADO_CFG[e] || ESTADO_CFG["Pendiente"];
const ac = a => AREA_CFG[a]  || { color:"#64748B", bg:"#F8FAFC", border:"#CBD5E1", icon:"📋" };

// ─── TIMESTAMPS ──────────────────────────────────────────────────────────────
const fmtTs = ts => {
  if (!ts) return null;
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleString("es-ES", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
};
const nowTs  = () => new Date().toISOString();
const genRef = () => {
  const y = new Date().getFullYear();
  const n = String(Math.floor(Math.random()*9000)+1000);
  return `CL-${y}-${n}`;
};
const todayStr = () => new Date().toISOString().split("T")[0];

// ─── PLANTILLAS ───────────────────────────────────────────────────────────────
const SUBTAREAS_TPL = {
  "Webinar": [
    { area:"Diseño", tipo:"Post Webinar",           dias:3,  dep:null,    esRedes:false },
    { area:"Diseño", tipo:"Carrusel Webinar",        dias:6,  dep:null,    esRedes:false },
    { area:"Diseño", tipo:"Banner Web",              dias:7,  dep:null,    esRedes:false },
    { area:"Copy",   tipo:"Copy Carrusel",           dias:2,  dep:null,    esRedes:false },
    { area:"Copy",   tipo:"Copy Post",               dias:2,  dep:null,    esRedes:false },
    { area:"Copy",   tipo:"Copy Reel",               dias:2,  dep:null,    esRedes:false },
    { area:"Copy",   tipo:"Cadena de Correos (1/3)", dias:3,  dep:null,    esRedes:false },
    { area:"Copy",   tipo:"Cadena de Correos (2/3)", dias:3,  dep:null,    esRedes:false },
    { area:"Copy",   tipo:"Cadena de Correos (3/3)", dias:3,  dep:null,    esRedes:false },
    { area:"Video",  tipo:"Edición Reel",            dias:5,  dep:null,    esRedes:false },
    { area:"Web",    tipo:"Website",                 dias:3,  dep:null,    esRedes:false },
    { area:"Web",    tipo:"Campaña Automática",      dias:3,  dep:null,    esRedes:false },
    { area:"Web",    tipo:"Registro",                dias:3,  dep:null,    esRedes:false },
    { area:"Redes",  tipo:"Publicación Post",        dias:1,  dep:"Diseño", esRedes:true, depDesc:"1 día después de aprobación del post por Diseño" },
    { area:"Redes",  tipo:"Publicación Carrusel",    dias:1,  dep:"Diseño", esRedes:true, depDesc:"1 día después de aprobación del carrusel por Diseño" },
    { area:"Redes",  tipo:"Publicación Reel",        dias:1,  dep:"Video",  esRedes:true, depDesc:"1 día después de aprobación del reel por Video" },
    { area:"Data",   tipo:"Reporte Post-Webinar",    dias:5,  dep:"Redes",  esRedes:false, esData:true, depDesc:"5 días hábiles después del webinar — incluye métricas de correos, inscritos, asistentes, duración e interacción" },
  ],
  "Diseño Gráfico": [
    { area:"Copy",   tipo:"Brief / Copy",            dias:2,  dep:null,    esRedes:false },
    { area:"Diseño", tipo:"Pieza Gráfica",           dias:4,  dep:null,    esRedes:false },
    { area:"Redes",  tipo:"Publicación Pieza",       dias:1,  dep:"Diseño", esRedes:true, depDesc:"1 día después de aprobación de la pieza por Diseño" },
  ],
  "Video / Reel / Cápsula": [
    { area:"Copy",   tipo:"Guion / Script",          dias:2,  dep:null,    esRedes:false },
    { area:"Video",  tipo:"Producción / Edición",    dias:8,  dep:null,    esRedes:false },
    { area:"Redes",  tipo:"Publicación Video",       dias:1,  dep:"Video",  esRedes:true, depDesc:"1 día después de aprobación del video por Video" },
  ],
  "Artículo / Blog": [
    { area:"Copy",   tipo:"Redacción Artículo",      dias:5,  dep:null,    esRedes:false },
    { area:"Diseño", tipo:"Imagen Destacada",        dias:3,  dep:null,    esRedes:false },
    { area:"Web",    tipo:"Publicación Web",         dias:1,  dep:"Copy",   esRedes:false, depDesc:"1 día después de aprobación del artículo" },
    { area:"Redes",  tipo:"Difusión en Redes",       dias:1,  dep:"Web",    esRedes:true,  depDesc:"1 día después de publicación en web" },
  ],
  "Redes Sociales": [
    { area:"Diseño", tipo:"Pieza para Redes",        dias:3,  dep:null,    esRedes:false },
    { area:"Copy",   tipo:"Copy Publicación",        dias:2,  dep:null,    esRedes:false },
    { area:"Redes",  tipo:"Programación / Publicación",dias:1, dep:"Diseño", esRedes:true, depDesc:"1 día después de aprobación de la pieza" },
  ],
  "Página Web": [
    { area:"Copy",   tipo:"Contenido / Textos",      dias:4,  dep:null,    esRedes:false },
    { area:"Diseño", tipo:"Maqueta / Wireframe",     dias:5,  dep:null,    esRedes:false },
    { area:"Web",    tipo:"Desarrollo Web",          dias:7,  dep:"Diseño", esRedes:false, depDesc:"Después de aprobación del diseño" },
  ],
  "Evento Presencial": [
    { area:"Diseño", tipo:"Post Evento",             dias:3,  dep:null,    esRedes:false },
    { area:"Diseño", tipo:"Carrusel Evento",         dias:5,  dep:null,    esRedes:false },
    { area:"Diseño", tipo:"Flyer / Material Impreso",dias:7,  dep:null,    esRedes:false },
    { area:"Copy",   tipo:"Copy Redes Evento",       dias:2,  dep:null,    esRedes:false },
    { area:"Copy",   tipo:"Correo Difusión Evento",  dias:3,  dep:null,    esRedes:false },
    { area:"Video",  tipo:"Reel Evento",             dias:5,  dep:null,    esRedes:false },
    { area:"Web",    tipo:"Landing / Página Evento", dias:4,  dep:null,    esRedes:false },
    { area:"Web",    tipo:"Formulario de Registro",  dias:3,  dep:null,    esRedes:false },
    { area:"Redes",  tipo:"Publicación Evento",      dias:1,  dep:"Diseño", esRedes:true,  depDesc:"1 día después de aprobación de diseño" },
  ],
  "Otras Solicitudes": [
    { area:null, tipo:"Evaluar y Asignar",           dias:2,  dep:null,    esRedes:false },
  ],
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
function addBizDays(dateStr, days) {
  if (!dateStr || !days) return "";
  const d = new Date(dateStr + "T12:00:00");
  if (isNaN(d.getTime())) return "";
  let added = 0;
  while (added < days) { d.setDate(d.getDate()+1); if(d.getDay()!==0&&d.getDay()!==6) added++; }
  return d.toISOString().split("T")[0];
}

function buildSubtareas(tipo, fechaInicio) {
  return (SUBTAREAS_TPL[tipo]||[]).map((t,i) => ({
    id: Date.now()+i+Math.random(),
    area: t.area, tipo: t.tipo, esRedes: t.esRedes||false, esData: t.esData||false,
    estado: "Pendiente",
    deadline: t.dep ? "" : addBizDays(fechaInicio, t.dias),
    diasBase: t.dias, dep: t.dep||null, depDesc: t.depDesc||null,
    entregaUrl: null, aprobado: null, comentario: null, notas:[],
    historial: [],            // ← array de eventos del ciclo de vida
    asignadoId: null,         // ← integrante asignado
    ts_enviado: null,
    ts_aprobado: null,
    ts_rechazado: null,
    ts_publicado: null,
    ts_cambios: null,         // ← nuevo: cuándo se pidieron cambios
  }));
}

// Agrega un evento al historial de una subtarea
function hEvent(st, tipo, autor, detalle) {
  return [
    ...( st.historial || [] ),
    { ts: nowTs(), tipo, autor, detalle: detalle || null }
  ];
}

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
const DEMO = [
  {
    id:1, refCode:"CL-2026-1001", tipo:"Webinar", proyecto:"Atrévete a Emprender", estado:"activa",
    solicitante:"Karla Casanova", email:"karla.casanova@castalatina.org",
    area_solicitante:"Eventos y Proyectos", urgente:false,
    ts_creacion: "2026-02-20T14:30:00.000Z",
    ts_completado: null,
    datos:{
      titulo:"Lanza tu negocio en Ontario",
      fecha:"2026-04-09 19:00 ET",
      descripcion:"Webinar educativo para emprendedores latinos en Ontario. Los participantes aprenderán a estructurar su idea de negocio, validarla y dar los primeros pasos legales y financieros.",
      link_zoom:"https://zoom.us/j/example",
      host:"Karla Casanova",
      invitado1:"Florentina Fernández — Consultora de Negocios",
      foto_invitado1:"https://drive.google.com/file/example",
      carpeta:"https://drive.google.com/drive/folders/example",
    },
    notas:[],
    subtareas: buildSubtareas("Webinar","2026-02-20"),
  },
  {
    id:2, refCode:"CL-2026-1002", tipo:"Video / Reel / Cápsula", proyecto:"Atrévete a Emprender", estado:"activa",
    solicitante:"Laura Salamanca", email:"laura.salamanca@castalatina.org",
    area_solicitante:"Eventos y Proyectos", urgente:false,
    ts_creacion: "2026-02-24T10:25:00.000Z",
    ts_completado: null,
    datos:{
      titulo:"Reel motivacional — Atrévete a Emprender",
      descripcion:"Dos videos de aprox. 4 min. Primero: propósito y organización financiera. Segundo: cápsula motivacional para el evento de abril.",
      requiere_grabacion:"No — material existente",
      carpeta:"https://drive.google.com/drive/folders/1qRytNvOIG8wKSkt4Z6ftP55o4F_Wn-5j",
    },
    notas:[],
    subtareas: buildSubtareas("Video / Reel / Cápsula","2026-02-24"),
  },
];

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────────
const Badge = ({ children, color, bg, border, sm }) => (
  <span style={{ fontSize:sm?10:11, padding:sm?"2px 7px":"3px 10px", borderRadius:4, background:bg, color, border:`1px solid ${border||color+"33"}`, fontWeight:700, whiteSpace:"nowrap", display:"inline-flex", alignItems:"center", gap:3 }}>{children}</span>
);

// ─── TIMELINE SOLICITUD (Director) ────────────────────────────────────────────
function TimelineCard({ sol }) {
  const totalST = sol.subtareas.length;
  const aprobST = sol.subtareas.filter(s => s.estado==="Aprobada"||s.estado==="Publicada").length;
  const primerAprobado  = sol.subtareas.filter(s=>s.ts_aprobado).sort((a,b)=>new Date(a.ts_aprobado)-new Date(b.ts_aprobado))[0];
  const primerPublicado = sol.subtareas.filter(s=>s.ts_publicado).sort((a,b)=>new Date(a.ts_publicado)-new Date(b.ts_publicado))[0];

  const hitos = [
    { label:"Solicitud creada",    ts: sol.ts_creacion,              color:"#2B3A5C", icon:"📋", done:!!sol.ts_creacion },
    { label:"Primera aprobación",  ts: primerAprobado?.ts_aprobado,  color:"#3BAD6E", icon:"✅", done:!!primerAprobado, sub: primerAprobado?.tipo },
    { label:"Primera publicación", ts: primerPublicado?.ts_publicado,color:"#9B59B6", icon:"📱", done:!!primerPublicado, sub: primerPublicado?.tipo },
    { label:"Proceso completo",    ts: sol.ts_completado,            color:"#F5C842", icon:"🎉", done:!!sol.ts_completado, sub:`${aprobST}/${totalST} completadas` },
  ];

  return (
    <div style={{ padding:"14px 16px", background:"#fff", borderRadius:12, border:"1px solid #E2E8F0" }}>
      <div style={{ fontSize:10, color:"#2B3A5C", fontWeight:800, letterSpacing:.6, marginBottom:12 }}>📅 LÍNEA DE TIEMPO</div>
      <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
        {hitos.map((h,i) => (
          <div key={i} style={{ display:"flex", gap:10, position:"relative" }}>
            {i < hitos.length-1 && (
              <div style={{ position:"absolute", left:11, top:24, bottom:-8, width:2, background: h.done ? h.color+"44" : "#E2E8F0", zIndex:0 }} />
            )}
            <div style={{ width:24, height:24, borderRadius:"50%", background: h.done ? h.color : "#F1F5F9", border:`2px solid ${h.done ? h.color : "#E2E8F0"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, flexShrink:0, zIndex:1, marginTop:2 }}>
              {h.done ? <span style={{ fontSize:10 }}>{h.icon}</span> : <div style={{ width:7, height:7, borderRadius:"50%", background:"#CBD5E1" }} />}
            </div>
            <div style={{ paddingBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color: h.done ? h.color : "#94A3B8" }}>{h.label}</div>
              {h.done && h.ts ? <div style={{ fontSize:10, color:"#64748B", marginTop:1 }}>{fmtTs(h.ts)}</div>
                : <div style={{ fontSize:10, color:"#CBD5E1", marginTop:1, fontStyle:"italic" }}>Pendiente</div>}
              {h.sub && <div style={{ fontSize:9, color:"#94A3B8", marginTop:1 }}>{h.sub}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HISTORIAL SUBTAREA ───────────────────────────────────────────────────────
// Lista cronológica de todos los eventos de la subtarea
function HistorialSubtarea({ st, esDirector }) {
  const eventos = st.historial || [];
  const HIST_ICON = {
    "creada":"📋", "enviada":"📤", "aprobada":"✅", "rechazada":"❌",
    "cambios":"⚠️", "reenviada":"🔄", "publicada":"📱", "estado":"🔀", "nota":"💬"
  };
  const HIST_COLOR = {
    "creada":"#94A3B8","enviada":"#4A90C4","aprobada":"#3BAD6E","rechazada":"#EF4444",
    "cambios":"#F5A623","reenviada":"#4A90C4","publicada":"#9B59B6","estado":"#8B5CF6","nota":"#64748B"
  };

  if (!eventos.length) return (
    <div style={{ padding:"8px 12px", background:"#F8FAFC", borderRadius:8, border:"1px solid #E2E8F0", fontSize:10, color:"#CBD5E1", fontStyle:"italic", textAlign:"center" }}>
      Sin historial aún
    </div>
  );

  return (
    <div style={{ padding:"10px 12px", background:"#F8FAFC", borderRadius:8, border:"1px solid #E2E8F0" }}>
      <div style={{ fontSize:9, color:"#94A3B8", fontWeight:700, letterSpacing:.6, marginBottom:8 }}>📋 HISTORIAL</div>
      <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
        {eventos.map((ev,i) => (
          <div key={i} style={{ display:"flex", gap:8, position:"relative" }}>
            {i < eventos.length-1 && (
              <div style={{ position:"absolute", left:9, top:20, bottom:-4, width:1.5, background:HIST_COLOR[ev.tipo]+"33", zIndex:0 }} />
            )}
            <div style={{ width:20, height:20, borderRadius:"50%", background:HIST_COLOR[ev.tipo]+"20", border:`1.5px solid ${HIST_COLOR[ev.tipo]}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, flexShrink:0, zIndex:1, marginTop:1 }}>
              {HIST_ICON[ev.tipo]||"·"}
            </div>
            <div style={{ paddingBottom:10, flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:4 }}>
                <span style={{ fontSize:11, fontWeight:700, color:HIST_COLOR[ev.tipo] }}>
                  {{creada:"Creada",enviada:"Enviada al director",aprobada:"Aprobada",rechazada:"Rechazada",cambios:"Cambios solicitados",reenviada:"Reenviada",publicada:"Publicada",estado:"Cambio de estado",nota:"Nota"}[ev.tipo]||ev.tipo}
                </span>
                {esDirector && ev.ts && <span style={{ fontSize:8, color:"#94A3B8", whiteSpace:"nowrap" }}>{fmtTs(ev.ts)}</span>}
                {!esDirector && ev.ts && <span style={{ fontSize:9 }}>✓</span>}
              </div>
              {ev.autor && <div style={{ fontSize:9, color:"#94A3B8" }}>por {ev.autor}</div>}
              {ev.detalle && <div style={{ fontSize:10, color:"#64748B", marginTop:2, fontStyle:"italic", lineHeight:1.4 }}>"{ev.detalle}"</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MODAL CONFIGURACIÓN DE EQUIPO (solo Director) ───────────────────────────
// ─── SHARED FORM HELPERS (defined outside components to prevent focus loss) ───
const INP_STYLE = {
  width:"100%", padding:"9px 12px", borderRadius:8,
  border:"1px solid #E2E8F0", background:"#FAFAFA",
  fontSize:13, color:"#1E293B", fontFamily:"inherit", outline:"none",
};
const FormLabel = ({label, req}) => (
  <label style={{fontSize:10,color:"#2B3A5C",fontWeight:700,letterSpacing:.5,marginBottom:4,display:"block"}}>
    {label}{req&&<span style={{color:"#E84B2C",marginLeft:2}}>*</span>}
  </label>
);
const FormLabelSimple = ({label}) => (
  <label style={{fontSize:10,color:"#2B3A5C",fontWeight:700,letterSpacing:.5,marginBottom:4,display:"block"}}>{label}</label>
);
const FormGrid = ({children}) => (
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>{children}</div>
);

// ─── CONFIRM DIALOG ──────────────────────────────────────────────────────────
function ConfirmDialog({ title, msg, onConfirm, onCancel, danger }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.65)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}
      onClick={onCancel}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:"#fff",borderRadius:16,width:"min(400px,92vw)",boxShadow:"0 24px 60px rgba(0,0,0,.22)",overflow:"hidden"}}>
        <div style={{padding:"18px 20px",borderBottom:"1px solid #F1F5F9"}}>
          <div style={{fontSize:15,fontWeight:800,color:danger?"#C0392B":"#0F172A",fontFamily:"Outfit,sans-serif",marginBottom:6}}>{title}</div>
          <div style={{fontSize:12,color:"#64748B",lineHeight:1.6}}>{msg}</div>
        </div>
        <div style={{padding:"14px 20px",display:"flex",justifyContent:"flex-end",gap:10}}>
          <button onClick={onCancel}
            style={{padding:"8px 18px",borderRadius:8,border:"1px solid #E2E8F0",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#64748B"}}>
            Cancelar
          </button>
          <button onClick={onConfirm}
            style={{padding:"8px 18px",borderRadius:8,border:"none",background:danger?"linear-gradient(135deg,#E84B2C,#C0392B)":"linear-gradient(135deg,#3BAD6E,#27AE60)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            {danger?"🗑 Eliminar":"Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalConfigEquipo({ equipo, setEquipo, onClose, notify }) {
  const [nombre, setNombre]       = useState("");
  const [area, setArea]           = useState("Diseño");
  const [rol, setRol]             = useState("");
  const [email, setEmail]         = useState("");
  const [confirmElim, setConfirmElim] = useState(null);

  const initials = n => n.trim().split(" ").slice(0,2).map(p=>p[0]?.toUpperCase()||"").join("");

  const agregar = () => {
    if (!nombre.trim()) { notify("El nombre es requerido","warn"); return; }
    if (!rol.trim())    { notify("El rol/cargo es requerido","warn"); return; }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      notify("El correo no tiene formato válido","warn"); return;
    }
    const cfg = AREA_CFG[area]||{color:"#64748B"};
    const nuevo = {
      id: "tm"+Date.now(),
      nombre: nombre.trim(),
      area, rol: rol.trim(),
      email: email.trim().toLowerCase(),
      activo: true,
      avatar: initials(nombre),
      color: cfg.color,
    };
    setEquipo(p => [...p, nuevo]);
    setNombre(""); setRol(""); setEmail("");
    notify(`✅ ${nombre.trim()} agregado al equipo`);
  };

  const toggleActivo = id => {
    setEquipo(p => p.map(m => m.id===id ? {...m, activo:!m.activo} : m));
  };

  const eliminar = id => {
    setEquipo(p => p.filter(m => m.id!==id));
    notify("Integrante eliminado","warn");
    setConfirmElim(null);
  };


  const inp = INP_STYLE;
  const byArea = AREAS_PROD.reduce((acc,a) => { acc[a]=equipo.filter(m=>m.area===a); return acc; }, {});

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.65)",zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(5px)"}}>
      {confirmElim&&<ConfirmDialog danger title="¿Eliminar integrante?" msg={`Se eliminará a "${equipo.find(m=>m.id===confirmElim)?.nombre}" del equipo permanentemente.`} onConfirm={()=>eliminar(confirmElim)} onCancel={()=>setConfirmElim(null)}/>}

      <div className="modal-config-w" style={{background:"#fff",borderRadius:20,maxHeight:"92dvh",overflow:"hidden",boxShadow:"0 28px 70px rgba(0,0,0,.28)",display:"flex",flexDirection:"column"}}>
        {/* Header */}
        <div style={{background:"#2B3A5C",borderBottom:"3px solid #E84B2C",flexShrink:0,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"Outfit,sans-serif",fontSize:16,fontWeight:800,color:"#fff"}}>⚙️ Configurar Equipo</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.5)",marginTop:2}}>{equipo.length} integrantes registrados</div>
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,.15)",border:"none",color:"#fff",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        {/* Body */}
        <div className="modal-config-body" style={{flex:1,overflow:"hidden",display:"grid",minHeight:0}}>

          {/* Izquierda — Agregar integrante */}
          <div style={{padding:"18px",borderRight:"1px solid #E2E8F0",overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:11,fontWeight:800,color:"#2B3A5C",letterSpacing:.5,marginBottom:4}}>➕ AGREGAR INTEGRANTE</div>
            <div>
              <div style={{fontSize:10,color:"#94A3B8",fontWeight:700,marginBottom:3}}>Nombre completo *</div>
              <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: María González" style={{...inp}}/>
            </div>
            <div>
              <div style={{fontSize:10,color:"#94A3B8",fontWeight:700,marginBottom:3}}>Área</div>
              <select value={area} onChange={e=>setArea(e.target.value)} style={{...inp}}>
                {AREAS_PROD.map(a=><option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:10,color:"#94A3B8",fontWeight:700,marginBottom:3}}>Rol / Cargo *</div>
              <input value={rol} onChange={e=>setRol(e.target.value)} placeholder="Ej: Diseñadora Gráfica" style={{...inp}}/>
            </div>
            <div>
              <div style={{fontSize:10,color:"#94A3B8",fontWeight:700,marginBottom:3}}>Email (opcional)</div>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@castlatina.org" style={{...inp}}/>
            </div>
            <button onClick={agregar}
              style={{padding:"10px",borderRadius:9,background:"linear-gradient(135deg,#2B3A5C,#1a2540)",color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>
              ✅ Agregar al equipo
            </button>
          </div>

          {/* Derecha — Lista de integrantes */}
          <div style={{overflowY:"auto",padding:"18px",display:"flex",flexDirection:"column",gap:16}}>
            <div style={{fontSize:11,fontWeight:800,color:"#2B3A5C",letterSpacing:.5}}>👥 EQUIPO ACTUAL</div>
            {AREAS_PROD.map(a => {
              const miembros = byArea[a]||[];
              if(!miembros.length) return null;
              const cfg = AREA_CFG[a]||{color:"#64748B",bg:"#F8FAFC",icon:"👤"};
              return(
                <div key={a}>
                  <div style={{fontSize:10,fontWeight:800,color:cfg.color,letterSpacing:.5,marginBottom:6,display:"flex",alignItems:"center",gap:5}}>
                    {cfg.icon} {a.toUpperCase()}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {miembros.map(m => (
                      <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:`1px solid ${m.activo?cfg.color+"33":"#E2E8F0"}`,background:m.activo?"#fff":"#F8FAFC",opacity:m.activo?1:.6}}>
                        <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${m.color},${m.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",flexShrink:0}}>{m.avatar}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:700,color:"#0F172A"}}>{m.nombre}</div>
                          <div style={{fontSize:10,color:"#64748B"}}>{m.rol||m.area}{m.email&&<span style={{color:"#94A3B8"}}> · {m.email}</span>}</div>
                        </div>
                        <div style={{display:"flex",gap:5,flexShrink:0}}>
                          <button onClick={()=>toggleActivo(m.id)} title={m.activo?"Desactivar":"Activar"}
                            style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${m.activo?"#FDE68A":"#6EE7B7"}`,background:m.activo?"#FFFBEB":"#F0FDF4",color:m.activo?"#B7860D":"#2D8A57",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                            {m.activo?"Pausar":"Activar"}
                          </button>
                          <button onClick={()=>setConfirmElim(m.id)} title="Eliminar"
                            style={{width:28,height:28,borderRadius:6,border:"1px solid #FECACA",background:"#FEF2F2",color:"#E84B2C",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {equipo.length===0&&(
              <div style={{textAlign:"center",padding:"40px 20px",color:"#94A3B8",fontSize:12}}>
                No hay integrantes aún. Agrega el primero con el formulario.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DEADLINE EDITOR (solo Director) ─────────────────────────────────────────
function ModalDetalle({sol,usuario,equipo=[],onClose,onUpdSol,onDeleteSol,notify}){
  const [nota,setNota]=useState("");
  // Auto-select area tab for equipo users
  const defaultArea=(()=>{
    if(usuario.rol==="equipo"){
      // Check if area has pending/active work (not yet sent)
      const hasPending=sol.subtareas.some(st=>st.area===usuario.area&&["Pendiente","En Producción","Cambios Solicitados"].includes(st.estado)&&st.asignadoId);
      if(hasPending) return usuario.area;
      return "Todas";
    }
    return "Todas";
  })();
  const [filtroArea,setFiltroArea]=useState(defaultArea);
  const [showAgregarST,setShowAgregarST]=useState(false);
  const [editingSol,setEditingSol]=useState(false);
  const [editDatos,setEditDatos]=useState({...sol.datos});
  const [confirmElimSol,setConfirmElimSol]=useState(false);
  const [confirmElimST,setConfirmElimST]=useState(null); // stId
  const [tabMovil,setTabMovil]=useState("subtareas"); // "info" | "subtareas"

  const tipoCfg=tc(sol.tipo);
  const titulo=sol.datos.titulo||sol.tipo;
  const esDirector=usuario.rol==="director";

  const addNota=()=>{
    if(!nota.trim()) return;
    const n={id:Date.now(),texto:nota,autor:usuario.rol==="director"?"Director":usuario.area,area:usuario.area||"Director",ts:new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})};
    onUpdSol(sol.id,{notas:[...sol.notas,n]});
    setNota("");notify("Nota guardada ✓");
  };

  const agregarST=(st)=>{
    onUpdSol(sol.id,{subtareas:[...sol.subtareas,st]});
  };

  const eliminarST=(stId)=>{
    const nuevas=sol.subtareas.filter(s=>s.id!==stId);
    const aprobST=nuevas.filter(s=>s.estado==="Aprobada"||s.estado==="Publicada").length;
    const todasAprobadas=nuevas.length>0&&nuevas.every(s=>s.estado==="Aprobada"||s.estado==="Publicada");
    onUpdSol(sol.id,{
      subtareas:nuevas,
      ts_completado: todasAprobadas&&!sol.ts_completado ? nowTs() : (nuevas.length===0?null:sol.ts_completado),
    });
    notify("Subtarea eliminada","warn");
    setConfirmElimST(null);
  };

  const updST=(stId,patch)=>{
    const nuevas=sol.subtareas.map(s=>s.id===stId?{...s,...patch}:s);
    const todasAprobadas=nuevas.length>0&&nuevas.every(s=>s.estado==="Aprobada"||s.estado==="Publicada");
    onUpdSol(sol.id,{
      subtareas:nuevas,
      ts_completado: todasAprobadas&&!sol.ts_completado ? nowTs() : sol.ts_completado,
    });
  };

  // "Dirección" tab: subtareas that have been sent (En Revisión / Aprobada etc.) — director approval queue
  const stParaRevision=sol.subtareas.filter(s=>["En Revisión","Cambios Solicitados","Aprobada","Publicada","Rechazada"].includes(s.estado)&&s.ts_enviado);
  const areas=["Todas",...new Set(sol.subtareas.map(s=>s.area||"Sin área")),
    ...(esDirector&&stParaRevision.length>0?["Dirección"]:[]
  )];
  const stFiltradas=(()=>{
    if(filtroArea==="Todas") return sol.subtareas;
    if(filtroArea==="Dirección") return stParaRevision;
    return sol.subtareas.filter(s=>(s.area||"Sin área")===filtroArea);
  })();
  const totalST=sol.subtareas.length;
  const aprobST=sol.subtareas.filter(s=>s.estado==="Aprobada"||s.estado==="Publicada").length;
  const revST=sol.subtareas.filter(s=>s.estado==="En Revisión").length;
  const cambiosST=sol.subtareas.filter(s=>s.estado==="Cambios Solicitados").length;
  const pct=totalST?Math.round(aprobST/totalST*100):0;

  const camposDatos={
    "Webinar":[["Título",sol.datos.titulo],["Fecha",sol.datos.fecha],["Descripción",sol.datos.descripcion],["Zoom",sol.datos.link_zoom],["Host",sol.datos.host],["Invitado 1",sol.datos.invitado1],["📁 Drive",sol.datos.carpeta]],
    "Evento Presencial":[["Nombre",sol.datos.titulo],["Fecha",sol.datos.fecha],["Ciudad",sol.datos.ciudad],["Descripción",sol.datos.descripcion],["📁 Drive",sol.datos.carpeta]],
    "Video / Reel / Cápsula":[["Nombre",sol.datos.titulo],["Descripción",sol.datos.descripcion],["¿Grabación?",sol.datos.requiere_grabacion],["📁 Drive",sol.datos.carpeta]],
    "Diseño Gráfico":[["Pieza",sol.datos.titulo],["Objetivo",sol.datos.objetivo],["Texto",sol.datos.texto],["📁 Drive",sol.datos.carpeta]],
    "Artículo / Blog":[["Título",sol.datos.titulo],["Descripción",sol.datos.descripcion],["📁 Drive",sol.datos.carpeta]],
    "Redes Sociales":[["Contenido",sol.datos.titulo],["Canales",sol.datos.canales],["Descripción",sol.datos.descripcion],["📁 Drive",sol.datos.carpeta]],
    "Página Web":[["Página",sol.datos.titulo],["Tipo",sol.datos.tipo_web],["Descripción",sol.datos.descripcion],["📁 Drive",sol.datos.carpeta]],
  };
  const campos=(camposDatos[sol.tipo]||[["Solicitud",sol.datos.titulo],["Descripción",sol.datos.descripcion],["📁 Drive",sol.datos.carpeta]]).filter(([,v])=>v);

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.6)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
      {showAgregarST&&<ModalAgregarSubtarea sol={sol} onClose={()=>setShowAgregarST(false)} onAdd={agregarST} notify={notify}/>}
      {confirmElimSol&&<ConfirmDialog danger title="¿Eliminar solicitud?" msg={`Esto eliminará permanentemente "${titulo}" y todas sus ${totalST} subtareas. Esta acción no se puede deshacer.`} onConfirm={()=>{onDeleteSol(sol.id);onClose();notify("Solicitud eliminada","warn");}} onCancel={()=>setConfirmElimSol(false)}/>}
      {confirmElimST&&<ConfirmDialog danger title="¿Eliminar subtarea?" msg={`Se eliminará la subtarea "${sol.subtareas.find(s=>s.id===confirmElimST)?.tipo||""}". Esta acción no se puede deshacer.`} onConfirm={()=>eliminarST(confirmElimST)} onCancel={()=>setConfirmElimST(null)}/>}

      <div style={{background:"#FAFAFA",borderRadius:20,width:"min(1100px,96vw)",height:"min(90vh,90dvh)",overflow:"hidden",boxShadow:"0 28px 70px rgba(0,0,0,.25)",display:"flex",flexDirection:"column"}}>
        {/* Header */}
        <div style={{padding:"12px 16px",background:"#2B3A5C",borderBottom:"3px solid #E84B2C",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:6}}>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center",minWidth:0}}>
              <Badge color={tipoCfg.color} bg={tipoCfg.bg} border={tipoCfg.border}>{tipoCfg.icon} {sol.tipo}</Badge>
              <Badge color="#F5C842" bg="rgba(245,200,66,.12)" border="rgba(245,200,66,.25)">{totalST} sub</Badge>
              {sol.refCode&&<Badge color="#4A90C4" bg="rgba(74,144,196,.15)" border="rgba(74,144,196,.35)">🔖 {sol.refCode}</Badge>}
              {sol.urgente&&<Badge color="#E84B2C" bg="#FEF3F0" border="#F9C4B8">⚡</Badge>}
              {revST>0&&<Badge color="#8B5CF6" bg="#F5F3FF" border="#C4B5FD">🔔 {revST}</Badge>}
              {cambiosST>0&&<Badge color="#F5A623" bg="#FFFBEB" border="#FDE68A">⚠️ {cambiosST}</Badge>}
              <Badge color={pct===100?"#3BAD6E":"#94A3B8"} bg="#F8FAFC">{aprobST}/{totalST}</Badge>
            </div>
            <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
              {esDirector&&sol.estado!=="cerrada"&&(
                <button onClick={()=>{onUpdSol(sol.id,{estado:"cerrada",ts_completado:new Date().toISOString()});onClose();notify("✅ Solicitud archivada");}} title="Cerrar y archivar"
                  style={{width:32,height:32,borderRadius:8,background:"rgba(59,173,110,.15)",border:"1px solid rgba(59,173,110,.35)",color:"#3BAD6E",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>📦</button>
              )}
              {esDirector&&sol.estado==="cerrada"&&(
                <button onClick={()=>{onUpdSol(sol.id,{estado:"activa",ts_completado:null});notify("✅ Solicitud reactivada");}} title="Reactivar"
                  style={{width:32,height:32,borderRadius:8,background:"rgba(74,144,196,.15)",border:"1px solid rgba(74,144,196,.35)",color:"#4A90C4",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>🔄</button>
              )}
              {esDirector&&(
                <button onClick={()=>setConfirmElimSol(true)} title="Eliminar solicitud"
                  style={{width:32,height:32,borderRadius:8,background:"rgba(232,75,44,.15)",border:"1px solid rgba(232,75,44,.35)",color:"#FF8A75",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>🗑</button>
              )}
              <button onClick={onClose} style={{width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,.15)",border:"none",color:"#fff",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
            </div>
          </div>
          <div style={{fontFamily:"Outfit,sans-serif",fontSize:15,fontWeight:800,color:"#fff",lineHeight:1.2,marginBottom:3}}>{titulo}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.45)"}}>
            {sol.solicitante} · {sol.area_solicitante} · {sol.proyecto}
            {esDirector&&sol.ts_creacion&&<span style={{marginLeft:6,color:"rgba(255,255,255,.3)"}}>· {fmtTs(sol.ts_creacion)}</span>}
          </div>
        </div>

                {/* Barra progreso */}
        <div style={{height:4,background:"#E2E8F0",flexShrink:0}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,#3BAD6E,#27AE60)",width:`${pct}%`,transition:"width .5s"}}/>
        </div>

        {/* Tabs móvil — solo visible en pantallas pequeñas */}
        <div className="modal-tabs-movil" style={{display:"none",flexShrink:0,borderBottom:"2px solid #E2E8F0",background:"#fff"}}>
          {[{id:"info",label:"📋 Información"},{id:"subtareas",label:`📌 Subtareas (${totalST})`}].map(t=>(
            <button key={t.id} onClick={()=>setTabMovil(t.id)}
              style={{flex:1,padding:"11px 8px",border:"none",background:"transparent",fontSize:12,fontWeight:700,
                color:tabMovil===t.id?"#E84B2C":"#94A3B8",cursor:"pointer",
                borderBottom:tabMovil===t.id?"3px solid #E84B2C":"3px solid transparent",
                transition:"all .15s",fontFamily:"inherit"}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Cuerpo 2 cols desktop / tabs móvil */}
        <div className="modal-detalle-body" style={{flex:1,overflow:"hidden",display:"grid",minHeight:0}}>
          {/* Izquierda — oculta en móvil si tab=subtareas */}
          <div className={`modal-detalle-left${tabMovil==="subtareas"?" modal-hidden-movil":""}`}
            style={{borderRight:"1px solid #E2E8F0",overflow:"auto",background:"#fff",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"10px 14px",background:"#F8FAFC",borderBottom:"1px solid #F1F5F9",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:10,color:tipoCfg.color,fontWeight:800,letterSpacing:.6}}>📋 INFORMACIÓN DE LA SOLICITUD</div>
              {esDirector&&(
                <button onClick={()=>{setEditDatos({...sol.datos});setEditingSol(p=>!p);}}
                  style={{fontSize:9,padding:"3px 9px",borderRadius:6,border:`1px solid ${editingSol?"#E84B2C":"#E2E8F0"}`,background:editingSol?"#FEF3F0":"#fff",color:editingSol?"#E84B2C":"#64748B",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>
                  {editingSol?"✕ Cancelar":"✏️ Editar"}
                </button>
              )}
            </div>
            {editingSol&&esDirector&&(
              <div style={{padding:"10px 14px",background:"#FFFBF0",borderBottom:"1px solid #FDE68A",display:"flex",flexDirection:"column",gap:8}}>
                {Object.entries(editDatos).map(([k,v])=>(
                  <div key={k}>
                    <div style={{fontSize:9,color:"#94A3B8",fontWeight:700,letterSpacing:.5,marginBottom:2}}>{k.toUpperCase().replace(/_/g," ")}</div>
                    {(k==="descripcion"||k==="objetivo"||k==="texto")?
                      <textarea value={v||""} onChange={e=>setEditDatos(p=>({...p,[k]:e.target.value}))}
                        style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #E2E8F0",fontSize:11,fontFamily:"inherit",resize:"vertical",minHeight:56,outline:"none"}}/>
                      :<input value={v||""} onChange={e=>setEditDatos(p=>({...p,[k]:e.target.value}))}
                        style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #E2E8F0",fontSize:11,fontFamily:"inherit",outline:"none"}}/>
                    }
                  </div>
                ))}
                <button onClick={()=>{onUpdSol(sol.id,{datos:editDatos});setEditingSol(false);notify("Solicitud actualizada ✓");}}
                  style={{padding:"7px 14px",borderRadius:8,background:"linear-gradient(135deg,#3BAD6E,#27AE60)",color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  💾 Guardar cambios
                </button>
              </div>
            )}
            <div style={{flex:1,overflow:"auto"}}>
              {/* Info básica siempre visible */}
              {[["Solicitante",sol.solicitante],["Área",sol.area_solicitante],["Proyecto",sol.proyecto],["Email",sol.email]].filter(([,v])=>v).map(([label,val])=>(
                <div key={label} style={{padding:"8px 14px",borderBottom:"1px solid #F8FAFC"}}>
                  <div style={{fontSize:9,color:"#94A3B8",fontWeight:700,letterSpacing:.8,marginBottom:2}}>{label}</div>
                  <div style={{fontSize:11,color:"#1E293B"}}>{val}</div>
                </div>
              ))}
              {campos.length===0&&(
                <div style={{padding:"16px 14px",color:"#CBD5E1",fontSize:11,fontStyle:"italic"}}>Sin detalles adicionales registrados.</div>
              )}
              {campos.map(([label,val])=>{
                const isLink=val&&val.startsWith("http");
                return(
                  <div key={label} onClick={!isLink?()=>{navigator.clipboard?.writeText(val||"");notify("Copiado ✓");}:undefined}
                    style={{padding:"8px 14px",borderBottom:"1px solid #F8FAFC",cursor:isLink?"default":"copy"}}
                    onMouseEnter={e=>{if(!isLink)e.currentTarget.style.background="#FFFBF9";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
                    <div style={{fontSize:9,color:"#94A3B8",fontWeight:700,letterSpacing:.8,marginBottom:2,display:"flex",justifyContent:"space-between"}}>
                      <span>{label}</span>{!isLink&&<span style={{color:"#E2E8F0",fontSize:8}}>copiar</span>}
                    </div>
                    {isLink
                      ?<a href={val} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#E84B2C",fontWeight:600,textDecoration:"underline",wordBreak:"break-all"}}>{val}</a>
                      :<div style={{fontSize:11,color:"#1E293B",lineHeight:1.5,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{val}</div>}
                  </div>
                );
              })}
            </div>

            {/* Timeline solicitud — solo Director */}
            {esDirector&&(
              <div style={{flexShrink:0,borderTop:"2px solid #F1F5F9",padding:"12px 14px"}}>
                <TimelineCard sol={sol}/>
              </div>
            )}

            {/* Notas */}
            <div style={{flexShrink:0,borderTop:"2px solid #F1F5F9",padding:"12px 14px"}}>
              <div style={{fontSize:10,color:"#2B3A5C",fontWeight:700,letterSpacing:.5,marginBottom:7}}>🗒️ NOTAS ({sol.notas.length})</div>
              <div style={{maxHeight:110,overflow:"auto",display:"flex",flexDirection:"column",gap:5,marginBottom:8}}>
                {sol.notas.map(n=>(
                  <div key={n.id} style={{padding:"7px 9px",background:"#F8FAFC",borderRadius:7,border:"1px solid #E2E8F0"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontSize:9,fontWeight:700,color:"#E84B2C"}}>{n.autor}</span>
                      <span style={{fontSize:9,color:"#94A3B8"}}>{n.ts}</span>
                    </div>
                    <p style={{fontSize:11,color:"#374151",lineHeight:1.4}}>{n.texto}</p>
                  </div>
                ))}
                {!sol.notas.length&&<p style={{fontSize:11,color:"#94A3B8",fontStyle:"italic",textAlign:"center",padding:"4px 0"}}>Sin notas aún</p>}
              </div>
              <div style={{display:"flex",gap:6}}>
                <input value={nota} onChange={e=>setNota(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addNota()} placeholder="Agregar nota..." style={{flex:1,padding:"7px 10px",borderRadius:7,border:"1px solid #E2E8F0",background:"#F8FAFC",fontSize:11,outline:"none",fontFamily:"inherit"}}/>
                <button onClick={addNota} style={{padding:"7px 12px",borderRadius:7,background:"#2B3A5C",color:"#fff",fontSize:13,fontWeight:700,border:"none",cursor:"pointer"}}>+</button>
              </div>
            </div>
          </div>

          {/* Derecha: subtareas — oculta en móvil si tab=info */}
          <div className={`modal-detalle-right${tabMovil==="info"?" modal-hidden-movil":""}`}
            style={{display:"flex",flexDirection:"column",overflow:"hidden",height:"100%"}}>
            <div style={{padding:"10px 14px",borderBottom:"1px solid #E2E8F0",background:"#fff",display:"flex",flexDirection:"column",gap:8,flexShrink:0}}>
              {/* Fila superior: label + botón agregar */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                <span style={{fontSize:10,fontWeight:800,color:"#2B3A5C",letterSpacing:.4}}>SUBTAREAS</span>
                {esDirector&&(
                  <button onClick={()=>setShowAgregarST(true)}
                    style={{padding:"5px 13px",borderRadius:7,background:"linear-gradient(135deg,#2B3A5C,#1a2540)",color:"#fff",border:"none",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>
                    ➕ Agregar subtarea
                  </button>
                )}
              </div>
              {/* Dropdown móvil */}
              <select className="area-filter-select"
                value={filtroArea} onChange={e=>setFiltroArea(e.target.value)}
                style={{display:"none",width:"100%",padding:"8px 12px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:12,fontWeight:600,color:"#2B3A5C",background:"#F8FAFC",fontFamily:"inherit",cursor:"pointer",outline:"none"}}>
                {areas.map(a=>{
                  const isDir=a==="Dirección";
                  const tot=a==="Todas"?totalST:isDir?stParaRevision.length:sol.subtareas.filter(s=>(s.area||"Sin área")===a).length;
                  const ap=a==="Todas"?aprobST:isDir?sol.subtareas.filter(s=>stParaRevision.includes(s)&&(s.estado==="Aprobada"||s.estado==="Publicada")).length:sol.subtareas.filter(s=>(s.area||"Sin área")===a&&(s.estado==="Aprobada"||s.estado==="Publicada")).length;
                  return <option key={a} value={a}>{a==="Todas"?"Todas":isDir?"🎯 Dirección":ac(a).icon+" "+a} ({ap}/{tot})</option>;
                })}
              </select>
              {/* Botones desktop */}
              <div className="area-filter-btns" style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                {areas.map(a=>{
                  const isDir=a==="Dirección";
                  const cfg=a==="Todas"?{color:"#2B3A5C",bg:"#EEF2FF",border:"#C7D2FE"}:isDir?{color:"#E84B2C",bg:"#FEF3F0",border:"#F9C4B8"}:ac(a);
                  const tot=a==="Todas"?totalST:isDir?stParaRevision.length:sol.subtareas.filter(s=>(s.area||"Sin área")===a).length;
                  const ap=a==="Todas"?aprobST:isDir?sol.subtareas.filter(s=>stParaRevision.includes(s)&&(s.estado==="Aprobada"||s.estado==="Publicada")).length:sol.subtareas.filter(s=>(s.area||"Sin área")===a&&(s.estado==="Aprobada"||s.estado==="Publicada")).length;
                  const revCount=isDir?stParaRevision.filter(s=>s.estado==="En Revisión").length:0;
                  return(
                    <button key={a} onClick={()=>setFiltroArea(a)}
                      style={{padding:"4px 11px",borderRadius:6,border:`1.5px solid ${filtroArea===a?cfg.color:"#E2E8F0"}`,background:filtroArea===a?cfg.bg:"#fff",color:filtroArea===a?cfg.color:"#64748B",fontSize:11,fontWeight:filtroArea===a?700:400,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4,position:"relative"}}>
                      {a==="Todas"?"Todas":isDir?<>🎯 Dirección</>:<>{ac(a).icon} {a}</>}
                      <span style={{fontSize:9,opacity:.7}}>{ap}/{tot}</span>
                      {isDir&&revCount>0&&<span style={{position:"absolute",top:-4,right:-4,width:14,height:14,borderRadius:"50%",background:"#E84B2C",color:"#fff",fontSize:8,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{revCount}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"14px 16px",scrollbarWidth:"thin",scrollbarColor:"#CBD5E1 #F1F5F9"}}>
              {filtroArea==="Dirección"&&stParaRevision.length>0&&(
                <div style={{padding:"8px 12px",background:"#FEF3F0",border:"1px solid #F9C4B8",borderRadius:8,fontSize:11,color:"#C0392B",fontWeight:600,marginBottom:4}}>
                  🎯 {stParaRevision.filter(s=>s.estado==="En Revisión").length} subtarea{stParaRevision.filter(s=>s.estado==="En Revisión").length!==1?"s":""} esperando aprobación
                </div>
              )}
              {stFiltradas.length===0&&(
                <div style={{textAlign:"center",padding:"40px 20px",color:"#94A3B8",fontSize:12}}>
                  {filtroArea==="Dirección"?"No hay entregas pendientes de aprobación aún.":"No hay subtareas para esta área aún."}
                  {esDirector&&filtroArea!=="Dirección"&&<div style={{marginTop:8,color:"#CBD5E1",fontSize:11}}>Usa "➕ Agregar subtarea" para crear una.</div>}
                </div>
              )}
              <div className="st-grid">
                {stFiltradas.map(st=>(
                  <TareaCard key={st.id} st={st} sol={sol} usuario={usuario} equipo={equipo} onUpd={updST} onDelete={esDirector?()=>setConfirmElimST(st.id):null} notify={notify}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DEADLINE EDITOR (solo Director) ─────────────────────────────────────────
function DeadlineEditor({deadline,onChange}){
  const [edit,setEdit]=useState(false);
  if(edit) return(
    <input type="date" autoFocus value={deadline||""} onChange={e=>onChange(e.target.value)} onBlur={()=>setEdit(false)}
      style={{padding:"4px 8px",borderRadius:6,border:"1px solid #3BAD6E",fontSize:11,outline:"none",fontFamily:"inherit",background:"#F0FDF4"}}/>
  );
  return(
    <button onClick={()=>setEdit(true)}
      style={{padding:"3px 8px",borderRadius:5,background:deadline?"#F0FDF4":"#FEF2F2",border:`1px solid ${deadline?"#A7F3D0":"#FECACA"}`,fontSize:10,color:deadline?"#2D8A57":"#E84B2C",fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}>
      ✏️ {deadline||"Sin fecha"}
    </button>
  );
}

function tipoCfgColor(sol){ return (TIPO_CFG[sol.tipo]||TIPO_CFG["Otras Solicitudes"]).color; }

// ─── ASIGNEE FIELD ────────────────────────────────────────────────────────────
function AsigneeField({ st, equipo, esDirector, onUpd, sol }) {
  const [open, setOpen] = useState(false);
  const [notifEmail, setNotifEmail] = useState(null); // { miembro, tarea, solicitud }
  const asignado = st.asignadoId ? equipo.find(m=>m.id===st.asignadoId) : null;
  // Same-area members first, then others — all active members are available
  const mismaArea = equipo.filter(m=>m.activo && m.area===st.area);
  const otrasAreas = equipo.filter(m=>m.activo && m.area!==st.area);
  const disponibles = mismaArea;
  const apoyo = otrasAreas;

  const asignar = (miembro) => {
    onUpd(st.id, {
      asignadoId: miembro ? miembro.id : null,
      historial: hEvent(st, "estado", "Director", miembro ? `Asignado a ${miembro.nombre}` : "Asignación removida"),
    });
    setOpen(false);
    // Mostrar notificación de correo si el miembro tiene email
    if (miembro && miembro.email) {
      setNotifEmail({ miembro, tarea: st.tipo, solicitud: sol?.datos?.titulo || sol?.tipo || "Solicitud" });
    }
  };

  if (!esDirector) {
    // Equipo: solo ve si hay alguien asignado
    if (!asignado) return null;
    return (
      <div style={{display:"flex",alignItems:"center",gap:7,padding:"7px 10px",background:"#F8FAFC",borderRadius:8,border:"1px solid #E2E8F0"}}>
        <div style={{width:24,height:24,borderRadius:"50%",background:`linear-gradient(135deg,${asignado.color},${asignado.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff",flexShrink:0}}>{asignado.avatar}</div>
        <div>
          <div style={{fontSize:10,color:"#94A3B8",fontWeight:700,letterSpacing:.5}}>RESPONSABLE</div>
          <div style={{fontSize:12,fontWeight:700,color:"#374151"}}>{asignado.nombre} <span style={{fontWeight:400,color:"#94A3B8"}}>· {asignado.rol}</span></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{position:"relative"}}>
      {/* ── Email notification modal ── */}
      {notifEmail&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.5)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center"}}
          onClick={()=>setNotifEmail(null)}>
          <div onClick={e=>e.stopPropagation()}
            style={{background:"#fff",borderRadius:18,padding:"0",width:"min(440px,92vw)",boxShadow:"0 24px 60px rgba(0,0,0,.25)",overflow:"hidden"}}>
            {/* Header */}
            <div style={{background:"linear-gradient(135deg,#2B3A5C,#1a2540)",padding:"18px 22px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg,${notifEmail.miembro.color},${notifEmail.miembro.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"#fff",flexShrink:0}}>
                {notifEmail.miembro.avatar}
              </div>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:"#fff",fontFamily:"Outfit,sans-serif"}}>Notificación lista para enviar</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:2}}>Copia el correo y envíala manualmente o conecta tu servidor</div>
              </div>
            </div>
            {/* Body */}
            <div style={{padding:"20px 22px",display:"flex",flexDirection:"column",gap:14}}>
              {/* Destinatario */}
              <div style={{background:"#F0FDF4",border:"1.5px solid #6EE7B7",borderRadius:12,padding:"12px 16px"}}>
                <div style={{fontSize:9,fontWeight:800,color:"#059669",letterSpacing:.6,marginBottom:6}}>DESTINATARIO</div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${notifEmail.miembro.color},${notifEmail.miembro.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff"}}>
                    {notifEmail.miembro.avatar}
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"#0F172A"}}>{notifEmail.miembro.nombre}</div>
                    <div style={{fontSize:11,color:"#64748B"}}>{notifEmail.miembro.rol}</div>
                  </div>
                </div>
                {/* Email copyable */}
                <div style={{marginTop:10,display:"flex",alignItems:"center",gap:8,background:"#fff",border:"1px solid #D1FAE5",borderRadius:8,padding:"8px 12px"}}>
                  <span style={{fontSize:13}}>✉️</span>
                  <span style={{fontSize:12,fontWeight:600,color:"#0F172A",flex:1,wordBreak:"break-all"}}>{notifEmail.miembro.email}</span>
                  <button onClick={()=>{navigator.clipboard?.writeText(notifEmail.miembro.email);}}
                    style={{flexShrink:0,padding:"3px 9px",borderRadius:6,border:"1px solid #6EE7B7",background:"#ECFDF5",color:"#059669",fontSize:10,fontWeight:700,cursor:"pointer"}}>
                    Copiar
                  </button>
                </div>
              </div>
              {/* Vista previa del correo */}
              <div style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:12,padding:"14px 16px"}}>
                <div style={{fontSize:9,fontWeight:800,color:"#64748B",letterSpacing:.6,marginBottom:10}}>VISTA PREVIA DEL MENSAJE</div>
                <div style={{fontSize:12,color:"#374151",lineHeight:1.7}}>
                  <p style={{margin:"0 0 8px",fontWeight:700,color:"#2B3A5C"}}>Asunto: Nueva tarea asignada — {notifEmail.tarea}</p>
                  <p style={{margin:"0 0 6px"}}>Hola <strong>{notifEmail.miembro.nombre.split(" ")[0]}</strong>,</p>
                  <p style={{margin:"0 0 6px"}}>Se te ha asignado la tarea <strong>"{notifEmail.tarea}"</strong> correspondiente a la solicitud <em>"{notifEmail.solicitud}"</em>.</p>
                  <p style={{margin:"0 0 6px"}}>Ingresa a la plataforma para ver los detalles, deadline y entrega.</p>
                  <p style={{margin:0,color:"#94A3B8",fontSize:11}}>— Equipo Casta Latina Network</p>
                </div>
              </div>
              {/* Nota */}
              <div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 14px",background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10}}>
                <span style={{fontSize:16,flexShrink:0}}>💡</span>
                <p style={{margin:0,fontSize:11,color:"#92400E",lineHeight:1.5}}>Para envíos automáticos, conecta esta plataforma con <strong>Resend</strong>, <strong>SendGrid</strong> o <strong>Zapier</strong> usando el correo de la persona.</p>
              </div>
            </div>
            {/* Footer */}
            <div style={{padding:"12px 22px",borderTop:"1px solid #F1F5F9",display:"flex",gap:8,justifyContent:"flex-end"}}>
              <a href={`mailto:${notifEmail.miembro.email}?subject=Nueva tarea asignada — ${encodeURIComponent(notifEmail.tarea)}&body=Hola ${encodeURIComponent(notifEmail.miembro.nombre.split(" ")[0])},%0A%0ASe te ha asignado la tarea "${encodeURIComponent(notifEmail.tarea)}" de la solicitud "${encodeURIComponent(notifEmail.solicitud)}".%0A%0AIngresa a la plataforma para ver los detalles.%0A%0A— Equipo Casta Latina Network`}
                style={{padding:"9px 18px",borderRadius:9,background:"linear-gradient(135deg,#2B3A5C,#1a2540)",color:"#fff",fontSize:12,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>
                ✉️ Abrir en correo
              </a>
              <button onClick={()=>setNotifEmail(null)}
                style={{padding:"9px 18px",borderRadius:9,border:"1px solid #E2E8F0",background:"#fff",color:"#64748B",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",alignItems:"center",gap:7,padding:"7px 10px",background:"#F8FAFC",borderRadius:8,border:`1px solid ${asignado?"#C7D2FE":"#E2E8F0"}`,cursor:"pointer"}} onClick={()=>setOpen(p=>!p)}>
        {asignado
          ? <div style={{width:24,height:24,borderRadius:"50%",background:`linear-gradient(135deg,${asignado.color},${asignado.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff",flexShrink:0}}>{asignado.avatar}</div>
          : <div style={{width:24,height:24,borderRadius:"50%",background:"#F1F5F9",border:"1.5px dashed #CBD5E1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>👤</div>
        }
        <div style={{flex:1}}>
          <div style={{fontSize:10,color:"#94A3B8",fontWeight:700,letterSpacing:.5}}>RESPONSABLE</div>
          <div style={{fontSize:12,fontWeight:700,color:asignado?"#374151":"#CBD5E1"}}>{asignado?`${asignado.nombre} · ${asignado.rol}`:"Sin asignar — click para asignar"}</div>
        </div>
        <span style={{fontSize:11,color:"#CBD5E1"}}>{open?"▴":"▾"}</span>
      </div>

      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:50,background:"#fff",borderRadius:10,border:"1px solid #E2E8F0",boxShadow:"0 8px 24px rgba(0,0,0,.12)",overflow:"auto",maxHeight:220}}>
          {/* Sin asignar option */}
          <div onClick={()=>asignar(null)} style={{padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid #F1F5F9",background:!asignado?"#F0FDF4":"#fff"}}
            onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"}
            onMouseLeave={e=>e.currentTarget.style.background=!asignado?"#F0FDF4":"#fff"}>
            <div style={{width:24,height:24,borderRadius:"50%",background:"#F1F5F9",border:"1.5px dashed #CBD5E1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>−</div>
            <span style={{fontSize:12,color:"#94A3B8",fontStyle:"italic"}}>Sin asignar</span>
          </div>
          {/* Miembros del área */}
          {disponibles.length>0&&(
            <div style={{padding:"5px 12px 3px",fontSize:9,fontWeight:800,color:(AREA_CFG[st.area]||{color:"#94A3B8"}).color,letterSpacing:.5,background:"#FAFAFA",borderBottom:"1px solid #F1F5F9"}}>
              {(AREA_CFG[st.area]||{icon:"👤"}).icon} {st.area||"Área"} — Equipo principal
            </div>
          )}
          {disponibles.length===0&&(
            <div style={{padding:"8px 12px",fontSize:11,color:"#94A3B8",textAlign:"center",fontStyle:"italic",borderBottom:"1px solid #F1F5F9"}}>Sin miembros activos en {st.area||"esta área"}</div>
          )}
          {disponibles.map(m=>(
            <div key={m.id} onClick={()=>asignar(m)}
              style={{padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,background:asignado?.id===m.id?"#EEF2FF":"#fff",borderBottom:"1px solid #F8FAFC",transition:"background .1s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"}
              onMouseLeave={e=>e.currentTarget.style.background=asignado?.id===m.id?"#EEF2FF":"#fff"}>
              <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${m.color},${m.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#fff",flexShrink:0}}>{m.avatar}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:"#374151"}}>{m.nombre}</div>
                <div style={{fontSize:10,color:"#94A3B8"}}>{m.rol} · {m.area}</div>
              </div>
              {asignado?.id===m.id&&<span style={{fontSize:11,color:"#3B82F6",fontWeight:700}}>✓</span>}
            </div>
          ))}
          {/* Apoyo de otras áreas */}
          {apoyo.length>0&&(
            <div style={{padding:"5px 12px 3px",fontSize:9,fontWeight:800,color:"#64748B",letterSpacing:.5,background:"#FAFAFA",borderBottom:"1px solid #F1F5F9",borderTop:"2px solid #F1F5F9"}}>
              👥 Apoyo de otras áreas
            </div>
          )}
          {apoyo.map(m=>(
            <div key={m.id} onClick={()=>asignar(m)}
              style={{padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,background:asignado?.id===m.id?"#EEF2FF":"#fff",borderBottom:"1px solid #F8FAFC",transition:"background .1s",opacity:.85}}
              onMouseEnter={e=>{e.currentTarget.style.background="#F8FAFC";e.currentTarget.style.opacity="1";}}
              onMouseLeave={e=>{e.currentTarget.style.background=asignado?.id===m.id?"#EEF2FF":"#fff";e.currentTarget.style.opacity=".85";}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${m.color},${m.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#fff",flexShrink:0}}>{m.avatar}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:"#374151"}}>{m.nombre}</div>
                <div style={{fontSize:10,color:"#94A3B8"}}>{m.rol} · <span style={{color:(AREA_CFG[m.area]||{color:"#94A3B8"}).color,fontWeight:600}}>{m.area}</span></div>
              </div>
              {asignado?.id===m.id&&<span style={{fontSize:11,color:"#3B82F6",fontWeight:700}}>✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TAREA CARD ───────────────────────────────────────────────────────────────
function TareaCard({st,sol,usuario,equipo=[],onUpd,onDelete,notify}){
  const [open,setOpen]=useState(true);
  const [url,setUrl]=useState(st.entregaUrl||"");
  const [comentarioEntrega,setComentarioEntrega]=useState("");
  const [comentario,setComentario]=useState("");
  const [loading,setLoading]=useState(false);
  const [editingCard,setEditingCard]=useState(false);
  const [editST,setEditST]=useState({tipo:st.tipo,area:st.area||"Diseño",deadline:st.deadline||"",esRedes:st.esRedes||false,esData:st.esData||false});

  const cfg=ac(st.area||"");
  const est=ec(st.estado);
  const esEquipo=usuario.rol==="equipo"&&usuario.area===st.area;
  const esDirector=usuario.rol==="director";

  // ── Equipo entrega trabajo
  const enviar=()=>{
    if(!url.trim()){notify("Pega el link primero","err");return;}
    setLoading(true);
    setTimeout(()=>{
      const ts=nowTs();
      const isReenvio=(st.historial||[]).some(h=>h.tipo==="enviada");
      onUpd(st.id,{
        entregaUrl:url, estado:"En Revisión",
        comentarioEntrega: comentarioEntrega.trim()||null,
        ts_enviado:ts,
        historial:hEvent(st, isReenvio?"reenviada":"enviada", usuario.rol==="director"?"Director":usuario.area, url+(comentarioEntrega.trim()?" · "+comentarioEntrega.trim():"")),
      });
      setLoading(false);setComentarioEntrega("");notify("✅ Enviado al Director");
    },600);
  };

  // ── Director aprueba
  const aprobar=()=>{
    const ts=nowTs();
    onUpd(st.id,{
      aprobado:true, estado:"Aprobada", comentario:comentario||null, ts_aprobado:ts,
      historial:hEvent(st,"aprobada","Director",comentario||null),
    });
    notify("✅ Subtarea aprobada");setComentario("");
  };

  // ── Director solicita cambios (ciclo vuelve al equipo con estado "Cambios Solicitados")
  const solicitarCambios=()=>{
    if(!comentario.trim()){notify("Escribe los cambios requeridos","warn");return;}
    const ts=nowTs();
    onUpd(st.id,{
      aprobado:false, estado:"Cambios Solicitados", comentario, ts_cambios:ts, ts_rechazado:null,
      historial:hEvent(st,"cambios","Director",comentario),
    });
    notify("⚠️ Cambios solicitados — vuelve al equipo","warn");setComentario("");
  };

  // ── Director rechaza definitivamente
  const rechazar=()=>{
    if(!comentario.trim()){notify("Escribe el motivo del rechazo","warn");return;}
    const ts=nowTs();
    onUpd(st.id,{
      aprobado:false, estado:"Rechazada", comentario, ts_rechazado:ts, ts_cambios:null,
      historial:hEvent(st,"rechazada","Director",comentario),
    });
    notify("Rechazada definitivamente","warn");setComentario("");
  };

  // ── Director cambia estado manualmente
  const cambiarEstado=e=>{
    onUpd(st.id,{
      estado:e,
      historial:hEvent(st,"estado","Director",`Cambio manual a "${e}"`),
    });
    notify(`→ ${e}`);
  };

  // ── Redes confirma publicación
  // ── Data entrega reporte post-webinar
  const [reporte,setReporte]=useState(()=>st.reporte||{});
  const enviarReporte=()=>{
    const alguno=Object.values(reporte).some(v=>v&&String(v).trim());
    if(!alguno){notify("Completa al menos un campo del reporte","warn");return;}
    setLoading(true);
    setTimeout(()=>{
      const ts=nowTs();
      onUpd(st.id,{
        reporte,entregaUrl:reporte.link||"[Reporte interno]",
        estado:"En Revisión",ts_enviado:ts,
        historial:hEvent(st,"enviada",usuario.area||"Data","Reporte Post-Webinar enviado"),
      });
      setLoading(false);notify("📊 Reporte enviado al Director");
    },500);
  };

  // ── Redes confirma publicación
  const PLATAFORMAS = [
    { id:"instagram", label:"Instagram", color:"#E1306C",
      svg:<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
    { id:"facebook",  label:"Facebook",  color:"#1877F2",
      svg:<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
    { id:"linkedin",  label:"LinkedIn",  color:"#0A66C2",
      svg:<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
    { id:"tiktok",    label:"TikTok",    color:"#010101",
      svg:<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
    { id:"youtube",   label:"YouTube",   color:"#FF0000",
      svg:<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg> },
    { id:"x",         label:"X",         color:"#000000",
      svg:<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  ];
  const [platsSelec, setPlatsSelec] = useState([]);
  const [linkCalendario, setLinkCalendario] = useState("");
  const togglePlat = (id) => setPlatsSelec(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);

  const confirmarPublicacion=()=>{
    if(platsSelec.length===0){notify("Selecciona al menos una plataforma","warn");return;}
    setLoading(true);
    setTimeout(()=>{
      const ts=nowTs();
      onUpd(st.id,{
        estado:"Publicada", ts_publicado:ts,
        aprobado:true,
        plataformas: platsSelec,
        linkCalendario: linkCalendario.trim()||null,
        historial:hEvent(st,"publicada",usuario.nombre,`Publicado en: ${platsSelec.join(", ")}${linkCalendario?" · "+linkCalendario:""}`),
      });
      setLoading(false);
      notify("📲 ¡Publicación registrada!");
      setPlatsSelec([]);setLinkCalendario("");
    },500);
  };

  const driveLink=sol.datos.carpeta;

  // Bloques de revisión del director — panel diferenciado para "Cambios" vs "Rechazar"
  const panelRevisionJSX=()=>(
    <div style={{background:"linear-gradient(135deg,#2B3A5C,#1a2540)",borderRadius:10,padding:"12px"}}>
      <div style={{fontSize:9,color:"rgba(255,255,255,.6)",fontWeight:700,letterSpacing:.6,marginBottom:4}}>🔔 ENTREGA DE {st.area?.toUpperCase()}</div>
      {st.ts_enviado&&<div style={{fontSize:9,color:"rgba(255,255,255,.4)",marginBottom:6}}>Enviada el {fmtTs(st.ts_enviado)}</div>}
      <a href={st.entregaUrl} target="_blank" rel="noreferrer" style={{fontSize:12,color:"#F5C842",fontWeight:700,textDecoration:"underline",wordBreak:"break-all",display:"block",marginBottom:8}}>{st.entregaUrl}</a>
      <textarea value={comentario} onChange={e=>setComentario(e.target.value)} placeholder="Comentario / cambios requeridos..."
        style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.1)",fontSize:11,resize:"none",height:56,color:"#fff",outline:"none",fontFamily:"inherit",marginBottom:8}}/>

      {/* 3 opciones: Aprobar / Solicitar Cambios / Rechazar */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
        <button onClick={aprobar}
          style={{padding:"8px 5px",borderRadius:8,background:"linear-gradient(135deg,#3BAD6E,#27AE60)",color:"#fff",fontSize:11,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
          ✅ Aprobar
        </button>
        <button onClick={solicitarCambios}
          style={{padding:"8px 5px",borderRadius:8,background:"linear-gradient(135deg,#F5A623,#D4881E)",color:"#fff",fontSize:11,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
          ⚠️ Cambios
        </button>
        <button onClick={rechazar}
          style={{padding:"8px 5px",borderRadius:8,background:"linear-gradient(135deg,#E84B2C,#C0392B)",color:"#fff",fontSize:11,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
          ❌ Rechazar
        </button>
      </div>
      <div style={{fontSize:9,color:"rgba(255,255,255,.35)",marginTop:5,textAlign:"center"}}>
        "Cambios" devuelve al equipo para retrabajar · "Rechazar" cierra definitivamente
      </div>
    </div>
  );

  // ── Panel de revisión para reportes Data
  const panelRevisionDataJSX=()=>{
    const r=st.reporte||{};
    const campos=[
      {k:"inscritos",label:"👥 Inscritos"},{k:"asistentes",label:"✅ Asistentes"},
      {k:"duracion",label:"⏱ Duración"},{k:"correos_enviados",label:"📧 Correos"},
      {k:"tasa_apertura",label:"📬 Apertura"},{k:"tasa_clics",label:"🔗 Clics"},
      {k:"calificacion",label:"⭐ Calificación"},{k:"preguntas",label:"❓ Preguntas"},
    ];
    return(
      <div style={{background:"linear-gradient(135deg,#0F172A,#1e2e45)",borderRadius:10,padding:"12px"}}>
        <div style={{fontSize:9,color:"rgba(14,165,233,.8)",fontWeight:800,letterSpacing:.6,marginBottom:8}}>📊 REPORTE POST-WEBINAR — REVISIÓN</div>
        {st.ts_enviado&&<div style={{fontSize:9,color:"rgba(255,255,255,.35)",marginBottom:8}}>Enviado el {fmtTs(st.ts_enviado)}</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
          {campos.filter(c=>r[c.k]).map(c=>(
            <div key={c.k} style={{background:"rgba(255,255,255,.07)",borderRadius:6,padding:"6px 8px"}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,.4)",marginBottom:2}}>{c.label}</div>
              <div style={{fontSize:13,fontWeight:700,color:"#7DD3FC"}}>{r[c.k]}</div>
            </div>
          ))}
        </div>
        {r.comentarios&&(
          <div style={{background:"rgba(255,255,255,.05)",borderRadius:6,padding:"7px 9px",marginBottom:8}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,.4)",marginBottom:3}}>💬 Comentarios e interacciones</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.7)",lineHeight:1.5}}>{r.comentarios}</div>
          </div>
        )}
        {r.link&&<a href={r.link} target="_blank" rel="noreferrer" style={{display:"block",fontSize:11,color:"#7DD3FC",fontWeight:700,textDecoration:"underline",wordBreak:"break-all",marginBottom:8}}>{r.link}</a>}
        <textarea value={comentario} onChange={e=>setComentario(e.target.value)} placeholder="Comentario para el equipo de Data..."
          style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.08)",fontSize:11,resize:"none",height:50,color:"#fff",outline:"none",fontFamily:"inherit",marginBottom:8}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
          <button onClick={aprobar} style={{padding:"8px 5px",borderRadius:8,background:"linear-gradient(135deg,#3BAD6E,#27AE60)",color:"#fff",fontSize:11,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit"}}>✅ Aprobar</button>
          <button onClick={solicitarCambios} style={{padding:"8px 5px",borderRadius:8,background:"linear-gradient(135deg,#F5A623,#D4881E)",color:"#fff",fontSize:11,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit"}}>⚠️ Cambios</button>
          <button onClick={rechazar} style={{padding:"8px 5px",borderRadius:8,background:"linear-gradient(135deg,#E84B2C,#C0392B)",color:"#fff",fontSize:11,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit"}}>❌ Rechazar</button>
        </div>
      </div>
    );
  };

  return(
    <div style={{background:"#fff",borderRadius:14,border:`1.5px solid ${open?cfg.color:"#E8ECF4"}`,overflow:"hidden",boxShadow:open?`0 6px 24px ${cfg.color}22`:"0 2px 6px rgba(15,23,42,.06)",transition:"all .18s",marginBottom:10}}>
      {/* Franja de color por área */}
      <div style={{height:3,background:`linear-gradient(90deg,${cfg.color},${cfg.color}44)`}}/>
      {/* Fila principal */}
      <div className="st-row" style={{display:"flex",alignItems:"stretch"}}>
        {/* Contenido clickeable */}
        <div onClick={()=>setOpen(p=>!p)} style={{flex:1,padding:"12px 14px",cursor:"pointer",minWidth:0}}>
          {/* Row 1: icono + nombre + chevron */}
          <div className="st-header-row" style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:8}}>
            <div style={{width:38,height:38,borderRadius:10,background:cfg.bg,border:`1.5px solid ${cfg.border||cfg.color+"33"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,marginTop:1}}>{cfg.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:"#0F172A",lineHeight:1.4,marginBottom:5,wordBreak:"break-word",whiteSpace:"normal"}}>{st.tipo}</div>
              {/* Badges row */}
              <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                <Badge color={cfg.color} bg={cfg.bg} border={cfg.border} sm>{st.area||"Sin área"}</Badge>
                {st.dep&&<Badge color="#E84B2C" bg="#FEF3F0" border="#F9C4B8" sm>⛓ Dep.</Badge>}
                {st.esRedes&&<Badge color="#9B59B6" bg="#F5F0FB" border="#D7BDE2" sm>📱 Redes</Badge>}
                {st.esData&&<Badge color="#0EA5E9" bg="#F0F9FF" border="#BAE6FD" sm>📊 Data</Badge>}
              </div>
            </div>
            <span style={{fontSize:11,color:"#CBD5E1",flexShrink:0,marginTop:2}}>{open?"▴":"▾"}</span>
          </div>
          {/* Row 2: estado + deadline + responsable */}
          <div className="st-meta-row" style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",paddingLeft:48}}>
            {/* Estado pill */}
            <div style={{display:"flex",alignItems:"center",gap:5,background:est.bg||"#F8FAFC",border:`1px solid ${est.color}33`,borderRadius:20,padding:"3px 10px"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:est.dot,flexShrink:0}}/>
              <span style={{fontSize:10,color:est.color,fontWeight:700,whiteSpace:"nowrap"}}>{st.estado}</span>
            </div>
            {/* Deadline */}
            <div onClick={e=>e.stopPropagation()} style={{flexShrink:0}}>
              {esDirector
                ? <DeadlineEditor deadline={st.deadline} onChange={dl=>onUpd(st.id,{deadline:dl})}/>
                : <div style={{fontSize:10,color:st.deadline?"#64748B":"#E84B2C",background:st.deadline?"#F8FAFC":"#FEF2F2",border:`1px solid ${st.deadline?"#E2E8F0":"#FECACA"}`,padding:"3px 9px",borderRadius:20,fontWeight:600,whiteSpace:"nowrap"}}>
                    🗓 {st.deadline||"Sin fecha"}
                  </div>
              }
            </div>
            {/* Responsable */}
            {st.asignadoId&&(()=>{const m=equipo.find(x=>x.id===st.asignadoId);return m?<div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:20,background:`${m.color}12`,border:`1px solid ${m.color}25`}}><div style={{width:15,height:15,borderRadius:"50%",background:`linear-gradient(135deg,${m.color},${m.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:800,color:"#fff"}}>{m.avatar}</div><span style={{fontSize:10,color:m.color,fontWeight:700}}>{m.nombre.split(" ")[0]}</span></div>:null;})()}
          </div>
        </div>
        {/* Expand button — only when collapsed */}
        {!open&&(
          <div onClick={()=>setOpen(true)} style={{padding:"6px 16px",borderTop:`1px solid ${cfg.color}22`,background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,color:cfg.color,fontSize:10,fontWeight:700,letterSpacing:.3}}>
            <span style={{fontSize:16,lineHeight:1}}>＋</span>
          </div>
        )}
        {esDirector&&(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,padding:"8px 8px",borderLeft:"1px solid #F1F5F9",flexShrink:0}}>
            <button onClick={e=>{e.stopPropagation();setEditingCard(p=>!p);setOpen(true);}}
              title="Editar subtarea"
              style={{width:32,height:32,borderRadius:8,background:"transparent",border:"none",color:"#94A3B8",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="#EEF2FF";e.currentTarget.style.color="#4338CA";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#94A3B8";}}>
              ✏️
            </button>
            {onDelete&&<button onClick={e=>{e.stopPropagation();onDelete();}}
              title="Eliminar subtarea"
              style={{width:32,height:32,borderRadius:8,background:"transparent",border:"none",color:"#94A3B8",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="#FEF2F2";e.currentTarget.style.color="#E84B2C";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#94A3B8";}}>
              🗑
            </button>}
          </div>
        )}
      </div>

      {/* Edit inline form */}
      {editingCard&&esDirector&&(
        <div style={{borderTop:"1px solid #EEF2FF",padding:"12px 14px",background:"#F8FAFF",display:"flex",flexDirection:"column",gap:8}}>
          <div style={{fontSize:9,color:"#4338CA",fontWeight:800,letterSpacing:.5}}>✏️ EDITAR SUBTAREA</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8}}>
            <div>
              <div style={{fontSize:9,color:"#64748B",fontWeight:700,marginBottom:2}}>NOMBRE</div>
              <input value={editST.tipo} onChange={e=>setEditST(p=>({...p,tipo:e.target.value}))}
                style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #C7D2FE",fontSize:11,fontFamily:"inherit",outline:"none",background:"#fff"}}/>
            </div>
            <div>
              <div style={{fontSize:9,color:"#64748B",fontWeight:700,marginBottom:2}}>ÁREA</div>
              <select value={editST.area} onChange={e=>setEditST(p=>({...p,area:e.target.value}))}
                style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #C7D2FE",fontSize:11,fontFamily:"inherit",outline:"none",background:"#fff"}}>
                {AREAS_PROD.map(a=><option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:9,color:"#64748B",fontWeight:700,marginBottom:2}}>DEADLINE</div>
              <input type="date" value={editST.deadline} onChange={e=>setEditST(p=>({...p,deadline:e.target.value}))}
                style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #C7D2FE",fontSize:11,fontFamily:"inherit",outline:"none",background:"#fff"}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
            <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:10,color:"#374151"}}>
              <input type="checkbox" checked={editST.esRedes} onChange={e=>setEditST(p=>({...p,esRedes:e.target.checked}))} style={{accentColor:"#9B59B6"}}/>📱 Redes
            </label>
            <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:10,color:"#374151"}}>
              <input type="checkbox" checked={editST.esData} onChange={e=>setEditST(p=>({...p,esData:e.target.checked}))} style={{accentColor:"#0EA5E9"}}/>📊 Data
            </label>
            <div style={{marginLeft:"auto",display:"flex",gap:6}}>
              <button onClick={()=>{
                onUpd(st.id,{tipo:editST.tipo,area:editST.area,deadline:editST.deadline,esRedes:editST.esRedes,esData:editST.esData,
                  historial:hEvent(st,"estado","Director",`Editada: "${editST.tipo}"`)});
                setEditingCard(false);notify("Subtarea actualizada ✓");
              }} style={{padding:"5px 14px",borderRadius:7,background:"linear-gradient(135deg,#3BAD6E,#27AE60)",color:"#fff",border:"none",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                💾 Guardar
              </button>
              <button onClick={()=>setEditingCard(false)}
                style={{padding:"5px 10px",borderRadius:7,background:"#F1F5F9",color:"#64748B",border:"none",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel expandido */}
      {open&&(
        <div style={{borderTop:"1px solid #F1F5F9",padding:"13px 14px",background:"#FAFAFA",display:"flex",flexDirection:"column",gap:10,maxHeight:560,overflowY:"auto",scrollbarWidth:"thin",scrollbarColor:"#CBD5E1 #F1F5F9"}}>

          {/* Historial cronológico */}
          <HistorialSubtarea st={st} esDirector={esDirector}/>

          {/* Responsable — Director puede asignar, equipo ve quién es */}
          <AsigneeField st={st} equipo={equipo} esDirector={esDirector} onUpd={onUpd} sol={sol}/>

          {/* Contexto */}
          <div style={{padding:"10px 12px",background:"#fff",borderRadius:9,border:"1px solid #E2E8F0"}}>
            <div style={{fontSize:9,color:tipoCfgColor(sol),fontWeight:800,letterSpacing:.6,marginBottom:5}}>📋 CONTEXTO — {sol.tipo.toUpperCase()}</div>
            {sol.datos.titulo&&<div style={{fontSize:11,color:"#374151",marginBottom:2}}><strong>Título:</strong> {sol.datos.titulo}</div>}
            {sol.datos.fecha&&<div style={{fontSize:11,color:"#374151",marginBottom:2}}><strong>Fecha:</strong> {sol.datos.fecha}</div>}
            {sol.datos.descripcion&&<div style={{fontSize:11,color:"#374151",lineHeight:1.5,marginBottom:2}}>{sol.datos.descripcion.substring(0,150)}{sol.datos.descripcion.length>150?"...":""}</div>}
            {st.depDesc&&<div style={{marginTop:4,padding:"4px 8px",background:"#FEF3F0",borderRadius:5,fontSize:10,color:"#E84B2C",fontWeight:600}}>⛓ {st.depDesc}</div>}
            {driveLink&&<a href={driveLink} target="_blank" rel="noreferrer" style={{display:"inline-block",marginTop:5,fontSize:11,color:"#E84B2C",fontWeight:700,textDecoration:"underline"}}>📁 Abrir carpeta Drive →</a>}
          </div>

          {/* Director: controles */}
          {esDirector&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div>
                <div style={{fontSize:9,color:"#94A3B8",fontWeight:700,letterSpacing:.6,marginBottom:5}}>CAMBIAR ESTADO MANUAL</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {Object.keys(ESTADO_CFG).filter(e=>e!==st.estado).map(e=>(
                    <button key={e} onClick={()=>cambiarEstado(e)} style={{padding:"4px 10px",borderRadius:6,background:ESTADO_CFG[e].bg,border:`1px solid ${ESTADO_CFG[e].dot}30`,color:ESTADO_CFG[e].color,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{e}</button>
                  ))}
                </div>
              </div>
              {st.estado==="En Revisión"&&st.entregaUrl&&(st.esData?panelRevisionDataJSX():panelRevisionJSX())}
              {st.aprobado===true&&<div style={{padding:"8px 12px",background:"#F0FDF4",border:"1px solid #A7F3D0",borderRadius:8,fontSize:11,fontWeight:700,color:"#3BAD6E"}}>
                ✅ Aprobada{st.comentario?` — "${st.comentario}"`:""}
                {st.ts_aprobado&&<span style={{fontWeight:400,color:"#94A3B8",marginLeft:6,fontSize:10}}>{fmtTs(st.ts_aprobado)}</span>}
              </div>}
              {st.estado==="Cambios Solicitados"&&<div style={{padding:"8px 12px",background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:8,fontSize:11,color:"#D97706"}}>
                <strong>⚠️ Cambios solicitados:</strong> "{st.comentario}"
                {st.ts_cambios&&<span style={{fontWeight:400,color:"#94A3B8",marginLeft:6,fontSize:10}}>{fmtTs(st.ts_cambios)}</span>}
              </div>}
              {st.aprobado===false&&st.estado==="Rechazada"&&st.comentario&&<div style={{padding:"8px 12px",background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:8,fontSize:11,color:"#E84B2C"}}>
                <strong>❌ Rechazada definitivamente:</strong> "{st.comentario}"
                {st.ts_rechazado&&<span style={{fontWeight:400,color:"#94A3B8",marginLeft:6,fontSize:10}}>{fmtTs(st.ts_rechazado)}</span>}
              </div>}
              {st.ts_publicado&&<div style={{padding:"8px 12px",background:"#F5F0FB",border:"1px solid #D7BDE2",borderRadius:8,fontSize:11,color:"#9B59B6",fontWeight:700}}>
                📱 Publicado el {fmtTs(st.ts_publicado)}
              </div>}
            </div>
          )}

          {/* Equipo */}
          {esEquipo&&(
            <>
              {/* Puede entregar si está en Pendiente, En Producción, Cambios Solicitados, o Rechazada */}
              {["Pendiente","En Producción","Cambios Solicitados","Rechazada"].includes(st.estado)&&(
                st.esRedes ? (
                  /* ── Redes: confirmar publicación directamente ── */
                  <div style={{background:"linear-gradient(135deg,#F5F0FB,#fff)",border:"1.5px solid #D7BDE2",borderRadius:10,padding:"14px",display:"flex",flexDirection:"column",gap:12}}>
                    {st.estado==="Cambios Solicitados"&&(
                      <div style={{padding:"7px 10px",background:"#FFFBEB",borderRadius:7,border:"1px solid #FDE68A",fontSize:11,color:"#D97706",fontWeight:600}}>
                        ⚠️ El Director solicitó cambios: "{st.comentario}"
                      </div>
                    )}
                    <div style={{fontSize:10,fontWeight:800,color:"#9B59B6",letterSpacing:.4}}>📱 ¿Dónde se publicó?</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {PLATAFORMAS.map(p=>{
                        const sel=platsSelec.includes(p.id);
                        return(
                          <button key={p.id} onClick={()=>togglePlat(p.id)}
                            style={{padding:"7px 12px",borderRadius:8,border:`2px solid ${sel?p.color:"#E2E8F0"}`,background:sel?p.color+"18":"#fff",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5,transition:"all .12s"}}>
                            <span style={{color:sel?p.color:"#94A3B8",display:"flex",alignItems:"center"}}>{p.svg}</span>
                            <span style={{fontSize:11,fontWeight:sel?700:400,color:sel?p.color:"#64748B"}}>{p.label}</span>
                            {sel&&<span style={{fontSize:10,fontWeight:800,color:p.color}}>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                    <div>
                      <div style={{fontSize:9,color:"#94A3B8",fontWeight:700,letterSpacing:.5,marginBottom:4}}>💬 COMENTARIO (opcional)</div>
                      <textarea value={linkCalendario} onChange={e=>setLinkCalendario(e.target.value)}
                        placeholder="Link del post, calendario de contenido, notas..."
                        rows={2}
                        style={{width:"100%",padding:"7px 10px",borderRadius:7,border:"1px solid #E2E8F0",fontSize:11,fontFamily:"inherit",outline:"none",background:"#FAFAFA",resize:"vertical",boxSizing:"border-box"}}/>
                    </div>
                    <button onClick={confirmarPublicacion} disabled={loading}
                      style={{padding:"9px",borderRadius:8,background:loading?"#C4B5FD":"linear-gradient(135deg,#9B59B6,#7D3C98)",color:"#fff",fontSize:12,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                      {loading?"⏳ Registrando...":"📲 Confirmar Publicación"}
                    </button>
                  </div>
                ) : (
                  /* ── Otras áreas: entregar link ── */
                  <div style={{background:"linear-gradient(135deg,#EFF6FF,#F8FAFF)",border:`1.5px solid ${st.estado==="Cambios Solicitados"?"#FDE68A":"#93C5FD"}`,borderRadius:10,padding:"12px",display:"flex",flexDirection:"column",gap:8}}>
                    {st.estado==="Cambios Solicitados"&&(
                      <div style={{padding:"7px 10px",background:"#FFFBEB",borderRadius:7,border:"1px solid #FDE68A",fontSize:11,color:"#D97706",fontWeight:600}}>
                        ⚠️ El Director solicitó cambios: "{st.comentario}"
                      </div>
                    )}
                    {/* Nota especial para Copy */}
                    {st.area==="Copy"&&(
                      <div style={{display:"flex",alignItems:"flex-start",gap:7,padding:"8px 10px",background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:8}}>
                        <span style={{fontSize:14,flexShrink:0}}>📅</span>
                        <p style={{margin:0,fontSize:10,color:"#C2410C",lineHeight:1.5,fontWeight:600}}>
                          Recuerda dejar el copy en el <strong>Calendario de Contenidos de Marketing</strong> antes de enviar al Director.
                        </p>
                      </div>
                    )}
                    <div style={{fontSize:9,color:"#4A90C4",fontWeight:700,letterSpacing:.6}}>📤 {st.estado==="Cambios Solicitados"?"ENTREGAR VERSIÓN CORREGIDA":"ENTREGAR TRABAJO"}</div>
                    {st.entregaUrl&&<div style={{fontSize:10,color:"#64748B"}}>Última entrega: <a href={st.entregaUrl} target="_blank" rel="noreferrer" style={{color:"#E84B2C"}}>{st.entregaUrl.substring(0,45)}...</a></div>}
                    <input value={url} onChange={e=>setUrl(e.target.value)} placeholder={st.estado==="Cambios Solicitados"?"Pega el link de la versión corregida...":"Pega el link de Drive, Figma, Frame.io..."}
                      style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${st.estado==="Cambios Solicitados"?"#FDE68A":"#BFDBFE"}`,background:"#fff",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
                    <div>
                      <div style={{fontSize:9,color:"#94A3B8",fontWeight:700,letterSpacing:.5,marginBottom:4}}>💬 COMENTARIO (opcional)</div>
                      <textarea value={comentarioEntrega} onChange={e=>setComentarioEntrega(e.target.value)}
                        placeholder="Notas para el Director, contexto, versión..."
                        rows={2}
                        style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid #BFDBFE",background:"#fff",fontSize:11,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
                    </div>
                    <button onClick={enviar} disabled={loading}
                      style={{width:"100%",padding:"9px",borderRadius:8,background:loading?"#93C5FD":st.estado==="Cambios Solicitados"?"linear-gradient(135deg,#F5A623,#D4881E)":"linear-gradient(135deg,#2B3A5C,#1a2540)",color:"#fff",fontSize:12,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                      {loading?"⏳ Enviando...":st.estado==="Cambios Solicitados"?"🔄 Enviar versión corregida":"🚀 Enviar al Director"}
                    </button>
                  </div>
                )
              )}
              {st.estado==="En Revisión"&&<div style={{padding:"10px",background:"#F5F3FF",border:"1px solid #C4B5FD",borderRadius:9,textAlign:"center",fontSize:12,color:"#7C3AED",fontWeight:600}}>⏳ Esperando revisión del Director</div>}
              {st.aprobado===true&&!st.esRedes&&<div style={{padding:"10px",background:"#F0FDF4",border:"1px solid #6EE7B7",borderRadius:9,textAlign:"center",fontSize:12,color:"#3BAD6E",fontWeight:700}}>🎉 ¡Aprobada!</div>}
              {st.aprobado===true&&st.esRedes&&usuario.area==="Redes"&&!st.ts_publicado&&(
                <div style={{background:"linear-gradient(135deg,#F5F0FB,#fff)",border:"1.5px solid #D7BDE2",borderRadius:10,padding:"14px",display:"flex",flexDirection:"column",gap:12}}>
                  <div style={{fontSize:12,fontWeight:800,color:"#9B59B6",letterSpacing:.3}}>📱 ¿Dónde se publicó?</div>
                  {/* Plataformas */}
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {PLATAFORMAS.map(p=>{
                      const sel = platsSelec.includes(p.id);
                      return(
                        <button key={p.id} onClick={()=>togglePlat(p.id)}
                          style={{padding:"7px 12px",borderRadius:8,border:`2px solid ${sel?p.color:"#E2E8F0"}`,background:sel?p.color+"18":"#fff",color:sel?p.color:"#94A3B8",fontSize:11,fontWeight:sel?700:500,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5,transition:"all .12s"}}>
                          <span style={{color:sel?p.color:"#94A3B8",display:"flex",alignItems:"center"}}>{p.svg}</span>
                          <span style={{color:sel?p.color:"#64748B"}}>{p.label}</span>
                          {sel&&<span style={{fontSize:10,fontWeight:800,color:p.color}}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  {/* Link calendario */}
                  <div>
                    <div style={{fontSize:9,color:"#94A3B8",fontWeight:700,letterSpacing:.5,marginBottom:4}}>📅 LINK EN CALENDARIO DE CONTENIDO (opcional)</div>
                    <input value={linkCalendario} onChange={e=>setLinkCalendario(e.target.value)}
                      placeholder="https://notion.so/... o link del post"
                      style={{width:"100%",padding:"7px 10px",borderRadius:7,border:"1px solid #E2E8F0",fontSize:11,fontFamily:"inherit",outline:"none",background:"#FAFAFA",boxSizing:"border-box"}}/>
                  </div>
                  <button onClick={confirmarPublicacion}
                    style={{padding:"9px",borderRadius:8,background:"linear-gradient(135deg,#9B59B6,#7D3C98)",color:"#fff",fontSize:12,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                    ✅ Confirmar Publicación
                  </button>
                </div>
              )}
              {st.estado==="Publicada"&&(
                <div style={{padding:"10px 12px",background:"#F5F0FB",border:"1px solid #D7BDE2",borderRadius:9,display:"flex",flexDirection:"column",gap:5}}>
                  <div style={{fontSize:11,color:"#9B59B6",fontWeight:700}}>📱 Publicada ✓ · {fmtTs(st.ts_publicado)}</div>
                  {st.plataformas?.length>0&&(
                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                      {st.plataformas.map(pid=>{const p=PLATAFORMAS.find(x=>x.id===pid);return p?(
                        <span key={pid} style={{padding:"3px 9px",borderRadius:5,background:p.color+"18",border:`1px solid ${p.color}44`,fontSize:10,fontWeight:700,color:p.color,display:"inline-flex",alignItems:"center",gap:4}}>
                          <span style={{color:p.color,display:"flex",alignItems:"center"}}>{p.svg}</span>{p.label}
                        </span>
                      ):null;})}
                    </div>
                  )}
                  {st.linkCalendario&&(
                    <a href={st.linkCalendario} target="_blank" rel="noreferrer"
                      style={{fontSize:10,color:"#9B59B6",fontWeight:600,textDecoration:"underline",wordBreak:"break-all"}}>
                      📅 Ver en calendario →
                    </a>
                  )}
                </div>
              )}

              {/* DATA: reporte post-webinar */}
              {st.esData&&usuario.area==="Data"&&["Pendiente","En Producción","Cambios Solicitados"].includes(st.estado)&&(
                <div style={{background:"linear-gradient(135deg,#F0F9FF,#fff)",border:"1.5px solid #BAE6FD",borderRadius:10,padding:"14px"}}>
                  {st.estado==="Cambios Solicitados"&&(
                    <div style={{marginBottom:10,padding:"7px 10px",background:"#FFFBEB",borderRadius:7,border:"1px solid #FDE68A",fontSize:11,color:"#D97706",fontWeight:600}}>
                      ⚠️ El Director solicitó ajustes: "{st.comentario}"
                    </div>
                  )}
                  <div style={{fontSize:9,color:"#0EA5E9",fontWeight:800,letterSpacing:.6,marginBottom:10}}>📊 REPORTE POST-WEBINAR</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                    {[
                      {k:"inscritos",label:"👥 Inscritos",ph:"Ej: 150"},
                      {k:"asistentes",label:"✅ Asistentes",ph:"Ej: 112"},
                      {k:"duracion",label:"⏱ Duración (min)",ph:"Ej: 75"},
                      {k:"correos_enviados",label:"📧 Correos enviados",ph:"Ej: 3 correos"},
                      {k:"tasa_apertura",label:"📬 Tasa de apertura",ph:"Ej: 45%"},
                      {k:"tasa_clics",label:"🔗 Tasa de clics",ph:"Ej: 12%"},
                      {k:"calificacion",label:"⭐ Calificación prom.",ph:"Ej: 4.5/5"},
                      {k:"preguntas",label:"❓ Preguntas recibidas",ph:"Ej: 18"},
                    ].map(f=>(
                      <div key={f.k}>
                        <div style={{fontSize:9,color:"#64748B",fontWeight:700,marginBottom:3}}>{f.label}</div>
                        <input value={reporte[f.k]||""} onChange={e=>setReporte(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #BAE6FD",background:"#fff",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:9,color:"#64748B",fontWeight:700,marginBottom:3}}>💬 Comentarios e interacciones destacadas</div>
                    <textarea value={reporte.comentarios||""} onChange={e=>setReporte(p=>({...p,comentarios:e.target.value}))} placeholder="Describe interacciones, feedback, preguntas frecuentes..." style={{width:"100%",padding:"7px 10px",borderRadius:7,border:"1px solid #BAE6FD",background:"#fff",fontSize:12,resize:"none",height:60,outline:"none",fontFamily:"inherit"}}/>
                  </div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:9,color:"#64748B",fontWeight:700,marginBottom:3}}>🔗 Link reporte completo (Drive / Sheets)</div>
                    <input value={reporte.link||""} onChange={e=>setReporte(p=>({...p,link:e.target.value}))} placeholder="https://docs.google.com/..." style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #BAE6FD",background:"#fff",fontSize:12,outline:"none",fontFamily:"inherit",color:"#0EA5E9"}}/>
                  </div>
                  <button onClick={enviarReporte} disabled={loading} style={{width:"100%",padding:"10px",borderRadius:8,background:loading?"#BAE6FD":"linear-gradient(135deg,#0EA5E9,#0284C7)",color:"#fff",fontSize:12,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                    {loading?"⏳ Enviando...":st.estado==="Cambios Solicitados"?"🔄 Enviar reporte corregido":"📊 Enviar Reporte al Director"}
                  </button>
                </div>
              )}
              {st.esData&&st.estado==="En Revisión"&&usuario.area==="Data"&&(
                <div style={{padding:"10px 12px",background:"#F0F9FF",border:"1px solid #BAE6FD",borderRadius:9,textAlign:"center",fontSize:12,color:"#0EA5E9",fontWeight:600}}>⏳ Reporte en revisión por el Director</div>
              )}
              {st.esData&&st.aprobado===true&&(
                <div style={{padding:"10px 12px",background:"#F0FDF4",border:"1px solid #6EE7B7",borderRadius:9,textAlign:"center",fontSize:12,color:"#3BAD6E",fontWeight:700}}>📊 Reporte aprobado ✓</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
// ─── PASSWORD MODAL (Director only) ──────────────────────────────────────────

// ─── MODAL AGREGAR SUBTAREA ──────────────────────────────────────────────────
function ModalAgregarSubtarea({ sol, onClose, onAdd, notify }) {
  const AREAS = Object.keys(AREA_CFG);
  const [tipo, setTipo] = useState("");
  const [area, setArea] = useState(AREAS[0]);
  const [deadline, setDeadline] = useState("");
  const [esRedes, setEsRedes] = useState(false);
  const [esData, setEsData] = useState(false);

  const cfg = AREA_CFG[area] || AREA_CFG["Diseño"];

  const guardar = () => {
    if (!tipo.trim()) { notify("Escribe el nombre de la subtarea", "warn"); return; }
    const st = {
      id: Date.now(),
      tipo,
      area,
      deadline,
      esRedes,
      esData,
      estado: "Pendiente",
      aprobado: false,
      entregaUrl: null,
      comentario: null,
      asignadoId: null,
      historial: [],
      ts_enviado: null,
      ts_aprobado: null,
      ts_rechazado: null,
      ts_cambios: null,
    };
    onAdd(st);
    notify("✅ Subtarea agregada");
    onClose();
  };

  const inputStyle = { width:"100%", padding:"8px 11px", borderRadius:8, border:"1px solid #E2E8F0", fontSize:12, fontFamily:"inherit", outline:"none", background:"#FAFAFA", boxSizing:"border-box" };
  const labelStyle = { fontSize:10, color:"#94A3B8", fontWeight:700, letterSpacing:.5, marginBottom:3, display:"block" };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.65)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
      <div style={{background:"#fff",borderRadius:18,width:"min(480px,94vw)",boxShadow:"0 24px 60px rgba(0,0,0,.22)",display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Header */}
        <div style={{padding:"14px 20px",background:"#2B3A5C",borderBottom:`3px solid ${cfg.color}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"Outfit,sans-serif",fontSize:15,fontWeight:800,color:"#fff"}}>➕ Agregar Subtarea</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.5)",marginTop:2}}>{sol.datos.titulo||sol.tipo}</div>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,.15)",border:"none",color:"#fff",cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        {/* Body */}
        <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:14}}>

          <div>
            <label style={labelStyle}>Nombre de la subtarea *</label>
            <input value={tipo} onChange={e=>setTipo(e.target.value)} placeholder="Ej: Diseño de banner, Guión, Post Instagram..." style={inputStyle} autoFocus/>
          </div>

          <div>
            <label style={labelStyle}>Área responsable</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {AREAS.map(a => {
                const c = AREA_CFG[a];
                const sel = area === a;
                return (
                  <button key={a} onClick={()=>setArea(a)}
                    style={{padding:"5px 12px",borderRadius:7,border:`1.5px solid ${sel?c.color:"#E2E8F0"}`,background:sel?c.bg:"#fff",color:sel?c.color:"#64748B",fontSize:11,fontWeight:sel?700:400,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                    {c.icon} {a}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Deadline</label>
            <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} style={{...inputStyle, width:"auto"}}/>
          </div>

          <div style={{display:"flex",gap:16}}>
            <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:11,fontWeight:600,color:"#9B59B6"}}>
              <input type="checkbox" checked={esRedes} onChange={e=>setEsRedes(e.target.checked)} style={{accentColor:"#9B59B6"}}/>
              📱 Publicación Redes
            </label>
            <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:11,fontWeight:600,color:"#0EA5E9"}}>
              <input type="checkbox" checked={esData} onChange={e=>setEsData(e.target.checked)} style={{accentColor:"#0EA5E9"}}/>
              📊 Reporte Data
            </label>
          </div>
        </div>

        {/* Footer */}
        <div style={{padding:"14px 20px",borderTop:"1px solid #E2E8F0",display:"flex",justifyContent:"flex-end",gap:10,background:"#fff"}}>
          <button onClick={onClose} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #E2E8F0",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#64748B"}}>Cancelar</button>
          <button onClick={guardar} style={{padding:"8px 20px",borderRadius:8,background:`linear-gradient(135deg,${cfg.color},${cfg.color}cc)`,color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            ✅ Agregar subtarea
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── MODAL NUEVA SOLICITUD ───────────────────────────────────────────────────
function ModalNueva({ onClose, onSave, notify }) {
  const CAMPOS = {
    "Webinar":               [{k:"titulo",l:"Título del Webinar",req:true},{k:"fecha",l:"Fecha y hora",type:"datetime-local",req:true},{k:"host",l:"Host"},{k:"invitado1",l:"Invitado principal"},{k:"descripcion",l:"Descripción",area:true},{k:"link_zoom",l:"Link Zoom"},{k:"carpeta",l:"📁 Link Drive"}],
    "Diseño Gráfico":        [{k:"titulo",l:"Nombre de la pieza",req:true},{k:"objetivo",l:"Objetivo"},{k:"texto",l:"Texto a incluir",area:true},{k:"carpeta",l:"📁 Link Drive"}],
    "Video / Reel / Cápsula":[{k:"titulo",l:"Nombre del video",req:true},{k:"descripcion",l:"Descripción",area:true},{k:"requiere_grabacion",l:"¿Requiere grabación?",opts:["Sí","No","Ya grabado"]},{k:"carpeta",l:"📁 Link Drive"}],
    "Artículo / Blog":       [{k:"titulo",l:"Título del artículo",req:true},{k:"descripcion",l:"Descripción / tema",area:true},{k:"carpeta",l:"📁 Link Drive"}],
    "Redes Sociales":        [{k:"titulo",l:"Descripción del contenido",req:true},{k:"canales",l:"Canales (ej: Instagram, LinkedIn)"},{k:"descripcion",l:"Detalles adicionales",area:true},{k:"carpeta",l:"📁 Link Drive"}],
    "Página Web":            [{k:"titulo",l:"Nombre de la página",req:true},{k:"tipo_web",l:"Tipo",opts:["Landing page","Actualización","Nueva sección","Otro"]},{k:"descripcion",l:"Descripción",area:true},{k:"carpeta",l:"📁 Link Drive"}],
    "Evento Presencial":     [{k:"titulo",l:"Nombre del evento",req:true},{k:"fecha",l:"Fecha del evento",type:"date",req:true},{k:"ciudad",l:"Ciudad"},{k:"descripcion",l:"Descripción",area:true},{k:"carpeta",l:"📁 Link Drive"}],
    "Otras Solicitudes":     [{k:"titulo",l:"Solicitud",req:true},{k:"descripcion",l:"Descripción",area:true},{k:"carpeta",l:"📁 Link Drive"}],
  };

  const [tipo, setTipo] = useState("Webinar");
  const [datos, setDatos] = useState({});
  const [solicitante, setSolicitante] = useState("");
  const [area_solicitante, setAreaSol] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [email, setEmail] = useState("");
  const [urgente, setUrgente] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [step, setStep] = useState(1); // 1=tipo, 2=info

  const cfg = tc(tipo);
  const campos = CAMPOS[tipo] || CAMPOS["Otras Solicitudes"];

  const set = (k, v) => setDatos(p => ({ ...p, [k]: v }));

  const guardar = () => {
    if (!solicitante.trim()) { notify("Escribe el nombre del solicitante", "warn"); return; }
    if (!datos.titulo?.trim()) { notify("El título es obligatorio", "warn"); return; }
    const sol = {
      id: Date.now(),
      refCode: genRef(),
      tipo,
      proyecto: proyecto || "Sin proyecto",
      solicitante,
      area_solicitante,
      email,
      urgente,
      estado: "activa",
      datos: { ...datos },
      notas: [],
      subtareas: fechaInicio ? buildSubtareas(tipo, fechaInicio) : [],
      ts_creacion: nowTs(),
      ts_completado: null,
    };
    onSave(sol);
    notify("✅ Solicitud creada — " + sol.refCode);
    onClose();
  };

  const inputStyle = { width:"100%", padding:"8px 11px", borderRadius:8, border:"1px solid #E2E8F0", fontSize:12, fontFamily:"inherit", outline:"none", background:"#FAFAFA", boxSizing:"border-box" };
  const labelStyle = { fontSize:10, color:"#94A3B8", fontWeight:700, letterSpacing:.5, marginBottom:3, display:"block" };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.65)",zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
      <div className="modal-nueva-w" style={{background:"#fff",borderRadius:20,maxHeight:"90dvh",overflow:"hidden",boxShadow:"0 28px 70px rgba(0,0,0,.25)",display:"flex",flexDirection:"column"}}>

        {/* Header */}
        <div style={{padding:"14px 20px",background:"#2B3A5C",borderBottom:`3px solid ${cfg.color}`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"Outfit,sans-serif",fontSize:16,fontWeight:800,color:"#fff"}}>
              {step===1 ? "Nueva Solicitud — Elige el tipo" : `${cfg.icon} ${tipo}`}
            </div>
            {step===2 && <div style={{fontSize:10,color:"rgba(255,255,255,.5)",marginTop:2}}>Completa los datos de la solicitud</div>}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {step===2 && <button onClick={()=>setStep(1)} style={{padding:"5px 12px",borderRadius:7,background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← Atrás</button>}
            <button onClick={onClose} style={{width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,.15)",border:"none",color:"#fff",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>

          {/* STEP 1 — elegir tipo */}
          {step===1 && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
              {TIPOS.map(t => {
                const c = tc(t);
                const sel = tipo === t;
                return (
                  <button key={t} onClick={() => { setTipo(t); setDatos({}); setStep(2); }}
                    style={{padding:"16px 14px",borderRadius:12,border:`2px solid ${sel?c.color:"#E2E8F0"}`,background:sel?c.bg:"#fff",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.background=c.bg;}}
                    onMouseLeave={e=>{if(!sel){e.currentTarget.style.borderColor="#E2E8F0";e.currentTarget.style.background="#fff";}}}>
                    <div style={{fontSize:26,marginBottom:8}}>{c.icon}</div>
                    <div style={{fontSize:12,fontWeight:700,color:"#0F172A",lineHeight:1.3}}>{t}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP 2 — llenar datos */}
          {step===2 && (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>

              {/* Info del solicitante */}
              <div style={{background:"#F8FAFC",borderRadius:10,padding:"14px",border:"1px solid #E2E8F0"}}>
                <div style={{fontSize:10,fontWeight:800,color:"#2B3A5C",letterSpacing:.5,marginBottom:10}}>👤 SOLICITANTE</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div>
                    <label style={labelStyle}>Nombre *</label>
                    <input value={solicitante} onChange={e=>setSolicitante(e.target.value)} placeholder="Ej: Karla Casanova" style={inputStyle}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Área</label>
                    <select value={area_solicitante} onChange={e=>setAreaSol(e.target.value)} style={inputStyle}>
                      <option value="">— Seleccionar área —</option>
                      <option>Presidencia / Vice Presidencia</option>
                      <option>Estrategia / Advisors</option>
                      <option>Marketing</option>
                      <option>Comunicaciones</option>
                      <option>Fundraising</option>
                      <option>Finanzas</option>
                      <option>Proyectos y Eventos</option>
                      <option>Administración Interna</option>
                      <option>Ejecutiva y Becas</option>
                      <option>Impacto Social y Apoyo Comunitario</option>
                      <option>Otro</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Proyecto</label>
                    <select value={proyecto} onChange={e=>setProyecto(e.target.value)} style={inputStyle}>
                      <option value="">— Seleccionar proyecto —</option>
                      <option>Institucional Casta Latina</option>
                      <option>Mentaliza</option>
                      <option>Conciencia</option>
                      <option>Career Boost</option>
                      <option>Pa'educarte</option>
                      <option>Conexiones Latinas</option>
                      <option>Atrévete a Emprender</option>
                      <option>Abrigos de Esperanza</option>
                      <option>Sponsorships</option>
                      <option>Impacto Social</option>
                      <option>Otro</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@castlatina.org" style={inputStyle}/>
                  </div>
                </div>
              </div>

              {/* Campos del tipo */}
              <div style={{background:"#F8FAFC",borderRadius:10,padding:"14px",border:"1px solid #E2E8F0"}}>
                <div style={{fontSize:10,fontWeight:800,color:cfg.color,letterSpacing:.5,marginBottom:10}}>{cfg.icon} DETALLES DE LA SOLICITUD</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {campos.map(f => (
                    <div key={f.k}>
                      <label style={labelStyle}>{f.l}{f.req&&" *"}</label>
                      {f.opts
                        ? <select value={datos[f.k]||""} onChange={e=>set(f.k,e.target.value)} style={{...inputStyle}}>
                            <option value="">— Seleccionar —</option>
                            {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
                          </select>
                        : f.area
                          ? <textarea value={datos[f.k]||""} onChange={e=>set(f.k,e.target.value)} rows={3} style={{...inputStyle,resize:"vertical"}}/>
                          : <input type={f.type||"text"} value={datos[f.k]||""} onChange={e=>set(f.k,e.target.value)} style={inputStyle}/>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* Opciones extra */}
              <div style={{background:"#F8FAFC",borderRadius:10,padding:"14px",border:"1px solid #E2E8F0",display:"flex",flexDirection:"column",gap:10}}>
                <div style={{fontSize:10,fontWeight:800,color:"#2B3A5C",letterSpacing:.5,marginBottom:2}}>⚙️ OPCIONES</div>
                <div>
                  <label style={labelStyle}>Fecha de inicio (para generar subtareas automáticamente)</label>
                  <input type="date" value={fechaInicio} onChange={e=>setFechaInicio(e.target.value)} style={{...inputStyle,width:"auto"}}/>
                </div>
                <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,fontWeight:600,color:"#E84B2C"}}>
                  <input type="checkbox" checked={urgente} onChange={e=>setUrgente(e.target.checked)} style={{width:15,height:15,accentColor:"#E84B2C"}}/>
                  ⚡ Marcar como urgente
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step===2 && (
          <div style={{padding:"14px 20px",borderTop:"1px solid #E2E8F0",flexShrink:0,display:"flex",justifyContent:"flex-end",gap:10,background:"#fff"}}>
            <button onClick={onClose} style={{padding:"9px 18px",borderRadius:9,border:"1px solid #E2E8F0",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#64748B"}}>Cancelar</button>
            <button onClick={guardar} style={{padding:"9px 22px",borderRadius:9,background:`linear-gradient(135deg,${cfg.color},${cfg.color}cc)`,color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              💾 Crear Solicitud
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const DIRECTOR_PASS = "marketing2026";

function ModalPassword({ onSuccess, onCancel }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(false);
  const [show, setShow] = useState(false);

  const check = () => {
    if (pwd === DIRECTOR_PASS) { setErr(false); onSuccess(); }
    else { setErr(true); setPwd(""); setTimeout(()=>setErr(false), 2000); }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.7)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)"}}>
      <div className="fu" style={{background:"#fff",borderRadius:20,width:360,overflow:"hidden",boxShadow:"0 28px 70px rgba(0,0,0,.3)"}}>
        <div style={{background:"#2B3A5C",padding:"22px 24px",borderBottom:"3px solid #E84B2C",textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:8}}>🔐</div>
          <div style={{fontFamily:"Outfit,sans-serif",fontSize:17,fontWeight:800,color:"#fff"}}>Acceso Director</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.45)",marginTop:2}}>Introduce la contraseña para continuar</div>
        </div>
        <div style={{padding:"24px"}}>
          <div style={{position:"relative",marginBottom:14}}>
            <input
              autoFocus
              type={show?"text":"password"}
              value={pwd}
              onChange={e=>{setPwd(e.target.value);setErr(false);}}
              onKeyDown={e=>e.key==="Enter"&&check()}
              placeholder="Contraseña"
              style={{width:"100%",padding:"11px 42px 11px 14px",borderRadius:10,border:`2px solid ${err?"#E84B2C":"#E2E8F0"}`,background:err?"#FEF2F2":"#F8FAFC",fontSize:14,fontFamily:"inherit",outline:"none",transition:"border-color .2s"}}
            />
            <button onClick={()=>setShow(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#94A3B8",padding:0}}>
              {show?"🙈":"👁"}
            </button>
          </div>
          {err && <div style={{textAlign:"center",fontSize:12,color:"#E84B2C",fontWeight:700,marginBottom:12}}>❌ Contraseña incorrecta</div>}
          <button onClick={check} style={{width:"100%",padding:"11px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#2B3A5C,#1a2540)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 14px rgba(43,58,92,.25)"}}>
            Entrar →
          </button>
          <button onClick={onCancel} style={{width:"100%",padding:"9px",marginTop:8,borderRadius:10,border:"1px solid #E2E8F0",background:"#fff",color:"#94A3B8",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function PlatformApp({ sols, setSols, equipo, setEquipo, usuario, setUsuario, onGoHome, pendingDirectorInit=false, clearPendingDirector }){
  const { isMobile, isTablet } = useBreakpoint();
  const [detalleSol,setDetalleSol]=useState(null);
  const [showNueva,setShowNueva]=useState(false);
  const [showSwitch,setShowSwitch]=useState(false);
  const [showConfig,setShowConfig]=useState(false);
  const [notif,setNotif]=useState(null);
  const [filtroTipo,setFiltroTipo]=useState("Todos");
  const [pendingDirector,setPendingDirector]=useState(pendingDirectorInit);
  const [confirmElimSolCard,setConfirmElimSolCard]=useState(null);
  const [busqueda,setBusqueda]=useState("");
  const [tabVista,setTabVista]=useState("activas"); // "activas" | "archivo"
  const [modalBusqueda,setModalBusqueda]=useState(null); // sol encontrada

  const notify=(msg,type="ok")=>{setNotif({msg,type});setTimeout(()=>setNotif(null),3200);};

  const updSol=(id,patch)=>{
    setSols(p=>p.map(s=>s.id===id?{...s,...patch}:s));
    setDetalleSol(p=>p?.id===id?{...p,...patch}:p);
  };

  const deleteSol=(id)=>{
    setSols(p=>p.filter(s=>s.id!==id));
    if(detalleSol?.id===id) setDetalleSol(null);
  };
  const cerrarSol=(id)=>{
    setSols(p=>p.map(s=>s.id===id?{...s,estado:"cerrada",ts_completado:new Date().toISOString()}:s));
    setDetalleSol(null);
    notify("✅ Solicitud cerrada y archivada");
  };

  const solsActivas = sols.filter(s=>s.estado!=="cerrada");
  const solsArchivo = sols.filter(s=>s.estado==="cerrada");
  const solsVis=useMemo(()=>{
    let list=tabVista==="archivo" ? solsArchivo : solsActivas;
    if(usuario.rol==="equipo"){
      list=list.filter(s=>s.subtareas.some(st=>
        st.area===usuario.area &&
        st.asignadoId!==null &&
        ["Pendiente","En Producción","Cambios Solicitados"].includes(st.estado)
      ));
    }
    if(usuario.rol==="direccion"){
      list=list.filter(s=>s.subtareas.some(st=>st.estado==="En Revisión"&&st.ts_enviado));
    }
    if(filtroTipo!=="Todos") list=list.filter(s=>s.tipo===filtroTipo);
    return list;
  },[sols,usuario,filtroTipo,tabVista]);

  const totalST=sols.reduce((a,s)=>a+s.subtareas.length,0);
  const aprob=sols.reduce((a,s)=>a+s.subtareas.filter(st=>st.estado==="Aprobada"||st.estado==="Publicada").length,0);
  const enRev=sols.reduce((a,s)=>a+s.subtareas.filter(st=>st.estado==="En Revisión").length,0);
  const enCambios=sols.reduce((a,s)=>a+s.subtareas.filter(st=>st.estado==="Cambios Solicitados").length,0);

  return(
    <div style={{minHeight:"100vh",background:"#F1F5F9",fontFamily:"'Outfit',sans-serif",color:"#1E293B"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:#F1F5F9}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:4px}
        input,textarea,select{outline:none;font-family:inherit}
        input:focus,textarea:focus,select:focus{border-color:#E84B2C!important;box-shadow:0 0 0 3px rgba(232,75,44,.1)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp .22s ease}
        .card{transition:all .18s;cursor:pointer}.card:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.1)!important}
        .btn{transition:all .15s;cursor:pointer;border:none;font-family:inherit}.btn:hover{filter:brightness(.92)}.btn:active{transform:scale(.98)}
        /* ── RESPONSIVE ─────────────────────────────────────────────── */
        .plat-header{height:64px;padding:0 28px}
        .plat-header-logo-text{display:block}
        .plat-header-mid{display:flex}
        .plat-main{padding:24px 28px}
        .plat-kpi-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:22px}
        .plat-sol-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}
        .modal-detalle-body{grid-template-columns:300px 1fr;min-height:0;height:100%}
        .modal-detalle-left{display:flex;flex-direction:column;min-height:0;overflow:hidden}
        .modal-detalle-right{display:flex;flex-direction:column;min-height:0;overflow:hidden}
        .modal-tabs-movil{display:none}
        .st-grid{display:grid;grid-template-columns:1fr;gap:10px}
        .st-row{align-items:center}
        .st-header-row{margin-bottom:0!important;align-items:center!important}
        .st-meta-row{padding-left:0!important;margin-left:auto;flex-wrap:nowrap!important}
        @media(max-width:639px){
          .st-meta-row{padding-left:48px!important;flex-wrap:wrap!important;margin-left:0}
        }
        .modal-hidden-movil{}
        .modal-detalle-w{width:min(1100px,96vw)}
        .modal-nueva-w{width:min(640px,96vw)}
        .modal-config-w{width:min(860px,94vw)}
        .modal-config-body{grid-template-columns:1fr 1.4fr}
        @media(max-width:1023px){
          .plat-kpi-grid{grid-template-columns:repeat(3,1fr)}
          .plat-sol-grid{grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}
          .modal-detalle-body{grid-template-columns:1fr;grid-template-rows:1fr;height:100%}
          .modal-tabs-movil{display:flex}
          .modal-detalle-left,.modal-detalle-right{height:100%}
          .modal-detalle-w{width:min(720px,96vw)}
          .modal-hidden-movil{display:none!important}
          .modal-hidden-movil{display:none!important}
        }
        @media(max-width:639px){
          .area-filter-select{display:block!important}
          .area-filter-btns{display:none!important}
          .tipo-filter-select{display:block!important}
          .tipo-filter-btns{display:none!important}
          .st-grid{grid-template-columns:1fr;gap:6px}
          .modal-hidden-movil{display:none!important}
          .plat-header{height:auto;padding:10px 14px;flex-wrap:wrap;gap:8px}
          .plat-header-logo-text{display:none}
          .plat-header-mid{display:none}
          .plat-main{padding:12px 12px}
          .plat-kpi-grid{grid-template-columns:repeat(2,1fr);gap:6px;margin-bottom:10px}
          .kpi-card{padding:10px 12px!important;border-radius:10px!important;gap:8px!important}
          .kpi-icon{font-size:18px!important}
          .kpi-value{font-size:18px!important}
          .kpi-label{font-size:9px!important;margin-top:2px!important}
          .plat-sol-grid{grid-template-columns:1fr;gap:10px}
          .modal-detalle-body{grid-template-columns:1fr;grid-template-rows:1fr;height:100%}
          .modal-tabs-movil{display:flex}
          .modal-detalle-left,.modal-detalle-right{height:100%}
          .modal-detalle-w{width:100vw;max-height:100dvh;border-radius:0}
          .modal-nueva-w{width:100vw;max-height:100dvh;border-radius:0}
          .modal-config-w{width:100vw;max-height:100dvh;border-radius:0}
          .modal-config-body{grid-template-columns:1fr}
        }
      `}</style>

      {notif&&(
        <div className="fu" style={{position:"fixed",top:16,right:16,zIndex:9999,background:"#fff",border:`1.5px solid ${notif.type==="ok"?"#3BAD6E":notif.type==="warn"?"#F5A623":"#E84B2C"}`,color:notif.type==="ok"?"#2D8A57":notif.type==="warn"?"#B7860D":"#C0392B",padding:"11px 18px",borderRadius:10,fontSize:13,fontWeight:700,boxShadow:"0 4px 20px rgba(0,0,0,.1)"}}>
          {notif.msg}
        </div>
      )}

      {/* ── Modal resultado de búsqueda ── */}
      {modalBusqueda&&(()=>{
        const s=modalBusqueda;
        const cfg=tc(s.tipo);
        const titulo=s.datos.titulo||s.tipo;
        const tST=s.subtareas.length;
        const aST=s.subtareas.filter(t=>t.estado==="Aprobada"||t.estado==="Publicada").length;
        const pct=tST?Math.round(aST/tST*100):0;
        const nextDL=s.subtareas.filter(t=>t.deadline&&!["Aprobada","Publicada","Rechazada"].includes(t.estado)).sort((a,b)=>a.deadline>b.deadline?1:-1)[0];
        return(
          <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.6)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center"}}
            onClick={()=>setModalBusqueda(null)}>
            <div onClick={e=>e.stopPropagation()}
              style={{background:"#fff",borderRadius:20,width:"min(560px,94vw)",overflow:"hidden",boxShadow:"0 24px 60px rgba(0,0,0,.25)"}}>
              {/* Header */}
              <div style={{background:"linear-gradient(135deg,#2B3A5C,#1a2540)",padding:"18px 22px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                <div>
                  <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                    <span style={{fontSize:10,fontWeight:800,color:cfg.color,background:`${cfg.color}22`,border:`1px solid ${cfg.color}44`,borderRadius:5,padding:"2px 8px"}}>{cfg.icon} {s.tipo}</span>
                    {s.refCode&&<span style={{fontSize:10,fontWeight:800,color:"#93C5FD",background:"rgba(74,144,196,.2)",border:"1px solid rgba(74,144,196,.4)",borderRadius:5,padding:"2px 8px"}}>🔖 {s.refCode}</span>}
                    {s.estado==="cerrada"&&<span style={{fontSize:10,fontWeight:800,color:"#6EE7B7",background:"rgba(59,173,110,.2)",border:"1px solid rgba(59,173,110,.4)",borderRadius:5,padding:"2px 8px"}}>📦 Archivada</span>}
                    {s.urgente&&<span style={{fontSize:10,fontWeight:800,color:"#FCA5A5",background:"rgba(232,75,44,.2)",border:"1px solid rgba(232,75,44,.4)",borderRadius:5,padding:"2px 8px"}}>⚡ Urgente</span>}
                  </div>
                  <div style={{fontFamily:"Outfit,sans-serif",fontSize:18,fontWeight:800,color:"#fff",lineHeight:1.2,marginBottom:4}}>{titulo}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,.45)"}}>{s.solicitante} · {s.area_solicitante} · {s.proyecto}</div>
                </div>
                <button onClick={()=>setModalBusqueda(null)} style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,.12)",border:"none",color:"#fff",cursor:"pointer",fontSize:14,flexShrink:0}}>✕</button>
              </div>
              {/* Body */}
              <div style={{padding:"20px 22px",display:"flex",flexDirection:"column",gap:14}}>
                {/* Progreso global */}
                <div style={{background:"#F8FAFC",borderRadius:12,padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#2B3A5C"}}>Progreso general</span>
                    <span style={{fontSize:14,fontWeight:800,color:pct===100?"#3BAD6E":"#2B3A5C"}}>{pct}%</span>
                  </div>
                  <div style={{height:8,background:"#E2E8F0",borderRadius:4,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#3BAD6E":"linear-gradient(90deg,#2B3A5C,#4A90C4)",borderRadius:4,transition:"width .4s"}}/>
                  </div>
                  <div style={{fontSize:11,color:"#94A3B8",marginTop:5}}>{aST} de {tST} subtareas completadas</div>
                </div>
                {/* Estado por área */}
                <div>
                  <div style={{fontSize:10,fontWeight:800,color:"#94A3B8",letterSpacing:.6,marginBottom:8}}>ESTADO POR ÁREA</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {[...new Set(s.subtareas.map(t=>t.area).filter(Boolean))].map(area=>{
                      const cfg2=ac(area);
                      const tot=s.subtareas.filter(t=>t.area===area).length;
                      const ap=s.subtareas.filter(t=>t.area===area&&(t.estado==="Aprobada"||t.estado==="Publicada")).length;
                      const rev=s.subtareas.filter(t=>t.area===area&&t.estado==="En Revisión").length;
                      const chg=s.subtareas.filter(t=>t.area===area&&t.estado==="Cambios Solicitados").length;
                      const pend=s.subtareas.filter(t=>t.area===area&&t.estado==="Pendiente").length;
                      const prod=s.subtareas.filter(t=>t.area===area&&t.estado==="En Producción").length;
                      const p2=tot?Math.round(ap/tot*100):0;
                      return(
                        <div key={area} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:9,background:"#F8FAFC",border:`1px solid ${cfg2.border||cfg2.color+"22"}`}}>
                          <span style={{fontSize:18,flexShrink:0}}>{cfg2.icon}</span>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                              <span style={{fontSize:12,fontWeight:700,color:cfg2.color}}>{area}</span>
                              <span style={{fontSize:11,fontWeight:700,color:p2===100?"#3BAD6E":"#64748B"}}>{ap}/{tot}</span>
                            </div>
                            <div style={{height:5,background:"#E2E8F0",borderRadius:3,overflow:"hidden"}}>
                              <div style={{width:`${p2}%`,height:"100%",background:cfg2.color,borderRadius:3}}/>
                            </div>
                            <div style={{display:"flex",gap:5,marginTop:4,flexWrap:"wrap"}}>
                              {pend>0&&<span style={{fontSize:9,color:"#94A3B8"}}>⏳ {pend} pend.</span>}
                              {prod>0&&<span style={{fontSize:9,color:"#4A90C4"}}>⚙️ {prod} prod.</span>}
                              {rev>0&&<span style={{fontSize:9,color:"#8B5CF6",fontWeight:700}}>🔔 {rev} rev.</span>}
                              {chg>0&&<span style={{fontSize:9,color:"#F5A623",fontWeight:700}}>⚠️ {chg} cambios</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Próximo deadline */}
                {nextDL&&(
                  <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10}}>
                    <span style={{fontSize:18}}>🗓</span>
                    <div>
                      <div style={{fontSize:11,fontWeight:700,color:"#92400E"}}>Próximo deadline</div>
                      <div style={{fontSize:12,color:"#1E293B"}}>{nextDL.tipo} — {nextDL.deadline}</div>
                      <div style={{fontSize:10,color:"#94A3B8"}}>{nextDL.area} · Estado: {nextDL.estado}</div>
                    </div>
                  </div>
                )}
              </div>
              {/* Footer */}
              <div style={{padding:"12px 22px",borderTop:"1px solid #F1F5F9",display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button onClick={()=>{setDetalleSol(s);setModalBusqueda(null);setBusqueda("");}}
                  style={{padding:"9px 20px",borderRadius:9,background:"linear-gradient(135deg,#2B3A5C,#1a2540)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",border:"none",fontFamily:"inherit"}}>
                  📋 Ver solicitud completa
                </button>
                <button onClick={()=>setModalBusqueda(null)}
                  style={{padding:"9px 18px",borderRadius:9,border:"1px solid #E2E8F0",background:"#fff",color:"#64748B",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {showNueva&&<ModalNueva onClose={()=>setShowNueva(false)} onSave={s=>setSols(p=>[s,...p])} notify={notify}/>}
      {showConfig&&<ModalConfigEquipo equipo={equipo} setEquipo={setEquipo} onClose={()=>setShowConfig(false)} notify={notify}/>}
      {detalleSol&&<ModalDetalle sol={detalleSol} usuario={usuario} equipo={equipo} onClose={()=>setDetalleSol(null)} onUpdSol={updSol} onDeleteSol={deleteSol} notify={notify}/>}
      {pendingDirector&&<ModalPassword
        onSuccess={()=>{setUsuario(USUARIOS[0]);setPendingDirector(false);if(clearPendingDirector)clearPendingDirector();notify("✅ Bienvenido, Director");}}
        onCancel={()=>setPendingDirector(false)}
      />}
      {confirmElimSolCard&&<ConfirmDialog danger title="¿Eliminar solicitud?" msg={`Esto eliminará permanentemente "${confirmElimSolCard.datos.titulo||confirmElimSolCard.tipo}" y todas sus ${confirmElimSolCard.subtareas.length} subtareas.`} onConfirm={()=>{deleteSol(confirmElimSolCard.id);setConfirmElimSolCard(null);notify("Solicitud eliminada","warn");}} onCancel={()=>setConfirmElimSolCard(null)}/>}

      {/* Switch de usuario */}
      {showSwitch&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.55)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}} onClick={()=>setShowSwitch(false)}>
          <div className="fu" onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,width:"min(390px,94vw)",overflow:"hidden",boxShadow:"0 28px 70px rgba(0,0,0,.22)"}}>
            <div style={{background:"#2B3A5C",padding:"18px 22px",borderBottom:"3px solid #E84B2C"}}>
              <div style={{fontFamily:"Outfit,sans-serif",fontSize:16,fontWeight:800,color:"#fff"}}>Cambiar vista</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:1}}>Simula el rol de cada persona</div>
            </div>
            <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:7}}>
              {USUARIOS.map(u=>{const isA=usuario.id===u.id;return(
                <button key={u.id} onClick={()=>{if(u.rol==="director"){setPendingDirector(true);setShowSwitch(false);}else{setUsuario(u);setShowSwitch(false);notify(`Vista: ${u.rol==="director"?"Director":u.area}`);}}}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"10px 13px",borderRadius:11,border:`2px solid ${isA?u.color:"#E2E8F0"}`,background:isA?`${u.color}0D`:"#fff",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all .15s"}}
                  onMouseEnter={e=>{if(!isA){e.currentTarget.style.borderColor=u.color;e.currentTarget.style.background=`${u.color}08`;}}}
                  onMouseLeave={e=>{if(!isA){e.currentTarget.style.borderColor="#E2E8F0";e.currentTarget.style.background="#fff";}}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${u.color},${u.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",flexShrink:0}}>{u.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#0F172A"}}>{u.rol==="director"?"Director de Marketing":u.area}</div>
                    <div style={{fontSize:11,color:"#94A3B8",marginTop:1}}>
                      {u.rol==="director"?"🔐 Requiere contraseña":`Área de ${u.area}`}
                    </div>
                  </div>
                  {isA&&<span style={{fontSize:12,color:u.color,fontWeight:700}}>✓</span>}
                </button>
              );})}
            </div>
            <div style={{padding:"0 18px 14px"}}><button onClick={()=>setShowSwitch(false)} className="btn" style={{width:"100%",padding:"10px",borderRadius:10,border:"1px solid #E2E8F0",background:"#F8FAFC",color:"#64748B",fontSize:13,fontWeight:600}}>Cerrar</button></div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="plat-header" style={{background:"#fff",borderBottom:"3px solid #E84B2C",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 12px rgba(43,58,92,.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:isMobile?8:16}}>
          <img src={LOGO_URL} alt="Casta Latina" style={{height:isMobile?36:50,objectFit:"contain",filter:"drop-shadow(0 1px 2px rgba(0,0,0,.08))"}}/>
          {!isMobile&&<><div style={{width:1,height:28,background:"#E2E8F0"}}/>
          <div><div style={{fontFamily:"Outfit,sans-serif",fontSize:11,fontWeight:800,color:"#2B3A5C",letterSpacing:.6}}>MARKETING</div><div style={{fontSize:10,color:"#E84B2C",fontWeight:700,letterSpacing:1.2}}>PLATFORM</div></div></>}
        </div>
        {!isMobile&&<div style={{display:"flex",alignItems:"center",gap:8,background:"#F8FAFC",border:`1.5px solid ${usuario.color}30`,borderRadius:8,padding:"0 13px",height:38}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:usuario.color}}/>
          <span style={{fontSize:12,fontWeight:700,color:"#2B3A5C"}}>{usuario.rol==="director"?"Director de Marketing":usuario.area}</span>
        </div>}
        <div style={{display:"flex",gap:isMobile?6:10,alignItems:"center"}}>
          {usuario.rol==="director"&&(
            <>
              {!isMobile&&<button onClick={()=>setShowConfig(true)} className="btn"
                style={{display:"flex",alignItems:"center",gap:6,padding:"0 16px",height:38,borderRadius:8,background:"#F8FAFC",border:"1px solid #E2E8F0",color:"#2B3A5C",fontSize:13,fontWeight:700}}>
                ⚙️ Equipo
              </button>}
              <button onClick={()=>setShowNueva(true)} className="btn"
                style={{display:"flex",alignItems:"center",gap:isMobile?4:7,padding:isMobile?"0 12px":"0 18px",height:isMobile?36:38,borderRadius:8,background:"#E84B2C",color:"#fff",fontSize:isMobile?12:13,fontWeight:700,boxShadow:"0 3px 10px rgba(232,75,44,.3)"}}>
                <span style={{fontSize:16,lineHeight:1}}>+</span> {isMobile?"Nueva":"Nueva Solicitud"}
              </button>
            </>
          )}
          <button onClick={()=>setShowSwitch(true)} className="btn"
            style={{display:"flex",alignItems:"center",gap:isMobile?6:8,background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:8,padding:isMobile?"0 8px":"0 12px",height:isMobile?36:38}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${usuario.color},${usuario.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff"}}>{usuario.avatar}</div>
            {!isMobile&&<><span style={{fontSize:12,fontWeight:700,color:"#1E293B"}}>{usuario.rol==="director"?"Director":usuario.area}</span>
            <span style={{fontSize:10,color:"#94A3B8"}}>▾</span></>}
          </button>
          {isMobile&&usuario.rol==="director"&&<button onClick={()=>setShowConfig(true)} className="btn"
            style={{width:36,height:36,borderRadius:8,background:"#F8FAFC",border:"1px solid #E2E8F0",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
            ⚙️
          </button>}
        </div>
      </header>

      {/* MAIN */}
      <main className="plat-main" style={{maxWidth:1280,margin:"0 auto"}}>
        {usuario.rol==="director"&&(
          <div className="plat-kpi-grid">
            {[
              {l:"Solicitudes",   v:sols.length,         c:"#2B3A5C", icon:"📋"},
              {l:"Subtareas",     v:totalST,             c:"#4A90C4", icon:"📌"},
              {l:"En Revisión",   v:enRev,               c:"#8B5CF6", icon:"🔔"},
              {l:"Con Cambios",   v:enCambios,           c:"#F5A623", icon:"⚠️"},
              {l:"Completadas",   v:`${aprob}/${totalST}`,c:"#3BAD6E", icon:"🎉"},
            ].map(s=>(
              <div key={s.l} className="kpi-card" style={{background:"#fff",border:"1px solid #E2E8F0",borderTop:`3px solid ${s.c}`,borderRadius:14,padding:"16px 18px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 1px 4px rgba(43,58,92,.06)"}}>
                <span className="kpi-icon" style={{fontSize:26}}>{s.icon}</span>
                <div>
                  <div className="kpi-value" style={{fontSize:26,fontWeight:800,fontFamily:"Outfit,sans-serif",color:s.c,lineHeight:1}}>{s.v}</div>
                  <div className="kpi-label" style={{fontSize:10,color:"#94A3B8",marginTop:3,fontWeight:600}}>{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {usuario.rol==="equipo"&&(
          <div style={{background:`linear-gradient(135deg,${usuario.color}12,white)`,border:`2px solid ${usuario.color}22`,borderLeft:`4px solid ${usuario.color}`,borderRadius:14,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:46,height:46,borderRadius:12,background:`linear-gradient(135deg,${usuario.color},${usuario.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{AREA_CFG[usuario.area]?.icon}</div>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:"#0F172A"}}>Hola, equipo de {usuario.area} 👋</div>
              <div style={{fontSize:12,color:"#64748B"}}>Tareas del área de <strong style={{color:usuario.color}}>{usuario.area}</strong> · Deadlines fijados por el Director</div>
            </div>
          </div>
        )}

        {usuario.rol==="director"&&(
          <div style={{marginBottom:16}}>
            {/* ── Barra de búsqueda ── */}
            <div style={{display:"flex",gap:10,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:220,position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:16,pointerEvents:"none"}}>🔍</span>
                <input
                  value={busqueda}
                  onChange={e=>setBusqueda(e.target.value)}
                  onKeyDown={e=>{
                    if(e.key==="Enter"&&busqueda.trim()){
                      const q=busqueda.trim().toLowerCase();
                      const found=sols.find(s=>
                        (s.refCode||"").toLowerCase()===q ||
                        (s.datos.titulo||"").toLowerCase().includes(q) ||
                        (s.solicitante||"").toLowerCase().includes(q)
                      );
                      if(found) setModalBusqueda(found);
                      else notify("No se encontró ninguna solicitud","warn");
                    }
                  }}
                  placeholder="Buscar por código (CL-2026-XXXX), título o solicitante... ↵ Enter"
                  style={{width:"100%",padding:"10px 12px 10px 38px",borderRadius:10,border:"1.5px solid #E2E8F0",background:"#fff",fontSize:13,color:"#1E293B",fontFamily:"inherit",outline:"none",boxShadow:"0 1px 4px rgba(43,58,92,.06)"}}
                />
              </div>
              {busqueda.trim()&&(
                <button onClick={()=>{
                  const q=busqueda.trim().toLowerCase();
                  const found=sols.find(s=>
                    (s.refCode||"").toLowerCase()===q ||
                    (s.datos.titulo||"").toLowerCase().includes(q) ||
                    (s.solicitante||"").toLowerCase().includes(q)
                  );
                  if(found) setModalBusqueda(found);
                  else notify("No se encontró ninguna solicitud","warn");
                }}
                  style={{padding:"10px 18px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#2B3A5C,#1a2540)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                  Buscar
                </button>
              )}
            </div>
            {/* ── Tabs Activas / Archivo ── */}
            <div style={{display:"flex",gap:0,marginBottom:12,background:"#F1F5F9",borderRadius:10,padding:3,width:"fit-content"}}>
              {[["activas",`📋 Activas (${solsActivas.length})`],["archivo",`📦 Archivo (${solsArchivo.length})`]].map(([id,label])=>(
                <button key={id} onClick={()=>setTabVista(id)}
                  style={{padding:"7px 18px",borderRadius:8,border:"none",background:tabVista===id?"#fff":"transparent",
                    color:tabVista===id?"#2B3A5C":"#94A3B8",fontSize:12,fontWeight:tabVista===id?700:500,
                    cursor:"pointer",fontFamily:"inherit",boxShadow:tabVista===id?"0 1px 4px rgba(43,58,92,.12)":"none",
                    transition:"all .15s"}}>
                  {label}
                </button>
              ))}
            </div>
            {/* ── Filtros de tipo ── */}
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:10,color:"#94A3B8",fontWeight:700}}>FILTRAR:</span>
                <span style={{fontSize:11,color:"#94A3B8",marginLeft:2}}>{solsVis.length} solicitud{solsVis.length!==1?"es":""}</span>
              </div>
              {/* Dropdown móvil */}
              <select className="tipo-filter-select"
                value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)}
                style={{display:"none",width:"100%",padding:"8px 12px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:12,fontWeight:600,color:"#2B3A5C",background:"#F8FAFC",fontFamily:"inherit",cursor:"pointer",outline:"none"}}>
                {["Todos",...TIPOS].map(t=>{const cfg=tc(t);return(
                  <option key={t} value={t}>{t==="Todos"?"Todos":cfg.icon+" "+t}</option>
                );})}
              </select>
              {/* Botones desktop */}
              <div className="tipo-filter-btns" style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                {["Todos",...TIPOS].map(t=>{const cfg=tc(t);const isA=filtroTipo===t;return(
                  <button key={t} onClick={()=>setFiltroTipo(t)} className="btn"
                    style={{padding:"5px 12px",borderRadius:6,border:`1.5px solid ${isA?(t==="Todos"?"#2B3A5C":cfg.color):"#E2E8F0"}`,background:isA?(t==="Todos"?"#EEF2FF":cfg.bg):"#fff",color:isA?(t==="Todos"?"#2B3A5C":cfg.color):"#64748B",fontSize:11,fontWeight:isA?700:400}}>
                    {t!=="Todos"&&cfg.icon+" "}{t}
                  </button>
                );})}
              </div>
            </div>
          </div>
        )}

        {/* ── Director: left approval panel + right sol grid ─────────────── */}
        {(()=>{
          const pendingApprovals=sols.flatMap(sol=>
            sol.subtareas.filter(st=>st.estado==="En Revisión"&&st.ts_enviado)
              .map(st=>({...st,solTitulo:sol.datos.titulo||sol.tipo,solId:sol.id}))
          ).sort((a,b)=>new Date(b.ts_enviado||0)-new Date(a.ts_enviado||0));
          const withChanges=sols.flatMap(sol=>
            sol.subtareas.filter(st=>st.estado==="Cambios Solicitados")
              .map(st=>({...st,solTitulo:sol.datos.titulo||sol.tipo,solId:sol.id}))
          );
          const showLeftPanel=usuario.rol==="director"&&(pendingApprovals.length>0||withChanges.length>0);
          return(
            <div style={{display:showLeftPanel?"grid":"block",gridTemplateColumns:"270px 1fr",gap:16,alignItems:"start"}}>
              {showLeftPanel&&(
                <div style={{position:"sticky",top:76,display:"flex",flexDirection:"column",gap:10}}>
                  {pendingApprovals.length>0&&(
                    <div style={{background:"#fff",border:"1px solid #EDE9FE",borderTop:"3px solid #8B5CF6",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(139,92,246,.1)"}}>
                      <div style={{padding:"10px 14px",background:"linear-gradient(90deg,#F5F3FF,#fff)",borderBottom:"1px solid #F1F5F9",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div style={{fontSize:10,fontWeight:800,color:"#7C3AED",letterSpacing:.5}}>🔔 APROBACIONES PENDIENTES</div>
                        <span style={{fontSize:11,fontWeight:800,color:"#7C3AED",background:"#EDE9FE",padding:"2px 8px",borderRadius:10}}>{pendingApprovals.length}</span>
                      </div>
                      <div style={{maxHeight:360,overflowY:"auto",scrollbarWidth:"thin"}}>
                        {pendingApprovals.map(st=>{
                          const areaCfg=ac(st.area||"");
                          const member=st.asignadoId?equipo.find(m=>m.id===st.asignadoId):null;
                          return(
                            <div key={st.id}
                              onClick={()=>setDetalleSol(sols.find(s=>s.id===st.solId))}
                              style={{padding:"10px 14px",borderBottom:"1px solid #F5F3FF",cursor:"pointer",transition:"background .1s"}}
                              onMouseEnter={e=>{e.currentTarget.style.background="#FAF8FF";}}
                              onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
                              <div style={{display:"flex",alignItems:"flex-start",gap:7,marginBottom:4}}>
                                <div style={{width:28,height:28,borderRadius:7,background:areaCfg.bg,border:`1px solid ${areaCfg.border||areaCfg.color+"22"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{areaCfg.icon}</div>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontSize:11,fontWeight:700,color:"#0F172A",lineHeight:1.3,marginBottom:1}}>{st.tipo}</div>
                                  <div style={{fontSize:9,color:"#94A3B8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{st.solTitulo}</div>
                                </div>
                                <span style={{fontSize:9,color:areaCfg.color,fontWeight:700,background:areaCfg.bg,padding:"1px 5px",borderRadius:3,flexShrink:0}}>{st.area}</span>
                              </div>
                              {member&&<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}>
                                <div style={{width:13,height:13,borderRadius:"50%",background:`linear-gradient(135deg,${member.color},${member.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,fontWeight:800,color:"#fff"}}>{member.avatar}</div>
                                <span style={{fontSize:9,color:"#64748B"}}>{member.nombre}</span>
                              </div>}
                              {st.entregaUrl&&<div style={{marginTop:3}}><a href={st.entregaUrl} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:9,color:"#8B5CF6",textDecoration:"underline",wordBreak:"break-all"}}>Ver entrega →</a></div>}
                              <div style={{fontSize:8,color:"#CBD5E1",marginTop:3}}>{fmtTs(st.ts_enviado)}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {withChanges.length>0&&(
                    <div style={{background:"#fff",border:"1px solid #FDE68A",borderTop:"3px solid #F5A623",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(245,166,35,.1)"}}>
                      <div style={{padding:"10px 14px",background:"linear-gradient(90deg,#FFFBEB,#fff)",borderBottom:"1px solid #FEF9C3",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div style={{fontSize:10,fontWeight:800,color:"#B7860D",letterSpacing:.5}}>⚠️ CON CAMBIOS SOLICITADOS</div>
                        <span style={{fontSize:11,fontWeight:800,color:"#B7860D",background:"#FFFBEB",padding:"2px 8px",borderRadius:10}}>{withChanges.length}</span>
                      </div>
                      <div style={{maxHeight:200,overflowY:"auto",scrollbarWidth:"thin"}}>
                        {withChanges.map(st=>{
                          const areaCfg=ac(st.area||"");
                          return(
                            <div key={st.id}
                              onClick={()=>setDetalleSol(sols.find(s=>s.id===st.solId))}
                              style={{padding:"9px 14px",borderBottom:"1px solid #FFFBEB",cursor:"pointer"}}
                              onMouseEnter={e=>{e.currentTarget.style.background="#FFFEF4";}}
                              onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
                              <div style={{fontSize:11,fontWeight:600,color:"#0F172A",marginBottom:2}}>{st.tipo}</div>
                              <div style={{display:"flex",alignItems:"center",gap:4}}>
                                <span style={{fontSize:11}}>{areaCfg.icon}</span>
                                <span style={{fontSize:9,color:"#94A3B8"}}>{st.solTitulo}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}
        {solsVis.length===0&&(
          <div style={{background:"#fff",border:"2px dashed #E2E8F0",borderRadius:16,padding:"60px 20px",textAlign:"center"}}>
            <img src={LOGO_URL} alt="" style={{height:55,objectFit:"contain",opacity:.15,marginBottom:14}}/>
            <div style={{fontSize:14,fontWeight:700,color:"#2B3A5C",marginBottom:5}}>{usuario.rol==="director"?"Sin solicitudes aún":usuario.rol==="direccion"?"Sin entregas pendientes":"No hay tareas asignadas a tu área"}</div>
            <div style={{fontSize:12,color:"#94A3B8"}}>{usuario.rol==="director"?"Usa el botón + Nueva Solicitud para crear la primera":usuario.rol==="direccion"?"Cuando el equipo envíe trabajo aparecerá aquí":"El Director te asignará tareas cuando haya solicitudes"}</div>
          </div>
        )}

        {/* ── Director: categorías de solicitudes ── */}
        {usuario.rol==="director"&&solsVis.length>0&&(()=>{
          // Categorizar solicitudes
          const porDelegar   = solsVis.filter(s => s.subtareas.some(st=>!st.asignadoId&&["Pendiente","En Producción"].includes(st.estado)));
          const enProceso    = solsVis.filter(s => {
            const tieneAsignadas = s.subtareas.some(st=>st.asignadoId&&["Pendiente","En Producción","En Revisión","Cambios Solicitados"].includes(st.estado));
            const noEstaEnDelegar = !s.subtareas.some(st=>!st.asignadoId&&["Pendiente","En Producción"].includes(st.estado));
            return tieneAsignadas && noEstaEnDelegar && !s.subtareas.every(st=>st.estado==="Publicada"||st.estado==="Aprobada"||st.estado==="Cerrada");
          });
          const publicadas   = solsVis.filter(s => s.subtareas.length>0 && s.subtareas.every(st=>st.estado==="Publicada"||st.estado==="Aprobada"||st.estado==="Cerrada"||st.estado==="Rechazada") && s.estado!=="cerrada");
          const archivadas   = solsVis.filter(s => s.estado==="cerrada");

          const CATS = [
            { key:"delegar",   label:"Por Delegar",          icon:"📋", color:"#E84B2C", bg:"#FEF3F0", border:"#F9C4B8", items:porDelegar,   desc:"Subtareas sin asignar" },
            { key:"proceso",   label:"En Proceso / Revisión",icon:"⚙️", color:"#8B5CF6", bg:"#F5F3FF", border:"#C4B5FD", items:enProceso,    desc:"Equipo trabajando" },
            { key:"publicadas",label:"Publicadas / Revisar", icon:"📱", color:"#3BAD6E", bg:"#F0FDF4", border:"#6EE7B7", items:publicadas,   desc:"Verificar calidad" },
            { key:"archivadas",label:"Archivadas",           icon:"📦", color:"#94A3B8", bg:"#F8FAFC", border:"#E2E8F0", items:archivadas,   desc:"Cerradas" },
          ].filter(c=>c.items.length>0);

          return CATS.map(cat=>(
            <div key={cat.key} style={{marginBottom:28}}>
              {/* Encabezado de categoría */}
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:8,borderBottom:`2px solid ${cat.border}`}}>
                <span style={{fontSize:18}}>{cat.icon}</span>
                <div>
                  <span style={{fontSize:14,fontWeight:800,color:cat.color,fontFamily:"Outfit,sans-serif"}}>{cat.label}</span>
                  <span style={{fontSize:11,color:"#94A3B8",marginLeft:8}}>{cat.items.length} solicitud{cat.items.length!==1?"es":""} · {cat.desc}</span>
                </div>
              </div>
              <div className="plat-sol-grid">
                {cat.items.map(sol=>{
            const tipoCfg=tc(sol.tipo);
            const titulo=sol.datos.titulo||sol.tipo;
            const desc=sol.datos.descripcion||"";
            const tST=sol.subtareas.length;
            const aST=sol.subtareas.filter(s=>s.estado==="Aprobada"||s.estado==="Publicada").length;
            const rST=sol.subtareas.filter(s=>s.estado==="En Revisión").length;
            const cST=sol.subtareas.filter(s=>s.estado==="Cambios Solicitados").length;
            const pct=tST?Math.round(aST/tST*100):0;
            const areasUniq=[...new Set(sol.subtareas.map(s=>s.area).filter(Boolean))];
            const misSubtareas=usuario.rol==="equipo"?sol.subtareas.filter(s=>s.area===usuario.area):[];

            return(
              <div key={sol.id} className="card" style={{background:"#fff",borderRadius:16,border:"1.5px solid #E2E8F0",overflow:"hidden",boxShadow:"0 1px 4px rgba(43,58,92,.06)",position:"relative"}}>
                {usuario.rol==="director"&&(
                  <button onClick={e=>{e.stopPropagation();setConfirmElimSolCard(sol);}}
                    style={{position:"absolute",top:10,right:10,width:28,height:28,borderRadius:7,background:"rgba(232,75,44,.08)",border:"1px solid rgba(232,75,44,.2)",color:"#E84B2C",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,zIndex:5}}
                    title="Eliminar solicitud">🗑</button>
                )}
                <div onClick={()=>setDetalleSol(sol)} style={{cursor:"pointer"}}>
                  <div style={{height:3,background:"#F1F5F9"}}><div style={{height:"100%",background:`linear-gradient(90deg,${tipoCfg.color},${tipoCfg.color}88)`,width:`${pct}%`,transition:"width .4s"}}/></div>
                  <div style={{padding:"15px 17px",paddingRight:usuario.rol==="director"?42:17}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                        <Badge color={tipoCfg.color} bg={tipoCfg.bg} border={tipoCfg.border}>{tipoCfg.icon} {sol.tipo}</Badge>
                        {sol.urgente&&<Badge color="#E84B2C" bg="#FEF3F0" sm>⚡</Badge>}
                        {sol.estado==="cerrada"&&<Badge color="#3BAD6E" bg="#F0FDF4" border="#6EE7B7" sm>📦 Archivada</Badge>}
                        {sol.ts_completado&&sol.estado!=="cerrada"&&<Badge color="#3BAD6E" bg="#F0FDF4" sm>🎉 Completo</Badge>}
                      </div>
                      {usuario.rol==="director"&&sol.ts_creacion&&(
                        <span style={{fontSize:9,color:"#94A3B8",whiteSpace:"nowrap",marginRight:4}}>{fmtTs(sol.ts_creacion)}</span>
                      )}
                    </div>
                    <div style={{fontSize:15,fontWeight:700,color:"#0F172A",marginBottom:4,lineHeight:1.3}}>{titulo}</div>
                    <div style={{fontSize:12,color:"#64748B",marginBottom:10,lineHeight:1.5}}>{desc.substring(0,75)}{desc.length>75?"...":""}</div>
                    <div style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:11,color:"#64748B",fontWeight:600}}>{aST}/{tST} completadas</span>
                        <div style={{display:"flex",gap:6}}>
                          {rST>0&&<span style={{fontSize:11,color:"#8B5CF6",fontWeight:700}}>🔔 {rST}</span>}
                          {cST>0&&<span style={{fontSize:11,color:"#F5A623",fontWeight:700}}>⚠️ {cST}</span>}
                        </div>
                      </div>
                      <div style={{height:6,background:"#F1F5F9",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:"linear-gradient(90deg,#3BAD6E,#27AE60)",width:`${pct}%`,borderRadius:3,transition:"width .4s"}}/></div>
                    </div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
                      {areasUniq.map(a=>{
                        const cfg=ac(a);
                        const ap=sol.subtareas.filter(s=>s.area===a&&(s.estado==="Aprobada"||s.estado==="Publicada")).length;
                        const tot=sol.subtareas.filter(s=>s.area===a).length;
                        const rv=sol.subtareas.filter(s=>s.area===a&&s.estado==="En Revisión").length;
                        const ch=sol.subtareas.filter(s=>s.area===a&&s.estado==="Cambios Solicitados").length;
                        return(
                          <div key={a} style={{padding:"3px 8px",borderRadius:5,background:cfg.bg,border:`1px solid ${cfg.border||cfg.color+"22"}`,display:"flex",alignItems:"center",gap:3}}>
                            <span style={{fontSize:11}}>{cfg.icon}</span>
                            <span style={{fontSize:10,fontWeight:700,color:cfg.color}}>{a}</span>
                            <span style={{fontSize:9,color:"#94A3B8"}}>{ap}/{tot}</span>
                            {rv>0&&<div style={{width:5,height:5,borderRadius:"50%",background:"#8B5CF6"}}/>}
                            {ch>0&&<div style={{width:5,height:5,borderRadius:"50%",background:"#F5A623"}}/>}
                          </div>
                        );
                      })}
                    </div>
                    {usuario.rol==="equipo"&&misSubtareas.length>0&&(
                      <div style={{padding:"8px 10px",background:`${usuario.color}09`,border:`1px solid ${usuario.color}22`,borderRadius:8,marginBottom:8}}>
                        <div style={{fontSize:9,fontWeight:700,color:usuario.color,marginBottom:4,letterSpacing:.5}}>MIS TAREAS</div>
                        {misSubtareas.map(st=>(
                          <div key={st.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#374151",marginBottom:2}}>
                            <span>· {st.tipo}</span>
                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                              <span style={{color:ec(st.estado).color,fontWeight:600}}>{st.estado}</span>
                              {st.deadline&&<span style={{fontSize:9,color:"#94A3B8"}}>🗓 {st.deadline}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:"1px solid #F1F5F9"}}>
                      <div style={{display:"flex",flexDirection:"column",gap:1}}>
                        <div style={{fontSize:11,color:"#94A3B8"}}>👤 {sol.solicitante.split(" ")[0]} · 📁 {sol.proyecto}</div>
                        {sol.refCode&&<div style={{fontSize:9,color:"#4A90C4",fontWeight:700,letterSpacing:.3}}>🔖 {sol.refCode}</div>}
                      </div>
                      <div style={{fontSize:11,color:tipoCfg.color,fontWeight:700}}>Ver {tST} subtareas →</div>
                    </div>
                  </div>
                </div>
              </div>
            );
                })}
              </div>
            </div>
          ))
        })()}
        {/* ── Equipo: flat grid ── */}
        {usuario.rol!=="director"&&(
          <div className="plat-sol-grid">
            {solsVis.map(sol=>{
              const tipoCfg=tc(sol.tipo);
              const titulo=sol.datos.titulo||sol.tipo;
              const desc=sol.datos.descripcion||"";
              const tST=sol.subtareas.length;
              const aST=sol.subtareas.filter(s=>s.estado==="Aprobada"||s.estado==="Publicada").length;
              const rST=sol.subtareas.filter(s=>s.estado==="En Revisión").length;
              const cST=sol.subtareas.filter(s=>s.estado==="Cambios Solicitados").length;
              const pct=tST?Math.round(aST/tST*100):0;
              const areasUniq=[...new Set(sol.subtareas.map(s=>s.area).filter(Boolean))];
              const misSubtareas=sol.subtareas.filter(s=>s.area===usuario.area);
              return(
                <div key={sol.id} className="card" style={{background:"#fff",borderRadius:16,border:"1.5px solid #E2E8F0",overflow:"hidden",boxShadow:"0 1px 4px rgba(43,58,92,.06)"}}>
                  <div onClick={()=>setDetalleSol(sol)} style={{cursor:"pointer"}}>
                    <div style={{height:3,background:"#F1F5F9"}}><div style={{height:"100%",background:`linear-gradient(90deg,${tipoCfg.color},${tipoCfg.color}88)`,width:`${pct}%`,transition:"width .4s"}}/></div>
                    <div style={{padding:"15px 17px"}}>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
                        <Badge color={tipoCfg.color} bg={tipoCfg.bg} border={tipoCfg.border}>{tipoCfg.icon} {sol.tipo}</Badge>
                        {sol.urgente&&<Badge color="#E84B2C" bg="#FEF3F0" sm>⚡</Badge>}
                        {sol.ts_completado&&<Badge color="#3BAD6E" bg="#F0FDF4" sm>🎉 Completo</Badge>}
                      </div>
                      <div style={{fontSize:15,fontWeight:700,color:"#0F172A",marginBottom:4,lineHeight:1.3}}>{titulo}</div>
                      <div style={{fontSize:12,color:"#64748B",marginBottom:10,lineHeight:1.5}}>{desc.substring(0,75)}{desc.length>75?"...":""}</div>
                      <div style={{marginBottom:10}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                          <span style={{fontSize:11,color:"#64748B",fontWeight:600}}>{aST}/{tST} completadas</span>
                          <div style={{display:"flex",gap:6}}>
                            {rST>0&&<span style={{fontSize:11,color:"#8B5CF6",fontWeight:700}}>🔔 {rST}</span>}
                            {cST>0&&<span style={{fontSize:11,color:"#F5A623",fontWeight:700}}>⚠️ {cST}</span>}
                          </div>
                        </div>
                        <div style={{height:6,background:"#F1F5F9",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:"linear-gradient(90deg,#3BAD6E,#27AE60)",width:`${pct}%`,borderRadius:3,transition:"width .4s"}}/></div>
                      </div>
                      {misSubtareas.length>0&&(
                        <div style={{padding:"8px 10px",background:`${usuario.color}09`,border:`1px solid ${usuario.color}22`,borderRadius:8,marginBottom:8}}>
                          <div style={{fontSize:9,fontWeight:700,color:usuario.color,marginBottom:4,letterSpacing:.5}}>MIS TAREAS</div>
                          {misSubtareas.map(st=>(
                            <div key={st.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#374151",marginBottom:2}}>
                              <span>· {st.tipo}</span>
                              <div style={{display:"flex",alignItems:"center",gap:5}}>
                                <span style={{color:ec(st.estado).color,fontWeight:600}}>{st.estado}</span>
                                {st.deadline&&<span style={{fontSize:9,color:"#94A3B8"}}>🗓 {st.deadline}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:"1px solid #F1F5F9"}}>
                        <div style={{fontSize:11,color:"#94A3B8"}}>👤 {sol.solicitante.split(" ")[0]} · 📁 {sol.proyecto}</div>
                        <div style={{fontSize:11,color:tipoCfg.color,fontWeight:700}}>Ver {tST} subtareas →</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
}

// ─── RECHARTS IMPORT (used by dashboard) ──────────────────────────────────
// Already available via CDN in React artifacts

// ─── EXECUTIVE DASHBOARD ──────────────────────────────────────────────────

// ── Mini bar ──────────────────────────────────────────────────
const Bar = ({ pct, color, h=6 }) => (
<div style={{height:h,background:"rgba(255,255,255,.08)",borderRadius:h,overflow:"hidden",width:"100%"}}>
    <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:h,transition:"width .6s ease"}}/>
</div>
);
const BarLight = ({ pct, color, h=6 }) => (
<div style={{height:h,background:"#F1F5F9",borderRadius:h,overflow:"hidden",width:"100%"}}>
    <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:h,transition:"width .6s ease"}}/>
</div>
);

// ── SVG Donut ────────────────────────────────────────────────
const Donut = ({ data, size=140, thickness=20, label, sublabel }) => {
const total = data.reduce((a,d)=>a+d.value,0);
if (!total) return (
    <div style={{width:size,height:size,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.2)",fontSize:12}}>Sin datos</div>
);
let cumAngle = -90;
const cx=size/2, cy=size/2, r=(size-thickness)/2;
const segments = data.map(d => {
    const pct = d.value/total;
    const sa = cumAngle;
    cumAngle += pct*360;
    const toRad = a => a*Math.PI/180;
    const sx = cx+r*Math.cos(toRad(sa)), sy = cy+r*Math.sin(toRad(sa));
    const ex = cx+r*Math.cos(toRad(sa+pct*360)), ey = cy+r*Math.sin(toRad(sa+pct*360));
    return { ...d, path:`M${sx},${sy} A${r},${r} 0 ${pct>.5?1:0},1 ${ex},${ey}`, pct };
});
return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      {segments.map((s,i)=>(
        <path key={i} d={s.path} fill="none" stroke={s.color} strokeWidth={thickness} strokeLinecap="butt"/>
      ))}
      <text x={cx} y={cy-8} textAnchor="middle" fontSize={size*.18} fontWeight={800} fill="#fff" fontFamily="Outfit,sans-serif">{label}</text>
      {sublabel&&<text x={cx} y={cy+10} textAnchor="middle" fontSize={size*.1} fill="rgba(255,255,255,.45)" fontFamily="Outfit,sans-serif">{sublabel}</text>}
    </svg>
);
};

function ExecutiveDashboard({ sols, equipo=[], onOpenPlatform, usuario, setUsuario, setPendingDirector }) {
  const { isMobile, isTablet } = useBreakpoint();
  const [showSwitch, setShowSwitch] = useState(false);
  const [queryDash, setQueryDash]   = useState("");
  const [resultsDash, setResultsDash] = useState(null); // null=not searched, []=no results, [...]= found

  const stats = useMemo(() => {
    // ── Stats ──────────────────────────────────────────────────────
    const totalSols  = sols.length;
    const totalST    = sols.reduce((a,s) => a + s.subtareas.length, 0);
    const aprobST    = sols.reduce((a,s) => a + s.subtareas.filter(t => t.estado==="Aprobada"||t.estado==="Publicada").length, 0);
    const revST      = sols.reduce((a,s) => a + s.subtareas.filter(t => t.estado==="En Revisión").length, 0);
    const cambiosST  = sols.reduce((a,s) => a + s.subtareas.filter(t => t.estado==="Cambios Solicitados").length, 0);
    const pendST     = sols.reduce((a,s) => a + s.subtareas.filter(t => t.estado==="Pendiente").length, 0);
    const prodST     = sols.reduce((a,s) => a + s.subtareas.filter(t => t.estado==="En Producción").length, 0);
    const pubST      = sols.reduce((a,s) => a + s.subtareas.filter(t => t.estado==="Publicada").length, 0);
    const rechST     = sols.reduce((a,s) => a + s.subtareas.filter(t => t.estado==="Rechazada").length, 0);
    const urgentes   = sols.filter(s => s.urgente).length;
    const pctGlobal  = totalST ? Math.round(aprobST / totalST * 100) : 0;

  // Estado distribution for donut
    const estadoDist = [
    { name:"Pendiente",           value:pendST,               color:"#94A3B8" },
    { name:"En Producción",       value:prodST,               color:"#4A90C4" },
    { name:"En Revisión",         value:revST,                color:"#8B5CF6" },
    { name:"Cambios Solicitados", value:cambiosST,            color:"#F5A623" },
    { name:"Aprobada",            value:aprobST - pubST,      color:"#3BAD6E" },
    { name:"Publicada",           value:pubST,                color:"#9B59B6" },
    { name:"Rechazada",           value:rechST,               color:"#EF4444" },
  ].filter(d => d.value > 0);

  // Subtareas por área
    const byArea = ["Diseño","Copy","Video","Redes","Web","Data"].map(area => {
    const all     = sols.reduce((a,s) => a + s.subtareas.filter(t=>t.area===area).length, 0);
    const done    = sols.reduce((a,s) => a + s.subtareas.filter(t=>t.area===area&&(t.estado==="Aprobada"||t.estado==="Publicada")).length, 0);
    const rev     = sols.reduce((a,s) => a + s.subtareas.filter(t=>t.area===area&&t.estado==="En Revisión").length, 0);
    const chg     = sols.reduce((a,s) => a + s.subtareas.filter(t=>t.area===area&&t.estado==="Cambios Solicitados").length, 0);
    const active  = sols.reduce((a,s) => a + s.subtareas.filter(t=>t.area===area&&(t.estado==="Pendiente"||t.estado==="En Producción")).length, 0);
    const members = equipo.filter(m=>m.area===area&&m.activo);
    return { area, all, done, rev, chg, active, pct: all ? Math.round(done/all*100) : 0, members };
  }).filter(a => a.all > 0);

  // Solicitudes por tipo
    const byTipo = Object.entries(
    sols.reduce((acc,s) => { acc[s.tipo]=(acc[s.tipo]||0)+1; return acc; }, {})
  ).sort((a,b)=>b[1]-a[1]);

  // Actividad reciente
    const eventos = [];
  sols.forEach(sol => {
    sol.subtareas.forEach(st => {
      (st.historial||[]).forEach(ev => {
        if (ev.ts && ev.tipo!=="creada") eventos.push({ ...ev, solTitulo:sol.datos.titulo||sol.tipo, stTipo:st.tipo, area:st.area, sol });
      });
    });
  });
  eventos.sort((a,b) => new Date(b.ts)-new Date(a.ts));
    const recentEvents = eventos.slice(0,10);

  // Próximos deadlines — sorted by urgency
    const today = new Date();
    const allDeadlines = [];
  sols.forEach(sol => {
    sol.subtareas.forEach(st => {
      if (st.deadline && !["Aprobada","Publicada","Rechazada"].includes(st.estado)) {
        const d   = new Date(st.deadline);
        const diff = Math.ceil((d - today) / 86400000);
        if (diff >= -2) allDeadlines.push({ ...st, solTitulo:sol.datos.titulo||sol.tipo, diff, sol });
      }
    });
  });
  allDeadlines.sort((a,b) => a.diff - b.diff);
    const criticals  = allDeadlines.filter(d => d.diff <= 2);
    const upcoming   = allDeadlines.filter(d => d.diff > 2 && d.diff <= 14);

  // Workload per person
    const memberWorkload = equipo.filter(m=>m.activo).map(m => {
    const active  = sols.reduce((a,s)=>a+s.subtareas.filter(t=>t.asignadoId===m.id&&(t.estado==="Pendiente"||t.estado==="En Producción"||t.estado==="Cambios Solicitados")).length,0);
    const inRev   = sols.reduce((a,s)=>a+s.subtareas.filter(t=>t.asignadoId===m.id&&t.estado==="En Revisión").length,0);
    const done    = sols.reduce((a,s)=>a+s.subtareas.filter(t=>t.asignadoId===m.id&&(t.estado==="Aprobada"||t.estado==="Publicada")).length,0);
    const total   = active + inRev + done;
    const pct     = total ? Math.round((done)/total*100) : 0;
    // Next deadline for this person
    const nextDL  = allDeadlines.filter(t=>t.asignadoId===m.id)[0];
    return { ...m, active, inRev, done, total, pct, nextDL };
  }).sort((a,b) => {
    // Sort: overdue first, then by active tasks descending
    const aUrgent = a.active + a.inRev;
    const bUrgent = b.active + b.inRev;
    return bUrgent - aUrgent;
  });

  // By proyecto
    const byProyecto = Object.entries(
      sols.reduce((acc,s) => { acc[s.proyecto]=(acc[s.proyecto]||0)+1; return acc;},{})
    ).sort((a,b)=>b[1]-a[1]).slice(0,6);

    const now = new Date();
    const hora = now.getHours();
    const saludo = hora<12?"Buenos días":hora<18?"Buenas tardes":"Buenas noches";
    const fechaHoy = now.toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
    return { totalSols,totalST,aprobST,revST,cambiosST,pendST,prodST,pubST,rechST,urgentes,pctGlobal,estadoDist,byArea,byTipo,eventos,recentEvents,allDeadlines,criticals,upcoming,memberWorkload,byProyecto,saludo,fechaHoy };
  }, [sols, equipo]);

  const { totalSols,totalST,aprobST,revST,cambiosST,pendST,prodST,pubST,rechST,urgentes,pctGlobal,estadoDist,byArea,byTipo,eventos,recentEvents,allDeadlines,criticals,upcoming,memberWorkload,byProyecto,saludo,fechaHoy } = stats;


  const AC = {
    "Diseño":{ color:"#E84B2C", icon:"🎨" }, "Copy":{ color:"#3BAD6E", icon:"✍️" },
    "Video": { color:"#4A90C4", icon:"🎬" }, "Redes":{ color:"#9B59B6", icon:"📱" },
    "Web":   { color:"#F5A623", icon:"🌐" }, "Data": { color:"#0EA5E9", icon:"📊" },
  };

  const EV_CFG = {
    enviada:   { label:"Entrega recibida",    color:"#4A90C4", icon:"📤" },
    reenviada: { label:"Versión corregida",   color:"#4A90C4", icon:"🔄" },
    aprobada:  { label:"Aprobada",            color:"#3BAD6E", icon:"✅" },
    rechazada: { label:"Rechazada",           color:"#EF4444", icon:"❌" },
    cambios:   { label:"Cambios solicitados", color:"#F5A623", icon:"⚠️" },
    publicada: { label:"Publicada",           color:"#9B59B6", icon:"📱" },
    estado:    { label:"Estado actualizado",  color:"#8B5CF6", icon:"🔀" },
  };


  // ── User switch modal ──────────────────────────────────────────
  const switchModalJSX = () => (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.7)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)"}} onClick={()=>setShowSwitch(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,width:"min(420px,96vw)",overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,.3)"}}>
        <div style={{background:"#2B3A5C",padding:"20px 24px",borderBottom:"3px solid #E84B2C"}}>
          <div style={{fontFamily:"Outfit,sans-serif",fontSize:17,fontWeight:800,color:"#fff"}}>¿Cómo quieres entrar?</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.45)",marginTop:3}}>Selecciona tu rol o área de trabajo</div>
        </div>
        <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:8}}>
          {USUARIOS.map(u=>{
            const isA = usuario?.id===u.id;
            return (
              <button key={u.id} onClick={()=>{
                if(u.rol==="director"){
                  setPendingDirector(true);
                  setShowSwitch(false);
                  onOpenPlatform();
                } else {
                  setUsuario(u);
                  setShowSwitch(false);
                  onOpenPlatform();
                }
              }}
                style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:12,border:`2px solid ${isA?u.color:"#E2E8F0"}`,background:isA?`${u.color}0D`:"#fff",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=u.color;e.currentTarget.style.background=`${u.color}08`;}}
                onMouseLeave={e=>{if(!isA){e.currentTarget.style.borderColor="#E2E8F0";e.currentTarget.style.background="#fff";}}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${u.color},${u.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{u.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{u.rol==="director"?"Director de Marketing":u.area}</div>
                  <div style={{fontSize:11,color:"#94A3B8",marginTop:1}}>{u.rol==="director"?"🔐 Requiere contraseña":`Área de ${u.area}`}</div>
                </div>
                {isA&&<span style={{fontSize:14,color:u.color}}>✓</span>}
              </button>
            );
          })}
        </div>
        <div style={{padding:"0 20px 16px"}}>
          <button onClick={()=>setShowSwitch(false)} style={{width:"100%",padding:"10px",borderRadius:10,border:"1px solid #E2E8F0",background:"#F8FAFC",color:"#64748B",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:"#0F172A",fontFamily:"'Outfit',sans-serif",color:"#E2E8F0",overflowX:"hidden"}}>
      {showSwitch && switchModalJSX()}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,.04)}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse2{0%,100%{opacity:1}50%{opacity:.4}}
        .dc{animation:fadeUp .4s ease both}
        .dc:nth-child(1){animation-delay:.04s}.dc:nth-child(2){animation-delay:.08s}.dc:nth-child(3){animation-delay:.12s}
        .dc:nth-child(4){animation-delay:.16s}.dc:nth-child(5){animation-delay:.20s}.dc:nth-child(6){animation-delay:.24s}
        .pulse{animation:pulse2 2s infinite}
        .dcard{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px}
        .dcard-dark{background:rgba(0,0,0,.2);border:1px solid rgba(255,255,255,.06);border-radius:16px;padding:18px}
        .dh{font-family:'Outfit',sans-serif;font-weight:800;font-size:11px;letter-spacing:.8px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:12px}
        .btn-enter{transition:all .2s;cursor:pointer}
        .btn-enter:hover{transform:translateY(-2px);filter:brightness(1.1)}
        /* Responsive */
        .d-wrap{padding:24px 28px;max-width:1440px;margin:0 auto}
        .d-kpi{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:20px}
        .d-row1{display:grid;grid-template-columns:220px 1fr 1fr;gap:16px;margin-bottom:16px}
        .d-row2{display:grid;grid-template-columns:1.8fr 1fr;gap:16px;margin-bottom:16px}
        .d-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
        @media(max-width:1279px){
          .d-kpi{grid-template-columns:repeat(4,1fr)}
          .d-row1{grid-template-columns:1fr 1fr}
          .d-row2{grid-template-columns:1fr}
          .d-row3{grid-template-columns:1fr 1fr}
        }
        @media(max-width:767px){
          .d-wrap{padding:14px 14px}
          .d-kpi{grid-template-columns:repeat(2,1fr);gap:6px;margin-bottom:14px}
          .d-row1{grid-template-columns:1fr;gap:12px;margin-bottom:12px}
          .d-row2{grid-template-columns:1fr;gap:12px;margin-bottom:12px}
          .d-row3{grid-template-columns:1fr;gap:12px}
          .dcard{padding:14px}.dcard-dark{padding:14px}
        }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header style={{background:"linear-gradient(90deg,#1E293B,#2B3A5C)",borderBottom:"2px solid rgba(232,75,44,.5)",padding:isMobile?"10px 16px":"0 32px",minHeight:isMobile?54:64,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 20px rgba(0,0,0,.4)",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <img src={LOGO_URL} alt="Casta Latina" style={{height:isMobile?34:46,objectFit:"contain",filter:"brightness(1.15)"}}/>
          {!isMobile&&<>
            <div style={{width:1,height:24,background:"rgba(255,255,255,.12)"}}/>
            <div>
              <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.35)",letterSpacing:1.6}}>MARKETING PLATFORM</div>
              <div style={{fontFamily:"Outfit,sans-serif",fontSize:13,fontWeight:800,color:"#fff",letterSpacing:.3}}>Panel Ejecutivo</div>
            </div>
          </>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {/* Live indicator */}
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",background:"rgba(59,173,110,.12)",borderRadius:20,border:"1px solid rgba(59,173,110,.25)"}}>
            <div className="pulse" style={{width:6,height:6,borderRadius:"50%",background:"#3BAD6E"}}/>
            <span style={{fontSize:9,color:"#3BAD6E",fontWeight:700,letterSpacing:.6}}>EN VIVO</span>
          </div>
          {!isMobile&&<div style={{fontSize:10,color:"rgba(255,255,255,.3)",padding:"0 4px"}}>{fechaHoy}</div>}
          <button className="btn-enter" onClick={()=>setShowSwitch(true)}
            style={{display:"flex",alignItems:"center",gap:6,padding:isMobile?"8px 12px":"9px 20px",borderRadius:10,background:"linear-gradient(135deg,#E84B2C,#C0392B)",border:"none",color:"#fff",fontSize:isMobile?12:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 3px 14px rgba(232,75,44,.4)"}}>
            Abrir Plataforma {!isMobile&&"→"}
          </button>
        </div>
      </header>

      <div className="d-wrap">
        {/* ── BUSCADOR PÚBLICO ──────────────────────────────────────────── */}
        <div style={{marginBottom:isMobile?20:28}}>
          {/* Label */}
          <div style={{marginBottom:10}}>
            <div style={{fontFamily:"Outfit,sans-serif",fontSize:isMobile?14:16,fontWeight:800,color:"rgba(255,255,255,.9)",letterSpacing:.3}}>
              🔍 Consulta el estado de una solicitud
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:3}}>
              Busca por nombre del proyecto, solicitante, palabra clave o código de referencia
            </div>
          </div>
          {/* Barra */}
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <div style={{flex:1,position:"relative"}}>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,pointerEvents:"none",opacity:.5}}>🔍</span>
              <input
                value={queryDash}
                onChange={e=>{setQueryDash(e.target.value);if(!e.target.value.trim())setResultsDash(null);}}
                onKeyDown={e=>{
                  if(e.key==="Enter"){
                    const q=queryDash.trim().toLowerCase();
                    if(!q){setResultsDash(null);return;}
                    const found=sols.filter(s=>
                      (s.refCode||"").toLowerCase().includes(q)||
                      (s.datos.titulo||"").toLowerCase().includes(q)||
                      (s.solicitante||"").toLowerCase().includes(q)||
                      (s.proyecto||"").toLowerCase().includes(q)||
                      (s.tipo||"").toLowerCase().includes(q)||
                      Object.values(s.datos).some(v=>typeof v==="string"&&v.toLowerCase().includes(q))
                    );
                    setResultsDash(found);
                  }
                }}
                placeholder="Ej: &quot;Webinar Ontario&quot;, &quot;Karla&quot;, &quot;Atrévete&quot;, &quot;CL-2026-1001&quot;..."
                style={{width:"100%",padding:"13px 14px 13px 42px",borderRadius:12,border:"1.5px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none",backdropFilter:"blur(4px)"}}
              />
            </div>
            <button onClick={()=>{
              const q=queryDash.trim().toLowerCase();
              if(!q){setResultsDash(null);return;}
              const found=sols.filter(s=>
                (s.refCode||"").toLowerCase().includes(q)||
                (s.datos.titulo||"").toLowerCase().includes(q)||
                (s.solicitante||"").toLowerCase().includes(q)||
                (s.proyecto||"").toLowerCase().includes(q)||
                (s.tipo||"").toLowerCase().includes(q)||
                Object.values(s.datos).some(v=>typeof v==="string"&&v.toLowerCase().includes(q))
              );
              setResultsDash(found);
            }}
              style={{padding:"13px 22px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#E84B2C,#C0392B)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",boxShadow:"0 3px 14px rgba(232,75,44,.35)"}}>
              Buscar
            </button>
            {resultsDash!==null&&(
              <button onClick={()=>{setResultsDash(null);setQueryDash("");}}
                style={{padding:"13px 16px",borderRadius:12,border:"1px solid rgba(255,255,255,.1)",background:"rgba(255,255,255,.06)",color:"rgba(255,255,255,.5)",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                ✕
              </button>
            )}
          </div>

          {/* ── Resultados ── */}
          {resultsDash!==null&&(
            <div>
              {resultsDash.length===0?(
                <div style={{textAlign:"center",padding:"28px 20px",background:"rgba(255,255,255,.04)",borderRadius:14,border:"1px solid rgba(255,255,255,.08)"}}>
                  <div style={{fontSize:28,marginBottom:8}}>🔎</div>
                  <div style={{fontSize:14,color:"rgba(255,255,255,.5)",fontWeight:600}}>No se encontraron solicitudes para "{queryDash}"</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.25)",marginTop:4}}>Prueba con otro nombre, proyecto o código</div>
                </div>
              ):(
                <div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:10,fontWeight:600}}>
                    {resultsDash.length} resultado{resultsDash.length!==1?"s":""} encontrado{resultsDash.length!==1?"s":""}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    {resultsDash.map(sol=>{
                      const cfg=TIPO_CFG[sol.tipo]||TIPO_CFG["Otras Solicitudes"];
                      const titulo=sol.datos.titulo||sol.tipo;
                      const tST=sol.subtareas.length;
                      const aST=sol.subtareas.filter(t=>t.estado==="Aprobada"||t.estado==="Publicada").length;
                      const pct=tST?Math.round(aST/tST*100):0;

                      // Build pipeline stages
                      const ETAPAS=[
                        {id:"Pendiente",       label:"Pendiente",    icon:"⏳", color:"#94A3B8"},
                        {id:"En Producción",   label:"En Producción",icon:"⚙️", color:"#4A90C4"},
                        {id:"En Revisión",     label:"Revisión",     icon:"🔔", color:"#8B5CF6"},
                        {id:"Aprobada",        label:"Aprobada",     icon:"✅", color:"#3BAD6E"},
                        {id:"Publicada",       label:"Publicada",    icon:"📱", color:"#9B59B6"},
                      ];
                      // Determine the furthest active stage
                      const stageOrder={"Pendiente":0,"En Producción":1,"Cambios Solicitados":1,"En Revisión":2,"Aprobada":3,"Publicada":4,"Rechazada":2};
                      const maxStage=sol.subtareas.reduce((mx,st)=>Math.max(mx,stageOrder[st.estado]??0),0);
                      const hasChanges=sol.subtareas.some(t=>t.estado==="Cambios Solicitados");
                      const hasRejected=sol.subtareas.some(t=>t.estado==="Rechazada");

                      // Next deadline
                      const nextDL=sol.subtareas
                        .filter(t=>t.deadline&&!["Aprobada","Publicada","Rechazada"].includes(t.estado))
                        .sort((a,b)=>a.deadline>b.deadline?1:-1)[0];
                      const today=new Date();
                      const dlDiff=nextDL?Math.ceil((new Date(nextDL.deadline)-today)/86400000):null;

                      // Areas involved
                      const areasInv=[...new Set(sol.subtareas.map(t=>t.area).filter(Boolean))];

                      return(
                        <div key={sol.id}
                          style={{background:"rgba(255,255,255,.05)",border:`1px solid ${sol.urgente?"rgba(232,75,44,.4)":"rgba(255,255,255,.1)"}`,borderRadius:16,overflow:"hidden",transition:"all .2s"}}
                          onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.transform="translateY(-1px)";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.transform="translateY(0)";}}>

                          {/* Card top: color stripe */}
                          <div style={{height:3,background:`linear-gradient(90deg,${cfg.color},${cfg.color}44)`}}/>

                          <div style={{padding:"16px 18px"}}>
                            {/* Header row */}
                            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:12}}>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:5}}>
                                  <span style={{fontSize:10,fontWeight:700,color:cfg.color,background:`${cfg.color}20`,border:`1px solid ${cfg.color}35`,borderRadius:5,padding:"2px 8px"}}>{cfg.icon} {sol.tipo}</span>
                                  {sol.refCode&&<span style={{fontSize:10,fontWeight:700,color:"#93C5FD",background:"rgba(74,144,196,.2)",border:"1px solid rgba(74,144,196,.3)",borderRadius:5,padding:"2px 8px"}}>🔖 {sol.refCode}</span>}
                                  {sol.urgente&&<span style={{fontSize:10,fontWeight:700,color:"#FCA5A5",background:"rgba(232,75,44,.2)",border:"1px solid rgba(232,75,44,.3)",borderRadius:5,padding:"2px 8px"}}>⚡ Urgente</span>}
                                  {sol.estado==="cerrada"&&<span style={{fontSize:10,fontWeight:700,color:"#6EE7B7",background:"rgba(59,173,110,.2)",border:"1px solid rgba(59,173,110,.3)",borderRadius:5,padding:"2px 8px"}}>📦 Archivada</span>}
                                </div>
                                <div style={{fontSize:16,fontWeight:800,color:"#fff",lineHeight:1.2,fontFamily:"Outfit,sans-serif"}}>{titulo}</div>
                                <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginTop:3}}>
                                  👤 {sol.solicitante} · 📁 {sol.proyecto}
                                  {sol.ts_creacion&&<span style={{marginLeft:6,opacity:.6}}>· {fmtTs(sol.ts_creacion)}</span>}
                                </div>
                              </div>
                              {/* Pct circle */}
                              <div style={{textAlign:"center",flexShrink:0}}>
                                <div style={{width:52,height:52,borderRadius:"50%",border:`3px solid ${pct===100?"#3BAD6E":cfg.color}`,display:"flex",alignItems:"center",justifyContent:"center",background:`${pct===100?"rgba(59,173,110,.15)":cfg.color+"15"}`}}>
                                  <span style={{fontSize:13,fontWeight:800,color:pct===100?"#3BAD6E":cfg.color}}>{pct}%</span>
                                </div>
                                <div style={{fontSize:9,color:"rgba(255,255,255,.3)",marginTop:3}}>avance</div>
                              </div>
                            </div>

                            {/* ── PIPELINE DE FLUJO ── */}
                            <div style={{marginBottom:14}}>
                              <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.3)",letterSpacing:.6,marginBottom:8}}>FLUJO DE TRABAJO</div>
                              <div style={{display:"flex",alignItems:"center",gap:0,overflowX:"auto",paddingBottom:4}}>
                                {ETAPAS.map((etapa,idx)=>{
                                  const stCount=sol.subtareas.filter(t=>t.estado===etapa.id||(etapa.id==="Aprobada"&&t.estado==="Aprobada")||(etapa.id==="Publicada"&&t.estado==="Publicada")).length;
                                  const isActive=stageOrder[etapa.id]===maxStage&&stCount>0;
                                  const isDone=stageOrder[etapa.id]<maxStage;
                                  const hasItems=stCount>0;
                                  return(
                                    <div key={etapa.id} style={{display:"flex",alignItems:"center",flex:1,minWidth:0}}>
                                      <div style={{
                                        flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                                        padding:"8px 4px",borderRadius:10,
                                        background:isActive?`${etapa.color}18`:isDone?"rgba(59,173,110,.08)":"rgba(255,255,255,.03)",
                                        border:`1.5px solid ${isActive?etapa.color:isDone?"rgba(59,173,110,.3)":"rgba(255,255,255,.06)"}`,
                                        transition:"all .2s"
                                      }}>
                                        <div style={{
                                          width:28,height:28,borderRadius:"50%",
                                          background:isActive?etapa.color:isDone?"#3BAD6E":"rgba(255,255,255,.08)",
                                          display:"flex",alignItems:"center",justifyContent:"center",
                                          fontSize:14,flexShrink:0
                                        }}>
                                          {isDone?"✓":etapa.icon}
                                        </div>
                                        <div style={{fontSize:isMobile?8:9,fontWeight:700,color:isActive?etapa.color:isDone?"#3BAD6E":"rgba(255,255,255,.3)",textAlign:"center",lineHeight:1.2,whiteSpace:"nowrap"}}>{etapa.label}</div>
                                        {hasItems&&<div style={{fontSize:8,fontWeight:700,color:isActive?etapa.color:"rgba(59,173,110,.7)",background:isActive?`${etapa.color}22`:"rgba(59,173,110,.1)",padding:"1px 5px",borderRadius:3}}>{stCount}</div>}
                                      </div>
                                      {idx<ETAPAS.length-1&&(
                                        <div style={{width:isMobile?8:12,height:2,background:stageOrder[ETAPAS[idx+1].id]<=maxStage?"rgba(59,173,110,.4)":"rgba(255,255,255,.08)",flexShrink:0}}/>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              {/* Alerts */}
                              {(hasChanges||hasRejected)&&(
                                <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                                  {hasChanges&&<div style={{fontSize:10,color:"#FDE68A",background:"rgba(245,166,35,.15)",border:"1px solid rgba(245,166,35,.25)",borderRadius:6,padding:"3px 9px",fontWeight:600}}>⚠️ {sol.subtareas.filter(t=>t.estado==="Cambios Solicitados").length} tarea(s) con cambios solicitados</div>}
                                  {hasRejected&&<div style={{fontSize:10,color:"#FCA5A5",background:"rgba(239,68,68,.15)",border:"1px solid rgba(239,68,68,.25)",borderRadius:6,padding:"3px 9px",fontWeight:600}}>❌ {sol.subtareas.filter(t=>t.estado==="Rechazada").length} rechazada(s)</div>}
                                </div>
                              )}
                            </div>

                            {/* ── Barra de progreso + detalles ── */}
                            <div style={{marginBottom:12}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                                <span style={{fontSize:11,color:"rgba(255,255,255,.5)",fontWeight:600}}>{aST}/{tST} subtareas completadas</span>
                                {nextDL&&<span style={{fontSize:11,fontWeight:700,color:dlDiff<=0?"#FCA5A5":dlDiff<=3?"#FDE68A":"rgba(255,255,255,.4)"}}>🗓 {dlDiff<=0?"Vencido":dlDiff===0?"Hoy":dlDiff===1?"Mañana":`${dlDiff}d`} · {nextDL.deadline}</span>}
                              </div>
                              <div style={{height:7,background:"rgba(255,255,255,.08)",borderRadius:4,overflow:"hidden"}}>
                                <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#3BAD6E":`linear-gradient(90deg,${cfg.color},${cfg.color}bb)`,borderRadius:4,transition:"width .5s ease"}}/>
                              </div>
                            </div>

                            {/* ── Áreas involucradas ── */}
                            <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                              {areasInv.map(area=>{
                                const ac2=ac(area);
                                const tot=sol.subtareas.filter(t=>t.area===area).length;
                                const ap=sol.subtareas.filter(t=>t.area===area&&(t.estado==="Aprobada"||t.estado==="Publicada")).length;
                                const p2=tot?Math.round(ap/tot*100):0;
                                return(
                                  <div key={area} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:6,background:`${ac2.color}15`,border:`1px solid ${ac2.color}30`}}>
                                    <span style={{fontSize:12}}>{ac2.icon}</span>
                                    <span style={{fontSize:10,fontWeight:700,color:ac2.color}}>{area}</span>
                                    <span style={{fontSize:9,color:"rgba(255,255,255,.35)"}}>{ap}/{tot}</span>
                                    {p2===100&&<span style={{fontSize:9,color:"#3BAD6E"}}>✓</span>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── GREETING ── */}
        <div style={{marginBottom:isMobile?14:22}}>
          <div style={{fontFamily:"Outfit,sans-serif",fontSize:isMobile?18:24,fontWeight:800,color:"#fff",lineHeight:1.15}}>
            {saludo}, Director 👋
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.35)",marginTop:4}}>
            Vista ejecutiva en tiempo real · {totalSols} solicitudes · {totalST} subtareas · {pctGlobal}% completado
          </div>
        </div>

        {/* ── ROW 0: KPIs ─────────────────────────────────────────────── */}
        <div className="d-kpi">
          {[
            { label:"Solicitudes",   val:totalSols,          color:"#fff",        sub:`${sols.filter(s=>s.ts_completado).length} completas`, accent:"#4A90C4" },
            { label:"Subtareas",     val:totalST,            color:"#fff",        sub:`global`, accent:"#2B3A5C" },
            { label:"Avance",        val:`${pctGlobal}%`,    color:"#3BAD6E",     sub:`${aprobST} aprobadas`, accent:"#3BAD6E" },
            { label:"En Revisión",   val:revST,              color:"#8B5CF6",     sub:"esperan aprobación", accent:"#8B5CF6", pulse:revST>0 },
            { label:"Con Cambios",   val:cambiosST,          color:"#F5A623",     sub:"requieren ajuste", accent:"#F5A623", pulse:cambiosST>0 },
            { label:"Publicadas",    val:pubST,              color:"#9B59B6",     sub:"en vivo", accent:"#9B59B6" },
            { label:"Urgentes",      val:urgentes,           color:"#E84B2C",     sub:"prioridad alta", accent:"#E84B2C", pulse:urgentes>0 },
          ].map((k,i)=>(
            <div key={i} className="dc" style={{background:"rgba(255,255,255,.05)",border:`1px solid ${k.pulse?k.accent+"60":"rgba(255,255,255,.08)"}`,borderTop:`3px solid ${k.accent}`,borderRadius:12,padding:"12px 14px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,right:0,width:60,height:60,background:`${k.accent}08`,borderRadius:"0 0 0 60px"}}/>
              {k.pulse&&<div className="pulse" style={{position:"absolute",top:8,right:8,width:6,height:6,borderRadius:"50%",background:k.color}}/>}
              <div style={{fontFamily:"Outfit,sans-serif",fontSize:"clamp(18px,2.5vw,26px)",fontWeight:800,color:k.color,lineHeight:1,marginBottom:4}}>{k.val}</div>
              <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.7)"}}>{k.label}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,.3)",marginTop:2}}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── ROW 1: Donut + Areas + Tipo Breakdown ─────────────────────── */}
        <div className="d-row1" style={{marginBottom:16}}>

          {/* DONUT */}
          <div className="dcard dc" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,minHeight:220}}>
            <div className="dh" style={{alignSelf:"flex-start"}}>Estado Global</div>
            <Donut data={estadoDist} size={isMobile?110:140} thickness={isMobile?16:22} label={`${pctGlobal}%`} sublabel="completado"/>
            <div style={{width:"100%",display:"flex",flexDirection:"column",gap:5,marginTop:4}}>
              {estadoDist.map((d,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0}}/>
                  <span style={{fontSize:10,color:"rgba(255,255,255,.55)",flex:1}}>{d.name}</span>
                  <span style={{fontSize:10,fontWeight:700,color:d.color}}>{d.value}</span>
                  <span style={{fontSize:9,color:"rgba(255,255,255,.2)",width:26,textAlign:"right"}}>{totalST?Math.round(d.value/totalST*100):0}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* AREA PROGRESS */}
          <div className="dcard dc">
            <div className="dh">Avance por Área</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {byArea.length===0&&<div style={{color:"rgba(255,255,255,.2)",fontSize:12,textAlign:"center",padding:"20px 0"}}>Sin datos</div>}
              {byArea.map(a=>{
                const areaCfg = AC[a.area]||{color:"#64748B",icon:"📋"};
                return(
                  <div key={a.area}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:16}}>{areaCfg.icon}</span>
                        <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.85)"}}>{a.area}</span>
                        {a.rev>0&&<span style={{fontSize:9,background:"rgba(139,92,246,.2)",color:"#C4B5FD",padding:"1px 5px",borderRadius:3,fontWeight:700}}>🔔{a.rev}</span>}
                        {a.chg>0&&<span style={{fontSize:9,background:"rgba(245,166,35,.2)",color:"#FDE68A",padding:"1px 5px",borderRadius:3,fontWeight:700}}>⚠️{a.chg}</span>}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>{a.done}/{a.all}</span>
                        <span style={{fontSize:12,fontWeight:800,color:areaCfg.color}}>{a.pct}%</span>
                      </div>
                    </div>
                    <Bar pct={a.pct} color={areaCfg.color} h={7}/>
                    {a.members.length>0&&(
                      <div style={{display:"flex",gap:4,marginTop:5,flexWrap:"wrap"}}>
                        {a.members.map(m=>{
                          const mActive = sols.reduce((acc,s)=>acc+s.subtareas.filter(t=>t.asignadoId===m.id&&!["Aprobada","Publicada","Rechazada"].includes(t.estado)).length,0);
                          return(
                            <div key={m.id} title={`${m.nombre} — ${mActive} tarea(s) activa(s)`}
                              style={{display:"flex",alignItems:"center",gap:3,padding:"1px 6px",borderRadius:5,background:`${m.color}18`,border:`1px solid ${m.color}30`}}>
                              <div style={{width:14,height:14,borderRadius:"50%",background:`linear-gradient(135deg,${m.color},${m.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:800,color:"#fff"}}>{m.avatar}</div>
                              <span style={{fontSize:9,color:m.color,fontWeight:700}}>{m.nombre.split(" ")[0]}</span>
                              {mActive>0&&<span style={{fontSize:8,color:"rgba(255,255,255,.3)"}}>·{mActive}</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TIPO + PROYECTO */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="dcard dc" style={{flex:1}}>
              <div className="dh">Por Tipo de Contenido</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {byTipo.map(([tipo,count])=>{
                  const cfg=TIPO_CFG[tipo]||TIPO_CFG["Otras Solicitudes"];
                  const pct=totalSols?Math.round(count/totalSols*100):0;
                  return(
                    <div key={tipo}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <span style={{fontSize:13}}>{cfg.icon}</span>
                          <span style={{fontSize:11,color:"rgba(255,255,255,.7)",fontWeight:600}}>{tipo}</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:9,color:"rgba(255,255,255,.25)"}}>{pct}%</span>
                          <span style={{fontSize:12,fontWeight:700,color:cfg.color,minWidth:16,textAlign:"right"}}>{count}</span>
                        </div>
                      </div>
                      <Bar pct={pct} color={cfg.color} h={4}/>
                    </div>
                  );
                })}
                {byTipo.length===0&&<div style={{color:"rgba(255,255,255,.2)",fontSize:12,textAlign:"center",padding:"16px 0"}}>Sin solicitudes</div>}
              </div>
            </div>
            <div className="dcard dc">
              <div className="dh">Por Proyecto</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {byProyecto.map(([proy,count])=>(
                  <div key={proy} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0"}}>
                    <span style={{fontSize:11,color:"rgba(255,255,255,.5)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📁 {proy}</span>
                    <div style={{height:3,width:36,background:"rgba(255,255,255,.08)",borderRadius:3,overflow:"hidden",flexShrink:0}}>
                      <div style={{width:`${Math.round(count/totalSols*100)}%`,height:"100%",background:"#4A90C4",borderRadius:3}}/>
                    </div>
                    <span style={{fontSize:11,fontWeight:700,color:"#fff",minWidth:14,textAlign:"right"}}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Solicitudes urgentes/activas + Actividad ─────────────── */}
        <div className="d-row2">

          {/* SOLICITUDES PANEL */}
          <div className="dcard dc">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div className="dh" style={{margin:0}}>Solicitudes Activas</div>
              <button onClick={()=>setShowSwitch(true)}
                style={{fontSize:11,color:"#E84B2C",fontWeight:700,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                Ver todas →
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10,maxHeight:340,overflow:"auto"}}>
              {sols.length===0&&<div style={{color:"rgba(255,255,255,.2)",fontSize:12,padding:"20px 0",gridColumn:"1/-1",textAlign:"center"}}>Sin solicitudes</div>}
              {sols.slice().sort((a,b)=>{
                // Sort: urgente first, then by % done ascending (least done = needs attention)
                if(a.urgente&&!b.urgente) return -1;
                if(!a.urgente&&b.urgente) return 1;
                const aPct = a.subtareas.length ? (a.subtareas.filter(t=>t.estado==="Aprobada"||t.estado==="Publicada").length/a.subtareas.length) : 1;
                const bPct = b.subtareas.length ? (b.subtareas.filter(t=>t.estado==="Aprobada"||t.estado==="Publicada").length/b.subtareas.length) : 1;
                return aPct - bPct;
              }).map(sol=>{
                const cfg = TIPO_CFG[sol.tipo]||TIPO_CFG["Otras Solicitudes"];
                const tST = sol.subtareas.length;
                const aST = sol.subtareas.filter(t=>t.estado==="Aprobada"||t.estado==="Publicada").length;
                const rST = sol.subtareas.filter(t=>t.estado==="En Revisión").length;
                const cST = sol.subtareas.filter(t=>t.estado==="Cambios Solicitados").length;
                const pct = tST ? Math.round(aST/tST*100) : 0;
                const needsAttn = rST>0||cST>0;
                return(
                  <div key={sol.id} onClick={()=>setShowSwitch(true)}
                    style={{background:needsAttn?"rgba(139,92,246,.08)":"rgba(255,255,255,.03)",border:`1px solid ${needsAttn?"rgba(139,92,246,.3)":"rgba(255,255,255,.06)"}`,borderRadius:10,padding:"10px 12px",cursor:"pointer",transition:"all .14s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.07)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background=needsAttn?"rgba(139,92,246,.08)":"rgba(255,255,255,.03)";}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
                      <span style={{fontSize:16}}>{cfg.icon}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:700,color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{sol.datos.titulo||sol.tipo}</div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>{sol.proyecto}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:12,fontWeight:800,color:pct===100?"#3BAD6E":cfg.color}}>{pct}%</div>
                        <div style={{fontSize:9,color:"rgba(255,255,255,.25)"}}>{aST}/{tST}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <div style={{flex:1,height:4,background:"rgba(255,255,255,.08)",borderRadius:4,overflow:"hidden"}}>
                        <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#3BAD6E":cfg.color,borderRadius:4,transition:"width .4s"}}/>
                      </div>
                      {sol.urgente&&<span style={{fontSize:9,color:"#E84B2C",fontWeight:700}}>⚡</span>}
                      {rST>0&&<span style={{fontSize:9,background:"rgba(139,92,246,.25)",color:"#C4B5FD",padding:"0 4px",borderRadius:3,fontWeight:700}}>🔔{rST}</span>}
                      {cST>0&&<span style={{fontSize:9,background:"rgba(245,166,35,.25)",color:"#FDE68A",padding:"0 4px",borderRadius:3,fontWeight:700}}>⚠️{cST}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVIDAD RECIENTE */}
          <div className="dcard dc">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div className="dh" style={{margin:0}}>Actividad Reciente</div>
              {(()=>{const h24=eventos.filter(e=>new Date(e.ts)>new Date(Date.now()-86400000)).length;return h24>0&&<span style={{fontSize:9,background:"rgba(232,75,44,.2)",color:"#FCA5A5",padding:"2px 7px",borderRadius:10,fontWeight:700}}>🔴 {h24} hoy</span>;})()}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:0,maxHeight:340,overflow:"auto"}}>
              {recentEvents.length===0&&<div style={{color:"rgba(255,255,255,.2)",fontSize:12,textAlign:"center",padding:"20px 0"}}>Sin actividad aún</div>}
              {recentEvents.map((ev,i)=>{
                const cfg = EV_CFG[ev.tipo]||{label:ev.tipo,color:"#94A3B8",icon:"·"};
                const areaCfg = ev.area?AC[ev.area]:null;
                return(
                  <div key={i} style={{display:"flex",gap:8,position:"relative",paddingBottom:10}}>
                    {i<recentEvents.length-1&&<div style={{position:"absolute",left:13,top:26,bottom:0,width:1,background:"rgba(255,255,255,.06)"}}/>}
                    <div style={{width:27,height:27,borderRadius:"50%",background:`${cfg.color}20`,border:`1.5px solid ${cfg.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0,zIndex:1}}>
                      {cfg.icon}
                    </div>
                    <div style={{flex:1,paddingTop:1}}>
                      <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,.75)",lineHeight:1.3}}>
                        <span style={{color:cfg.color}}>{cfg.label}</span>
                        {areaCfg&&<span style={{fontSize:9,marginLeft:4,color:areaCfg.color}}>{areaCfg.icon}</span>}
                      </div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,.3)",marginTop:1,lineHeight:1.3}}>
                        {ev.stTipo} · {ev.solTitulo?.substring(0,28)}{(ev.solTitulo?.length||0)>28?"...":""}
                      </div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,.2)",marginTop:1}}>{fmtTs(ev.ts)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── ROW 3: Deadlines Críticos + Próximos + Carga del Equipo ─────── */}
        <div className="d-row3">

          {/* CRÍTICOS / VENCIDOS */}
          <div className="dcard dc">
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
              <div className="dh" style={{margin:0}}>Deadlines Críticos</div>
              {criticals.length>0&&<div className="pulse" style={{width:7,height:7,borderRadius:"50%",background:"#EF4444",flexShrink:0}}/>}
            </div>
            {criticals.length===0?(
              <div style={{textAlign:"center",padding:"20px 0",color:"rgba(255,255,255,.2)",fontSize:12}}>
                ✅ Sin vencimientos inmediatos
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {criticals.slice(0,6).map((dl,i)=>{
                  const areaCfg = dl.area?AC[dl.area]:{color:"#64748B",icon:"📋"};
                  const isOverdue = dl.diff < 0;
                  const isToday = dl.diff === 0;
                  const color = isOverdue?"#EF4444":isToday?"#F5A623":"#FCA5A5";
                  const member = dl.asignadoId ? equipo.find(m=>m.id===dl.asignadoId) : null;
                  return(
                    <div key={i} style={{padding:"8px 10px",borderRadius:10,background:"rgba(239,68,68,.08)",border:`1px solid rgba(239,68,68,${isOverdue?.35:.15})`}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:15}}>{areaCfg.icon}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:11,fontWeight:700,color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{dl.tipo}</div>
                          <div style={{fontSize:9,color:"rgba(255,255,255,.35)"}}>{dl.solTitulo?.substring(0,24)}{(dl.solTitulo?.length||0)>24?"...":""}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:11,fontWeight:800,color}}>{isOverdue?`${Math.abs(dl.diff)}d vencido`:isToday?"Hoy":`${dl.diff}d`}</div>
                          {member&&<div style={{fontSize:9,color:"rgba(255,255,255,.3)"}}>{member.nombre.split(" ")[0]}</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {upcoming.length>0&&(
              <div style={{marginTop:12}}>
                <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.25)",letterSpacing:.6,marginBottom:8}}>PRÓXIMOS 14 DÍAS ({upcoming.length})</div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {upcoming.slice(0,5).map((dl,i)=>{
                    const areaCfg = dl.area?AC[dl.area]:{color:"#64748B",icon:"📋"};
                    const member = dl.asignadoId ? equipo.find(m=>m.id===dl.asignadoId) : null;
                    return(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 8px",borderRadius:8,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)"}}>
                        <span style={{fontSize:13}}>{areaCfg.icon}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,.65)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{dl.tipo}</div>
                          {member&&<div style={{fontSize:9,color:"rgba(255,255,255,.3)"}}>{member.nombre.split(" ")[0]}</div>}
                        </div>
                        <span style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.4)",flexShrink:0}}>{dl.diff}d</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* CARGA DEL EQUIPO */}
          <div className="dcard dc">
            <div className="dh">Carga del Equipo</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:400,overflow:"auto"}}>
              {memberWorkload.length===0&&<div style={{color:"rgba(255,255,255,.2)",fontSize:12,textAlign:"center",padding:"20px 0"}}>Sin miembros activos</div>}
              {memberWorkload.map(m=>{
                const areaCfg = AC[m.area]||{color:"#64748B",icon:"📋"};
                const total = m.active+m.inRev+m.done;
                return(
                  <div key={m.id} style={{padding:"10px 12px",borderRadius:10,background:"rgba(255,255,255,.03)",border:`1px solid rgba(255,255,255,${m.inRev>0||m.active>0?.1:.05})`}}>
                    <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}>
                      <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${m.color},${m.color}80)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",flexShrink:0}}>{m.avatar}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.85)"}}>{m.nombre}</span>
                          <span style={{fontSize:10}}>{areaCfg.icon}</span>
                        </div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>{m.rol}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        {total===0
                          ? <span style={{fontSize:10,color:"rgba(255,255,255,.2)",fontStyle:"italic"}}>libre</span>
                          : <><div style={{fontSize:11,fontWeight:700,color:m.color}}>{m.pct}%</div>
                            <div style={{fontSize:9,color:"rgba(255,255,255,.25)"}}>{m.done}/{total}</div></>
                        }
                      </div>
                    </div>
                    {total>0&&<Bar pct={m.pct} color={m.color} h={5}/>}
                    <div style={{display:"flex",gap:5,marginTop:5,flexWrap:"wrap"}}>
                      {m.active>0&&<span style={{fontSize:9,background:"rgba(74,144,196,.2)",color:"#93C5FD",padding:"1px 6px",borderRadius:4,fontWeight:700}}>⚙️ {m.active} activa{m.active!==1?"s":""}</span>}
                      {m.inRev>0&&<span style={{fontSize:9,background:"rgba(139,92,246,.2)",color:"#C4B5FD",padding:"1px 6px",borderRadius:4,fontWeight:700}}>🔔 {m.inRev} revisión</span>}
                      {m.nextDL&&<span style={{fontSize:9,background:"rgba(245,166,35,.15)",color:"#FDE68A",padding:"1px 6px",borderRadius:4,fontWeight:700}}>📅 {m.nextDL.diff<=0?"Vencida":m.nextDL.diff===1?"Mañana":`${m.nextDL.diff}d`}</span>}
                      {total===0&&<span style={{fontSize:9,color:"rgba(255,255,255,.2)"}}>Sin tareas asignadas</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVIDAD RECIENTE (mini) + Próximos deadlines resumen */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="dcard dc" style={{flex:1}}>
              <div className="dh">Resumen por Estado</div>
              {[
                { label:"Pendiente",           val:pendST,    color:"#94A3B8", icon:"⏳" },
                { label:"En Producción",       val:prodST,    color:"#4A90C4", icon:"⚙️" },
                { label:"En Revisión",         val:revST,     color:"#8B5CF6", icon:"🔔" },
                { label:"Cambios Solicitados", val:cambiosST, color:"#F5A623", icon:"⚠️" },
                { label:"Aprobada",            val:aprobST-pubST, color:"#3BAD6E", icon:"✅" },
                { label:"Publicada",           val:pubST,     color:"#9B59B6", icon:"📱" },
                { label:"Rechazada",           val:rechST,    color:"#EF4444", icon:"❌" },
              ].filter(s=>s.val>0).map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontSize:13,flexShrink:0}}>{s.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:10,color:"rgba(255,255,255,.55)",fontWeight:600}}>{s.label}</span>
                      <span style={{fontSize:10,fontWeight:700,color:s.color}}>{s.val}</span>
                    </div>
                    <Bar pct={totalST?Math.round(s.val/totalST*100):0} color={s.color} h={4}/>
                  </div>
                </div>
              ))}
              {totalST===0&&<div style={{color:"rgba(255,255,255,.2)",fontSize:12,textAlign:"center",padding:"12px 0"}}>Sin datos</div>}
            </div>
          </div>
        </div>

        <div style={{marginTop:20,textAlign:"center",fontSize:10,color:"rgba(255,255,255,.15)",paddingBottom:8}}>
          Casta Latina Marketing Platform · Panel Ejecutivo · Datos sincronizados en tiempo real
        </div>
      </div>
    </div>
  );
}


// ─── ROOT APP ─────────────────────────────────────────────────────────────────
function SyncBadge({syncStatus}) {
  if (!syncStatus) return null;
  return (
    <div style={{position:"fixed",bottom:60,right:16,zIndex:9001,padding:"6px 14px",borderRadius:8,
      background:syncStatus==="saved"?"#3BAD6E":"#E84B2C",color:"#fff",fontSize:11,fontWeight:700,
      boxShadow:"0 2px 10px rgba(0,0,0,.3)"}}>
      {syncStatus==="saved"?"✓ Guardado":"⚠️ Error"}
    </div>
  );
}

export default function App() {
  const [view, setView]        = useState("dashboard");
  const [sols, setSolsRaw]     = useState(null);
  const [equipo, setEquipoRaw] = useState(null);
  const [usuario, setUsuario]  = useState(USUARIOS[1]);
  const [pendingDirector, setPendingDirector] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const syncTimer = useRef(null);
  const isFirstSols  = useRef(true);
  const isFirstEquipo = useRef(true);

  const flashSync = useCallback((s) => {
    setSyncStatus(s);
    if (syncTimer.current) clearTimeout(syncTimer.current);
    if (s === "saved") syncTimer.current = setTimeout(() => setSyncStatus(null), 1500);
  }, []);

  // ── Load on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const s = localStorage.getItem("cls_sols");
      const e = localStorage.getItem("cls_equipo");
      setSolsRaw(s ? JSON.parse(s) : DEMO_PLAIN());
      setEquipoRaw(e ? JSON.parse(e) : EQUIPO_INICIAL);
      if (!s) localStorage.setItem("cls_sols",   JSON.stringify(DEMO_PLAIN()));
      if (!e) localStorage.setItem("cls_equipo", JSON.stringify(EQUIPO_INICIAL));
    } catch {
      setSolsRaw(DEMO_PLAIN());
      setEquipoRaw(EQUIPO_INICIAL);
    }
  }, []);

  // ── Persist sols whenever it changes ──────────────────────────────────
  useEffect(() => {
    if (sols === null) return;
    if (isFirstSols.current) { isFirstSols.current = false; return; }
    try { localStorage.setItem("cls_sols", JSON.stringify(sols)); flashSync("saved"); }
    catch { flashSync("error"); }
  }, [sols]);

  // ── Persist equipo whenever it changes ────────────────────────────────
  useEffect(() => {
    if (equipo === null) return;
    if (isFirstEquipo.current) { isFirstEquipo.current = false; return; }
    try { localStorage.setItem("cls_equipo", JSON.stringify(equipo)); flashSync("saved"); }
    catch { flashSync("error"); }
  }, [equipo]);
  // State initialized directly — no localStorage in artifact env

  // ── Simple state setters ──────────────────────────────────────────────
  const setSols = useCallback((updater) => {
    setSolsRaw(prev => typeof updater === "function" ? updater(prev || []) : updater);
  }, []);

  const setEquipo = useCallback((updater) => {
    setEquipoRaw(prev => typeof updater === "function" ? updater(prev || []) : updater);
  }, []);

  // ── Loading ───────────────────────────────────────────────────────────


  // SyncBadge is defined outside App (see below)

  if (sols === null || equipo === null) return (
    <div style={{minHeight:"100vh",background:"#F1F5F9",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{fontSize:14,color:"#94A3B8",fontWeight:600}}>Cargando plataforma…</div>
    </div>
  );

  if (view === "dashboard") return (
    <>
      <ExecutiveDashboard sols={sols} equipo={equipo} usuario={usuario}
        setUsuario={setUsuario} setPendingDirector={setPendingDirector}
        onOpenPlatform={() => setView("platform")}/>
      <SyncBadge syncStatus={syncStatus}/>
    </>
  );

  return (
    <div style={{position:"relative"}}>
      <PlatformApp sols={sols} setSols={setSols} equipo={equipo} setEquipo={setEquipo}
        usuario={usuario} setUsuario={setUsuario}
        pendingDirectorInit={pendingDirector}
        clearPendingDirector={() => setPendingDirector(false)}
        onGoHome={() => setView("dashboard")}/>
      <SyncBadge syncStatus={syncStatus}/>
      <button onClick={() => setView("dashboard")}
        style={{position:"fixed",bottom:16,right:16,zIndex:9000,padding:"9px 14px",borderRadius:10,
          background:"#2B3A5C",color:"#fff",fontSize:12,fontWeight:700,border:"none",cursor:"pointer",
          fontFamily:"'Outfit',sans-serif",boxShadow:"0 4px 16px rgba(43,58,92,.3)",
          display:"flex",alignItems:"center",gap:6}}>
        📊 Dashboard
      </button>
    </div>
  );
}

// ── DEMO_PLAIN: DEMO but with buildSubtareas already resolved ─────────────────
function DEMO_PLAIN() {
  return [
    {
      id:"demo-1", refCode:"CL-2026-1001", tipo:"Webinar", proyecto:"Atrévete a Emprender", estado:"activa",
      solicitante:"Karla Casanova", email:"karla.casanova@castalatina.org",
      area_solicitante:"Eventos y Proyectos", urgente:false,
      ts_creacion:"2026-02-20T14:30:00.000Z", ts_completado:null,
      datos:{titulo:"Lanza tu negocio en Ontario",fecha:"2026-04-09 19:00 ET",descripcion:"Webinar educativo para emprendedores latinos en Ontario.",link_zoom:"https://zoom.us/j/example",host:"Karla Casanova",invitado1:"Florentina Fernández — Consultora de Negocios",carpeta:"https://drive.google.com/drive/folders/example"},
      notas:[], subtareas: buildSubtareas("Webinar","2026-02-20"),
    },
    {
      id:"demo-2", refCode:"CL-2026-1002", tipo:"Video / Reel / Cápsula", proyecto:"Atrévete a Emprender", estado:"activa",
      solicitante:"Laura Salamanca", email:"laura.salamanca@castalatina.org",
      area_solicitante:"Eventos y Proyectos", urgente:false,
      ts_creacion:"2026-02-24T10:25:00.000Z", ts_completado:null,
      datos:{titulo:"Recap Webinar Febrero",descripcion:"Cápsula de 60 segundos con los mejores momentos del webinar de febrero.",carpeta:"https://drive.google.com/drive/folders/example"},
      notas:[], subtareas: buildSubtareas("Video / Reel / Cápsula","2026-02-24"),
    },
  ];
}
