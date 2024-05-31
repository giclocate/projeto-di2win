import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import {MatIcon} from '@angular/material/icon';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RelatorioSinteticoComponent } from './components/form/relatorio-sintetico/relatorio-sintetico.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, HeaderComponent,MatIcon, SidebarComponent, RelatorioSinteticoComponent]
})
export class AppComponent {
  title = 'projeto-di2win';
}
