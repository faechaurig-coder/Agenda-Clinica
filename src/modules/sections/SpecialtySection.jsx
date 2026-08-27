import React, { useState } from 'react'
import { Field } from '../../components/ui.jsx'
import { Badge } from '../../components/ui.jsx'
import { Spark, EmptyState } from '../../components/ui.jsx'
import { BODY_MARKERS, ODONTOGRAM_STATES } from '../../data/specialties.js'
import Icon from '../../icons/Icons.jsx'

export function SpecialtySection({ patient, specialtyId }) {
  switch (specialtyId) {
    case 'odontologia': return <Odontologia patient={patient} />
    case 'medicina': return <Medicina patient={patient} />
    case 'pediatria': return <Pediatria patient={patient} />
    case 'psicologia': return <Psicologia patient={patient} />
    case 'nutricion': return <Nutricion patient={patient} />
    case 'fisioterapia': return <Fisioterapia patient={patient} />
    case 'dermatologia': return <Dermatologia patient={patient} />
    case 'ginecologia': return <Ginecologia />
    default: return <EmptyState icon="doc" title="Módulo de especialidad" sub="Personaliza esta vista según tu flujo clínico." />
  }
}

/* ===================== PLANILLA CLÍNICA VITAL ===================== */
function SectionTitle({ children, icon = 'doc' }) {
  return <div className="card-title row" style={{ marginBottom: 2 }}><Icon name={icon} size={16} style={{ color: 'var(--accent)' }} />{children}</div>
}

/* ===================== MEDICINA ===================== */
function Medicina({ patient }) {
  const vs = patient.vitales || []
  const last = vs[vs.length - 1] || {}
  const rows = [
    { l: 'Peso', v: last.peso + ' kg' }, { l: 'Talla', v: last.talla + ' cm' }, { l: 'IMC', v: last.imc },
    { l: 'Presión arterial', v: last.pa }, { l: 'Frecuencia cardiaca', v: last.fc + ' lpm' },
    { l: 'Frecuencia resp.', v: last.fr + ' rpm' }, { l: 'Temperatura', v: last.temp + ' °C' },
    { l: 'Saturación', v: last.sat + ' %' }, { l: 'Glucosa', v: last.glu + ' mg/dL' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div className="card">
        <SectionTitle icon="activity">Signos vitales</SectionTitle>
        <div className="muted" style={{ fontSize: 12 }}>{vs.length ? `Último registro · ${last.date}` : 'Sin registros'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 14 }}>
          {rows.map((r) => <div key={r.l} className="kpi" style={{ padding: 12 }}><div className="ui-label">{r.l}</div><div className="k-value" style={{ fontSize: 18 }}>{r.v || '—'}</div></div>)}
        </div>
        <button className="btn btn-sm mt2"><Icon name="plus" size={13} />Registrar vitales</button>
      </div>
      <div className="card">
        <SectionTitle icon="trend">Evolución</SectionTitle>
        <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>Peso (kg) · últimos registros</div>
        {vs.length > 1 ? <Spark points={vs.map((v) => v.peso)} width={420} height={160} fill="color-mix(in srgb, var(--accent) 14%, transparent)" label="Evolución de peso" /> : <div className="muted">Registra vitales en varias consultas para ver la tendencia.</div>}
      </div>
      <div className="card" style={{ gridColumn: '1/-1' }}>
        <SectionTitle icon="doc">Historia clínica por consulta</SectionTitle>
        <div className="muted" style={{ marginBottom: 14 }}>La exploración, motivo y padecimiento se capturan en cada consulta.</div>
        <DiagnosticList patient={patient} />
      </div>
    </div>
  )
}
function DiagnosticList({ patient }) {
  const diags = patient.consultas?.map((c) => c.diagnostico).filter(Boolean) || []
  return (
    <div className="row wrap" style={{ gap: 8 }}>
      {diags.map((d, i) => <Badge key={i} tone="accent">{d}</Badge>)}
      {!diags.length && <div className="muted">Sin diagnósticos registrados.</div>}
    </div>
  )
}

/* ===================== ODONTOLOGÍA ===================== */
const UPPER = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28']
const LOWER = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38']

