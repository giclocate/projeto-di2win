import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RelatorioComponent } from '../form/relatorio/relatorio.component';
import { RelatorioAnaliticoComponent } from '../form/relatorio-analitico/relatorio-analitico.component';
import { RelatorioSinteticoComponent } from '../form/relatorio-sintetico/relatorio-sintetico.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RelatorioComponent,RelatorioAnaliticoComponent,RelatorioSinteticoComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  isDropdownOpen = false;

  @Output() sintetico = new EventEmitter<void>();
  @Output() analitico = new EventEmitter<void>();

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  emitSintetico(): void {
    this.sintetico.emit();
    this.isDropdownOpen = false; // Fechar o dropdown após a seleção
  }

  emitAnalitico(): void {
    this.analitico.emit();
    this.isDropdownOpen = false; // Fechar o dropdown após a seleção
  }
}
