import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import Icon from '../icons/Icons.jsx'
import { Badge } from './ui.jsx'

const NAV = [
  { id: 'agenda', label: 'Agenda', icon: 'calendar' },
  { id: 'pacientes', label: 'Pacientes', icon: 'users' },
  { id: 'expediente', label: 'Expediente', icon: 'folder' },
]

export default function AppShell({ children }) {
  const { view, setView, theme, setTheme, toast } = useApp()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const todayCount = 0

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
        <button className="nav-item" onClick={() => setSettingsOpen(true)}>
          <span className="nav-ico"><Icon name="settings" size={20} /></span>
          <span>Configuración</span>
        </button>
        <button className="nav-item">
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
            <input placeholder="Buscar pacientes, citas o expedientes…" aria-label="Búsqueda global" />
            <span style={{ color: 'var(--text-3)', fontSize: 12 }}>⌘K</span>
          </div>
          <div style={{ flex: 1 }} />
          <button className="icon-btn"><Icon name="bell" size={19} /><span className="dot" /></button>
          <div className="seg" aria-label="Cambiar tema visual">
            <button className={theme === 'magic-frames' ? 'active' : ''} title="Magic Frames" onClick={() => { setTheme('magic-frames'); toast('Tema Magic Frames activado') }}>
              <Icon name="spark" size={16} />
            </button>
            <button className={theme === 'talenta' ? 'active' : ''} title="Talenta" onClick={() => { setTheme('talenta'); toast('Tema Talenta activado') }}>
              <Icon name="grid" size={16} />
            </button>
            <button className={theme === 'base' ? 'active' : ''} title="Base" onClick={() => { setTheme('base'); toast('Tema Base activado') }}>
              <Icon name="checkCircle" size={16} />
            </button>
          </div>
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
          <button key="mas" className={`nav-item ${settingsOpen ? 'active' : ''}`} onClick={() => setSettingsOpen(true)}>
            <span className="nav-ico"><Icon name="more" size={22} /></span>
            <span style={{ fontSize: 12 }}>Más</span>
          </button>
        </nav>
      </div>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}

function Avatar({ name, size }) {
  const ini = name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.4 }}>{ini}</div>
}

export function SettingsModal({ onClose }) {
  const { theme, setTheme, specialty, setSpecialty, toast } = useApp()
  const THEMES = [
    { id: 'magic-frames', label: 'Magic Frames', desc: 'AI · premium · futurista', style: { background: 'linear-gradient(120deg,#6EE7F9,#7C6CF0)' } },
    { id: 'talenta', label: 'Talenta', desc: 'profesional · corporativo · confiable', style: { background: 'linear-gradient(120deg,#1F6FEB,#0A3D91)' } },
    { id: 'base', label: 'Base', desc: 'simple · profesional · universal', style: { background: 'linear-gradient(120deg,#10B981,#0B8A65)' } },
  ]
  const SPECIALTIES = [
    'medicina', 'odontologia', 'psicologia', 'nutricion', 'fisioterapia', 'pediatria', 'ginecologia', 'dermatologia',
  ]
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <Modal open title="Configuración" onClose={onClose}>
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

      <div>
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
              <div style={{ height: 54, borderRadius: 8, background: t.style, marginBottom: 10, position: 'relative' }}>
                {theme === t.id && <span style={{ position: 'absolute', top: 4, right: 4, color: '#fff' }}><Icon name="checkCircle" size={18} /></span>}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{t.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt2">
        <div className="ui-label" style={{ marginBottom: 8 }}>Referencia del sistema</div>
        <div className="card" style={{ fontSize: 13, color: 'var(--text-2)' }}>
          AGENDA · PACIENTES · EXPEDIENTE — módulos universales configurables por especialidad.<br />
          Simple por fuera. Potente por dentro.
        </div>
      </div>
    </Modal>
  )
}