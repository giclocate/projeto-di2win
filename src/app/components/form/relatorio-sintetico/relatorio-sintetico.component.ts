import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';

import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { CommonModule, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ExcelService } from '../../../services/excel.service';


import { mockCompany, mockDates, mockDocument, mockPags } from '../../../services/dados.service';
import { UserData } from '../../../model/UserModel';



@Component({
  selector: 'app-relatorio-sintetico',
  standalone: true,
  templateUrl: './relatorio-sintetico.component.html',
  styleUrl: './relatorio-sintetico.component.scss',
  imports: [CommonModule, MatFormFieldModule,MatIcon,MatInputModule, MatPaginatorModule, MatTableModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter(), DatePipe]
})
export class RelatorioSinteticoComponent {

  displayedColumns: string[] = ['empresaID', 'dataID', 'qtdPag'];
  dataSource: MatTableDataSource<UserData>;
  totalPaginas: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('datePicker') datePicker: any;
  startDate: Date | null = null;
  endDate: Date | null = null;

  value: number = 0;

  constructor(private datePipe: DatePipe, private excelService: ExcelService, private cdr: ChangeDetectorRef) {
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1, datePipe));
    this.dataSource = new MatTableDataSource(users);
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
        return data.tipoDocumento.toLowerCase().includes(lowerCaseFilter);
      }
    };
    this.dataSource.connect().subscribe(() => {
      this.updateTotalPaginas();
    });

    setTimeout(() => {
      this.value = 30558;
      this.cdr.detectChanges();
    }, 0);
  }

  updateTotalPaginas() {
    setTimeout(() => {
      const filteredData = this.dataSource.filteredData;
      this.totalPaginas = filteredData.reduce((total, data) => total + parseInt(data.qtdPag || '0', 10), 0);
    });
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
  
      const startString = this.parseDateToBrazilian(this.startDate);
      const endString = this.parseDateToBrazilian(this.endDate);
  
      this.dataSource.filter = `${startString} - ${endString}`;
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
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


  parseDateToBrazilian(date: string | Date): string {
    if (typeof date === 'string') {
      return this.datePipe.transform(new Date(date), 'dd/MM/yyyy') || '';
    } else {
      return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }
  }

}

function createNewUser(id: number, datePipe: DatePipe): UserData {
  const document = mockDocument[Math.round(Math.random() * (mockDocument.length - 1))];
  const empresa = mockCompany[Math.round(Math.random() * (mockCompany.length - 1))];
  const pags= mockPags[Math.round(Math.random() * (mockPags.length - 1))];
  const dates = mockDates[Math.round(Math.random() * (mockDates.length - 1))];


  return {
    empresaID: empresa,
    dataID: dates,
    tipoDocumento: document,
    qtdPag: pags
  };
}
