import { Component} from '@angular/core';
import { RelatorioSinteticoComponent } from '../relatorio-sintetico/relatorio-sintetico.component';
import { RelatorioAnaliticoComponent } from '../relatorio-analitico/relatorio-analitico.component';
import { CommonModule} from '@angular/common';


@Component({
  selector: 'app-relatorio',
  standalone: true,
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.scss'],
  imports: [CommonModule, RelatorioSinteticoComponent, RelatorioAnaliticoComponent]
})
export class RelatorioComponent {
 

  tipoRelatorio: string = 'sintetico';

  onTipoRelatorioChange(tipo: string) {
    this.tipoRelatorio = tipo;
  }

  
}
