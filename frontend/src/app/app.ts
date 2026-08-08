import { Component } from '@angular/core';
import { WarDetailsComponent } from './pages/war-details/war-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WarDetailsComponent],
  template: `<app-war-details></app-war-details>` // <--- Define o template diretamente aqui
})
export class App {
  title = 'clash-war-app';
}
