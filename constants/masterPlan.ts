
import { PlanPhase } from '../types';

export const MASTER_PLAN = {
  targetWeight: 75,
  initialWeight: 95,
  phases: [
    {
      id: 1,
      name: "Mes 1-3: Base & Técnica",
      rangeMonths: [0, 3],
      focus: "Adaptación neuronal y perfección mecánica. Doble progresión.",
      nutrition: "Proteína: 2.2g/kg. Carbos: Moderados. Déficit: 300-500 kcal.",
      routines: {
        "Lunes": "Piernas A (Sentadilla focus) + Core",
        "Martes": "Superior A (Empuje/Tirón horizontal) + Cardio 20'",
        "Miércoles": "Recuperación Activa (Movilidad/Paseo)",
        "Jueves": "Piernas B (Bisagra de cadera) + Core",
        "Viernes": "Superior B (Hombro/Vertical) + Cardio 20'",
        "Sábado": "Full Body Metabólico (Circuito)",
        "Domingo": "Descanso Total"
      }
    },
    {
      id: 2,
      name: "Mes 3-6: Hipertrofia & Densidad",
      rangeMonths: [3, 6],
      focus: "Aumento de volumen de trabajo (sets). Enfoque en tiempo bajo tensión (TUT).",
      nutrition: "Proteína: 2.2g/kg. Ciclado de Carbos (High en Pierna).",
      routines: {
        "Lunes": "Cuádriceps + Pantorrilla (Volumen alto)",
        "Martes": "Pecho + Espalda (Superseries antagonistas)",
        "Miércoles": "Cardio LISS 45' + Abdominales",
        "Jueves": "Isquios + Glúteo (Énfasis excéntrico)",
        "Viernes": "Hombros + Brazos (Densidad)",
        "Sábado": "Full Body (Heavy Load)",
        "Domingo": "Paseo Familiar / Movilidad"
      }
    },
    {
      id: 3,
      name: "Mes 6-12: Fuerza & Definición",
      rangeMonths: [6, 12],
      focus: "Mantener fuerza en déficit. Variantes unilaterales y control absoluto.",
      nutrition: "Déficit agresivo controlado. Proteína techo. Refeeds semanales.",
      routines: {
        "Lunes": "Fuerza Max: Sentadilla / Zancada Heavy",
        "Martes": "Fuerza Max: Flexión / Remo con carga",
        "Miércoles": "HIIT 15' + Caminata 30'",
        "Jueves": "Cadena Posterior (Unilateral Focus)",
        "Viernes": "Torso Completo (Power Focus)",
        "Sábado": "Complejos Metabólicos (Kettlebell/Mesa)",
        "Domingo": "Recuperación Total"
      }
    }
  ],
  rules: [
    "Proteína: 2g a 2.2g por kg de peso corporal.",
    "Agua: 35ml por kg de peso (Mínimo 3L).",
    "Sueño: 7-8 horas (Factor limitante de quema de grasa).",
    "Caminata: 10k pasos diarios obligatorios.",
    "Descarga: Semana 4 de cada mes reducir volumen un 40%."
  ]
};
