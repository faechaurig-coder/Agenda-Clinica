import React from 'react'
import { useApp } from '../context/AppContext.jsx'
import Icon from '../icons/Icons.jsx'
import { Avatar, Badge } from '../components/ui.jsx'
import { specialtyById } from '../data/specialties.js'
import { ResumenSection } from './sections/ResumenSection.jsx'
import { PerfilSection } from './sections/PerfilSection.jsx'
import { AntecedentesSection } from './sections/AntecedentesSection.jsx'
import { ConsultasSection } from './sections/ConsultasSection.jsx'
import { UniversalSection } from './sections/UniversalSection.jsx'
import { SpecialtySection } from './sections/SpecialtySection.jsx'

const UNIVERSAL_TABS = [
  { id: 'resumen', label: 'Resumen', icon: 'grid' },
  { id: 'consultas', label: 'Consultas', icon: 'activity' },
  { id: 'perfil', label: 'Perfil', icon: 'user' },
  { id: 'antecedentes', label: 'Antecedentes', icon: 'doc' },
  { id: 'documentos', label: 'Documentos', icon: 'upload' },
  { id: 'estudios', label: 'Estudios', icon: 'eye' },
  { id: 'vacunas', label: 'Vacunas', icon: 'shield' },
  { id: 'medicamentos', label: 'Medicamentos', icon: 'pill' },
  { id: 'recetas', label: 'Recetas', icon: 'receipt' },
]

export default function Expediente() {
  const { openPatientId, patientById, setView } = useApp()

  if (!openPatientId) {
    return (
      <div className="page" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div className="card" style={{ display: 'inline-grid', placeItems: 'center', padding: 20, borderRadius: 18, marginBottom: 14 }}>
            <Icon name="folder" size={32} />
          </div>
          <h2>Selecciona un paciente</h2>
          <p className="muted" style={{ margin: '8px 0 18px' }}>Abre un paciente desde la agenda o la lista de pacientes para ver su expediente completo: resumen, consultas y módulos según especialidad.</p>
          <button className="btn btn-primary" onClick={() => setView('pacientes')}><Icon name="users" size={16} />Ir a pacientes</button>
        </div>
      </div>
    )
  }

  const p = patientById(openPatientId)
  if (!p) return null
  return <ExpedienteBody key={p.id} patient={p} />
}

function ExpedienteBody({ patient }) {
  const { recordTab, setRecordTab, consultDraft } = useApp()
  // Progressive disclosure: cada paciente muestra SOLO su propia especialidad.
  const spec = specialtyById(patient.specialty)
  const specTabs = spec?.sections || []

  const tabs = [...UNIVERSAL_TABS]
  if (specTabs.length) {
    tabs.push({ id: '__spec', label: spec.label, icon: spec.icon })
  }

  const nextAppt = patient.nextAppointment
  return (
    <div className="page">
      {/* ---------------------------- CABECERA ---------------------------- */}
      <div className="card" style={{ padding: '18px 22px', marginBottom: 18 }}>
        <div className="row" style={{ flexWrap: 'wrap', gap: 18 }}>
          <Avatar name={patient.name} size={64} />
          <div className="grow" style={{ minWidth: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>{patient.name}</h1>
              <Badge tone="ok">● Activo</Badge>
            </div>
            <div className="muted" style={{ fontSize: 13.5, marginTop: 2 }}>
              {patient.age} años · {patient.sex} · {patient.occupation || '—'}
            </div>
            <div className="row wrap" style={{ marginTop: 8, gap: 12, fontSize: 13 }}>
              <span className="row"><Icon name="phone" size={14} className="muted" />{patient.phone}</span>
              {patient.email && <span className="row"><Icon name="mail" size={14} className="muted" />{patient.email}</span>}
              {nextAppt && <span className="row"><Icon name="calendar" size={14} style={{ color: 'var(--accent)' }} /><b style={{ color: 'var(--accent)' }}>Próxima cita {new Date(nextAppt + 'T00:00').toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })}</b></span>}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setRecordTab('consultas')} style={{ alignSelf: 'center' }}>
            <Icon name="activity" size={16} />Nueva consulta
          </button>
        </div>

        {/* Alertas clínicas: nunca escondidas */}
        {patient.alerts?.length > 0 && (
          <div className="mt2" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {patient.alerts.map((a, i) => (
              <div key={i} className="clinical-alert"><Icon name="alert" size={16} />{a}</div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------------------- TABS ---------------------------- */}
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={recordTab === t.id || (t.id === '__spec' && recordTab.startsWith('__spec'))}
            className={`tab ${recordTab === t.id || (t.id === '__spec' && recordTab.startsWith('__spec')) ? 'active' : ''}`}
            onClick={() => setRecordTab(t.id)}
          >
            {t.label} {t.id === 'consultas' && <span className="tab-count">{patient.consultas?.length || 0}</span>}
          </button>
        ))}
      </div>

      {/* ---------------------------- BODIES ---------------------------- */}
      {recordTab === 'resumen' && <ResumenSection patient={patient} />}
      {recordTab === 'perfil' && <PerfilSection patient={patient} />}
      {recordTab === 'antecedentes' && <AntecedentesSection patient={patient} />}
      {recordTab === 'consultas' && <ConsultasSection patient={patient} draft={consultDraft} />}
      {recordTab === 'documentos' && <UniversalSection kind="documentos" />}
      {recordTab === 'estudios' && <UniversalSection kind="estudios" />}
      {recordTab === 'vacunas' && <UniversalSection kind="vacunas" patient={patient} />}
      {recordTab === 'medicamentos' && <UniversalSection kind="medicamentos" patient={patient} />}
      {recordTab === 'recetas' && <UniversalSection kind="recetas" patient={patient} />}
      {recordTab.startsWith('__spec') && <SpecialtySection patient={patient} specialtyId={patient.specialty} />}
    </div>
  )
}