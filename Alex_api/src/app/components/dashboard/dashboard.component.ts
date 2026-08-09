import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  tickets: Ticket[] = [];
  cargando = true;
  error = '';

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.cargando = true;
    this.error = '';
    this.ticketService.listarTodos().subscribe({
      next: (datos) => {
        this.tickets = datos;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo conectar con la API. Verifica que el backend este corriendo.';
        this.cargando = false;
      }
    });
  }

  get totalTickets(): number {
    return this.tickets.length;
  }

  get abiertos(): number {
    return this.tickets.filter(t => t.estado === 'ABIERTO').length;
  }

  get enProgreso(): number {
    return this.tickets.filter(t => t.estado === 'EN_PROGRESO').length;
  }

  get cerrados(): number {
    return this.tickets.filter(t => t.estado === 'CERRADO').length;
  }

  get altaPrioridad(): number {
    return this.tickets.filter(t => t.prioridad === 'ALTA').length;
  }

  get recientes(): Ticket[] {
    return [...this.tickets]
      .sort((a, b) => (b.fechaCreacion ?? '').localeCompare(a.fechaCreacion ?? ''))
      .slice(0, 5);
  }
}
