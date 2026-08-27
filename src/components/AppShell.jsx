import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import Icon from '../icons/Icons.jsx'
import { Badge, Modal, Field } from './ui.jsx'
import { THEMES } from '../theme/tokens.js'

const NAV = [
  { id: 'agenda', label: 'Agenda', icon: 'calendar' },
  { id: 'pacientes', label: 'Pacientes', icon: 'users' },
  { id: 'expediente', label: 'Expediente', icon: 'folder' },
]

export default function AppShell({ children }) {
  const { view, setView, toast } = useApp()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState('general')

  const openSettings = (tab = 'general') => { setSettingsTab(tab); setSettingsOpen(true) }

  return (
    <div className="app">
      <aside className="sidebar" aria-label="Navegación principal">
        <div className="brand">
          <div className="brand-mark"><Icon name="plus" size={20} stroke={2.4} /></div>
          <div>
            <div className="brand-name">Ágora Clínica</div>
            <div className="brand-sub">Plataforma de atención</div>
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

        <div className="card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Avatar name="Elena Ruiz" size={36} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>Dra. Elena Ruiz</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Odontóloga · Consultorio 2</div>
            </div>
          </div>
          <div className="row">
            <Badge tone="accent">● En línea</Badge>
            <button className="icon-btn" style={{ marginLeft: 'auto' }}><Icon name="logout" size={16} /></button>
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
          <button className="icon-btn" aria-label="Notificaciones"><Icon name="bell" size={19} /><span className="dot" /></button>
          <button className="icon-btn" aria-label="Cambiar tema visual" title="Cambiar tema" onClick={() => openSettings('apariencia')}>
            <Icon name="spark" size={19} />
          </button>
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
  const { theme, setTheme, specialty, setSpecialty, toast } = useApp()
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
          <Field label="Especialidad principal">
            <div className="select-wrap">
              <select className="select" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                {SPECIALTIES.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
              </select>
            </div>
            <div className="muted" style={{ fontSize: 12.5 }}>
              El expediente se adapta a tu especialidad. El núcleo (agenda, pacientes, resumen) es universal.
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