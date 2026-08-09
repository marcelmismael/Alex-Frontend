import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { CATEGORIAS, PRIORIDADES } from '../../models/ticket.model';

@Component({
  selector: 'app-registro-incidentes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-incidentes.component.html',
  styleUrl: './registro-incidentes.component.css'
})
export class RegistroIncidentesComponent {
  categorias = CATEGORIAS;
  prioridades = PRIORIDADES;

  enviando = false;
  mensajeExito = '';
  errorServidor = '';

  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(120)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      categoria: ['', Validators.required],
      prioridad: ['', Validators.required]
    });
  }

  get f() {
    return this.formulario.controls;
  }

  enviar(): void {
    this.mensajeExito = '';
    this.errorServidor = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando = true;
    const nuevoTicket = {
      ...this.formulario.value,
      estado: 'ABIERTO' as const
    };

    this.ticketService.crear(nuevoTicket).subscribe({
      next: () => {
        this.enviando = false;
        this.mensajeExito = 'Incidente registrado correctamente.';
        this.formulario.reset();
        setTimeout(() => this.router.navigate(['/tickets']), 1200);
      },
      error: (err) => {
        this.enviando = false;
        this.errorServidor = err?.error?.mensaje
          || 'Ocurrió un error al registrar el incidente. Verifica los datos e intenta de nuevo.';
      }
    });
  }
}
