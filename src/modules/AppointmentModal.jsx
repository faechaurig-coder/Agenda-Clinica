import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { Modal, Field } from '../components/ui.jsx'
import { CONSULT_TYPES } from '../data/specialties.js'
import { APPOINTMENT_STATUS } from '../data/specialties.js'
import Icon from '../icons/Icons.jsx'

export default function AppointmentModal({ open, onClose, editing, defaultDate, professionals }) {
  const { patients, setAppointments, rooms, toast } = useApp()
  const isEdit = !!editing
  const [form, setForm] = useState(() => {
    if (editing) return { patientId: editing.patientId, date: editing.date, time: editing.time, duration: editing.duration, type: editing.type, professional: editing.professional, room: editing.room, notes: editing.notes || '', reminder: !!editing.reminder, status: editing.status }
    const today = defaultDate || new Date().toISOString().slice(0, 10)
    return { patientId: patients[0]?.id || '', date: today, time: '09:00', duration: 30, type: 'seguimiento', professional: professionals[0]?.name || '', room: rooms[0] || '', notes: '', reminder: true, status: 'Pendiente' }
  })
  const [showNewPatient, setShowNewPatient] = useState(false)

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  function save() {
    if (!form.patientId) { toast('Selecciona un paciente', 'danger'); return }
    if (isEdit) {
      setAppointments((list) => list.map((a) => (a.id === editing.id ? { ...a, ...form } : a)))
      toast('Cita actualizada')
    } else {
      const id = 'a' + Date.now()
      setAppointments((list) => [...list, { id, ...form }])
      toast('Cita creada')
    }
    onClose()
  }

  const title = (
    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name={isEdit ? 'edit' : 'plus'} size={20} /> {isEdit ? 'Editar cita' : 'Nueva cita'}
    </span>
  )

  return (
    <Modal open={open} onClose={onClose} title={title} wide
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Icon name="check" size={16} />{isEdit ? 'Guardar cambios' : 'Guardar cita'}</button>
      </>}
    >
      <div className="form-row form-grid2">
        <Field label="Paciente" req className={showNewPatient ? '' : ''}>
          {showNewPatient ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="row">
                <input className="input grow" placeholder="Nombre y apellidos" />
                <input className="input" placeholder="Teléfono" style={{ maxWidth: 150 }} />
              </div>
              <span className="muted" style={{ fontSize: 12.5 }}>
                <a onClick={() => setShowNewPatient(false)} style={{ color: 'var(--accent)', cursor: 'pointer' }}>← Elegir paciente existente</a>
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="select-wrap grow">
                <select className="select" value={form.patientId} onChange={(e) => set('patientId', e.target.value)}>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <button className="btn btn-sm" onClick={() => setShowNewPatient(true)} title="Crear paciente"><Icon name="userPlus" size={15} /></button>
            </div>
          )}
        </Field>
        <Field label="Tipo de consulta">
          <div className="select-wrap">
            <select className="select" value={form.type} onChange={(e) => set('type', e.target.value)}>
              {CONSULT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
        </Field>
      </div>

      <div className="form-row form-grid3">
        <Field label="Fecha" req><input type="date" className="input" value={form.date} onChange={(e) => set('date', e.target.value)} /></Field>
        <Field label="Hora" req><input type="time" className="input" value={form.time} onChange={(e) => set('time', e.target.value)} /></Field>
        <Field label="Duración">
          <div className="select-wrap">
            <select className="select" value={form.duration} onChange={(e) => set('duration', +e.target.value)}>
              {[15, 20, 30, 40, 45, 50, 60, 90].map((d) => <option key={d} value={d}>{d} min</option>)}
            </select>
          </div>
        </Field>
      </div>

      <div className="form-row form-grid2">
        <Field label="Profesional">
          <div className="select-wrap">
            <select className="select" value={form.professional} onChange={(e) => set('professional', e.target.value)}>
              {professionals.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
        </Field>
        <Field label="Consultorio">
          <div className="select-wrap">
            <select className="select" value={form.room} onChange={(e) => set('room', e.target.value)}>
              {rooms.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </Field>
      </div>

      <Field label="Nota">
        <textarea className="textarea" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Motivo, indicaciones al paciente…" style={{ minHeight: 60 }} />
      </Field>

      <div className="row between">
        <div className="row">
          <button
            className="switch" role="switch" aria-checked={form.reminder}
            onClick={() => set('reminder', !form.reminder)}
          />
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>Enviar recordatorio</span>
        </div>
        <Field label="Estado">
          <div className="select-wrap">
            <select className="select" value={form.status} onChange={(e) => set('status', e.target.value)} style={{ maxWidth: 170 }}>
              {APPOINTMENT_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </Field>
      </div>
    </Modal>
  )
}