import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RelatorioAnaliticoComponent } from '../form/relatorio-analitico/relatorio-analitico.component';
import { RelatorioSinteticoComponent } from '../form/relatorio-sintetico/relatorio-sintetico.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIcon, RelatorioAnaliticoComponent, RelatorioSinteticoComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
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
    this.isDropdownOpen = false;
  }

  emitAnalitico(): void {
    this.analitico.emit();
    this.isDropdownOpen = false;
  }
}
