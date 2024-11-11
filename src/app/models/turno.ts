export interface Turno {
    id?: string;
    fechaCompleta: Date;
    correoEspecialista: string;
    correoPaciente: string;
    especialidad: string;
    estado: "Pendiente" | "Aceptado" | "Realizado" | "Rechazado" | "Cancelado";
    detalleCancelacion?: string;
    motivoCancelacion?: string;
}
