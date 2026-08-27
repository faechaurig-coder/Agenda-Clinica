import React from 'react'
import { EmptyState } from '../../components/ui.jsx'
import Icon from '../../icons/Icons.jsx'
import { Badge } from '../../components/ui.jsx'

const CATEGORIES = {
  documentos: ['PDFs', 'Imágenes', 'Consentimientos', 'Identificaciones', 'Referencias', 'Otros'],
  estudios: ['Laboratorio', 'Radiografías', 'Ultrasonidos', 'Tomografías', 'Resonancias', 'Fotografías', 'Otros'],
}

export function UniversalSection({ kind, patient }) {
  if (kind === 'vacunas' && patient?.vacunas?.length) {
    return (
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead><tr><th>Vacuna</th><th>Fecha</th><th>Dosis</th><th>Lote</th><th>Próxima dosis</th><th>Comprobante</th></tr></thead>
            <tbody>
              {patient.vacunas.map((v, i) => (
                <tr key={i}>
                  <td className="td-strong">{v.vacuna}</td>
                  <td>{v.fecha}</td><td>{v.dosis}</td><td className="mono">{v.lote}</td>
                  <td>{v.prox}</td><td><Badge tone="ok">✓ {v.comprobante}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  if (kind === 'medicamentos' && patient?.meds?.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {patient.meds.map((m, i) => (
          <div key={i} className="card row" style={{ padding: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'color-mix(in srgb, var(--info) 14%, transparent)', color: 'var(--info)' }}><Icon name="pill" size={20} /></div>
            <div className="grow">
              <div style={{ fontWeight: 700 }}>{m}</div>
              <div className="muted" style={{ fontSize: 12.5 }}>Activo</div>
            </div>
            <Badge tone="ok">● Activo</Badge>
          </div>
        ))}
        <button className="btn btn-ghost" style={{ alignSelf: 'flex-start' }}><Icon name="plus" size={15} />Agregar medicamento</button>
      </div>
    )
  }
  if (kind === 'recetas') {
    return (
      <EmptyState icon="receipt" title="Historial de recetas" sub="Las recetas generadas desde las consultas aparecerán aquí para visualizarse, imprimirse o exportarse." />
    )
  }

  const cats = CATEGORIES[kind] || []
  return (
    <EmptyState
      icon={kind === 'documentos' ? 'upload' : 'eye'}
      title={kind === 'documentos' ? 'Documentos' : 'Estudios'}
      sub="Repositorio organizado listo para recibir archivos y registros."
      action={<button className="btn btn-primary"><Icon name="plus" size={15} />Adjuntar {kind === 'documentos' ? 'documento' : 'estudio'}</button>}
    />
  )
}