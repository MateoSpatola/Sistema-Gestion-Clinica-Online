import { HistoriaClinica } from "./historiaClinica";

export interface Turno {
    id?: string;
    fechaCompleta: Date;
    correoEspecialista: string;
    nombreEspecialista: string;
    correoPaciente: string;
    nombrePaciente: string;
    especialidad: string;
    estado: "Pendiente" | "Aceptado" | "Realizado" | "Rechazado" | "Cancelado";
    canceladoPor?: "Paciente" | "Especialista" | "Administración";
    motivoCancelacion?: string;
    motivoRechazo?: string;
    resenia?: string;
    encuesta?: string;
    calificacion?: string;
    historiaClinica?: HistoriaClinica;
}
