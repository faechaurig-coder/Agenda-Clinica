// MOTOR DE ESPECIALIDADES
// Cada especialidad declara qué información se muestra. Una sola estructura
// `Patient + SpecialtyProfile + SpecialtyRecords`. La especialidad define
// visibilidad; no se duplican modelos.

export const SPECIALTIES = [
  {
    id: 'medicina',
    label: 'Medicina General',
    icon: 'list',
    blurb: 'Signos vitales, historia clínica, diagnóstico y evolución.',
    sections: ['signos', 'historia', 'diagnosticos', 'evolucion'],
  },
  {
    id: 'odontologia',
    label: 'Odontología',
    icon: 'tooth',
    blurb: 'Odontograma gráfico, periodoncia, radiografías y fotografía clínica.',
    sections: ['odontograma', 'periodoncia', 'radiografias', 'fotografia'],
  },
  {
    id: 'psicologia',
    label: 'Psicología',
    icon: 'brain',
    blurb: 'Historia, evaluación, sesiones y objetivos terapéuticos.',
    sections: ['historia', 'evaluacion', 'sesiones', 'objetivos'],
  },
  {
    id: 'nutricion',
    label: 'Nutrición',
    icon: 'leaf',
    blurb: 'Evaluación corporal, historia alimentaria, plan y evolución.',
    sections: ['evaluacion', 'alimentaria', 'plan', 'evolucion'],
  },
  {
    id: 'fisioterapia',
    label: 'Fisioterapia',
    icon: 'body',
    blurb: 'Evaluación, mapa corporal y plan de tratamiento.',
    sections: ['evaluacion', 'mapa', 'tratamiento'],
  },
  {
    id: 'pediatria',
    label: 'Pediatría',
    icon: 'child',
    blurb: 'Crecimiento con percentiles y curvas, desarrollo y alimentación.',
    sections: ['crecimiento', 'desarrollo', 'perinatal', 'alimentacion'],
  },
  {
    id: 'ginecologia',
    label: 'Ginecología',
    icon: 'flower',
    blurb: 'Antecedentes gineco-obstétricos, anticoncepción y estudios.',
    sections: ['ago', 'anticoncepcion', 'estudios_gin'],
  },
  {
    id: 'dermatologia',
    label: 'Dermatología',
    icon: 'spark',
    blurb: 'Mapa corporal con fotografías y comparación antes/después.',
    sections: ['mapa', 'antes_despues'],
  },
]

export const specialtyById = (id) => SPECIALTIES.find((s) => s.id === id)

// Campos de plantilla personalizada que cualquier profesional puede crear.
export const FIELD_TYPES = [
  { id: 'text', label: 'Texto', kind: 'input' },
  { id: 'textarea', label: 'Texto largo', kind: 'textarea' },
  { id: 'number', label: 'Número', kind: 'number' },
  { id: 'date', label: 'Fecha', kind: 'date' },
  { id: 'time', label: 'Hora', kind: 'time' },
  { id: 'select', label: 'Selector', kind: 'select' },
  { id: 'multiselect', label: 'Multi-selector', kind: 'multiselect' },
  { id: 'checkbox', label: 'Checkbox', kind: 'checkbox' },
  { id: 'scale', label: 'Escala', kind: 'scale' },
  { id: 'photo', label: 'Fotografía', kind: 'photo' },
  { id: 'file', label: 'Archivo', kind: 'file' },
  { id: 'table', label: 'Tabla', kind: 'table' },
  { id: 'signature', label: 'Firma', kind: 'signature' },
  { id: 'formula', label: 'Fórmula', kind: 'formula' },
]

// ---- ESTADOS DE CITA ----
export const APPOINTMENT_STATUS = [
  'Pendiente',
  'Confirmada',
  'Llegó',
  'En consulta',
  'Finalizada',
  'Cancelada',
  'No asistió',
]

// Tipos de consulta más usados (configurables).
export const CONSULT_TYPES = [
  { id: 'inicial', label: 'Consulta inicial', color: '#6EA8FF' },
  { id: 'seguimiento', label: 'Consulta de seguimiento', color: '#6EE7F9' },
  { id: 'urgencia', label: 'Urgencia', color: '#FF6B7A' },
  { id: 'control', label: 'Control / Revisión', color: '#2EE6A8' },
  { id: 'terapia', label: 'Sesión terapéutica', color: '#C084FC' },
  { id: 'otra', label: 'Otra', color: '#B9C0E0' },
]

export const consultTypeById = (id) => CONSULT_TYPES.find((t) => t.id === id) || CONSULT_TYPES[5]

// ---- MAPA CORPORAL (reutilizado por fisioterapia y dermatología) ----
export const BODY_MARKERS = [
  { id: 'cabeza', label: 'Cabeza', x: 50, y: 6 },
  { id: 'cuello', label: 'Cuello', x: 50, y: 15 },
  { id: 'hombro_izq', label: 'Hombro izq.', x: 32, y: 20 },
  { id: 'hombro_der', label: 'Hombro der.', x: 68, y: 20 },
  { id: 'brazo_izq', label: 'Brazo izq.', x: 24, y: 33 },
  { id: 'mano_izq', label: 'Mano izq.', x: 18, y: 50 },
  { id: 'brazo_der', label: 'Brazo der.', x: 76, y: 33 },
  { id: 'mano_der', label: 'Mano der.', x: 82, y: 50 },
  { id: 'torax', label: 'Tórax', x: 50, y: 28 },
  { id: 'espalda', label: 'Espalda', x: 50, y: 30 },
  { id: 'abdomen', label: 'Abdomen', x: 50, y: 42 },
  { id: 'cadera', label: 'Cadera', x: 50, y: 52 },
  { id: 'pierna_izq', label: 'Pierna izq.', x: 38, y: 68 },
  { id: 'pierna_der', label: 'Pierna der.', x: 62, y: 68 },
  { id: 'rodilla_izq', label: 'Rodilla izq.', x: 40, y: 62 },
  { id: 'rodilla_der', label: 'Rodilla der.', x: 60, y: 62 },
  { id: 'pie_izq', label: 'Pie izq.', x: 40, y: 92 },
  { id: 'pie_der', label: 'Pie der.', x: 60, y: 92 },
]

export const ODONTOGRAM_STATES = {
  sana: { label: 'Sana', color: '#2EE6A8' },
  caries: { label: 'Caries', color: '#FF6B7A' },
  restauracion: { label: 'Restauración', color: '#6EA8FF' },
  ausente: { label: 'Ausente', color: '#5A5F75' },
  extraccion: { label: 'Extracción', color: '#6B7280' },
  corona: { label: 'Corona', color: '#FFC24B' },
  endodoncia: { label: 'Endodoncia', color: '#C084FC' },
  implante: { label: 'Implante', color: '#B9C0E0' },
  protesis: { label: 'Prótesis', color: '#7C83A6' },
  fractura: { label: 'Fractura', color: '#FF9F43' },
}