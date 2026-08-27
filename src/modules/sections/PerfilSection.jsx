import React from 'react'
import { Avatar } from '../../components/ui.jsx'
import Icon from '../../icons/Icons.jsx'

function Info({ label, value }) {
  return (
    <div style={{ padding: '12px 14px', background: 'var(--bg-surface-sunk)', borderRadius: 12 }}>
      <div className="ui-label" style={{ marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{value || '—'}</div>
    </div>
  )
}

export function PerfilSection({ patient }) {
  return (
    <div className="card">
      <div className="card-header"><div className="card-title">Perfil del paciente</div></div>
      <div className="row" style={{ marginBottom: 18, gap: 16 }}>
        <Avatar name={patient.name} size={80} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 22, fontFamily: 'var(--font-display)' }}>{patient.name}</div>
          <div className="muted">{patient.age} años · {patient.sex}</div>
          <div className="row" style={{ marginTop: 8, gap: 6 }}>{patient.tags?.map((t) => <a key={t} style={{ color: 'var(--accent)', fontSize: 13 }}>#{t}</a>)}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        <Info label="Teléfono" value={patient.phone} />
        <Info label="Email" value={patient.email} />
        <Info label="Dirección" value={patient.address} />
        <Info label="Ocupación" value={patient.occupation} />
        <Info label="Estado civil" value={patient.civil} />
        <Info label="Fecha de alta" value={patient.joined} />
        <Info label="Identificador" value={patient.id?.toUpperCase()} />
        <Info label="Notas" value="—" />
      </div>
      <div className="card-header" style={{ marginTop: 20 }}><div className="card-title row"><Icon name="user" size={15} style={{ color: 'var(--warn)' }} />Contacto de emergencia</div></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        <Info label="Nombre" value={patient.emergency?.name} />
        <Info label="Relación" value={patient.emergency?.relation} />
        <Info label="Teléfono" value={patient.emergency?.phone} />
      </div>
    </div>
  )
}