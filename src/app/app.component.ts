import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavegacionComponent } from './components/navegacion/navegacion.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavegacionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  titulo = 'Alex_api';
}