function Odontologia({ patient }) {
  const [selected, setSelected] = useState(null)
  const [toothState, setToothState] = useState({})
  const tg = patient.odontograma || {}
  const stateOf = (num) => (toothState[num] || tg[num] || 'sana')
  const names = ODONTOGRAM_STATES

  function select(num) { setSelected(selected === num ? null : num); setToothState((s) => ({ ...s, [num]: s[num] || tg[num] || 'sana' })) }
  function setState(num, st) { setToothState((s) => ({ ...s, [num]: st })) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card">
        <SectionTitle icon="tooth">Odontograma</SectionTitle>
        <div className="muted" style={{ fontSize: 12.5, marginBottom: 6 }}>Selecciona una pieza para editar su estado. Cada pieza conserva historial.</div>
        <div className="row wrap" style={{ gap: 6, marginBottom: 18 }}>
          {Object.entries(names).map(([id, meta]) => (
            <span key={id} className={`badge ${selected?.st === id ? 'badge-accent' : 'badge-plain'}`} style={{ cursor: 'pointer', borderColor: meta.color, color: meta.color }} onClick={() => selected && setState(selected.num, id)}>
              <span className="seed" style={{ background: meta.color }} />{meta.label}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <OdontoRow nums={UPPER} stateOf={stateOf} onSelect={select} selected={selected} />
          <OdontoRow nums={LOWER} stateOf={stateOf} onSelect={select} selected={selected} flip />
        </div>
      </div>
      {selected && (
        <div className="card">
          <SectionTitle icon="edit">Pieza {selected.num}</SectionTitle>
          <div className="muted" style={{ fontSize: 12.5, marginBottom: 12 }}>Estado actual: <b style={{ color: names[stateOf(selected.num)].color }}>{names[stateOf(selected.num)].label}</b></div>
          <div className="row wrap" style={{ gap: 8 }}>
            {Object.entries(names).map(([id, meta]) => (
              <button key={id} className="chip" style={{ borderColor: stateOf(selected.num) === id ? meta.color : undefined, color: stateOf(selected.num) === id ? meta.color : undefined }} onClick={() => setState(selected.num, id)}>
                <span className="seed" style={{ background: meta.color, marginRight: 6 }} />{meta.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
function OdontoRow({ nums, stateOf, onSelect, selected, flip }) {
  // draw as two banks; mirror numbers for lower
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 8 }}>
      {nums.map((num) => {
        const st = stateOf(num)
        const meta = ODONTOGRAM_STATES[st] || ODONTOGRAM_STATES.sana
        const isSel = selected && selected.num === num
        return (
          <button key={num} onClick={() => onSelect(num)} title={`${num} · ${meta.label}`}
            style={{
              width: 40, height: 50, borderRadius: 12, cursor: 'pointer',
              border: isSel ? '2px solid var(--accent)' : '1px solid var(--border)',
              background: `color-mix(in srgb, ${meta.color} 26%, transparent)`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
              boxShadow: isSel ? 'var(--accent-glow)' : 'none',
            }}>
            <span style={{ fontSize: 22, color: meta.color, lineHeight: 1 }}>▮</span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--text-2)' }}>{num}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ===================== PEDIATRÍA ===================== */
function Pediatria({ patient }) {
  const cp = patient.crecimiento || []
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div className="card">
        <SectionTitle icon="child">Crecimiento</SectionTitle>
        {cp.length > 1 ? (
          <>
            <div className="ui-label" style={{ marginBottom: 6 }}>Curva de peso (kg)</div>
            <Spark points={cp.map((c) => c.peso)} width={400} height={130} fill="color-mix(in srgb, var(--accent) 12%, transparent)" label="Curva de peso" />
            <div className="ui-label" style={{ marginTop: 14, marginBottom: 6 }}>Curva de talla (cm)</div>
            <Spark points={cp.map((c) => c.talla)} width={400} height={110} fill="color-mix(in srgb, var(--ok) 10%, transparent)" stroke="var(--ok)" label="Curva de talla" />
          </>
        ) : <EmptyState icon="trend" title="Registra mediciones" sub="Mínimo 2 mediciones para dibujar las curvas de crecimiento." />}
      </div>
      <div className="card">
        <SectionTitle icon="grid">Desarrollo</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
          {[['Motor', 80], ['Lenguaje', 65], ['Social', 90], ['Cognitivo', 75]].map(([l, v]) => (
            <div key={l}>
              <div className="row between" style={{ fontSize: 13, marginBottom: 6 }}><span className="bold">{l}</span><span className="muted">{v / 10}/10</span></div>
              <div style={{ height: 8, borderRadius: 99, background: 'var(--bg-surface-sunk)', overflow: 'hidden' }}>
                <div style={{ width: `${v}%`, height: '100%', borderRadius: 99, background: 'var(--accent-gradient)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <SectionTitle icon="pill">Alimentación</SectionTitle>
        <Field label="Lactancia"><input className="input" defaultValue="Lactancia materna exclusiva hasta 6 meses" /></Field>
        <Field label="Alimentación complementaria" className="mt1"><input className="input" defaultValue="Iniciada a los 6 meses" /></Field>
      </div>
      <div className="card">
        <SectionTitle icon="user">Perinatal</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
          {[['Embarazo', 'Término'], ['Parto', 'Vaginal'], ['Gestación', '39 sem'], ['Peso al nacer', '3.2 kg'], ['Apgar', '9/10'], ['Complicaciones', 'Ninguna']].map(([l, v]) => (
            <div key={l}><div className="ui-label">{l}</div><div style={{ fontWeight: 600, fontSize: 14 }}>{v}</div></div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ===================== PSICOLOGÍA ===================== */
function Psicologia({ patient }) {
  const sesiones = patient.sesiones || []
  const objetivos = patient.objetivos || []
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card">
        <SectionTitle icon="brain">Objetivos terapéuticos</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
          {objetivos.map((o, i) => (
            <div key={i} className="card" style={{ padding: 14, boxShadow: 'none' }}>
              <div className="row between"><div style={{ fontWeight: 700, flex: 1 }}>{o.objetivo}</div><Badge tone={o.estado === 'En progreso' ? 'warn' : 'ok'}>{o.estado}</Badge></div>
              <div className="row" style={{ marginTop: 10 }}>
                <div style={{ flex: 1, height: 8, borderRadius: 99, background: 'var(--bg-surface-sunk)', overflow: 'hidden' }}>
                  <div style={{ width: `${o.progreso}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: 99 }} />
                </div>
                <span className="mono" style={{ marginLeft: 10, fontSize: 12 }}>{o.progreso}%</span>
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>creado {o.creado} · revisado {o.revisado}</div>
            </div>
          ))}
        </div>
        <button className="btn btn-sm mt2"><Icon name="plus" size={13} />Nuevo objetivo</button>
      </div>
      <div className="card">
        <SectionTitle icon="activity">Sesiones</SectionTitle>
        {sesiones.length ? (
          <div className="timeline mt1">
            {sesiones.map((s, i) => (
              <div key={i} className="tl-item ok">
                <div className="tl-date">{s.date}</div>
                <div className="tl-title">{s.tipo}</div>
                <div className="tl-body row" style={{ flexWrap: 'wrap', gap: 6 }}>{s.temas}</div>
                <div className="tl-body mt1" style={{ fontSize: 12.5, color: 'var(--text-3)' }}>{s.evolucion}</div>
              </div>
            ))}
          </div>
        ) : <EmptyState icon="activity" title="Sin sesiones" sub="Registra la primera sesión terapéutica." />}
        <button className="btn btn-primary mt2" onClick={() => setOpen(true)}><Icon name="plus" size={14} />Registrar sesión</button>
      </div>
      </div>
  )
}

/* ===================== NUTRICIÓN ===================== */
function Nutricion({ patient }) {
  const ev = patient.evaluacionNut || []
  const last = ev[ev.length - 1] || {}
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card">
        <SectionTitle icon="leaf">Evaluación corporal - últim registro</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10, marginTop: 12 }}>
          {[['Peso', last.peso + ' kg'], ['Talla', last.talla + ' cm'], ['IMC', last.imc], ['Cintura', last.cintura + ' cm'], ['Cadera', last.cadera + ' cm'], ['Grasa', last.grasa + ' %'], ['Músculo', last.musculo + ' %']].map(([l, v]) => (
            <div key={l} className="kpi" style={{ padding: 12 }}><div className="ui-label">{l}</div><div className="k-value" style={{ fontSize: 18 }}>{v || '—'}</div></div>
          ))}
        </div>
      </div>
      <div className="card">
        <SectionTitle icon="trend">Evolución de composición (kg)</SectionTitle>
        {ev.length > 1 && <><div className="ui-label" style={{ marginBottom: 6 }}>Peso</div><Spark points={ev.map((e) => e.peso)} width={480} height={120} fill="color-mix(in srgb, var(--accent) 12%, transparent)" label="Peso" /><div className="ui-label" style={{ marginTop: 14, marginBottom: 6 }}>Grasa (%)</div><Spark points={ev.map((e) => e.grasa)} width={480} height={110} stroke="var(--warn)" fill="color-mix(in srgb, var(--warn) 8%, transparent)" label="Grasa" /></>}
      </div>
    </div>
  )
}

/* ===================== FISIOTERAPIA ===================== */
function Fisioterapia({ patient }) {
  const [zone, setZone] = useState(null)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
      <div className="card">
        <SectionTitle icon="body">Mapa corporal</SectionTitle>
        <div style={{ position: 'relative', margin: '12px auto', width: 220, height: 300 }}>
          <BodySilhouette />
          {BODY_MARKERS.filter((m) => !['hombro_izq', 'hombro_der'].includes(m.id)).map((m) => (
            <button key={m.id} title={m.label} onClick={() => setZone(zone === m.id ? null : m.id)}
              style={{ position: 'absolute', left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%,-50%)', width: 16, height: 16, borderRadius: '50%', border: zone === m.id ? '2px solid var(--accent)' : '1px solid var(--border)', background: zone === m.id ? 'var(--accent)' : 'var(--bg-surface)' , zIndex: 2 }} />
          ))}
        </div>
        <div className="muted" style={{ fontSize: 12, textAlign: 'center' }}>Toca una zona del cuerpo para registrar dolor / lesión.</div>
      </div>
      <div className="card">
        <SectionTitle icon="activity">Evaluación</SectionTitle>
        <Field label="Dolor (EVA 0-10)"><input type="range" min="0" max="10" defaultValue="3" style={{ width: '100%', accentColor: 'var(--accent)' }} /></Field>
        <div className="row" style={{ fontSize: 13, marginTop: 4 }}><b>3/10</b><span className="muted">· leve</span></div>
        <Field label="Lesión / zona" className="mt1"><input className="input" placeholder="Lumbar, rodilla…" /></Field>
        <div className="form-row form-grid2 mt1">
          <Field label="Movilidad"><input className="input" placeholder="Conservada" /></Field>
          <Field label="Fuerza"><input className="input" placeholder="4/5" /></Field>
        </div>
        <SectionTitle icon="doc" >Tratamiento</SectionTitle>
        <div className="form-row form-grid3">
          {[['Ejercicio', 'Puente glúteo'], ['Series', '3'], ['Repeticiones', '12']].map(([l, v]) => <Field key={l} label={l}><input className="input" defaultValue={v} /></Field>)}
        </div>
      </div>
    </div>
  )
}
function BodySilhouette() {
  return (
    <svg width="220" height="300" viewBox="0 0 220 300" fill="none" style={{ opacity: 0.5 }}>
      <ellipse cx="110" cy="30" rx="34" ry="38" stroke="var(--text-2)" strokeWidth="2" fill="none" />
      <path d="M78 82c20-12 44-12 64 0 14 40 16 80 16 120H62c0-40 2-80 16-120Z" stroke="var(--text-2)" strokeWidth="2" fill="none" />
      <path d="M94 82 66 130c-8 14-4 30 2 42M126 82l28 48c8 14 4 30-2 42" stroke="var(--text-2)" strokeWidth="2" />
      <path d="M96 180c8 9 20 9 28 0 4 12 4 50 4 74H92c0-24 0-62 4-74ZM60 172v34l-12 58h-4M160 172v34l12 58h4" stroke="var(--text-2)" strokeWidth="2" />
    </svg>
  )
}

/* ===================== DERMATOLOGÍA ===================== */
function Dermatologia({ patient }) {
  const [z, setZ] = useState(null)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 16 }}>
      <div className="card">
        <SectionTitle icon="spark">Mapa corporal</SectionTitle>
        <div style={{ position: 'relative', margin: '12px auto', width: 220, height: 300 }}>
          <BodySilhouette />
          {BODY_MARKERS.map((m) => (
            <button key={m.id} title={m.label} onClick={() => setZ(z === `${m.id}` ? null : `${m.id}`)}
              style={{ position: 'absolute', left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%,-50%)', width: 16, height: 16, borderRadius: '50%', background: z === `${m.id}` ? 'var(--danger)' : 'var(--bg-surface)', border: z === `${m.id}` ? '2px solid var(--danger)' : '1px solid var(--border)', zIndex: 2 }} />
          ))}
        </div>
      </div>
      <div className="card">
        <SectionTitle icon="eye">Lesiones</SectionTitle>
        {z && <div className="row" style={{ margin: '8px 0 14px' }}><Badge tone="warn">Zona seleccionada: {BODY_MARKERS.find((m) => m.id === z)?.label}</Badge></div>}
        <div className="form-row form-grid2">
          <Field label="Fecha"><input type="date" className="input" defaultValue={new Date().toISOString().slice(0, 10)} /></Field>
          <Field label="Lesión"><input className="input" placeholder="Melanocítica, verruga…" /></Field>
          <Field label="Diagnóstico"><input className="input" placeholder="Dermatitis…" /></Field>
          <Field label="Tratamiento"><input className="input" placeholder="Tópico / crioterapia…" /></Field>
        </div>
        <Field label="Observaciones" className="mt1"><textarea className="textarea" placeholder="Describir evolución, tamaño, color…" /></Field>
        <button className="btn btn-primary mt2"><Icon name="plus" size={14} />Registrar lesión</button>
      </div>
    </div>
  )
}

/* ===================== GINECOLOGÍA ===================== */
function Ginecologia() {
  return (
    <EmptyState icon="flower" title="Antecedentes gineco-obstétricos" sub="Menstruación, embarazos, anticoncepción y estudios (ultrasonido, Papanicolaou, colposcopía, mamografía)." action={<button className="btn btn-primary">Configurar módulos</button>} />
  )
}