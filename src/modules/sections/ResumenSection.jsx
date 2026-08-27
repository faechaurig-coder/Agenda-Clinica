import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { Spark, Badge } from '../../components/ui.jsx'
import Icon from '../../icons/Icons.jsx'
import { consultTypeById } from '../../data/specialties.js'

export function ResumenSection({ patient }) {
  const { setRecordTab } = useApp()
  const [range, setRange] = useState(pesos(patient).slice(-6))

  const vs = patient.vitales || []
  const diag = patient.consultas?.reduce((acc, c) => {
    if (c.diagnostico) acc.push(c.diagnostico)
    return acc
  }, []) || []
  const activeDiag = diag.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Cockpit KPIs */}
      <div className="kpi-grid">
        <KPI label="Última consulta" value={fmtShort(patient.lastConsult)} icon="activity" />
        <KPI label="Próxima cita" value={patient.nextAppointment ? fmtShort(patient.nextAppointment) : '—'} icon="calendar" accent />
        <KPI label="Diagnósticos" value={activeDiag || 0} sub={activeDiag ? 'activos' : 'sin registro'} icon="doc" />
        <KPI label="Medicamentos" value={patient.meds?.length || 0} sub={patient.meds?.length ? 'activos' : 'sin registro'} icon="pill" accent2 />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Evolución</div>
              <div className="muted" style={{ fontSize: 12.5 }}>Peso (kg)</div>
            </div>
            <div className="seg">
              {['3', '6', '12'].map((n) => (
                <button key={n} className={range.length === Int(n) ? 'active' : ''} onClick={() => setRange(vs.slice(-Int(n)))}>{n}m</button>
              ))}
            </div>
          </div>
          {vs.length > 1 ? (
            <Spark points={pesos(patient).slice(-range.length).map((v) => v.peso)} width={460} height={150} fill="color-mix(in srgb, var(--accent) 14%, transparent)" label="Gráfica de peso" />
          ) : <div className="muted" style={{ padding: 30, textAlign: 'center' }}>Carga registros de signos vitales para ver evolución.</div>}
        </div>

        {/* Alertas */}
        <div className="card">
          <div className="card-header"><div className="card-title row"><Icon name="alert" size={16} style={{ color: 'var(--danger)' }} />Alertas clínicas</div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {patient.alerts?.length === 0 && <div className="muted">Sin alertas activas.</div>}
            {patient.alerts?.map((a, i) => (
              <div key={i} className="row" style={{ background: 'color-mix(in srgb, var(--danger) 10%, transparent)', borderRadius: 10, padding: '8px 10px', fontSize: 13, fontWeight: 600 }}>
                <Icon name="alert" size={15} style={{ color: 'var(--danger)' }} />{a}
              </div>
            ))}
            {patient.meds?.map((m, i) => (
              <div key={i} className="row" style={{ background: 'color-mix(in srgb, var(--info) 10%, transparent)', borderRadius: 10, padding: '8px 10px', fontSize: 13, fontWeight: 600 }}>
                <Icon name="pill" size={15} style={{ color: 'var(--info)' }} />{m}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        {/* Consultas recientes */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Consultas recientes</div>
            <button className="btn btn-sm btn-ghost" onClick={() => setRecordTab('consultas')}>Ver todas <Icon name="chevR" size={14} /></button>
          </div>
          <div className="timeline">
            {patient.consultas?.slice().reverse().map((c) => {
              const t = consultTypeById(c.type)
              return (
                <div key={c.id} className="tl-item ok">
                  <div className="tl-date">{c.date ? c.date.substring(0, 10) : '—'}</div>
                  <div className="tl-title">{c.tipo || t.label}</div>
                  <div className="tl-body">{c.motivo || c.diagnostico}</div>
                </div>
              )
            })}
            {!patient.consultas?.length && <div className="muted">Sin consultas registradas.</div>}
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="card">
          <div className="card-header"><div className="card-title">Actividad</div></div>
          <div className="timeline">
            <TimelineItem date="26 AGO" title="Consulta de seguimiento" body="HTA controlada · PA 128/82" tone="ok" />
            <TimelineItem date="02 JUL" title="Consulta inicial" body="Ingreso, inicio de tratamiento" tone="accent" />
            <TimelineItem date="18 JUN" title="Vacuna registrada" body="Influenza · lote INF-908" tone="warn" />
          </div>
        </div>
      </div>
    </div>
  )
}

function pesos(p) { return p.vitales || [] }
function Int(n) { return +n }
function fmtShort(d) {
  if (!d) return '—'
  return new Date(d + 'T00:00').toLocaleDateString('es', { day: '2-digit', month: 'short' }).toUpperCase()
}
function KPI({ label, value, sub, icon, accent, accent2 }) {
  const color = accent ? 'var(--accent)' : accent2 ? 'var(--ok)' : 'var(--text-3)'
  return (
    <div className="kpi">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="k-label">{label}</div>
        <Icon name={icon} size={16} style={{ color }} />
      </div>
      <div className="k-value">{value}</div>
      {sub && <div className="k-sub">{sub}</div>}
    </div>
  )
}
function TimelineItem({ date, title, body, tone }) {
  const toneCls = tone === 'ok' ? 'ok' : tone === 'warn' ? 'warn' : ''
  return (
    <div className={`tl-item ${toneCls}`}>
      <div className="tl-date">{date}</div>
      <div className="tl-title">{title}</div>
      <div className="tl-body">{body}</div>
    </div>
  )
}