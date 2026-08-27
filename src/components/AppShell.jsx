import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import Icon from '../icons/Icons.jsx'
import { Modal, Field } from './ui.jsx'
import { THEMES } from '../theme/tokens.js'

const NAV = [
  { id: 'agenda', label: 'Agenda', icon: 'calendar' },
  { id: 'pacientes', label: 'Pacientes', icon: 'users' },
  { id: 'expediente', label: 'Expediente', icon: 'folder' },
]

export default function AppShell({ children }) {
  const { view, setView, toast, doctor, appointments, patients, patientById, openExpediente } = useApp()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState('general')
  const [notifOpen, setNotifOpen] = useState(false)

  const openSettings = (tab = 'general') => { setSettingsTab(tab); setSettingsOpen(true) }

  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const notifications = (() => {
    const list = []
    // Clínicas: pacientes con una alerta registrada (importante, siempre visibles)
    patients.filter((p) => (p.alerts || []).length > 0).forEach((p) => {
      (p.alerts || []).forEach((a) => {
        list.push({ id: `al-${p.id}-${a}`, kind: 'danger', text: `${p.name}: ${a}`, patientId: p.id })
      })
    })
    // Agenda hoy: relevantes
    appointments
      .filter((a) => a.date === todayKey && (a.status === 'En consulta' || a.status === 'Llegó' || a.status === 'Confirmada'))
      .slice(0, 4)
      .forEach((a) => {
        const pn = patientById(a.patientId)?.name || 'Paciente'
        list.push({ id: `ap-${a.id}`, kind: a.status === 'En consulta' ? 'primary' : 'info', text: `${pn} · ${a.time} — ${a.status}`, patientId: a.patientId, time: a.time })
      })
    // Seguimiento: pacientes con alerta o sin próxima cita
    const nextByPatient = {}
    appointments.forEach((a) => { if (a.date >= todayKey && (!nextByPatient[a.patientId] || a.date < nextByPatient[a.patientId].date)) nextByPatient[a.patientId] = a })
    patients.forEach((p) => {
      if (!nextByPatient[p.id]) list.push({ id: `fol-${p.id}`, kind: 'warn', text: `${p.name} necesita programar su próxima cita`, patientId: p.id })
    })
    return list
  })()

  return (
    <div className="app">
      <aside className="sidebar" aria-label="Navegación principal">
        <div className="brand">
          <div className="brand-mark"><Icon name="plus" size={20} stroke={2.4} /></div>
          <div style={{ minWidth: 0 }}>
            <div className="brand-name" style={{ fontSize: 17, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {doctor.name}
            </div>
            <div className="brand-sub">{doctor.title}</div>
          </div>
        </div>

        <div className="nav-group-label">Atención</div>
        {NAV.map((n) => (
          <button
            key={n.id}
            className={`nav-item ${view === n.id ? 'active' : ''}`}
            onClick={() => setView(n.id)}
            aria-current={view === n.id ? 'page' : undefined}
          >
            <span className="nav-ico"><Icon name={n.icon} size={20} /></span>
            <span>{n.label}</span>
            {n.id === 'agenda' && <span className="nav-badge">hoy</span>}
          </button>
        ))}

        <div className="nav-group-label" style={{ marginTop: 18 }}>Sistema</div>
        <button className="nav-item" onClick={() => openSettings('general')}>
          <span className="nav-ico"><Icon name="settings" size={20} /></span>
          <span>Configuración</span>
        </button>
        <button className="nav-item" onClick={() => openSettings('plantillas')}>
          <span className="nav-ico"><Icon name="layers" size={20} /></span>
          <span>Plantillas</span>
        </button>

        <div style={{ flex: 1 }} />

        <div className="sidebar-prof">
          <Avatar name={doctor.name} size={38} />
          <div style={{ minWidth: 0 }}>
            <div className="sidebar-prof-name">{doctor.name}</div>
            <div className="sidebar-prof-title">{doctor.title}</div>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-search">
            <Icon name="search" size={17} />
            <input className="search-input" placeholder="Buscar pacientes, citas…" aria-label="Búsqueda global" />
            <span className="kbd-hint" style={{ color: 'var(--text-3)', fontSize: 12 }}>⌘K</span>
          </div>
          <div style={{ flex: 1 }} />
          <button
            className={`icon-btn ${notifOpen ? 'active' : ''}`}
            aria-label="Notificaciones"
            aria-haspopup="true"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((o) => !o)}
          >
            <Icon name="bell" size={19} />
            {notifications.length > 0 && <span className="dot">{notifications.length <= 9 ? notifications.length : '9+'}</span>}
          </button>
          <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} items={notifications} onOpenPatient={openExpediente} doctorName={doctor.name} />
        </header>

        <div className="app-content">{children}</div>

        {/* Mobile bottom nav */}
        <nav className="tabnav" aria-label="Navegación inferior">
          {NAV.map((n) => (
            <button key={n.id} className={`nav-item ${view === n.id ? 'active' : ''}`} onClick={() => setView(n.id)}>
              <span className="nav-ico"><Icon name={n.icon} size={22} /></span>
              <span style={{ fontSize: 12 }}>{n.label}</span>
            </button>
          ))}
          <button key="mas" className={`nav-item ${settingsOpen ? 'active' : ''}`} onClick={() => openSettings('general')}>
            <span className="nav-ico"><Icon name="more" size={22} /></span>
            <span style={{ fontSize: 12 }}>Más</span>
          </button>
        </nav>
      </div>

      {settingsOpen && <SettingsModal tab={settingsTab} onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}

function NotificationPanel({ open, onClose, items, onOpenPatient, doctorName }) {
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open, onClose])
  if (!open) return null
  const kinds = {
    danger: 'var(--danger)', primary: 'var(--accent)', info: 'var(--info, var(--text-3))', warn: 'var(--warn)',
  }
  return (
    <div ref={ref} className="notif-panel" role="dialog" aria-label="Notificaciones y alertas">
      <div className="notif-head">
        <div style={{ fontWeight: 700, fontSize: 14 }}>Alertas · {doctorName}</div>
        <button className="icon-btn notif-close" aria-label="Cerrar notificaciones" onClick={onClose}>
          <Icon name="x" size={16} />
        </button>
      </div>
      <div className="notif-body">
        {items.length === 0 && <div className="muted" style={{ padding: 18, textAlign: 'center' }}>Sin nuevas alertas.</div>}
        {items.map((it) => (
          <button key={it.id} className="notif-item" onClick={() => { onOpenPatient(it.patientId, 'resumen'); onClose() }}>
            <span className="notif-badge" style={{ background: kinds[it.kind] || 'var(--text-3)', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div className="notif-txt">{it.text}</div>
              <div className="notif-meta">{it.kind === 'danger' ? 'Alerta clínica' : it.time ? `Cita ${it.time}` : 'Seguimiento'}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="notif-foot">
        <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  )
}

function Avatar({ name, size }) {
  const ini = name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.4 }}>{ini}</div>
}

const TEMPLATE_PRESETS = [
  { id: 'consulta', label: 'Consulta', desc: 'Motivo · evaluación · diagnóstico · tratamiento', icon: 'activity' },
  { id: 'nutricion', label: 'Nutrición', desc: 'Peso · cintura · objetivos · plan alimentario', icon: 'leaf' },
  { id: 'sesion', label: 'Sesión psicológica', desc: 'Temas · observaciones · acuerdos · tareas', icon: 'brain' },
  { id: 'fisio', label: 'Fisioterapia', desc: 'Dolor · movilidad · ejercicios · series', icon: 'body' },
]

const TemplateField = ({ value, onChange }) => {
  const FIELDS = [
    { id: 'text', label: 'Texto' }, { id: 'long', label: 'Texto largo' },
    { id: 'number', label: 'Número' }, { id: 'scale', label: 'Escala 0-10' },
    { id: 'date', label: 'Fecha' }, { id: 'select', label: 'Selector' },
  ]
  return (
    <div className="row" style={{ marginBottom: 8, gap: 8 }}>
      <div className="select-wrap grow">
        <select className="select" value={value.type} onChange={(e) => onChange({ ...value, type: e.target.value })}>
          {FIELDS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
      </div>
      <input
        className="input grow"
        placeholder="Etiqueta del campo (p. ej. Nivel de ansiedad)"
        value={value.label}
        onChange={(e) => onChange({ ...value, label: e.target.value })}
      />
      <button className="icon-btn" aria-label="Quitar campo" onClick={() => onChange(null)}>
        <Icon name="trash" size={15} />
      </button>
    </div>
  )
}

export function SettingsModal({ onClose, tab = 'general' }) {
  const { theme, setTheme, specialty, setSpecialty, doctor, setDoctor, toast } = useApp()
  const [active, setActive] = useState(tab)
  const [activeTemplate, setActiveTemplate] = useState('consulta')
  const [fields, setFields] = useState([
    { type: 'long', label: 'Motivo de consulta' },
    { type: 'select', label: 'Diagnóstico principal' },
  ])
  const SPECIALTIES = [
    'medicina', 'odontologia', 'psicologia', 'nutricion', 'fisioterapia', 'pediatria', 'ginecologia', 'dermatologia',
  ]
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

  const updateField = (i, v) => {
    if (v === null) { setFields((f) => f.filter((_, idx) => idx !== i)); return }
    setFields((f) => f.map((x, idx) => (idx === i ? v : x)))
  }

  return (
    <Modal open title="Configuración" onClose={onClose} wide>
      <div className="tabs" role="tablist" style={{ marginBottom: 18 }}>
        {[['general', 'General', 'settings'], ['apariencia', 'Apariencia', 'spark'], ['plantillas', 'Plantillas', 'layers']].map(([id, label, ic]) => (
          <button key={id} role="tab" aria-selected={active === id}
            className={`tab ${active === id ? 'active' : ''}`} onClick={() => setActive(id)}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name={ic} size={15} />{label}</span>
          </button>
        ))}
      </div>

      {active === 'general' && (
        <>
          <div className="ui-label" style={{ marginBottom: 10 }}>Perfil profesional</div>
          <div className="card" style={{ marginBottom: 16 }}>
            <Field label="Nombre del profesional">
              <input className="input" value={doctor.name} onChange={(e) => setDoctor({ ...doctor, name: e.target.value })} placeholder="Dra. Elena Ruiz" />
            </Field>
            <Field label="Especialidad / título">
              <input className="input" value={doctor.title} onChange={(e) => setDoctor({ ...doctor, title: e.target.value })} placeholder="Especialista en Odontología" />
            </Field>
            <div className="muted" style={{ fontSize: 12.5 }}>
              Así te identifica la plataforma en la navegación y en tus alertas.
            </div>
          </div>

          <Field label="Especialidad clínica">
            <div className="select-wrap">
              <select className="select" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                {SPECIALTIES.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
              </select>
            </div>
            <div className="muted" style={{ fontSize: 12.5 }}>
              Configura el módulo de expediente (odontología, psicología, nutrición…). El núcleo (agenda, pacientes, resumen) es universal.
            </div>
          </Field>

          <div className="mt2">
            <div className="ui-label" style={{ marginBottom: 8 }}>Referencia del sistema</div>
            <div className="card" style={{ fontSize: 13, color: 'var(--text-2)' }}>
              AGENDA · PACIENTES · EXPEDIENTE — módulos universales configurables por especialidad.<br />
              Simple por fuera. Potente por dentro.
            </div>
          </div>
        </>
      )}

      {active === 'apariencia' && (
        <>
          <div className="ui-label" style={{ marginBottom: 10 }}>Tema visual</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); toast(`Tema ${t.label} activado`) }}
                style={{
                  padding: 12, borderRadius: 14, border: theme === t.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: 'var(--bg-surface)', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ height: 54, borderRadius: 8, background: `linear-gradient(120deg, ${t.swatch[0]}, ${t.swatch[1]})`, marginBottom: 10, position: 'relative' }}>
                  {theme === t.id && <span style={{ position: 'absolute', top: 4, right: 4, color: '#fff' }}><Icon name="checkCircle" size={18} /></span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{t.label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{t.tagline}</div>
              </button>
            ))}
          </div>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 10 }}>
            6 temas disponibles. Tus temas favoritos se recuerdan en este dispositivo.
          </div>
        </>
      )}

      {active === 'plantillas' && (
        <>
          <div className="ui-label" style={{ marginBottom: 8 }}>Plantillas de consulta</div>
          <div className="row" style={{ flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {TEMPLATE_PRESETS.map((p) => (
              <button key={p.id} className={`chip ${activeTemplate === p.id ? 'active' : ''}`} onClick={() => setActiveTemplate(p.id)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name={p.icon} size={13} />{p.label}</span>
              </button>
            ))}
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div className="card-title">
                {TEMPLATE_PRESETS.find((p) => p.id === activeTemplate)?.label}
              </div>
              <button className="btn btn-sm" onClick={() => setFields((f) => [...f, { type: 'text', label: '' }])}>
                <Icon name="plus" size={14} />Campo
              </button>
            </div>
            <div className="muted" style={{ fontSize: 12.5, marginBottom: 12 }}>
              {TEMPLATE_PRESETS.find((p) => p.id === activeTemplate)?.desc}
            </div>
            {fields.map((f, i) => (
              <TemplateField key={i} value={f} onChange={(v) => updateField(i, v)} />
            ))}
            {fields.length === 0 && (
              <div className="muted" style={{ fontSize: 13, padding: '8px 0' }}>Sin campos personalizados.</div>
            )}
          </div>

          <div className="row" style={{ justifyContent: 'flex-end', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setFields([
              { type: 'long', label: 'Motivo de consulta' },
              { type: 'select', label: 'Diagnóstico principal' },
            ])}>Restablecer</button>
            <button className="btn btn-primary" onClick={() => toast(`Plantilla «${TEMPLATE_PRESETS.find((p) => p.id === activeTemplate)?.label}» guardada`)}>
              <Icon name="check" size={15} />Guardar plantilla
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}