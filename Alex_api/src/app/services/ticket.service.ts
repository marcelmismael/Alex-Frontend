import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ticket } from '../models/ticket.model';

/**
 * Servicio central de acceso a la API REST (Actividad 8 - mayte_api).
 * Toda la comunicacion HTTP de la aplicacion pasa por aqui.
 */
@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  crear(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, this.sanitizarTicket(ticket));
  }

  actualizar(id: number, ticket: Ticket): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, this.sanitizarTicket(ticket));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Medida de seguridad contra XSS: se limpian los campos de texto libre
   * (titulo, descripcion) antes de enviarlos al backend, quitando
   * etiquetas HTML/script y caracteres peligrosos. Esto se suma (no
   * reemplaza) a la proteccion nativa de Angular, que ya escapa
   * automaticamente cualquier interpolacion {{ }} en las plantillas,
   * y a la validacion @NotBlank/@NotNull del backend.
   */
  private sanitizarTexto(valor: string): string {
    return valor
      .replace(/<[^>]*>?/gm, '')   // remueve etiquetas HTML/script
      .replace(/[<>]/g, '')        // remueve angulares sueltos
      .trim();
  }

  private sanitizarTicket(ticket: Ticket): Ticket {
    return {
      ...ticket,
      titulo: this.sanitizarTexto(ticket.titulo),
      descripcion: this.sanitizarTexto(ticket.descripcion)
    };
  }
}
