# Ágora Clínica — Plataforma Universal de Atención Clínica

SaaS clínico configurable por especialidad: **Agenda**, **Pacientes** y **Expediente** en un solo sistema, con tres temas visuales intercambiables y un motor de especialidades que adapta la experiencia clínica sin duplicar estructuras.

> **Simple por fuera. Potente por dentro.**

---

## 🧩 Pilares funcionales

| Módulo | Descripción |
| --- | --- |
| **Agenda** | Vista semanal con bloques de cita, navegación temporal, quick view, creación de citas, estados visuales e inicio de consulta con un clic. |
| **Pacientes** | Base de datos clínica visual con búsqueda instantánea, filtros, fotografía, datos de contacto y emergencia. |
| **Expediente** | Corazón del producto: cabecera con **alertas clínicas** siempre visibles, información universal + información especializada. |

## 🎨 Sistema de temas

La UI se construye 100 % sobre **design tokens** (color, tipografía, spacing, radius, sombras, gradientes, motion), lo que permite cambiar de tema sin reconstruir componentes:

- **Magic Frames** — estética AI + premium + futurista (gradientes, glow, tarjetas luminosas).
- **Talenta** — SaaS profesional corporativo (azul, blanco, alto contraste).
- **Base** — sistema clínico neutro, minimalista y universal.

## 🧠 Motor de especialidades

Cada paciente declara su especialidad y el sistema revela únicamente las secciones que aplican (*progressive disclosure*):

- **Medicina General** — signos vitales, diagnósticos, evolución, curva de peso/PA/glucosa.
- **Odontología** — odontograma interactivo, periodoncia, radiografías, fotografía clínica.
- **Psicología** — evaluación, sesiones, objetivos terapéuticos con progreso.
- **Nutrición** — antropometría, historia alimentaria, plan, evolución de peso/grasa/músculo.
- **Fisioterapia** — evaluación, **mapa corporal** interactivo, tratamiento con series.
- **Pediatría** — crecimiento con percentiles, desarrollo, perinatal, alimentación.
- **Ginecología** — antecedentes gineco-obstétricos, seguimiento prenatal.
- **Dermatología** — **mapa corporal**, control fotográfico **antes/después**.

El modelo de datos sigue la arquitectura:

```
Patient + SpecialtyProfile + SpecialtyRecords
```

Un mismo paciente puede evolucionar entre especialidades sin duplicar su registro universal (perfil, antecedentes, consultas, documentos, estudios, vacunas, medicamentos, recetas).

## ⚙️ Sistema de consultas

Cada consulta es un objeto independiente (fecha, profesional, motivo, evaluación, diagnóstico, tratamiento, indicaciones, archivos, seguimiento). Desde una cita en la agenda se puede **Iniciar consulta** con un solo clic, quedando ligada a fecha, hora, profesional y paciente.

## 📱 Responsive + PWA

- Despliegue instalable (manifest webmanifest).
- Desktop con sidebar; móvil con navegación inferior (Agenda / Pacientes / Expediente) y tarjetas de paciente.
- Accesibilidad: contraste adecuado, objetivos táctiles, focus visible, navegación por teclado, labels claros.

---

## 🚀 Puesta en marcha

```bash
npm install
npm run dev      # desarrollo
npm run build    # producción
npm run preview  # previsualización del build
```

## 🧰 Tecnología

React 18 · Vite · CSS custom properties (design tokens) · PWA · SVG inline · español (es).

---

*Proyecto generado por un agente de IA (OpenHands) a partir de la Arquitectura Maestra de la "Plataforma Universal de Atención Clínica".*