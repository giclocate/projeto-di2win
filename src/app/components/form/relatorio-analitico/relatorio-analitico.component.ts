import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExcelService } from '../../../services/excel.service';
import { CommonModule, DatePipe } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { mockCompany, mockDates, mockDocument, mockPags } from '../../../services/dados.service';
import { UserData } from '../../../model/UserModel';

@Component({
  selector: 'app-relatorio-analitico',
  standalone: true,
  templateUrl: './relatorio-analitico.component.html',
  styleUrls: ['./relatorio-analitico.component.scss'],
  imports: [
    CommonModule,
    AsyncPipe,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter(), DatePipe]
})
export class RelatorioAnaliticoComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['tipoDocumento', 'dataID', 'qtdPag'];
  dataSource: MatTableDataSource<UserData>;
  fullData: UserData[];
  totalPaginas: number = 0;

  autocompleteFocused: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('datePicker') datePicker: any;
  @ViewChild('autocompleteInput') autocompleteInput?: ElementRef;

  startDate: Date | null = null;
  endDate: Date | null = null;
  value: number = 0;

  myControl = new FormControl<string | UserData>('');
  options: UserData[] = this.mockCompanyToUserData(mockCompany);
  filteredOptions!: Observable<UserData[]>;
  selectedOption: string | undefined;

  constructor(private datePipe: DatePipe, private excelService: ExcelService, private renderer: Renderer2) {
    this.fullData = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1, datePipe));
    this.dataSource = new MatTableDataSource<UserData>([]);


    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.empresaID || ''),
      filter(name => !!name), // Filtrar valores nulos
      map(name => this._filterUserData(name))
    );

    this.myControl.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        const selected = this.options.find(option => option.empresaID === value);
        this.selectedOption = selected ? selected.empresaID : undefined;
      } else {
        this.selectedOption = value ? value.empresaID : undefined;
      }

      this.filterBySelectedCompany();
    });
  }


  onInputChange(event: any) {
    const value = event.target.value;
    if (value.trim() !== '') {
      this.autocompleteFocused = true;
    } else {
      this.autocompleteFocused = false;
    }
  }

  onAutocompleteOptionSelected() {
    this.autocompleteFocused = true; 
  }

  reloadPage() {
    window.location.reload();
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.empresaID;
        return name ? this._filterUserData(name) : this.options.slice();
      }),
    );
  }

  displayFn(user: UserData): string {
    return user && user.empresaID ? user.empresaID : '';
  }

  mockCompanyToUserData(companies: string[]): UserData[] {
    return companies.map(company => ({ id: 0, empresaID: company, dataID: '', tipoDocumento: '', qtdPag: '' }));
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

    this.dataSource.connect().subscribe(() => {
      this.updateTotalPaginas();
    });

    setTimeout(() => {
      this.value = 30558;
    }, 0);
  }

  updateTotalPaginas() {
    this.totalPaginas = this.dataSource.filteredData.reduce((total, data) => total + parseInt(data.qtdPag || '0', 10), 0);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    // Verificar se os campos de data estão preenchidos
    if (this.startDate !== null && this.endDate !== null) {
      // Aplicar o filtro de tipo de documento apenas aos dados filtrados atualmente
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const lowerCaseFilter = filter.trim().toLowerCase();
        return data.empresaID.toLowerCase().includes(lowerCaseFilter) ||
               data.tipoDocumento.toLowerCase().includes(lowerCaseFilter);
      };

      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      // Aplicar o filtro de tipo de documento a todos os dados
      this.dataSource.filterPredicate = (data: UserData, filter: string) => {
        const lowerCaseFilter = filter.trim().toLowerCase();
        return data.empresaID.toLowerCase().includes(lowerCaseFilter) ||
               data.tipoDocumento.toLowerCase().includes(lowerCaseFilter);
      };

      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

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

    // Verificar se ambas as datas foram preenchidas
    if (this.startDate !== null && this.endDate !== null) {
      const formattedStartDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd') || '';
      const formattedEndDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd') || '';

      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const start = new Date(formattedStartDate).getTime();
        const end = new Date(formattedEndDate).getTime();
        const dataDate = new Date(data.dataID).getTime();

        return dataDate >= start && dataDate <= end;
      };

      const startString = this.parseDateToBrazilian(this.startDate);
      const endString = this.parseDateToBrazilian(this.endDate);
  
      this.dataSource.filter = `${startString} - ${endString}`;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      this.dataSource.filterPredicate = () => true;
      this.dataSource.filter = '';
    }
  }

  exportData() {
    // Aqui você precisa fornecer o nome da empresa atual como o terceiro argumento
    const dados = this.dataSource.data;
    const empresaSelecionada = this.selectedOption ? this.selectedOption : 'Nenhuma empresa selecionada';

    this.excelService.exportToExcel(dados, empresaSelecionada);
  }

  resetDateFilter(startInput: HTMLInputElement, endInput: HTMLInputElement): void {
    this.startDate = null;
    this.endDate = null;

    // Limpar valores dos Datepickers
    startInput.value = '';
    endInput.value = '';

    // Limpar o filtro de datas e aplicar o filtro de tipo de documento a todos os dados
    this.dataSource.filterPredicate = (data: UserData, filter: string) => {
      const lowerCaseFilter = filter.trim().toLowerCase();
      return data.empresaID.toLowerCase().includes(lowerCaseFilter) ||
             data.tipoDocumento.toLowerCase().includes(lowerCaseFilter);
    };

    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private _filterUserData(value: string): UserData[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.empresaID.toLowerCase().includes(filterValue));
  }

  parseDateToBrazilian(date: string | Date): string {
    if (typeof date === 'string') {
      return this.datePipe.transform(new Date(date), 'dd/MM/yyyy') || '';
    } else {
      return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }
  }

  filterBySelectedCompany() {
    if (this.selectedOption) {
      this.dataSource.data = this.fullData.filter(user => user.empresaID === this.selectedOption);
    } else {
      this.dataSource.data = [];
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

function createNewUser(id: number, datePipe: DatePipe): UserData {
  const document = mockDocument[Math.round(Math.random() * (mockDocument.length - 1))];
  const empresa = mockCompany[Math.round(Math.random() * (mockCompany.length - 1))];
  const pags = mockPags[Math.round(Math.random() * (mockPags.length - 1))];
  const dates = mockDates[Math.round(Math.random() * (mockDates.length - 1))];

  return {
    empresaID: empresa,
    dataID: dates,
    tipoDocumento: document,
    qtdPag: pags
  };
}

