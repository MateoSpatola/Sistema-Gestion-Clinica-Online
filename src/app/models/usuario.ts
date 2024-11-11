import { Dia } from "./dia";

export interface Usuario {
    tipo: "Paciente" | "Especialista" | "Administrador";
    habilitado?: boolean;
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    obraSocial?: string;
    especialidades?: string[];
    correo: string;
    clave: string;
    imagenPerfil: string;
    imagenPortada?: string;
    disponibilidad?: Dia[];
}
