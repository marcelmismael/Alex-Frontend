import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistroIncidentesComponent } from './components/registro-incidentes/registro-incidentes.component';
import { ListadoTicketsComponent } from './components/listado-tickets/listado-tickets.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard | Alex_api' },
  { path: 'registro', component: RegistroIncidentesComponent, title: 'Registrar Incidente | Alex_api' },
  { path: 'tickets', component: ListadoTicketsComponent, title: 'Listado de Tickets | Alex_api' },
  { path: '**', redirectTo: 'dashboard' }
];
