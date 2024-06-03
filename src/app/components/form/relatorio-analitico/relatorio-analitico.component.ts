import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExcelService } from '../../../services/excel.service';
import { DatePipe } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';


export interface UserData {
  id: number;
  empresaID: string;
  dataID: string;
  tipoDocumento: string;
  qtdPag: string;
}

const mockDates: string[] = [
  '2024-01-01',
  '2024-02-14',
  '2024-03-17',
  '2024-04-01',
  '2024-05-05',
  '2024-05-28',
  '2024-06-21',
  '2024-07-04',
  '2024-08-15',
  '2024-09-10',
  '2024-10-31',
  '2024-11-25',
  '2024-12-31'
];

const mockPags: string[] = [
  '16',
  '100',
  '54',
  '321',
  '1230',
  '243',
  '321',
  '28',
];

const mockDocument: string[] = [
  'CNH',
  'CPF',
  'Contrato ',
  'Certidão de Nascimento',
  'Certidão de Casamento',
  'Certidão de Óbito',
  'Carteira de Trabalho',
  'Comprovante de Residência',
  'Passaporte',
  'RG',
  'Carteira de Identidade Profissional',
  'Título de Eleitor',
  'Carteira de Estudante',
  'Certificado de Reservista',
  'Cartão de Crédito ',
  'Cartão de Débito'
];

const mockCompany: string[] = [
  'CyberTech',
  'NovaWave Industries',
  'Quantum Innovations',
  'SkyLabs Corporation',
  'NebulaTech Solutions',
  'Phoenix Innovate',
  'HorizonTech Enterprises',
  'FusionWorks Inc.',
  'PrimeTech Solutions',
  'Apex Global Technologies'
];
@Component({
  selector: 'app-relatorio-analitico',
  standalone: true,
  templateUrl: './relatorio-analitico.component.html',
  styleUrl: './relatorio-analitico.component.scss',
  imports: [ReactiveFormsModule,FormsModule,MatAutocompleteModule,MatInputModule, MatFormFieldModule,MatIcon,MatInputModule, MatPaginatorModule, MatTableModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter(), DatePipe]
})
export class RelatorioAnaliticoComponent {

  displayedColumns: string[] = ['empresaID','tipoDocumento', 'dataID', 'qtdPag'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('datePicker') datePicker: any;
  startDate: Date | null = null;
  endDate: Date | null = null;

  inputControl = new FormControl();
  suggestions: string[] = mockCompany;
  filteredSuggestions: Observable<string[]>;


  constructor(private datePipe: DatePipe, private excelService: ExcelService) {
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1, datePipe));
    this.dataSource = new MatTableDataSource(users);
    this.filteredSuggestions = this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  exportData() {
    this.excelService.exportToExcel(this.dataSource.data, 'relatorio');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: UserData, filter: string) => {
      if (filter.includes('-')) {
        const [start, end] = filter.split('-').map(date => new Date(date.trim()));
        const dataDate = new Date(data.dataID);
        return dataDate >= start && dataDate <= end;
      } else {
        const lowerCaseFilter = filter.trim().toLowerCase();
        return data.empresaID.toLowerCase().includes(lowerCaseFilter) ||
               data.tipoDocumento.toLowerCase().includes(lowerCaseFilter);
      }
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyDateFilter(type: 'start' | 'end', event: any): void {
    if (type === 'start') {
      this.startDate = event.value;
    } else if (type === 'end') {
      this.endDate = event.value;
    }

    if (this.startDate && this.endDate) {
      const formattedStartDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd') || '';
      const formattedEndDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd') || '';

      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const start = new Date(formattedStartDate).getTime();
        const end = new Date(formattedEndDate).getTime();
        const dataDate = new Date(data.dataID).getTime();

        return dataDate >= start && dataDate <= end;
      };

      this.dataSource.filter = `${formattedStartDate} - ${formattedEndDate}`;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  applyCompanyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetDateFilter(startInput: HTMLInputElement, endInput: HTMLInputElement): void {
    this.startDate = null;
    this.endDate = null;

    // Limpar valores dos Datepickers
    startInput.value = '';
    endInput.value = '';

    // Definindo uma função de filtro que sempre retorna verdadeiro para todos os dados
    this.dataSource.filterPredicate = () => true;
    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.suggestions.filter(suggestion => suggestion.toLowerCase().includes(filterValue));
  }


  parseDate(dateString: string, format: string = 'dd/MM/yyyy'): Date {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    return new Date(year, month, day);
  }

}

function createNewUser(id: number, datePipe: DatePipe): UserData {
  const document = mockDocument[Math.round(Math.random() * (mockDocument.length - 1))];
  const empresa = mockCompany[Math.round(Math.random() * (mockCompany.length - 1))];
  const pags = mockPags[Math.round(Math.random() * (mockPags.length - 1))];
  const dates = mockDates[Math.round(Math.random() * (mockDates.length - 1))];

  return {
    id: id,
    empresaID: empresa,
    dataID: dates,
    tipoDocumento: document,
    qtdPag: pags
  };
}
