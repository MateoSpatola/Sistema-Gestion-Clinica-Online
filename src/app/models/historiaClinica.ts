export interface HistoriaClinica {
    altura: number;
    peso: number;
    temperatura: number;
    presionSistolica: number;
    presionDiastolica: number;
    datosDinamicos: { [clave: string]: string };
}
