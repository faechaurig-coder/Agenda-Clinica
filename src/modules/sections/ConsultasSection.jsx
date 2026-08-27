import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { Field } from '../../components/ui.jsx'
import { Modal } from '../../components/ui.jsx'
import { consultTypeById, CONSULT_TYPES } from '../../data/specialties.js'
import Icon from '../../icons/Icons.jsx'

export function ConsultasSection({ patient }) {
  const today = new Date().toISOString().slice(0, 10)
  const [editing, setEditing] = useState(null)

  // auto-open draft from "iniciar consulta"
  const alreadyEditing = editing

  return (
    <div>
      <div className="row between" style={{ marginBottom: 16 }}>
        <div>
          <div className="card-title">Historial clínico</div>
          <div className="muted" style={{ fontSize: 12.5 }}>Cada consulta es un objeto independiente que reconstruye la historia del paciente.</div>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({ date: today, motivos: [] })}><Icon name="plus" size={16} />Nueva consulta</button>
      </div>

      <div className="timeline">
        {(patient.consultas || []).slice().reverse().map((c) => {
          const t = consultTypeById(c.type)
          return (
            <div key={c.id} className="tl-item ok" style={{ cursor: 'pointer' }} onClick={() => setEditing(c)}>
              <div className="row between">
                <div style={{ flex: 1 }}>
                  <div className="tl-date">{c.date ? c.date.substring(0, 10) : '—'}</div>
                  <div className="tl-title">{c.tipo || t.label} {c.professional ? `· ${c.professional}` : ''}</div>
                  <div className="tl-body">{c.motivo || 'Consulta registrada'}</div>
                  {c.diagnostico && <div className="tl-body mt1" style={{ fontSize: 12.5, color: 'var(--text-3)' }}>Diagnóstico: {c.diagnostico}</div>}
                </div>
                <Icon name="chevR" size={18} className="muted" />
              </div>
            </div>
          )
        })}
        {(!patient.consultas || !patient.consultas.length) && (
          <div className="muted" style={{ padding: 20 }}>Sin consultas todavía. Haz clic en «Nueva consulta» para iniciar la primera.</div>
        )}
      </div>

      <ConsultModal patient={patient} editing={alreadyEditing} onClose={() => setEditing(null)} />
    </div>
  )
}

function ConsultModal({ patient, editing, onClose }) {
  const { setPatients, toast } = useApp()
  const open = !!editing
  const [form, setForm] = useState(editing)
  const f = form || {}

  // keep form in sync when editing changes
  React.useEffect(() => { if (editing) setForm(editing) }, [editing])

  function set(k, v) { setForm((prev) => ({ ...prev, [k]: v })) }

  function save() {
    if (!f.motivo) { toast('Registra el motivo de la consulta', 'danger'); return }
    // update patient consultas
    setPatients((list) => list.map((p) => {
      if (p.id !== patient.id) return p
      const existing = f.id ? (p.consultas || []).map((c) => (c.id === f.id ? { ...c, ...f } : c)) : [...(p.consultas || []), { ...f, id: f.id || 'c' + Date.now() }]
      // if comming from a draft (new), and date provided, update lastConsult
      const up = { ...p, consultas: existing }
      if (f.date) up.lastConsult = f.date.substring(0, 10)
      return up
    }))
    toast('Consulta guardada')
    onClose()
  }

  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} wide
      title={<span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Icon name="activity" size={20} />Consulte · {patient.name}</span>}
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Icon name="check" size={16} />Guardar consulta</button>
      </>}
    >
      <div className="form-row form-grid2">
        <Field label="Fecha"><input type="date" className="input" value={(f.date || '').substring(0, 10)} onChange={(e) => set('date', e.target.value)} /></Field>
        <Field label="Tipo de consulta">
          <div className="select-wrap">
            <select className="select" value={f.type || 'seguimiento'} onChange={(e) => set('type', e.target.value)}>
              {CONSULT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
        </Field>
      </div>
      <Field label="Motivo de consulta"><textarea className="textarea" value={f.motivo || ''} onChange={(e) => set('motivo', e.target.value)} placeholder="Motivo y padecimiento actual…" /></Field>
      <Field label="Evaluación"><textarea className="textarea" value={f.evaluacion || ''} onChange={(e) => set('evaluacion', e.target.value)} placeholder="Hallazgos de la exploración y evaluación…" /></Field>
      <div className="form-row form-grid2">
        <Field label="Diagnóstico"><input className="input" value={f.diagnostico || ''} onChange={(e) => set('diagnostico', e.target.value)} /></Field>
        <Field label="Tratamiento"><input className="input" value={f.tratamiento || ''} onChange={(e) => set('tratamiento', e.target.value)} /></Field>
      </div>
      <Field label="Indicaciones"><textarea className="textarea" value={f.indicaciones || ''} onChange={(e) => set('indicaciones', e.target.value)} placeholder="Indicaciones al paciente, seguimiento…" style={{ minHeight: 56 }} /></Field>
    </Modal>
  )
}