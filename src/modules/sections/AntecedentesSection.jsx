import React from 'react'
import Icon from '../../icons/Icons.jsx'

const KEYS = [
  { k: 'alergias', label: 'Alergias', icon: 'alert', danger: true },
  { k: 'enfermedades', label: 'Enfermedades', icon: 'doc' },
  { k: 'cirugias', label: 'Cirugías', icon: 'activity' },
  { k: 'hospitalizaciones', label: 'Hospitalizaciones', icon: 'shield' },
  { k: 'familiares', label: 'Antecedentes familiares', icon: 'users' },
  { k: 'personales', label: 'Antecedentes personales', icon: 'user' },
  { k: 'habitos', label: 'Hábitos', icon: 'clock' },
  { k: 'medicamentos', label: 'Medicamentos actuales', icon: 'pill' },
  { k: 'observaciones', label: 'Observaciones', icon: 'doc' },
]

export function AntecedentesSection({ patient }) {
  const h = patient.history || {}
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
      {KEYS.map(({ k, label, icon, danger }) => {
        const v = h[k]
        const has = v && String(v).trim() && v !== 'Ninguna' && v !== 'NA' && v !== 'Ninguna conocida.'
        return (
          <div key={k} className="card" style={{ padding: 16, borderColor: danger && has ? 'color-mix(in srgb, var(--danger) 40%, transparent)' : undefined }}>
            <div className="row" style={{ marginBottom: 8 }}>
              <Icon name={icon} size={16} style={{ color: danger && has ? 'var(--danger)' : 'var(--accent)' }} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>{label}</span>
            </div>
            <div className="muted" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
              {v ? String(v) : (<span style={{ color: 'var(--text-3)', fontStyle: 'italic' }}>Sin registro</span>)}
            </div>
          </div>
        )
      })}
    </div>
  )
}