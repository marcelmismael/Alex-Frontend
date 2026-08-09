import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Estado, ESTADOS, Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-listado-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listado-tickets.component.html',
  styleUrl: './listado-tickets.component.css'
})
export class ListadoTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  estados = ESTADOS;
  cargando = true;
  error = '';
  filtroEstado = '';
  idEnProceso: number | null = null;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.ticketService.listarTodos().subscribe({
      next: (datos) => {
        this.tickets = datos;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo conectar con la API. Verifica que el backend esté corriendo.';
        this.cargando = false;
      }
    });
  }

  get ticketsFiltrados(): Ticket[] {
    if (!this.filtroEstado) return this.tickets;
    return this.tickets.filter(t => t.estado === this.filtroEstado);
  }

  cambiarEstado(ticket: Ticket, nuevoEstado: Estado): void {
    if (!ticket.id || ticket.estado === nuevoEstado) return;
    this.idEnProceso = ticket.id;
    const actualizado: Ticket = { ...ticket, estado: nuevoEstado };

    this.ticketService.actualizar(ticket.id, actualizado).subscribe({
      next: (res) => {
        ticket.estado = res.estado;
        this.idEnProceso = null;
      },
      error: () => {
        this.error = 'No se pudo actualizar el estado del ticket.';
        this.idEnProceso = null;
      }
    });
  }

  eliminar(ticket: Ticket): void {
    if (!ticket.id) return;
    const confirmado = confirm(`¿Eliminar el ticket "${ticket.titulo}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    this.idEnProceso = ticket.id;
    this.ticketService.eliminar(ticket.id).subscribe({
      next: () => {
        this.tickets = this.tickets.filter(t => t.id !== ticket.id);
        this.idEnProceso = null;
      },
      error: () => {
        this.error = 'No se pudo eliminar el ticket.';
        this.idEnProceso = null;
      }
    });
  }
}
