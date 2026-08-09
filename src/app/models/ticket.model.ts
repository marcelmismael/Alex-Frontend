// Debe coincidir exactamente con los enums del backend (com.utm.mayte_api.model)
export type Categoria = 'HARDWARE' | 'SOFTWARE' | 'RED';
export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';
export type Estado = 'ABIERTO' | 'EN_PROGRESO' | 'CERRADO';

export interface Ticket {
  id?: number;
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  prioridad: Prioridad;
  estado: Estado;
  fechaCreacion?: string;
}

export const CATEGORIAS: Categoria[] = ['HARDWARE', 'SOFTWARE', 'RED'];
export const PRIORIDADES: Prioridad[] = ['ALTA', 'MEDIA', 'BAJA'];
export const ESTADOS: Estado[] = ['ABIERTO', 'EN_PROGRESO', 'CERRADO'];
