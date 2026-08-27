import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { Modal, Field } from '../components/ui.jsx'
import Icon from '../icons/Icons.jsx'

export default function NewPatientModal({ open, onClose }) {
  const { setPatients, specialty, toast } = useApp()
  const [form, setForm] = useState({
    name: '', sex: 'Femenino', birth: '', phone: '', whatsapp: '', email: '',
    address: '', emergencyName: '', emergencyRelation: '', emergencyPhone: '',
    tags: '', status: 'Activo', notes: '',
  })

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  // Edad automática desde fecha de nacimiento
  let autoAge = null
  if (form.birth) {
    const b = new Date(form.birth)
    const now = new Date()
    autoAge = now.getFullYear() - b.getFullYear()
    const m = now.getMonth() - b.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) autoAge--
  }

  function save() {
    if (!form.name.trim()) { toast('El nombre es obligatorio', 'danger'); return }
    const newPatient = {
      id: 'p' + Date.now(),
      name: form.name.trim(),
      age: autoAge || 0,
      sex: form.sex,
      phone: form.phone || 'Sin teléfono',
      whatsapp: form.whatsapp,
      email: form.email,
      address: form.address,
      emergency: { name: form.emergencyName, relation: form.emergencyRelation, phone: form.emergencyPhone },
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      alerts: [],
      meds: [],
      status: form.status,
      joined: new Date().toISOString().slice(0, 10),
      lastConsult: null,
      nextAppointment: null,
      specialty,
      color: '#6EA8FF',
      history: {},
      consultas: [],
    }
    setPatients((list) => [newPatient, ...list])
    toast('Paciente creado')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} wide
      title={<span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Icon name="userPlus" size={20} />Nuevo paciente</span>}
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Icon name="check" size={16} />Guardar paciente</button>
      </>}
    >
      <div className="ui-label" style={{ marginBottom: 8 }}>Identificación</div>
      <div className="form-row form-grid2">
        <Field label="Nombre y apellidos" req>
          <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="María González" />
        </Field>
        <div className="row" style={{ alignItems: 'flex-end' }}>
          <Field label="Fecha de nacimiento" className="grow">
            <input type="date" className="input" value={form.birth} onChange={(e) => set('birth', e.target.value)} />
          </Field>
          <Field label="Edad">
            <div className="input" style={{ width: 70, display: 'grid', placeItems: 'center', background: 'transparent' }}>{autoAge != null ? autoAge : '—'}</div>
          </Field>
        </div>
      </div>
      <div className="form-row form-grid3">
        <Field label="Sexo">
          <div className="select-wrap">
            <select className="select" value={form.sex} onChange={(e) => set('sex', e.target.value)}>
              <option>Femenino</option><option>Masculino</option><option>Otro</option>
            </select>
          </div>
        </Field>
        <Field label="Identificador (opcional)"><input className="input" placeholder="ID / CURP" /></Field>
        <Field label="Estado">
          <div className="select-wrap">
            <select className="select" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option>Activo</option><option>Inactivo</option>
            </select>
          </div>
        </Field>
      </div>

      <div className="ui-label" style={{ marginTop: 8, marginBottom: 8 }}>Contacto</div>
      <div className="form-row form-grid2">
        <Field label="Teléfono"><input type="tel" className="input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+52 …" /></Field>
        <Field label="WhatsApp"><input type="tel" className="input" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="+52 …" /></Field>
        <Field label="Email"><input type="email" className="input" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
        <Field label="Dirección"><input className="input" value={form.address} onChange={(e) => set('address', e.target.value)} /></Field>
      </div>

      <div className="ui-label" style={{ marginTop: 8, marginBottom: 8 }}>Contacto de emergencia</div>
      <div className="form-row form-grid3">
        <Field label="Nombre"><input className="input" value={form.emergencyName} onChange={(e) => set('emergencyName', e.target.value)} /></Field>
        <Field label="Relación"><input className="input" value={form.emergencyRelation} onChange={(e) => set('emergencyRelation', e.target.value)} /></Field>
        <Field label="Teléfono"><input className="input" value={form.emergencyPhone} onChange={(e) => set('emergencyPhone', e.target.value)} /></Field>
      </div>

      <div className="ui-label" style={{ marginTop: 8, marginBottom: 8 }}>Administración</div>
      <div className="form-row form-grid2">
        <Field label="Etiquetas">
          <input className="input" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Alergias, Nuevo, Lumbalgia…" />
        </Field>
        <Field label="Notas administrativas"><input className="input" value={form.notes} onChange={(e) => set('notes', e.target.value)} /></Field>
      </div>
    </Modal>
  )
}