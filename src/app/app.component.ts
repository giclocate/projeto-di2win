import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { MatIcon } from '@angular/material/icon';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RelatorioSinteticoComponent } from './components/form/relatorio-sintetico/relatorio-sintetico.component';
import { RelatorioAnaliticoComponent } from './components/form/relatorio-analitico/relatorio-analitico.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, CommonModule, HeaderComponent, MatIcon, SidebarComponent, RelatorioSinteticoComponent, RelatorioAnaliticoComponent]
})
export class AppComponent {
  title = 'projeto-di2win';

  isRelatorioSinteticoVisible = true;
  isRelatorioAnaliticoVisible = false;

  switchToSintetico(): void {
    this.isRelatorioSinteticoVisible = true;
    this.isRelatorioAnaliticoVisible = false;
  }

  switchToAnalitico(): void {
    this.isRelatorioSinteticoVisible = false;
    this.isRelatorioAnaliticoVisible = true;
  }
}
